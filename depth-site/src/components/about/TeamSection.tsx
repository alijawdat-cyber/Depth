"use client";
import { TEAM } from "@/data/team";
import TeamCard from "./TeamCard";
import { motion, useReducedMotion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";

export default function TeamSection() {
  const reduce = useReducedMotion();

  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeading 
          title="الفريق" 
          subtitle="مصورون / محررون / إدارة أداء" 
          align="center" 
          className="mb-12" 
        />
        
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={reduce ? undefined : { opacity: 0 }}
          whileInView={reduce ? undefined : { opacity: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          {TEAM.map((member, index) => (
            <TeamCard key={member.id} m={member} index={index} />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}


