'use client';

import { 
    Cpu, 
    Megaphone, 
    Landmark, 
    BookOpen, 
    Briefcase, 
    HeartPulse, 
    GraduationCap,
    BarChart,
    DollarSign,
    Sprout,
    Dumbbell,
    BrainCircuit,
    type LucideIcon 
} from 'lucide-react';
import * as React from 'react';

export const ICONS: Record<string, LucideIcon> = {
  // Topics
  'AI': Cpu,
  'Marketing': Megaphone,
  'Finance': Landmark,
  'Business': Briefcase,
  'Healthcare': HeartPulse,
  'Education': GraduationCap,
  'Personal Growth': Sprout,
  'Fitness': Dumbbell,
  'Psychology': BrainCircuit,

  // Default
  'default': BookOpen,
};

interface TopicIconProps {
  topic: string;
  className?: string;
}

export const TopicIcon: React.FC<TopicIconProps> = ({ topic, className }) => {
  const Icon = ICONS[topic] || ICONS.default;
  return <Icon className={className} />;
};

export const LevelIcon: React.FC<{className?: string}> = ({className}) => <BarChart className={className} />
export const PriceIcon: React.FC<{className?: string}> = ({className}) => <DollarSign className={className} />
export const IndustryIcon: React.FC<{className?: string}> = ({className}) => <Briefcase className={className} />

