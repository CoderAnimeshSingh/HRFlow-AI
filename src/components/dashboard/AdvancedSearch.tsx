import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Search, SlidersHorizontal, X, Sparkles, 
  Calendar, Briefcase, Target 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface SearchFilters {
  query: string;
  minScore: number;
  maxScore: number;
  status: string;
  jobRole: string;
  experienceMin: number;
  experienceMax: number;
  skills: string[];
  dateRange: string;
}

interface AdvancedSearchProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  jobRoles: string[];
  availableSkills: string[];
}

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "new", label: "New" },
  { value: "screening", label: "Screening" },
  { value: "interview", label: "Interview" },
  { value: "test", label: "Test" },
  { value: "offer", label: "Offer" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
];

const dateRangeOptions = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "quarter", label: "This Quarter" },
];

export const AdvancedSearch = ({ 
  filters, 
  onFiltersChange, 
  jobRoles,
  availableSkills 
}: AdvancedSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const addSkill = (skill: string) => {
    if (skill && !filters.skills.includes(skill)) {
      updateFilter('skills', [...filters.skills, skill]);
    }
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    updateFilter('skills', filters.skills.filter(s => s !== skill));
  };

  const clearFilters = () => {
    onFiltersChange({
      query: "",
      minScore: 0,
      maxScore: 100,
      status: "all",
      jobRole: "all",
      experienceMin: 0,
      experienceMax: 20,
      skills: [],
      dateRange: "all",
    });
  };

  const activeFiltersCount = [
    filters.status !== "all",
    filters.jobRole !== "all",
    filters.minScore > 0 || filters.maxScore < 100,
    filters.experienceMin > 0 || filters.experienceMax < 20,
    filters.skills.length > 0,
    filters.dateRange !== "all",
  ].filter(Boolean).length;

  const matchingSkills = availableSkills
    .filter(s => s.toLowerCase().includes(skillInput.toLowerCase()) && !filters.skills.includes(s))
    .slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or skills..."
            value={filters.query}
            onChange={(e) => updateFilter('query', e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-1 h-5 px-1.5">{activeFiltersCount}</Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-4" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">Advanced Filters</h4>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>

              {/* AI Score Range */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  AI Score Range
                </Label>
                <div className="px-2">
                  <Slider
                    value={[filters.minScore, filters.maxScore]}
                    onValueChange={([min, max]) => {
                      updateFilter('minScore', min);
                      updateFilter('maxScore', max);
                    }}
                    min={0}
                    max={100}
                    step={5}
                    className="my-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{filters.minScore}%</span>
                    <span>{filters.maxScore}%</span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={filters.status} onValueChange={(v) => updateFilter('status', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Job Role */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  Job Role
                </Label>
                <Select value={filters.jobRole} onValueChange={(v) => updateFilter('jobRole', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {jobRoles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Experience Range */}
              <div className="space-y-2">
                <Label>Experience (years)</Label>
                <div className="px-2">
                  <Slider
                    value={[filters.experienceMin, filters.experienceMax]}
                    onValueChange={([min, max]) => {
                      updateFilter('experienceMin', min);
                      updateFilter('experienceMax', max);
                    }}
                    min={0}
                    max={20}
                    step={1}
                    className="my-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{filters.experienceMin} yrs</span>
                    <span>{filters.experienceMax}+ yrs</span>
                  </div>
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Applied Date
                </Label>
                <Select value={filters.dateRange} onValueChange={(v) => updateFilter('dateRange', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dateRangeOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Required Skills
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Type to add skills..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSkill(skillInput)}
                  />
                  {skillInput && matchingSkills.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-10">
                      {matchingSkills.map(skill => (
                        <button
                          key={skill}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
                          onClick={() => addSkill(skill)}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {filters.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    <AnimatePresence>
                      {filters.skills.map(skill => (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                        >
                          <Badge variant="secondary" className="gap-1">
                            {skill}
                            <button onClick={() => removeSkill(skill)}>
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          <AnimatePresence>
            {filters.status !== "all" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Badge variant="outline" className="gap-1">
                  Status: {filters.status}
                  <button onClick={() => updateFilter('status', 'all')}><X className="h-3 w-3" /></button>
                </Badge>
              </motion.div>
            )}
            {filters.jobRole !== "all" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Badge variant="outline" className="gap-1">
                  Role: {filters.jobRole}
                  <button onClick={() => updateFilter('jobRole', 'all')}><X className="h-3 w-3" /></button>
                </Badge>
              </motion.div>
            )}
            {(filters.minScore > 0 || filters.maxScore < 100) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Badge variant="outline" className="gap-1">
                  Score: {filters.minScore}-{filters.maxScore}%
                  <button onClick={() => { updateFilter('minScore', 0); updateFilter('maxScore', 100); }}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              </motion.div>
            )}
            {filters.dateRange !== "all" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Badge variant="outline" className="gap-1">
                  Date: {dateRangeOptions.find(d => d.value === filters.dateRange)?.label}
                  <button onClick={() => updateFilter('dateRange', 'all')}><X className="h-3 w-3" /></button>
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 text-xs">
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};
