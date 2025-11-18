import { type HTMLAttributes } from 'react';
import { cn, getInitials } from '@/utils/misc';

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ name, src, size = 'md', className, ...props }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  // Check if src is an emoji (starts with emoji or is very short)
  const isEmoji = src && /^[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}]/u.test(src);

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-primary-500 text-white font-medium flex-shrink-0',
        sizeClasses[size],
        className
      )}
      title={name}
      {...props}
    >
      {isEmoji ? (
        <span className="text-lg">{src}</span>
      ) : src ? (
        <img src={src} alt={name} className="w-full h-full rounded-full object-cover" />
      ) : (
        getInitials(name)
      )}
    </div>
  );
}
