import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  onClick?: () => void;
  active?: boolean;
}

export function KpiCard({ title, value, subtitle, icon: Icon, iconBg, iconColor, onClick, active }: KpiCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-card rounded-xl border p-5 flex items-center justify-between transition-all ${onClick ? "cursor-pointer hover:shadow-md" : ""} ${active ? "ring-2 ring-primary border-primary" : ""}`}
    >
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold mt-1 text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
    </div>
  );
}
