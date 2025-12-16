import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ResumeUpload } from "@/components/dashboard/ResumeUpload";
import { motion } from "framer-motion";
import { User, Mail, Phone, Briefcase, FileText, Upload, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const jobRoles = [
  "Software Engineer",
  "Senior Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Product Manager",
  "UI/UX Designer",
  "QA Engineer",
  "Mobile Developer",
  "Machine Learning Engineer",
  "Cloud Architect",
  "Technical Lead",
  "Engineering Manager",
];

const Apply = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    jobRole: "",
    resumeText: "",
    resumeUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<"paste" | "upload">("upload");
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleResumeUpload = (url: string, extractedText: string) => {
    setFormData(prev => ({ 
      ...prev, 
      resumeUrl: url,
      resumeText: prev.resumeText || extractedText 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.jobRole) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // First, insert the candidate
      const { data: candidate, error: insertError } = await supabase
        .from('candidates')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          job_role_applied: formData.jobRole,
          resume_text: formData.resumeText || null,
          resume_url: formData.resumeUrl || null,
          status: 'new',
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // If resume text is provided, trigger AI analysis
      if (formData.resumeText && candidate) {
        try {
          const { data: aiData, error: aiError } = await supabase.functions.invoke('ai-resume-parser', {
            body: {
              resumeText: formData.resumeText,
              jobRole: formData.jobRole,
              candidateName: formData.name,
            },
          });

          if (!aiError && aiData?.analysis) {
            // Update candidate with AI analysis results
            await supabase
              .from('candidates')
              .update({
                ai_fit_score: aiData.analysis.fitScore || 0,
                ai_summary: aiData.analysis.summary || null,
                skills: aiData.analysis.skills || [],
                experience_years: aiData.analysis.experienceYears || null,
                status: 'screening',
              })
              .eq('id', candidate.id);
          }
        } catch (aiErr) {
          console.error('AI analysis error:', aiErr);
          // Continue even if AI fails - the application is still submitted
        }
      }

      setSubmitted(true);
      toast({
        title: "Application Submitted!",
        description: "Thank you for applying. We'll review your application and get back to you soon.",
      });

    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            Application Submitted!
          </h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your interest in joining our team. Our AI has analyzed your resume and our hiring team will review your application shortly.
          </p>
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <Link to="/" className="inline-block mb-6">
            <h1 className="font-display text-2xl font-bold">
              <span className="text-gradient">HRFlow</span>
              <span className="text-foreground"> AI</span>
            </h1>
          </Link>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Join Our Team
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Submit your application and let our AI-powered system match you with the perfect role.
          </p>
        </div>

        {/* Application Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Personal Information
                </h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Job Information */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Position
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="jobRole">Job Role *</Label>
                  <Select
                    value={formData.jobRole}
                    onValueChange={(value) => handleInputChange("jobRole", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select the position you're applying for" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Resume */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Resume / CV
                </h3>
                
                <Tabs value={uploadMethod} onValueChange={(v) => setUploadMethod(v as "paste" | "upload")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Upload File</TabsTrigger>
                    <TabsTrigger value="paste">Paste Text</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upload" className="mt-4">
                    <ResumeUpload onUploadComplete={handleResumeUpload} />
                    {formData.resumeUrl && (
                      <p className="text-sm text-emerald-600 mt-2 flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        Resume uploaded successfully
                      </p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="paste" className="mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="resumeText">
                        Paste Your Resume Content
                        <span className="text-muted-foreground text-sm ml-2">(Our AI will analyze it)</span>
                      </Label>
                      <Textarea
                        id="resumeText"
                        placeholder="Paste your resume content here... Include your work experience, education, skills, and any relevant achievements."
                        value={formData.resumeText}
                        onChange={(e) => handleInputChange("resumeText", e.target.value)}
                        className="min-h-[200px] resize-y"
                      />
                      <p className="text-xs text-muted-foreground">
                        For best results, include your work experience, skills, education, and notable achievements.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-5 w-5" />
                      Submit Application
                    </>
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-4">
                  By submitting, you agree to our privacy policy and terms of service.
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Apply;
