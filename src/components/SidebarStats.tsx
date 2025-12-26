// ============================================
// src/components/SidebarStats.tsx
// ============================================

interface StatsProps {
  stats: {
    total_alerts: number;
    alerts_this_week: number;
    total_area_affected: number;
    unverified_count: number;
  };
}

export default function SidebarStats({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 p-4 bg-gradient-to-b from-earth-100 to-earth-50 border-b border-earth-200">
      <StatCard 
        label="Total Alerts" 
        value={stats.total_alerts} 
        dotColor="bg-forest-500" 
      />
      <StatCard 
        label="Unverified" 
        value={stats.unverified_count} 
        dotColor="bg-maasai-500" 
        pulse 
        alert 
      />
      <StatCard 
        label="This Week" 
        value={stats.alerts_this_week} 
        dotColor="bg-sunset-500" 
      />
      <StatCard 
        label="Hectares" 
        value={stats.total_area_affected.toFixed(1)} 
        dotColor="bg-savanna-500" 
      />
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  dotColor, 
  pulse = false, 
  alert = false 
}: { 
  label: string; 
  value: string | number; 
  dotColor: string; 
  pulse?: boolean;
  alert?: boolean;
}) {
  return (
    <div className={`p-3 rounded-xl ${alert ? 'bg-maasai-50' : 'bg-white'} border border-earth-200`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={`w-2 h-2 rounded-full ${dotColor} ${pulse ? 'animate-pulse' : ''}`} />
        <p className="text-xs text-earth-600">{label}</p>
      </div>
      <p className={`text-2xl font-bold ${alert ? 'text-maasai-600' : 'text-kenya-black'}`}>
        {value}
      </p>
    </div>
  );
}