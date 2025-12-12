import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Zap, 
  Brain, 
  Calendar, 
  FileCheck, 
  Users, 
  Shield,
  ArrowUpRight
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Resume Screening",
    description: "Our AI analyzes resumes in seconds, scoring candidates based on skills, experience, and job fit—no bias, just data.",
    gradient: "from-primary to-cyan-400",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Automatically coordinate interviews across time zones. Candidates pick slots, you approve—done.",
    gradient: "from-blue-500 to-primary",
  },
  {
    icon: Zap,
    title: "Instant Candidate Intake",
    description: "Applicants submit once, get routed automatically. No more spreadsheet chaos.",
    gradient: "from-cyan-400 to-teal-500",
  },
  {
    icon: FileCheck,
    title: "Automated Offer Letters",
    description: "Generate personalized offer letters in one click. E-signatures included.",
    gradient: "from-teal-500 to-green-500",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share candidate profiles, leave feedback, and make hiring decisions together—in real time.",
    gradient: "from-primary to-blue-500",
  },
  {
    icon: Shield,
    title: "Compliance Built-In",
    description: "GDPR, EEOC, and data privacy handled. Focus on hiring, not paperwork.",
    gradient: "from-blue-600 to-primary",
  },
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="relative h-full p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}>
          <feature.icon className="w-6 h-6 text-primary-foreground" />
        </div>

        {/* Content */}
        <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
          {feature.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {feature.description}
        </p>

        {/* Hover Arrow */}
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight className="w-5 h-5 text-primary" />
        </div>
      </div>
    </motion.div>
  );
};

export const Features = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-muted/30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-glow opacity-30" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Features
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mt-4 mb-4">
            Everything You Need to{" "}
            <span className="text-gradient">Hire at Scale</span>
          </h2>
          <p className="text-muted-foreground">
            From first application to signed offer, HRFlow AI handles the heavy lifting 
            so you can focus on finding the right people.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
