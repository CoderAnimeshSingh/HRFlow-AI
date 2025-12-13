import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { CandidateTable } from "@/components/dashboard/CandidateTable";
import { CandidateModal } from "@/components/dashboard/CandidateModal";
import CandidateCompare from "@/components/dashboard/CandidateCompare";
import { Loader2 } from "lucide-react";

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

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareCandidates, setCompareCandidates] = useState<Candidate[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
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
      
      <main className="container mx-auto px-4 py-8">
        <DashboardStats candidates={candidates} />
        
        <div className="mt-8">
          <CandidateTable 
            candidates={candidates} 
            onViewCandidate={handleViewCandidate}
            onStatusChange={handleStatusChange}
            onRefresh={fetchCandidates}
            onCompare={(list) => {
              setCompareCandidates(list);
              setIsCompareOpen(true);
            }}
          />
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
