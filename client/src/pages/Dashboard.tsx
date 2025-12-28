import { useTenants } from "@/hooks/use-tenants";
import { useUsers } from "@/hooks/use-users";
import { useHealth } from "@/hooks/use-system";
import { StatCard } from "@/components/StatCard";
import { 
  Users, 
  Building2, 
  Server, 
  Activity, 
  ShieldAlert,
  Clock
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid 
} from "recharts";

// Mock data for the chart since we don't have analytics API yet
const MOCK_TRAFFIC = [
  { name: "00:00", requests: 120 },
  { name: "04:00", requests: 80 },
  { name: "08:00", requests: 450 },
  { name: "12:00", requests: 980 },
  { name: "16:00", requests: 850 },
  { name: "20:00", requests: 340 },
];

export default function Dashboard() {
  const { data: tenants, isLoading: tenantsLoading } = useTenants();
  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: health } = useHealth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Platform overview and performance metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Tenants" 
          value={tenantsLoading ? "..." : tenants?.length || 0} 
          icon={Building2}
          trend="+12.5%"
          trendUp={true}
        />
        <StatCard 
          title="Total Users" 
          value={usersLoading ? "..." : users?.length || 0} 
          icon={Users}
          trend="+4.2%"
          trendUp={true}
        />
        <StatCard 
          title="System Status" 
          value={health?.status === 'ok' ? "Healthy" : "Degraded"} 
          icon={Activity}
          className={health?.status === 'ok' ? "" : "border-rose-500/50"}
        />
        <StatCard 
          title="Runtime" 
          value={health?.runtime || "Unknown"} 
          icon={Server}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-card border border-border/50 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Request Volume</h3>
            <select className="bg-muted text-xs rounded-md px-2 py-1 border-none focus:ring-0">
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_TRAFFIC}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#666" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#666" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar 
                  dataKey="requests" 
                  fill="hsl(217, 91%, 60%)" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="p-6 rounded-xl bg-card border border-border/50 shadow-sm flex flex-col">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-primary" />
            Audit Log Stream
          </h3>
          <div className="space-y-6 overflow-hidden relative">
            {/* Visual fade at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card to-transparent z-10" />
            
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Tenant Created</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    User admin@example.com created new tenant <span className="text-foreground font-mono">tenant_{100+i}</span>
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{i * 15} mins ago</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
