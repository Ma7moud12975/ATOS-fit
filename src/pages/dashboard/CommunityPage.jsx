import React from 'react';
import AppHeader from '../../components/ui/AppHeader';
import SidebarNavigation from '../../components/ui/SidebarNavigation';

const CommunityPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader isSidebarOpen={isSidebarOpen} onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <SidebarNavigation isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="pt-16 lg:pl-72 min-h-screen">
        <div className="px-4 lg:px-6 max-w-3xl mx-auto w-full py-8">
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-8 select-none bg-gradient-to-br from-[#FF8A00] via-orange-400 to-yellow-400 bg-clip-text text-transparent" style={{letterSpacing: '0.02em', marginTop: '1rem'}}>
            COMING SOON
          </h1>
          {/* Details absolutely left-aligned, English only */}
          <div className="w-full">
            <p className="text-lg font-medium text-card-foreground mb-4 text-left">
              We're launching a new community section, featuring:
            </p>
            <ul className="text-base mb-4 space-y-3 text-left pl-3 border-l-4 border-orange-400">
              <li className="text-[#FF8A00] font-semibold">• Share your workouts with friends & the ATOS Fit community.</li>
              <li className="text-[#FF8A00] font-semibold">• Create posts about your progress, tips, and achievements.</li>
              <li className="text-[#FF8A00] font-semibold">• Like & comment on other members' workouts and posts.</li>
              <li className="text-[#FF8A00] font-semibold">• Instantly share your workout to <span className='italic text-[#FFA744]'>X (Twitter), Facebook, or Instagram stories</span> with integrations.</li>
            </ul>
            <p className="text-sm text-muted-foreground text-left mt-2">
              Stay tuned! Your fitness social experience is coming soon—connect, get motivated, and achieve more 🚀
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CommunityPage;
