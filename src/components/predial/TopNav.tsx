import { Building2, BarChart3 } from "lucide-react";

interface TopNavProps {
  activeTab: "resumen" | "inmuebles";
  onTabChange: (tab: "resumen" | "inmuebles") => void;
}

export function TopNav({ activeTab, onTabChange }: TopNavProps) {
  const tabs = [
    { id: "resumen" as const, label: "Resumen", icon: BarChart3 },
    { id: "inmuebles" as const, label: "Inmuebles", icon: Building2 },
  ];

  return (
    <header className="border-b bg-card px-6 py-0 flex items-center gap-6 h-14">
      <div className="flex items-center gap-2 mr-6">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Building2 className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-bold text-lg text-foreground">Duppla</span>
      </div>

      <nav className="flex items-center gap-1 h-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 h-full text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
