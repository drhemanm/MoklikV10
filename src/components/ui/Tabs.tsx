import React from 'react';
import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'underline' | 'pills' | 'buttons';
  fullWidth?: boolean;
}

export function Tabs({ 
  tabs, 
  activeTab, 
  onChange, 
  variant = 'underline',
  fullWidth = false
}: TabsProps) {
  const getTabStyles = (tabId: string) => {
    const isActive = activeTab === tabId;
    
    switch (variant) {
      case 'pills':
        return isActive 
          ? 'bg-primary text-white' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100';
      
      case 'buttons':
        return isActive 
          ? 'bg-primary text-white border-primary' 
          : 'bg-white text-gray-600 hover:text-gray-900 border-gray-300 hover:bg-gray-50';
      
      case 'underline':
      default:
        return isActive 
          ? 'text-primary border-b-2 border-primary' 
          : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300';
    }
  };
  
  const baseStyles = {
    underline: 'px-4 py-2 font-medium text-sm transition-colors',
    pills: 'px-4 py-2 rounded-full font-medium text-sm transition-colors',
    buttons: 'px-4 py-2 rounded-lg font-medium text-sm transition-colors border'
  };
  
  return (
    <div className={`flex ${variant === 'underline' ? 'border-b border-gray-200' : ''} ${fullWidth ? 'w-full' : ''}`}>
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          whileTap={{ scale: 0.97 }}
          onClick={() => onChange(tab.id)}
          className={`${baseStyles[variant]} ${getTabStyles(tab.id)} ${fullWidth ? 'flex-1' : 'mr-2'} flex items-center justify-center`}
        >
          {tab.icon && <span className="mr-2">{tab.icon}</span>}
          {tab.label}
        </motion.button>
      ))}
    </div>
  );
}