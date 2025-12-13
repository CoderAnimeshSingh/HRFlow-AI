import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-glow opacity-50" />
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-primary/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-accent-foreground">
              AI-Powered Hiring Automation
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            Hire Smarter.{" "}
            <span className="text-gradient">Onboard Faster.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-body"
          >
            HRFlow AI automates your entire hiring pipeline—from resume screening 
            to interview scheduling—so you can focus on what matters: building great teams.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/apply">
              <Button variant="hero" size="xl" className="group">
                Apply Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="heroOutline" size="xl" className="group">
                <Play className="w-5 h-5" />
                HR Login
              </Button>
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 pt-8 border-t border-border/50"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Trusted by forward-thinking teams
            </p>
            <div className="flex items-center justify-center gap-8 opacity-60 flex-wrap">
              {["TechCorp", "StartupX", "InnovateCo", "FutureHR", "ScaleUp"].map((company) => (
                <span key={company} className="font-display font-semibold text-muted-foreground text-lg">
                  {company}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Floating Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 rounded-3xl blur-2xl opacity-60" />
            
            {/* Dashboard Mockup */}
            <div className="relative glass rounded-2xl p-1 shadow-2xl">
              <div className="bg-card rounded-xl overflow-hidden">
                {/* Browser Chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 rounded-md bg-background text-xs text-muted-foreground">
                      app.hrflow.ai/dashboard
                    </div>
                  </div>
                </div>
                
                {/* Dashboard Content */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Stats Cards */}
                  <div className="bg-accent/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Active Candidates</p>
                    <p className="text-3xl font-display font-bold text-foreground mt-1">247</p>
                    <p className="text-xs text-primary mt-2">+23% this week</p>
                  </div>
                  <div className="bg-accent/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Interviews Scheduled</p>
                    <p className="text-3xl font-display font-bold text-foreground mt-1">42</p>
                    <p className="text-xs text-primary mt-2">12 today</p>
                  </div>
                  <div className="bg-accent/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Time Saved</p>
                    <p className="text-3xl font-display font-bold text-foreground mt-1">156h</p>
                    <p className="text-xs text-primary mt-2">This month</p>
                  </div>
                  
                  {/* Candidate List Preview */}
                  <div className="md:col-span-3 bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-medium">Recent Candidates</p>
                      <span className="text-xs text-muted-foreground">AI Screened</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        { name: "Sarah Chen", role: "Senior Developer", score: 94 },
                        { name: "Marcus Johnson", role: "Product Manager", score: 88 },
                        { name: "Emily Rodriguez", role: "UX Designer", score: 91 },
                      ].map((candidate) => (
                        <div key={candidate.name} className="flex items-center justify-between p-3 bg-card rounded-md">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-xs font-medium text-primary">
                                {candidate.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{candidate.name}</p>
                              <p className="text-xs text-muted-foreground">{candidate.role}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full" 
                                style={{ width: `${candidate.score}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-primary">{candidate.score}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
