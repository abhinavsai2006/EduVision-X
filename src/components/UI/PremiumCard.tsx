import React from 'react';

type PremiumCardProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  glass?: boolean;
  featured?: boolean;
};

export default function PremiumCard({
  children,
  className,
  style,
  glass = false,
  featured = false,
}: PremiumCardProps) {
  const baseClass = glass ? 'card-glass' : 'card-premium';

  return (
    <div
      className={`${baseClass} motion-consistent ${className ?? ''}`.trim()}
      style={{
        ...(featured
          ? {
              borderColor: 'rgba(124,58,237,0.4)',
              boxShadow: '0 0 0 1px rgba(124,58,237,0.35), 0 20px 40px rgba(0,0,0,0.28)',
            }
          : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
