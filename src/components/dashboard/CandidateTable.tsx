import { useState } from "react";
import { Candidate } from "@/pages/Dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Eye, Search, RefreshCw, Filter } from "lucide-react";
import { format } from "date-fns";

interface CandidateTableProps {
  candidates: Candidate[];
  onViewCandidate: (candidate: Candidate) => void;
  onStatusChange: (candidateId: string, status: string) => void;
  onRefresh: () => void;
  onCompare?: (candidates: Candidate[]) => void;
}

const statusColors: Record<string, string> = {
  new: "bg-muted text-muted-foreground",
  screening: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  interview: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  test: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  offer: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  hired: "bg-primary/20 text-primary",
  rejected: "bg-destructive/20 text-destructive",
};

const statusOptions = [
  { value: "new", label: "New" },
  { value: "screening", label: "Screening" },
  { value: "interview", label: "Interview" },
  { value: "test", label: "Test" },
  { value: "offer", label: "Offer" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
];

export const CandidateTable = ({ 
  candidates, 
  onViewCandidate, 
  onStatusChange,
  onRefresh 
  , onCompare
}: CandidateTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.job_role_applied.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const selectedCandidates = candidates.filter(c => selectedIds.includes(c.id));

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id].slice(-3));
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return "text-muted-foreground";
    if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 60) return "text-amber-600 dark:text-amber-400";
    return "text-destructive";
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Candidates Pipeline
          </h2>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"> </TableHead>
              <TableHead>Candidate</TableHead>
              <TableHead>Position</TableHead>
              <TableHead className="text-center">AI Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCandidates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No candidates found
                </TableCell>
              </TableRow>
            ) : (
              filteredCandidates.map((candidate) => (
                <TableRow key={candidate.id} className="hover:bg-muted/50">
                  <TableCell>
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={selectedIds.includes(candidate.id)}
                      onChange={() => toggleSelect(candidate.id)}
                      aria-label={`select-${candidate.id}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{candidate.name}</p>
                      <p className="text-sm text-muted-foreground">{candidate.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-foreground">{candidate.job_role_applied}</p>
                    {candidate.experience_years && (
                      <p className="text-sm text-muted-foreground">
                        {candidate.experience_years} years exp.
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`font-display font-bold text-lg ${getScoreColor(candidate.ai_fit_score)}`}>
                      {candidate.ai_fit_score || '-'}
                      {candidate.ai_fit_score && '%'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={candidate.status || 'new'} 
                      onValueChange={(value) => onStatusChange(candidate.id, value)}
                    >
                      <SelectTrigger className="w-[120px] h-8">
                        <Badge className={statusColors[candidate.status || 'new']}>
                          {candidate.status || 'New'}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(candidate.created_at), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewCandidate(candidate)}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 border-t border-border flex flex-wrap items-center gap-2 justify-between">
        <div className="text-sm text-muted-foreground">Selected: {selectedIds.length}</div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => { setSelectedIds([]); }}>
            Clear
          </Button>
          <Button
            onClick={() => onCompare && onCompare(selectedCandidates)}
            disabled={selectedCandidates.length < 2}
          >
            Compare ({selectedCandidates.length})
          </Button>
        </div>
      </div>
    </div>
  );
};
