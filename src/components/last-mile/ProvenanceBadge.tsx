import React from 'react';
import { ShieldAlert, Sparkles, Languages, Eye, AlertOctagon, Activity, FileCheck } from 'lucide-react';

export type ProvenanceType =
  | 'OFFICIAL SOURCE CONTENT'
  | 'DERIVED CONTENT'
  | 'TRANSLATION'
  | 'PLAIN-LANGUAGE VERSION'
  | 'VISUAL VERSION'
  | 'COMMUNITY-GENERATED • NOT OFFICIAL'
  | 'DEMO TELEMETRY'
  | 'SAMPLE / SYNTHETIC DATA';

interface ProvenanceBadgeProps {
  type: ProvenanceType;
  size?: 'sm' | 'md';
  className?: string;
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  type,
  size = 'sm',
  className = '',
}) => {
  const config = {
    'OFFICIAL SOURCE CONTENT': {
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      icon: FileCheck,
    },
    'DERIVED CONTENT': {
      bg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
      icon: Sparkles,
    },
    'TRANSLATION': {
      bg: 'bg-sky-500/10 border-sky-500/30 text-sky-300',
      icon: Languages,
    },
    'PLAIN-LANGUAGE VERSION': {
      bg: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
      icon: Eye,
    },
    'VISUAL VERSION': {
      bg: 'bg-teal-500/10 border-teal-500/30 text-teal-300',
      icon: Eye,
    },
    'COMMUNITY-GENERATED • NOT OFFICIAL': {
      bg: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
      icon: AlertOctagon,
    },
    'DEMO TELEMETRY': {
      bg: 'bg-slate-700/50 border-slate-600 text-slate-300',
      icon: Activity,
    },
    'SAMPLE / SYNTHETIC DATA': {
      bg: 'bg-rose-500/15 border-rose-500/35 text-rose-300',
      icon: ShieldAlert,
    },
  }[type];

  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2.5 py-0.5 gap-1.5' : 'text-xs px-3 py-1 gap-2';

  return (
    <span
      className={`inline-flex items-center font-bold tracking-wider rounded-full border uppercase select-none transition-colors ${config.bg} ${sizeClasses} ${className}`}
      role="status"
      aria-label={`Content provenance: ${type}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3 shrink-0' : 'w-3.5 h-3.5 shrink-0'} />
      <span>{type}</span>
    </span>
  );
};
