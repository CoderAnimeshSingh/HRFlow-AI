import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { CandidateTable } from "@/components/dashboard/CandidateTable";
import { CandidateModal } from "@/components/dashboard/CandidateModal";
import CandidateCompare from "@/components/dashboard/CandidateCompare";
import { HiringAnalytics } from "@/components/dashboard/HiringAnalytics";
import { TeamCollaboration, logActivity } from "@/components/dashboard/TeamCollaboration";
import { BulkActions } from "@/components/dashboard/BulkActions";
import { AdvancedSearch, SearchFilters } from "@/components/dashboard/AdvancedSearch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, LayoutDashboard, BarChart3, Users, Activity } from "lucide-react";
import { subDays, isWithinInterval, startOfDay, startOfWeek, startOfMonth, startOfQuarter } from "date-fns";

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  job_role_applied: string;
  resume_url: string | null;
  resume_text: string | null;
  experience_years: number | null;
  skills: string[] | null;
  ai_fit_score: number | null;
  ai_summary: string | null;
  status: string | null;
  test_link: string | null;
  test_score: number | null;
  interview_date_time: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const defaultFilters: SearchFilters = {
  query: "",
  minScore: 0,
  maxScore: 100,
  status: "all",
  jobRole: "all",
  experienceMin: 0,
  experienceMax: 20,
  skills: [],
  dateRange: "all",
};

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareCandidates, setCompareCandidates] = useState<Candidate[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [activeTab, setActiveTab] = useState("pipeline");
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchCandidates = useCallback(async () => {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching candidates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch candidates",
        variant: "destructive",
      });
      return;
    }

    setCandidates(data || []);
  }, [toast]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchCandidates();
      
      // Set up realtime subscription
      const channel = supabase
        .channel('candidates-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'candidates' },
          () => {
            fetchCandidates();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, fetchCandidates]);

  // Filter candidates based on search criteria
  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      // Text search
      if (filters.query) {
        const query = filters.query.toLowerCase();
        const matchesQuery = 
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.job_role_applied.toLowerCase().includes(query) ||
          (c.skills || []).some(s => s.toLowerCase().includes(query));
        if (!matchesQuery) return false;
      }

      // AI Score
      const score = c.ai_fit_score || 0;
      if (score < filters.minScore || score > filters.maxScore) return false;

      // Status
      if (filters.status !== "all" && c.status !== filters.status) return false;

      // Job Role
      if (filters.jobRole !== "all" && c.job_role_applied !== filters.jobRole) return false;

      // Experience
      const exp = c.experience_years || 0;
      if (exp < filters.experienceMin || exp > filters.experienceMax) return false;

      // Skills
      if (filters.skills.length > 0) {
        const candidateSkills = (c.skills || []).map(s => s.toLowerCase());
        const hasAllSkills = filters.skills.every(s => 
          candidateSkills.some(cs => cs.includes(s.toLowerCase()))
        );
        if (!hasAllSkills) return false;
      }

      // Date Range
      if (filters.dateRange !== "all") {
        const created = new Date(c.created_at);
        const now = new Date();
        let start: Date;
        
        switch (filters.dateRange) {
          case "today":
            start = startOfDay(now);
            break;
          case "week":
            start = startOfWeek(now);
            break;
          case "month":
            start = startOfMonth(now);
            break;
          case "quarter":
            start = startOfQuarter(now);
            break;
          default:
            start = new Date(0);
        }
        
        if (!isWithinInterval(created, { start, end: now })) return false;
      }

      return true;
    });
  }, [candidates, filters]);

  // Get unique job roles and skills for filters
  const jobRoles = useMemo(() => 
    [...new Set(candidates.map(c => c.job_role_applied))].sort(),
    [candidates]
  );

  const availableSkills = useMemo(() => 
    [...new Set(candidates.flatMap(c => c.skills || []))].sort(),
    [candidates]
  );

  const selectedCandidates = useMemo(() => 
    candidates.filter(c => selectedIds.includes(c.id)),
    [candidates, selectedIds]
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleViewCandidate = async (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
    await logActivity('viewed', 'candidate', candidate.id, { candidate_name: candidate.name });
  };

  const handleStatusChange = async (candidateId: string, newStatus: string) => {
    const { error } = await supabase
      .from('candidates')
      .update({ status: newStatus })
      .eq('id', candidateId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
      return;
    }

    const candidate = candidates.find(c => c.id === candidateId);
    await logActivity('updated_status', 'candidate', candidateId, { 
      candidate_name: candidate?.name,
      new_status: newStatus 
    });

    toast({
      title: "Status Updated",
      description: `Candidate status changed to ${newStatus}`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <DashboardStats candidates={candidates} />
        
        <div className="mt-6 sm:mt-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6">
              <TabsTrigger value="pipeline" className="gap-2">
                <LayoutDashboard className="h-4 w-4 hidden sm:block" />
                Pipeline
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
                <BarChart3 className="h-4 w-4 hidden sm:block" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="team" className="gap-2">
                <Users className="h-4 w-4 hidden sm:block" />
                Team
              </TabsTrigger>
              <TabsTrigger value="activity" className="gap-2">
                <Activity className="h-4 w-4 hidden sm:block" />
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pipeline" className="space-y-4">
              {/* Advanced Search */}
              <AdvancedSearch
                filters={filters}
                onFiltersChange={setFilters}
                jobRoles={jobRoles}
                availableSkills={availableSkills}
              />

              {/* Bulk Actions */}
              {selectedIds.length > 0 && (
                <BulkActions
                  selectedCandidates={selectedCandidates}
                  onActionComplete={fetchCandidates}
                  onClearSelection={() => setSelectedIds([])}
                />
              )}

              {/* Candidate Table */}
              <CandidateTable 
                candidates={filteredCandidates} 
                onViewCandidate={handleViewCandidate}
                onStatusChange={handleStatusChange}
                onRefresh={fetchCandidates}
                onCompare={(list) => {
                  setCompareCandidates(list);
                  setIsCompareOpen(true);
                }}
              />
            </TabsContent>

            <TabsContent value="analytics">
              <HiringAnalytics candidates={candidates} />
            </TabsContent>

            <TabsContent value="team">
              <TeamCollaboration 
                candidateId={selectedCandidate?.id}
                candidateName={selectedCandidate?.name}
              />
            </TabsContent>

            <TabsContent value="activity">
              <TeamCollaboration />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <CandidateModal
        candidate={selectedCandidate}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCandidate(null);
        }}
        onStatusChange={handleStatusChange}
        onRefresh={fetchCandidates}
      />

      <CandidateCompare
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        candidates={compareCandidates}
      />
    </div>
  );
};

export default Dashboard;
