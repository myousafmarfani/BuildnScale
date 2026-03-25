type SkillBadgeProps = {
  label: string;
  variant?: 'default' | 'primary' | 'muted';
};

const VARIANT_CLASS: Record<NonNullable<SkillBadgeProps['variant']>, string> = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/10 text-primary',
  muted: 'bg-muted text-muted-foreground',
};

export default function SkillBadge({ label, variant = 'muted' }: SkillBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium font-mono whitespace-nowrap ${VARIANT_CLASS[variant]}`}
    >
      {label}
    </span>
  );
}
