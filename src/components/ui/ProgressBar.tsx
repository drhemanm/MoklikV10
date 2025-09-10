
interface ProgressBarProps {
  progress: number;
  className?: string;
  barClassName?: string;
}

export function ProgressBar({ progress, className = '', barClassName = '' }: ProgressBarProps) {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-300 ${barClassName || 'bg-blue-600'}`}
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
}