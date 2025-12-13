import { useState } from "react";
import { Candidate } from "@/pages/Dashboard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { sendInterviewEmail } from "@/lib/email";
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Calendar, 
  Star, 
  FileText, 
  Brain,
  Save,
  Loader2,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";

interface CandidateModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (candidateId: string, status: string) => void;
  onRefresh: () => void;
}

const statusOptions = [
  { value: "new", label: "New" },
  { value: "screening", label: "Screening" },
  { value: "interview", label: "Interview" },
  { value: "test", label: "Test" },
  { value: "offer", label: "Offer" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
];

export const CandidateModal = ({ 
  candidate, 
  isOpen, 
  onClose, 
  onStatusChange,
  onRefresh 
}: CandidateModalProps) => {
  const [notes, setNotes] = useState(candidate?.notes || "");
  const [interviewDate, setInterviewDate] = useState(candidate?.interview_date_time || "");
  const [testLink, setTestLink] = useState(candidate?.test_link || "");
  const [testScore, setTestScore] = useState<string>(candidate?.test_score?.toString() || "");
  const [saving, setSaving] = useState(false);
  const [reanalyzing, setReanalyzing] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const { toast } = useToast();

  if (!candidate) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('candidates')
        .update({
          notes,
          interview_date_time: interviewDate || null,
          test_link: testLink || null,
          test_score: testScore ? parseInt(testScore) : null,
        })
        .eq('id', candidate.id);

      if (error) throw error;

      toast({
        title: "Saved",
        description: "Candidate information updated successfully.",
      });
      onRefresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReanalyze = async () => {
    if (!candidate.resume_text) {
      toast({
        title: "No Resume",
        description: "This candidate doesn't have resume content to analyze.",
        variant: "destructive",
      });
      return;
    }

    setReanalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-resume-parser', {
        body: {
          resumeText: candidate.resume_text,
          jobRole: candidate.job_role_applied,
          candidateName: candidate.name,
        },
      });

      if (error) throw error;

      if (data?.analysis) {
        await supabase
          .from('candidates')
          .update({
            ai_fit_score: data.analysis.fitScore || 0,
            ai_summary: data.analysis.summary || null,
            skills: data.analysis.skills || [],
            experience_years: data.analysis.experienceYears || null,
          })
          .eq('id', candidate.id);

        toast({
          title: "Analysis Complete",
          description: "AI has re-analyzed the candidate's resume.",
        });
        onRefresh();
      }
    } catch (error) {
      console.error('Reanalyze error:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to re-analyze resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setReanalyzing(false);
    }
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return "text-muted-foreground";
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-destructive";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Candidate Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row gap-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <span className="font-display text-lg font-semibold">{candidate.name}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{candidate.email}</span>
              </div>
              {candidate.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">{candidate.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <span className="text-sm">{candidate.job_role_applied}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Applied {format(new Date(candidate.created_at), 'MMM dd, yyyy')}</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-card rounded-lg border border-border min-w-[120px]">
              <Star className={`h-8 w-8 mb-2 ${getScoreColor(candidate.ai_fit_score)}`} />
              <span className={`font-display text-3xl font-bold ${getScoreColor(candidate.ai_fit_score)}`}>
                {candidate.ai_fit_score || 0}%
              </span>
              <span className="text-xs text-muted-foreground">AI Fit Score</span>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="ai" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ai" className="gap-2">
                <Brain className="h-4 w-4" />
                AI Analysis
              </TabsTrigger>
              <TabsTrigger value="resume" className="gap-2">
                <FileText className="h-4 w-4" />
                Resume
              </TabsTrigger>
              <TabsTrigger value="actions" className="gap-2">
                <Briefcase className="h-4 w-4" />
                Actions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai" className="space-y-4 mt-4">
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleReanalyze}
                  disabled={reanalyzing || !candidate.resume_text}
                >
                  {reanalyzing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Re-analyze
                </Button>
              </div>

              {candidate.ai_summary && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">AI Summary</h4>
                  <p className="text-muted-foreground text-sm">{candidate.ai_summary}</p>
                </div>
              )}

              {candidate.skills && candidate.skills.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Skills Identified</h4>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {candidate.experience_years && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-1">Experience</h4>
                  <p className="text-muted-foreground text-sm">
                    {candidate.experience_years} years of relevant experience
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="resume" className="mt-4">
              {candidate.resume_text ? (
                <div className="p-4 bg-muted/50 rounded-lg max-h-[400px] overflow-y-auto">
                  <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-body">
                    {candidate.resume_text}
                  </pre>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No resume content available
                </p>
              )}
            </TabsContent>

            <TabsContent value="actions" className="space-y-4 mt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={candidate.status || 'new'} 
                    onValueChange={(value) => onStatusChange(candidate.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Interview Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Test Link</Label>
                  <Input
                    placeholder="https://..."
                    value={testLink}
                    onChange={(e) => setTestLink(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Test Score</Label>
                  <Input
                    type="number"
                    placeholder="0-100"
                    min={0}
                    max={100}
                    value={testScore}
                    onChange={(e) => setTestScore(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Add notes about this candidate..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes

                </Button>

                <Button
                  onClick={async () => {
                    if (!candidate) return;
                    setSendingEmail(true);
                    try {
                      const useServer = import.meta.env.VITE_USE_SERVER_EMAIL === 'true';
                      if (useServer) {
                        // Call Supabase Edge Function `send-invite`
                        const { data, error } = await supabase.functions.invoke('send-invite', {
                          body: {
                            candidateName: candidate.name,
                            candidateEmail: candidate.email,
                            interviewDate,
                            notes,
                            companyName: import.meta.env.VITE_COMPANY_NAME || '',
                          },
                        });

                        if (error) throw error;
                        if (data && 'error' in data && data.error) throw new Error(String(data.error));

                        toast({ title: 'Email Sent', description: 'Interview invite sent via server.' });
                      } else {
                        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
                        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
                        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

                        const templateParams = {
                          to_name: candidate.name,
                          to_email: candidate.email,
                          interview_datetime: interviewDate || "",
                          company_name: import.meta.env.VITE_COMPANY_NAME || "",
                          notes,
                        };

                        await sendInterviewEmail({ serviceId, templateId, publicKey, templateParams });
                        toast({ title: 'Email Sent', description: 'Interview invite sent to candidate.' });
                      }
                    } catch (err) {
                      console.error(err);
                      toast({ title: "Email Failed", description: "Failed to send email.", variant: "destructive" });
                    } finally {
                      setSendingEmail(false);
                    }
                  }}
                  disabled={sendingEmail}
                >
                  {sendingEmail ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4 mr-2" />
                  )}
                  Send Invite
                </Button>
              </div>

              <div className="mt-2 flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    // Open Calendly scheduling page; user should configure VITE_CALENDLY_BASE_URL in .env
                    const base = import.meta.env.VITE_CALENDLY_BASE_URL as string;
                    const url = base
                      ? `${base}?name=${encodeURIComponent(candidate.name)}&email=${encodeURIComponent(candidate.email)}`
                      : `https://calendly.com/your-calendly-event?name=${encodeURIComponent(candidate.name)}&email=${encodeURIComponent(candidate.email)}`;
                    window.open(url, "_blank");
                  }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule (Calendly)
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
