import { useState, useMemo } from "react";
import { Candidate } from "@/pages/Dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { 
  TrendingUp, Users, Target, Clock, Award, 
  Download, Calendar, ArrowUp, ArrowDown 
} from "lucide-react";
import { format, subDays, startOfDay, isWithinInterval } from "date-fns";
import { motion } from "framer-motion";

interface HiringAnalyticsProps {
  candidates: Candidate[];
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export const HiringAnalytics = ({ candidates }: HiringAnalyticsProps) => {
  const [timeRange, setTimeRange] = useState("30");

  const filteredCandidates = useMemo(() => {
    const now = new Date();
    const start = subDays(now, parseInt(timeRange));
    return candidates.filter(c => 
      isWithinInterval(new Date(c.created_at), { start, end: now })
    );
  }, [candidates, timeRange]);

  // Pipeline stats
  const pipelineData = useMemo(() => {
    const stats = {
      new: 0, screening: 0, interview: 0, test: 0, offer: 0, hired: 0, rejected: 0
    };
    filteredCandidates.forEach(c => {
      const status = c.status || 'new';
      if (status in stats) stats[status as keyof typeof stats]++;
    });
    return [
      { name: 'New', value: stats.new, color: 'hsl(var(--muted-foreground))' },
      { name: 'Screening', value: stats.screening, color: 'hsl(var(--chart-1))' },
      { name: 'Interview', value: stats.interview, color: 'hsl(var(--chart-2))' },
      { name: 'Test', value: stats.test, color: 'hsl(var(--chart-3))' },
      { name: 'Offer', value: stats.offer, color: 'hsl(var(--chart-4))' },
      { name: 'Hired', value: stats.hired, color: 'hsl(var(--primary))' },
      { name: 'Rejected', value: stats.rejected, color: 'hsl(var(--destructive))' },
    ];
  }, [filteredCandidates]);

  // Daily applications trend
  const trendData = useMemo(() => {
    const days = parseInt(timeRange);
    const data: { date: string; applications: number; hired: number }[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const day = startOfDay(subDays(new Date(), i));
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);
      
      const dayApplications = candidates.filter(c => {
        const created = new Date(c.created_at);
        return isWithinInterval(created, { start: day, end: dayEnd });
      });

      data.push({
        date: format(day, days > 14 ? 'MMM dd' : 'EEE'),
        applications: dayApplications.length,
        hired: dayApplications.filter(c => c.status === 'hired').length,
      });
    }
    
    return data;
  }, [candidates, timeRange]);

  // Job role distribution
  const roleData = useMemo(() => {
    const roles: Record<string, number> = {};
    filteredCandidates.forEach(c => {
      roles[c.job_role_applied] = (roles[c.job_role_applied] || 0) + 1;
    });
    return Object.entries(roles)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  }, [filteredCandidates]);

  // AI Score distribution
  const scoreData = useMemo(() => {
    const ranges = [
      { range: '0-20', min: 0, max: 20, count: 0 },
      { range: '21-40', min: 21, max: 40, count: 0 },
      { range: '41-60', min: 41, max: 60, count: 0 },
      { range: '61-80', min: 61, max: 80, count: 0 },
      { range: '81-100', min: 81, max: 100, count: 0 },
    ];
    
    filteredCandidates.forEach(c => {
      const score = c.ai_fit_score || 0;
      const range = ranges.find(r => score >= r.min && score <= r.max);
      if (range) range.count++;
    });
    
    return ranges.map(r => ({ name: r.range, value: r.count }));
  }, [filteredCandidates]);

  // Key metrics
  const metrics = useMemo(() => {
    const total = filteredCandidates.length;
    const hired = filteredCandidates.filter(c => c.status === 'hired').length;
    const avgScore = filteredCandidates.reduce((acc, c) => acc + (c.ai_fit_score || 0), 0) / (total || 1);
    const withScores = filteredCandidates.filter(c => c.ai_fit_score && c.ai_fit_score >= 70).length;
    
    // Compare to previous period
    const prevStart = subDays(new Date(), parseInt(timeRange) * 2);
    const prevEnd = subDays(new Date(), parseInt(timeRange));
    const prevCandidates = candidates.filter(c => 
      isWithinInterval(new Date(c.created_at), { start: prevStart, end: prevEnd })
    );
    const prevTotal = prevCandidates.length;
    const change = prevTotal ? ((total - prevTotal) / prevTotal) * 100 : 0;

    return { total, hired, avgScore, withScores, change };
  }, [candidates, filteredCandidates, timeRange]);

  const exportData = () => {
    const csv = [
      ['Name', 'Email', 'Role', 'AI Score', 'Status', 'Applied Date'].join(','),
      ...filteredCandidates.map(c => [
        c.name, c.email, c.job_role_applied, c.ai_fit_score || '', c.status || 'new',
        format(new Date(c.created_at), 'yyyy-MM-dd')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hiring-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Hiring Analytics</h2>
          <p className="text-muted-foreground">Track your recruitment performance</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${metrics.change >= 0 ? 'text-emerald-600' : 'text-destructive'}`}>
                  {metrics.change >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {Math.abs(metrics.change).toFixed(1)}%
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-foreground">{metrics.total}</p>
                <p className="text-sm text-muted-foreground">Total Applications</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Award className="h-5 w-5 text-emerald-500" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-foreground">{metrics.hired}</p>
                <p className="text-sm text-muted-foreground">Hired</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-amber-500" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-foreground">{metrics.avgScore.toFixed(0)}%</p>
                <p className="text-sm text-muted-foreground">Avg AI Score</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-foreground">{metrics.withScores}</p>
                <p className="text-sm text-muted-foreground">High Potential (70%+)</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Applications Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Applications Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="applications" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                    name="Applications"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="hired" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--chart-2))' }}
                    name="Hired"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pipeline Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pipeline Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pipelineData.filter(d => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Roles */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Job Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roleData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={120}
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* AI Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {scoreData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
