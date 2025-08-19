import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Webhook } from "https://esm.sh/svix@1.24.0";

// The main function that handles incoming requests.
serve(async (req) => {
  // 1. Get the required environment variables
  const CLERK_WEBHOOK_SECRET = Deno.env.get("CLERK_WEBHOOK_SECRET_KEY");
  if (!CLERK_WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET_KEY is not set.");
    return new Response("Internal Server Error: Missing Webhook Secret", { status: 500 });
  }

  // 2. Verify the webhook signature to ensure it's from Clerk
  const headers = req.headers;
  const payload = await req.json();
  const svix_id = headers.get("svix-id")!;
  const svix_timestamp = headers.get("svix-timestamp")!;
  const svix_signature = headers.get("svix-signature")!;

  const wh = new Webhook(CLERK_WEBHOOK_SECRET);
  let event: any;
  try {
    event = wh.verify(JSON.stringify(payload), {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying Clerk webhook:", err.message);
    return new Response("Webhook verification failed", { status: 400 });
  }

  // 3. Handle the specific 'user.created' event
  if (event.type === "user.created") {
    console.log("Handling 'user.created' event...");
    const { id, email_addresses, first_name, last_name } = event.data;
    const email = email_addresses?.[0]?.email_address ?? "";

    if (!id) {
        return new Response("Bad Request: Missing user ID from Clerk event.", { status: 400 });
    }

    try {
      // Create a Supabase client with the service_role key to bypass RLS
      const supabaseAdmin = createClient(
        "https://oxfkncyuslvnzraiueoc.supabase.co",
        Deno.env.get("SERVICE_ROLE_KEY")!
      );

      // Create a corresponding user in Supabase's auth schema
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        email_confirm: true, // Clerk has already verified the email
      });

      if (authError) {
        console.error("Error creating Supabase auth user:", authError.message);
        return new Response(`Internal Server Error: ${authError.message}`, { status: 500 });
      }

      // Insert the public user profile, linking it to the new auth user and the clerk_id
      const { error: profileError } = await supabaseAdmin
        .from("user_profiles")
        .insert({
          id: authUser.user.id, // Use the new Supabase auth user's ID
          clerk_id: id,         // Store the original Clerk user ID
          email: email,
          full_name: `${first_name || ""} ${last_name || ""}`.trim(),
        });

      if (profileError) {
        console.error("Error inserting user profile:", profileError.message);
        return new Response(`Internal Server Error: ${profileError.message}`, { status: 500 });
      }
      
      console.log(`Successfully created profile for Clerk user ${id}`);

    } catch (error) {
        console.error("An unexpected error occurred:", error.message);
        return new Response("Internal Server Error", { status: 500 });
    }
  }

  // 4. Return a success response
  return new Response("Webhook received", { status: 200 });
});