import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { motion } from 'framer-motion';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title = 'Dashboard' }: DashboardLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileSidebarOpen && window.innerWidth < 1024) {
        const sidebar = document.getElementById('mobile-sidebar');
        if (sidebar && !sidebar.contains(event.target as Node)) {
          setIsMobileSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileSidebarOpen]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <motion.div
            id="mobile-sidebar"
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute left-0 top-0 h-full"
          >
            <Sidebar
              isCollapsed={false}
              onToggle={() => setIsMobileSidebarOpen(false)}
            />
          </motion.div>
        </div>
      )}

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64'
        }`}
      >
        <TopBar
          title={title}
          onMenuClick={() => setIsMobileSidebarOpen(true)}
        />

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
