-- Create storage bucket for resume PDFs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('resumes', 'resumes', false, 10485760, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']);

-- Storage policies for resumes bucket
CREATE POLICY "Anyone can upload resumes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Authenticated users can view resumes"
ON storage.objects FOR SELECT
USING (bucket_id = 'resumes' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete resumes"
ON storage.objects FOR DELETE
USING (bucket_id = 'resumes' AND auth.role() = 'authenticated');

-- Team collaboration tables
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  department TEXT,
  position TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view team members"
ON public.team_members FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage team members"
ON public.team_members FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Candidate comments for collaboration
CREATE TABLE public.candidate_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.candidate_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view comments"
ON public.candidate_comments FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create comments"
ON public.candidate_comments FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete own comments"
ON public.candidate_comments FOR DELETE
USING (auth.uid() = user_id);

-- Activity log for tracking all actions
CREATE TABLE public.activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  user_name TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view activity"
ON public.activity_log FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can log activity"
ON public.activity_log FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Hiring analytics aggregation table
CREATE TABLE public.hiring_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_applications INTEGER DEFAULT 0,
  new_candidates INTEGER DEFAULT 0,
  screened INTEGER DEFAULT 0,
  interviewed INTEGER DEFAULT 0,
  offers_made INTEGER DEFAULT 0,
  hired INTEGER DEFAULT 0,
  rejected INTEGER DEFAULT 0,
  avg_time_to_hire_days DECIMAL,
  avg_ai_score DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(metric_date)
);

ALTER TABLE public.hiring_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view metrics"
ON public.hiring_metrics FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "System can insert metrics"
ON public.hiring_metrics FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "System can update metrics"
ON public.hiring_metrics FOR UPDATE
USING (auth.role() = 'authenticated');

-- Enable realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.candidate_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_log;

-- Trigger to update timestamps
CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();