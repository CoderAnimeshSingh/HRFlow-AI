import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Candidate } from "@/pages/Dashboard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CandidateCompareProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: Candidate[];
}

export const CandidateCompare = ({ isOpen, onClose, candidates }: CandidateCompareProps) => {
  if (!candidates || candidates.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Compare Candidates</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field</TableHead>
                {candidates.map((c) => (
                  <TableHead key={c.id}>{c.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Job Applied</TableCell>
                {candidates.map((c) => (
                  <TableCell key={c.id}>{c.job_role_applied}</TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell>AI Fit</TableCell>
                {candidates.map((c) => (
                  <TableCell key={c.id}>{c.ai_fit_score ?? "-"}%</TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell>Experience (yrs)</TableCell>
                {candidates.map((c) => (
                  <TableCell key={c.id}>{c.experience_years ?? "-"}</TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell>Skills</TableCell>
                {candidates.map((c) => (
                  <TableCell key={c.id}>{(c.skills || []).join(", ") || "-"}</TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell>Notes</TableCell>
                {candidates.map((c) => (
                  <TableCell key={c.id}>{c.notes || "-"}</TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateCompare;
