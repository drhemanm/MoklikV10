import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

// Base Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', hover = false, onClick }: CardProps) {
  const baseClasses = 'bg-white rounded-2xl border border-gray-100 shadow-sm';
  const hoverClasses = hover ? 'hover:shadow-md hover:border-gray-200 transition-all cursor-pointer' : '';

  if (onClick || hover) {
    return (
      <motion.div
        whileHover={hover ? { y: -2 } : undefined}
        whileTap={onClick ? { scale: 0.98 } : undefined}
        className={`${baseClasses} ${hoverClasses} ${className}`}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseClasses} ${className}`}>
      {children}
    </div>
  );
}

// Card Header (enhanced)
interface CardHeaderProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, title, subtitle, icon, action, className = '' }: CardHeaderProps) {
  // Legacy support - if children are passed, use them directly
  if (children) {
    return (
      <div className={`p-5 border-b border-gray-100 ${className}`}>
        {children}
      </div>
    );
  }

  // New enhanced header with icon and action support
  return (
    <div className={`flex items-start justify-between p-5 border-b border-gray-100 ${className}`}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            {icon}
          </div>
        )}
        <div>
          {title && <h3 className="font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// Card Body (alias for CardContent)
export function CardBody({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-5 ${className}`}>
      {children}
    </div>
  );
}

// Card Content (same as CardBody for flexibility)
export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-5 ${className}`}>
      {children}
    </div>
  );
}

// Card Footer
export function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-5 border-t border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  iconColor?: string;
  iconBgColor?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  iconColor = 'text-blue-600',
  iconBgColor = 'bg-blue-50'
}: StatCardProps) {
  const changeColors = {
    positive: 'text-green-600 bg-green-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50'
  };

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl ${iconBgColor} ${iconColor}`}>
          {icon}
        </div>
        {change && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${changeColors[changeType]}`}>
            {change}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{title}</p>
      </div>
    </Card>
  );
}

// Quick Action Card
interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

export function QuickActionCard({ title, description, icon, color, onClick }: QuickActionCardProps) {
  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group"
    >
      <div className={`h-2 ${color}`} />
      <div className="p-5">
        <div className={`w-12 h-12 rounded-xl ${color} bg-opacity-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </motion.button>
  );
}

// Feature Card (for landing page)
interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient?: string;
}

export function FeatureCard({ title, description, icon: Icon, gradient = 'from-blue-500 to-blue-600' }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100"
    >
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5 shadow-lg`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}

// Progress Card
interface ProgressCardProps {
  title: string;
  current: number;
  total: number;
  color?: string;
  icon?: React.ReactNode;
}

export function ProgressCard({ title, current, total, color = 'bg-blue-600', icon }: ProgressCardProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon && <span className="text-gray-400">{icon}</span>}
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        <span className="text-sm font-semibold text-gray-600">{percentage}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full ${color} rounded-full`}
        />
      </div>
      <p className="text-xs text-gray-500 mt-2">{current} of {total} completed</p>
    </Card>
  );
}

// Empty State Card
interface EmptyStateCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyStateCard({ title, description, icon, action }: EmptyStateCardProps) {
  return (
    <Card className="p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-400">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </Card>
  );
}
