import { Candidate } from "@/pages/Dashboard";
import { Users, UserCheck, Clock, Star } from "lucide-react";

interface DashboardStatsProps {
  candidates: Candidate[];
}

export const DashboardStats = ({ candidates }: DashboardStatsProps) => {
  const totalCandidates = candidates.length;
  const newCandidates = candidates.filter(c => c.status === 'new').length;
  const inProgress = candidates.filter(c => ['screening', 'interview', 'test'].includes(c.status || '')).length;
  const hired = candidates.filter(c => c.status === 'hired').length;
  const avgScore = candidates.length > 0 
    ? Math.round(candidates.reduce((sum, c) => sum + (c.ai_fit_score || 0), 0) / candidates.length)
    : 0;

  const stats = [
    {
      label: "Total Candidates",
      value: totalCandidates,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "New Applications",
      value: newCandidates,
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: UserCheck,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Avg. AI Score",
      value: `${avgScore}%`,
      icon: Star,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
