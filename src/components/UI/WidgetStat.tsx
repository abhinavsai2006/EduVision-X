import React from 'react';

type WidgetStatProps = {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  value?: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function WidgetStat({
  icon,
  title,
  subtitle,
  value,
  className,
  style,
}: WidgetStatProps) {
  return (
    <div className={`widget-card motion-consistent ${className ?? ''}`.trim()} style={style}>
      {icon ? <span className="widget-icon">{icon}</span> : null}
      <div style={{ flex: 1, minWidth: 0 }}>
        {value ? (
          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>{value}</div>
        ) : null}
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</div>
        {subtitle ? <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{subtitle}</div> : null}
      </div>
    </div>
  );
}
