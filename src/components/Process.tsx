import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Upload, 
  Brain, 
  CalendarCheck, 
  FileSignature,
  ArrowRight
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Candidate Intake",
    description: "Candidates apply through your branded portal. Resumes and info flow directly into HRFlow.",
  },
  {
    number: "02",
    icon: Brain,
    title: "AI Screening",
    description: "Our AI reads every resume, extracts skills, and scores each candidate against your job requirements.",
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "Interview Scheduling",
    description: "Top candidates get automatic interview invites. They pick a slot, you get notified. Simple.",
  },
  {
    number: "04",
    icon: FileSignature,
    title: "Offer & Onboarding",
    description: "Send offer letters with one click. New hires get automated onboarding workflows from day one.",
  },
];

export const Process = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="process" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mt-4 mb-4">
            From Application to Offer in{" "}
            <span className="text-gradient">4 Simple Steps</span>
          </h2>
          <p className="text-muted-foreground">
            No complex setup. No manual data entry. Just a streamlined hiring 
            process that runs on autopilot.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <div className="text-center">
                  {/* Step Number */}
                  <div className="relative inline-flex mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-card border border-border shadow-lg flex items-center justify-center relative z-10">
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                    <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-hero-gradient text-primary-foreground text-sm font-bold flex items-center justify-center shadow-md">
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="font-display font-semibold text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow (hidden on last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-10 -right-6 w-12 items-center justify-center z-20">
                    <ArrowRight className="w-5 h-5 text-primary/40" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
