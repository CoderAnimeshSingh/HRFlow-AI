import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Candidate } from "@/pages/Dashboard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, Trash2, UserCheck, Download, 
  FileSpreadsheet, Loader2, CheckCircle2 
} from "lucide-react";
import { format } from "date-fns";
import { logActivity } from "./TeamCollaboration";

interface BulkActionsProps {
  selectedCandidates: Candidate[];
  onActionComplete: () => void;
  onClearSelection: () => void;
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

export const BulkActions = ({ 
  selectedCandidates, 
  onActionComplete, 
  onClearSelection 
}: BulkActionsProps) => {
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    action: () => Promise<void>;
  }>({ open: false, title: '', description: '', action: async () => {} });
  const { toast } = useToast();

  const count = selectedCandidates.length;

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    try {
      const ids = selectedCandidates.map(c => c.id);
      const { error } = await supabase
        .from('candidates')
        .update({ status: newStatus })
        .in('id', ids);

      if (error) throw error;

      // Log activity for each
      for (const candidate of selectedCandidates) {
        await logActivity('updated_status', 'candidate', candidate.id, {
          candidate_name: candidate.name,
          new_status: newStatus,
        });
      }

      toast({
        title: "Status Updated",
        description: `${count} candidate(s) moved to ${newStatus}`,
      });
      onActionComplete();
      onClearSelection();
    } catch (error) {
      console.error('Bulk update error:', error);
      toast({ title: "Error", description: "Failed to update candidates", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const deleteCandidates = async () => {
    setLoading(true);
    try {
      const ids = selectedCandidates.map(c => c.id);
      const { error } = await supabase
        .from('candidates')
        .delete()
        .in('id', ids);

      if (error) throw error;

      toast({
        title: "Candidates Deleted",
        description: `${count} candidate(s) have been removed`,
      });
      onActionComplete();
      onClearSelection();
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast({ title: "Error", description: "Failed to delete candidates", variant: "destructive" });
    } finally {
      setLoading(false);
      setConfirmDialog({ ...confirmDialog, open: false });
    }
  };

  const exportSelected = () => {
    const headers = [
      'Name', 'Email', 'Phone', 'Position', 'Experience', 
      'AI Score', 'Status', 'Skills', 'Applied Date'
    ];
    
    const rows = selectedCandidates.map(c => [
      c.name,
      c.email,
      c.phone || '',
      c.job_role_applied,
      c.experience_years ? `${c.experience_years} years` : '',
      c.ai_fit_score ? `${c.ai_fit_score}%` : '',
      c.status || 'new',
      (c.skills || []).join('; '),
      format(new Date(c.created_at), 'yyyy-MM-dd'),
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `candidates-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `${count} candidate(s) exported to CSV`,
    });
  };

  const sendBulkEmail = async () => {
    setLoading(true);
    try {
      // In a real app, this would call an edge function to send emails
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Emails Queued",
        description: `${count} email(s) have been queued for delivery`,
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to send emails", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (count === 0) return null;

  return (
    <>
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">{count} candidate{count > 1 ? 's' : ''} selected</p>
            <p className="text-sm text-muted-foreground">Choose an action to apply</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Bulk Status Change */}
          <Select onValueChange={updateStatus} disabled={loading}>
            <SelectTrigger className="w-[140px]">
              <UserCheck className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Set Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Export */}
          <Button variant="outline" size="sm" onClick={exportSelected} disabled={loading}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export
          </Button>

          {/* Email */}
          <Button variant="outline" size="sm" onClick={sendBulkEmail} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Mail className="h-4 w-4 mr-2" />}
            Email
          </Button>

          {/* Delete */}
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => setConfirmDialog({
              open: true,
              title: 'Delete Candidates',
              description: `Are you sure you want to delete ${count} candidate(s)? This action cannot be undone.`,
              action: deleteCandidates,
            })}
            disabled={loading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>

          {/* Clear */}
          <Button variant="ghost" size="sm" onClick={onClearSelection}>
            Clear
          </Button>
        </div>
      </div>

      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirmDialog.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDialog.action} className="bg-destructive text-destructive-foreground">
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
