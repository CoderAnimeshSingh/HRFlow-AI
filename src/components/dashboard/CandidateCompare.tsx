import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Candidate } from "@/pages/Dashboard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface CandidateCompareProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: Candidate[];
}

export const CandidateCompare = ({ isOpen, onClose, candidates }: CandidateCompareProps) => {
  if (!candidates || candidates.length === 0) return null;

  const getScoreColor = (score: number | null) => {
    if (!score) return "text-muted-foreground";
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-destructive";
  };

  const getBestScore = () => {
    const scores = candidates.map(c => c.ai_fit_score || 0);
    return Math.max(...scores);
  };

  const bestScore = getBestScore();

  const getScoreIndicator = (score: number | null) => {
    if (!score) return <Minus className="h-4 w-4 text-muted-foreground" />;
    if (score === bestScore && candidates.length > 1) {
      return <TrendingUp className="h-4 w-4 text-emerald-600" />;
    }
    if (score < bestScore - 20) {
      return <TrendingDown className="h-4 w-4 text-destructive" />;
    }
    return <Minus className="h-4 w-4 text-amber-600" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Compare Candidates
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold w-40">Criteria</TableHead>
                {candidates.map((c) => (
                  <TableHead key={c.id} className="text-center min-w-[150px]">
                    <div className="font-semibold text-foreground">{c.name}</div>
                    <div className="text-xs text-muted-foreground font-normal">{c.job_role_applied}</div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* AI Fit Score */}
              <TableRow className="bg-muted/30">
                <TableCell className="font-medium">AI Fit Score</TableCell>
                {candidates.map((c) => (
                  <TableCell key={c.id} className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className={`font-display font-bold text-2xl ${getScoreColor(c.ai_fit_score)}`}>
                        {c.ai_fit_score ?? "-"}%
                      </span>
                      {getScoreIndicator(c.ai_fit_score)}
                    </div>
                  </TableCell>
                ))}
              </TableRow>

              {/* Experience */}
              <TableRow>
                <TableCell className="font-medium">Experience (Years)</TableCell>
                {candidates.map((c) => (
                  <TableCell key={c.id} className="text-center">
                    <span className="font-semibold">{c.experience_years ?? "-"}</span>
                  </TableCell>
                ))}
              </TableRow>

              {/* Status */}
              <TableRow className="bg-muted/30">
                <TableCell className="font-medium">Current Status</TableCell>
                {candidates.map((c) => (
                  <TableCell key={c.id} className="text-center">
                    <Badge variant="secondary" className="capitalize">
                      {c.status || "new"}
                    </Badge>
                  </TableCell>
                ))}
              </TableRow>

              {/* Skills */}
              <TableRow>
                <TableCell className="font-medium align-top pt-4">Skills</TableCell>
                {candidates.map((c) => (
                  <TableCell key={c.id} className="text-center align-top pt-4">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {(c.skills || []).slice(0, 6).map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {(c.skills || []).length > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{(c.skills || []).length - 6} more
                        </Badge>
                      )}
                      {(!c.skills || c.skills.length === 0) && (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>

              {/* AI Summary */}
              <TableRow className="bg-muted/30">
                <TableCell className="font-medium align-top pt-4">AI Summary</TableCell>
                {candidates.map((c) => (
                  <TableCell key={c.id} className="text-left align-top pt-4">
                    <p className="text-sm text-muted-foreground line-clamp-4">
                      {c.ai_summary || "-"}
                    </p>
                  </TableCell>
                ))}
              </TableRow>

              {/* Test Score */}
              <TableRow>
                <TableCell className="font-medium">Test Score</TableCell>
                {candidates.map((c) => (
                  <TableCell key={c.id} className="text-center">
                    <span className={`font-semibold ${c.test_score && c.test_score >= 70 ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                      {c.test_score ? `${c.test_score}%` : "-"}
                    </span>
                  </TableCell>
                ))}
              </TableRow>

              {/* Interview Scheduled */}
              <TableRow className="bg-muted/30">
                <TableCell className="font-medium">Interview</TableCell>
                {candidates.map((c) => (
                  <TableCell key={c.id} className="text-center">
                    {c.interview_date_time ? (
                      <span className="text-sm text-emerald-600">
                        {new Date(c.interview_date_time).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Not scheduled</span>
                    )}
                  </TableCell>
                ))}
              </TableRow>

              {/* Notes */}
              <TableRow>
                <TableCell className="font-medium align-top pt-4">Notes</TableCell>
                {candidates.map((c) => (
                  <TableCell key={c.id} className="text-left align-top pt-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {c.notes || "-"}
                    </p>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Recommendation */}
        {candidates.length >= 2 && (
          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <h4 className="font-semibold text-foreground mb-2">AI Recommendation</h4>
            <p className="text-sm text-muted-foreground">
              Based on the AI analysis, <strong className="text-foreground">
                {candidates.find(c => c.ai_fit_score === bestScore)?.name}
              </strong> appears to be the strongest candidate with an AI fit score of{" "}
              <strong className="text-primary">{bestScore}%</strong>.
              Consider scheduling interviews with top candidates to validate these findings.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CandidateCompare;
