import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(then);
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

export function truncate(text: string, max: number): string {
  return text.length <= max ? text : text.slice(0, max).trim() + "...";
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function estimateReadTime(text: string): number {
  return Math.max(1, Math.ceil(countWords(text) / 200));
}

export const BEAT_OPTIONS = [
  { value: "politics", label: "Politics", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
  { value: "business", label: "Business", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  { value: "sports", label: "Sports", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
  { value: "technology", label: "Technology", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  { value: "health", label: "Health", color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300" },
  { value: "science", label: "Science", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
  { value: "entertainment", label: "Entertainment", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
  { value: "crime", label: "Crime", color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300" },
  { value: "local", label: "Local", color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300" },
  { value: "national", label: "National", color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300" },
  { value: "international", label: "International", color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300" },
  { value: "opinion", label: "Opinion", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
  { value: "features", label: "Features", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" },
] as const;

export const STATUS_OPTIONS = [
  { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200" },
  { value: "in_progress", label: "In Progress", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  { value: "review", label: "Review", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
  { value: "approved", label: "Approved", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  { value: "published", label: "Published", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" },
  { value: "archived", label: "Archived", color: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200" },
] as const;

export const PRIORITY_OPTIONS = [
  { value: "breaking", label: "Breaking", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
  { value: "high", label: "High", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
  { value: "low", label: "Low", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
] as const;

export const TONE_OPTIONS = [
  { value: "neutral", label: "Neutral", description: "Objective, balanced reporting" },
  { value: "urgent", label: "Urgent", description: "Breaking news, time-sensitive" },
  { value: "explanatory", label: "Explanatory", description: "Educational, context-rich" },
  { value: "investigative", label: "Investigative", description: "Deep-dive, accountability-focused" },
  { value: "feature", label: "Feature", description: "Narrative, human-interest" },
  { value: "opinion", label: "Opinion", description: "Editorial, persuasive" },
] as const;

export const AUDIENCE_OPTIONS = [
  { value: "general_public", label: "General Public" },
  { value: "industry_experts", label: "Industry Experts" },
  { value: "policy_makers", label: "Policy Makers" },
  { value: "youth", label: "Youth (18-24)" },
  { value: "seniors", label: "Seniors (65+)" },
  { value: "professional", label: "Professional" },
  { value: "academic", label: "Academic" },
] as const;

export const FORMAT_OPTIONS = [
  { value: "breaking" as const, label: "Breaking Alert", icon: "Zap" },
  { value: "web" as const, label: "Web Article", icon: "Globe" },
  { value: "feature" as const, label: "Feature Story", icon: "BookOpen" },
  { value: "twitter" as const, label: "Twitter/X", icon: "Twitter" },
  { value: "linkedin" as const, label: "LinkedIn", icon: "Linkedin" },
  { value: "facebook" as const, label: "Facebook", icon: "Facebook" },
  { value: "instagram" as const, label: "Instagram", icon: "Instagram" },
  { value: "video" as const, label: "Video Script", icon: "Video" },
  { value: "newsletter" as const, label: "Newsletter", icon: "Mail" },
  { value: "audio" as const, label: "Audio Brief", icon: "Mic" },
  { value: "press" as const, label: "Press Release", icon: "FileText" },
] as const;
