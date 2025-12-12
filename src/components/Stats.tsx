import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  {
    value: "85%",
    label: "Reduction in Screening Time",
    description: "AI handles the first pass, you handle the interviews.",
  },
  {
    value: "3x",
    label: "Faster Time-to-Hire",
    description: "From weeks to days with automated workflows.",
  },
  {
    value: "50+",
    label: "Hours Saved Monthly",
    description: "Per recruiter, on average.",
  },
  {
    value: "99%",
    label: "Candidate Satisfaction",
    description: "Fast responses and clear communication.",
  },
];

export const Stats = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-hero-gradient opacity-5" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="font-display font-medium text-foreground mb-1">
                  {stat.label}
                </div>
                <p className="text-sm text-muted-foreground">
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
