"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Building2, 
  Briefcase, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Linkedin, 
  Search, 
  Sparkles, 
  ExternalLink, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Award, 
  BookOpen, 
  Loader2, 
  X,
  Layers,
  MapPin,
  Send,
  AlertCircle,
  TrendingUp,
  UserCheck,
  ArrowRight,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/app/provider";
import { supabase } from "@/services/supabaseClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function InterviewExperiencePage() {
  const { user } = useUser();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // State Management
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState("All");
  const [selectedVerdictFilter, setSelectedVerdictFilter] = useState("All");

  // Modal Controls
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [isVerifyingAndSubmitting, setIsVerifyingAndSubmitting] = useState(false);

  // Form State for Sharing Experience
  const [formValues, setFormValues] = useState({
    company_name: "",
    role_title: "",
    linkedin_url: "",
    experience_level: "Fresher / 0-1 YOE",
    job_location: "",
    application_source: "LinkedIn",
    verdict: "Offer Accepted",
    overall_difficulty: "Medium",
    interview_date: "",
    description: "",
    preparation_tips: "",
    resources_used: ""
  });

  // Dynamic Round Components State
  const [rounds, setRounds] = useState([
    {
      round_number: 1,
      round_name: "Online Assessment (OA)",
      topics_covered: "DSA, Arrays, Dynamic Programming",
      round_description: ""
    }
  ]);

  // Fetch all experiences and their child rounds from Supabase
  useEffect(() => {
    setIsMounted(true);
    fetchInterviewExperiences();
  }, []);

  // Auto-prefill LinkedIn URL from user_details if already saved
  useEffect(() => {
    async function prefillLinkedIn() {
      if (user?.email && supabase) {
        try {
          const { data, error } = await supabase
            .from("user_details")
            .select("linkedinprofile")
            .eq("email", user.email)
            .maybeSingle();
          
          if (!error && data?.linkedinprofile) {
            setFormValues(prev => ({ ...prev, linkedin_url: data.linkedinprofile }));
          }
        } catch (err) {
          console.warn("Could not prefill LinkedIn:", err);
        }
      }
    }
    prefillLinkedIn();
  }, [user]);

  const fetchInterviewExperiences = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      // Fetch parent experiences
      const { data: expData, error: expError } = await supabase
        .from("interview_experience")
        .select("*")
        .order("created_at", { ascending: false });

      if (expError) throw expError;

      // Fetch child rounds for all experiences
      let roundsData = [];
      const { data: rData, error: roundsError } = await supabase
        .from("interview_experience_rounds")
        .select("*")
        .order("round_number", { ascending: true });

      if (!roundsError && rData) {
        roundsData = rData;
      } else {
        const { data: rSingleData } = await supabase
          .from("interview_experience_round")
          .select("*")
          .order("round_number", { ascending: true });
        if (rSingleData) roundsData = rSingleData;
      }

      // Merge rounds into each experience
      const merged = (expData || []).map(exp => ({
        ...exp,
        rounds: (roundsData || []).filter(r => r.experience_id === exp.id)
      }));

      setExperiences(merged);
    } catch (error) {
      console.error("Error fetching experiences:", error);
      toast.error("Failed to load community interview experiences.");
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Round Component Handlers
  const handleAddRound = () => {
    setRounds(prev => [
      ...prev,
      {
        round_number: prev.length + 1,
        round_name: `Technical Round ${prev.length}`,
        topics_covered: "",
        round_description: ""
      }
    ]);
  };

  const handleRemoveRound = (indexToRemove) => {
    if (rounds.length === 1) {
      toast.error("You must have at least one interview round.");
      return;
    }
    const updated = rounds
      .filter((_, idx) => idx !== indexToRemove)
      .map((r, idx) => ({ ...r, round_number: idx + 1 }));
    setRounds(updated);
  };

  const handleRoundChange = (index, field, value) => {
    setRounds(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Submit & AI Verification Handler
  const handleVerifyAndSubmit = async (e) => {
    e.preventDefault();

    // 1. Mandatory validations
    if (!formValues.company_name.trim()) {
      toast.error("Please enter the company name.");
      return;
    }
    if (!formValues.role_title.trim()) {
      toast.error("Please enter the target role title.");
      return;
    }
    if (!formValues.linkedin_url.trim()) {
      toast.error("LinkedIn profile URL is mandatory for verification.");
      return;
    }

    const cleanLinkedIn = formValues.linkedin_url.trim();
    if (!cleanLinkedIn.includes("linkedin.com/in/")) {
      toast.error("Please provide a valid LinkedIn URL (e.g. https://linkedin.com/in/username).");
      return;
    }

    const hasEmptyRoundDesc = rounds.some(r => !r.round_description.trim());
    if (hasEmptyRoundDesc) {
      toast.error("Please provide description details for all interview rounds.");
      return;
    }

    setIsVerifyingAndSubmitting(true);
    const toastId = toast.loading("🤖 AI Auditor is verifying your LinkedIn and round details...");

    try {
      // 2. Call the AI Verification API
      const verifyResponse = await fetch("/api/verify-experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formValues,
          candidate_name: user?.name || "Candidate",
          rounds
        })
      });

      const verifyResult = await verifyResponse.json();

      if (!verifyResult.is_verified) {
        toast.error(
          `Verification Rejected (${verifyResult.confidence_score}%): ${verifyResult.evidence_reason}`,
          { id: toastId, duration: 6000 }
        );
        setIsVerifyingAndSubmitting(false);
        return;
      }

      toast.success(
        `Verified by AI Auditor (${verifyResult.confidence_score}%)! Publishing to community pool...`,
        { id: toastId }
      );

      // 3. Insert Parent Experience into Supabase
      const experiencePayload = {
        user_id: user?.id ? (isNaN(Number(user.id)) ? null : Number(user.id)) : null,
        user_email: user?.email || "anonymous@community.io",
        user_name: user?.name || "Verified Candidate",
        linkedin_url: cleanLinkedIn,
        company_name: formValues.company_name.trim(),
        role_title: formValues.role_title.trim(),
        experience_level: formValues.experience_level,
        job_location: formValues.job_location.trim() || "Not specified",
        application_source: formValues.application_source,
        verdict: formValues.verdict,
        overall_difficulty: formValues.overall_difficulty,
        interview_date: formValues.interview_date.trim() || "Recent",
        description: formValues.description.trim() || null,
        preparation_tips: formValues.preparation_tips.trim() || null,
        resources_used: formValues.resources_used.trim() || null,
        is_verified: true,
        verification_score: verifyResult.confidence_score,
        verification_verdict: verifyResult.verdict || "VERIFIED",
        verification_evidence: verifyResult.evidence_reason || "AI audit confirmed profile & hiring patterns.",
        verification_flags: verifyResult.flags || []
      };

      const { data: insertedExp, error: insertError } = await supabase
        .from("interview_experience")
        .insert([experiencePayload])
        .select()
        .single();

      if (insertError) throw insertError;

      // 4. Insert Child Rounds into Supabase
      const roundsPayload = rounds.map((r, idx) => ({
        experience_id: insertedExp.id,
        round_number: idx + 1,
        round_name: r.round_name.trim() || `Round ${idx + 1}`,
        round_description: r.round_description.trim(),
        topics_covered: r.topics_covered.trim() || null
      }));

      const { error: roundsInsertError } = await supabase
        .from("interview_experience_rounds")
        .insert(roundsPayload);

      if (roundsInsertError) {
        // Fallback if child table is singular
        await supabase
          .from("interview_experience_round")
          .insert(roundsPayload);
      }

      toast.success("🎉 Your interview experience is now live in the Open Community Pool!");
      setIsShareModalOpen(false);

      // Reset form
      setFormValues({
        company_name: "",
        role_title: "",
        linkedin_url: user ? formValues.linkedin_url : "",
        experience_level: "Fresher / 0-1 YOE",
        job_location: "",
        application_source: "LinkedIn",
        verdict: "Offer Accepted",
        overall_difficulty: "Medium",
        interview_date: "",
        description: "",
        preparation_tips: "",
        resources_used: ""
      });
      setRounds([
        {
          round_number: 1,
          round_name: "Online Assessment (OA)",
          topics_covered: "DSA, Arrays, Dynamic Programming",
          round_description: ""
        }
      ]);

      fetchInterviewExperiences();

    } catch (err) {
      console.error("Submission error:", err);
      toast.error(`Failed to publish: ${err.message}`, { id: toastId });
    } finally {
      setIsVerifyingAndSubmitting(false);
    }
  };

  // Filtered Community Experiences
  const filteredExperiences = useMemo(() => {
    return experiences.filter(exp => {
      const matchesSearch = 
        exp.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.role_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (exp.rounds || []).some(r => 
          r.round_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.topics_covered?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.round_description?.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCompany = 
        selectedCompanyFilter === "All" || 
        exp.company_name?.toLowerCase() === selectedCompanyFilter.toLowerCase();

      const matchesVerdict = 
        selectedVerdictFilter === "All" || 
        exp.verdict === selectedVerdictFilter;

      return matchesSearch && matchesCompany && matchesVerdict;
    });
  }, [experiences, searchQuery, selectedCompanyFilter, selectedVerdictFilter]);

  // Helper to format post timestamp
  const formatPostDate = (dateString) => {
    if (!dateString) return "Recently";
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch (e) {
      return "Recently";
    }
  };

  // Dynamically compute company filter tags from real database records + popular seed
  const dynamicCompanyTags = useMemo(() => {
    const companies = new Set(["All"]);
    ["Google", "Amazon", "Microsoft", "Meta", "Apple"].forEach(c => companies.add(c));
    experiences.forEach(exp => {
      if (exp.company_name && typeof exp.company_name === 'string' && exp.company_name.trim()) {
        companies.add(exp.company_name.trim());
      }
    });
    return Array.from(companies);
  }, [experiences]);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 p-4 sm:p-8 font-inter text-slate-900 dark:text-slate-100 transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ========================================================================= */}
        {/* HEADER SECTION                                                            */}
        {/* ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-xl shadow-indigo-100/50 dark:shadow-black/40">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/30">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  Open Interview Experience Pool
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Real round-by-round interview breakdowns verified by AI and backed by real LinkedIn profiles.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setIsShareModalOpen(true)}
            variant="default"
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-6 py-6 rounded-2xl shadow-xl shadow-indigo-500/25 transition-all flex items-center gap-2.5 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Share Your Experience
          </Button>
        </div>

        {/* ========================================================================= */}
        {/* SEARCH & FILTERS BAR                                                      */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search by company, role, or topic (e.g. Graphs, System Design)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-white/5 rounded-2xl text-sm font-medium focus:border-indigo-500 shadow-sm"
              />
            </div>

            {/* Verdict Filter */}
            <div className="flex items-center gap-2 self-start md:self-auto overflow-x-auto pb-1 max-w-full">
              {["All", "Offer Accepted", "Rejected"].map((v) => (
                <button
                  key={v}
                  onClick={() => setSelectedVerdictFilter(v)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    selectedVerdictFilter === v
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md"
                      : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Company Quick Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {dynamicCompanyTags.map((comp) => (
              <button
                key={comp}
                onClick={() => setSelectedCompanyFilter(comp)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCompanyFilter === comp
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-white/20"
                }`}
              >
                {comp}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* OPEN POOL EXPERIENCE GRID                                                 */}
        {/* ========================================================================= */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-white/5 animate-pulse p-6"></div>
            ))}
          </div>
        ) : filteredExperiences.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-4">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <BookOpen className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No interview experiences found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                Be the first candidate to contribute your interview rounds and help the community!
              </p>
            </div>
            <Button
              onClick={() => setIsShareModalOpen(true)}
              variant="default"
              size="default"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Share First Experience
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiences.map((exp) => {
              const isAccepted = exp.verdict === "Offer Accepted" || exp.verdict === "Offer Received";
              const roundsList = exp.rounds || [];

              return (
                <div
                  key={exp.id}
                  className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-white/5 rounded-3xl p-6 flex flex-col justify-between hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 group"
                >
                  <div className="space-y-4">
                    {/* Top Row: Company & Verdict */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-md">
                          {exp.company_name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-black text-lg text-slate-900 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {exp.company_name}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            {exp.role_title}
                          </p>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                        isAccepted
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                          : "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                      }`}>
                        {isAccepted ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {exp.verdict}
                      </span>
                    </div>

                    {/* Author & Mandatory LinkedIn Card */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-white/5 gap-2.5">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {exp.user_name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{exp.user_name}</p>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                            <span>AI Verified ({exp.verification_score || 85}%)</span>
                          </div>
                        </div>
                      </div>

                      {/* Direct LinkedIn Button with clear CTA */}
                      {exp.linkedin_url && (
                        <a
                          href={exp.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/70 text-blue-600 dark:text-blue-400 rounded-xl transition-all flex items-center gap-1.5 text-[11px] font-bold border border-blue-100 dark:border-blue-900/40 shadow-sm self-start sm:self-auto group/lnk"
                          title="Click to visit author's LinkedIn profile and verify company experience"
                        >
                          <Linkedin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 group-hover/lnk:scale-110 transition-transform" />
                          <span>Verify Profile</span>
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </a>
                      )}
                    </div>

                    {/* Meta tags & Post Timestamp */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex flex-wrap gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        {exp.experience_level && (
                          <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">
                            {exp.experience_level}
                          </span>
                        )}
                        {exp.application_source && (
                          <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">
                            Via {exp.application_source}
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-md">
                          {roundsList.length} {roundsList.length === 1 ? "Round" : "Rounds"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                        <Clock className="w-3 h-3" />
                        <span>Posted on {formatPostDate(exp.created_at)}</span>
                      </div>
                    </div>

                    {/* Overall Description Snippet */}
                    {exp.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed font-medium">
                        "{exp.description}"
                      </p>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedExperience(exp)}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      View All Rounds ({roundsList.length}) <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <Button
                      onClick={() => {
                        router.push(`/dashboard/CreateButton`);
                      }}
                      size="sm"
                      variant="outline"
                      className="text-[11px] font-bold border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1" /> Practice
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 1: SHARE INTERVIEW EXPERIENCE (WITH DYNAMIC ROUND COMPONENTS)       */}
        {/* ========================================================================= */}
        {isShareModalOpen && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col">
              
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-600 text-white rounded-xl">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      Share Your Interview Experience
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      All submissions are verified by AI & visible in the open community pool.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form Body */}
              <form onSubmit={handleVerifyAndSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
                
                {/* 1. Basic Company & Candidate Details */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> 1. Company & Role Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Company Name <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        type="text"
                        placeholder="Ex. Google, Amazon, Microsoft"
                        value={formValues.company_name}
                        onChange={(e) => setFormValues(prev => ({ ...prev, company_name: e.target.value }))}
                        className="rounded-xl h-12 text-sm font-medium"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Target Role / Title <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        type="text"
                        placeholder="Ex. Software Development Engineer II"
                        value={formValues.role_title}
                        onChange={(e) => setFormValues(prev => ({ ...prev, role_title: e.target.value }))}
                        className="rounded-xl h-12 text-sm font-medium"
                        required
                      />
                    </div>

                    {/* Mandatory LinkedIn Input */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Linkedin className="w-4 h-4 text-blue-500" />
                          Author LinkedIn Profile URL <span className="text-rose-500">* (Mandatory for Proof)</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">Enables community verification</span>
                      </label>
                      <Input
                        type="url"
                        placeholder="https://linkedin.com/in/your-username"
                        value={formValues.linkedin_url}
                        onChange={(e) => setFormValues(prev => ({ ...prev, linkedin_url: e.target.value }))}
                        className="rounded-xl h-12 text-sm font-medium border-blue-200 dark:border-blue-900/40 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Experience Level</label>
                      <select
                        value={formValues.experience_level}
                        onChange={(e) => setFormValues(prev => ({ ...prev, experience_level: e.target.value }))}
                        className="w-full h-12 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 text-sm font-medium"
                      >
                        <option value="Intern">Internship / Student</option>
                        <option value="Fresher / 0-1 YOE">Fresher / 0-1 YOE</option>
                        <option value="Mid Level (2-4 YOE)">Mid Level (2-4 YOE)</option>
                        <option value="Senior (5+ YOE)">Senior (5+ YOE)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Application Source</label>
                      <select
                        value={formValues.application_source}
                        onChange={(e) => setFormValues(prev => ({ ...prev, application_source: e.target.value }))}
                        className="w-full h-12 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 text-sm font-medium"
                      >
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Employee Referral">Employee Referral</option>
                        <option value="Company Careers Page">Company Careers Page</option>
                        <option value="On-Campus Placement">On-Campus Placement</option>
                        <option value="Recruiter Reach-out">Recruiter Reach-out</option>
                        <option value="Job Portal (Naukri/Indeed)">Job Portal (Naukri/Indeed)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Interview Verdict</label>
                      <select
                        value={formValues.verdict}
                        onChange={(e) => setFormValues(prev => ({ ...prev, verdict: e.target.value }))}
                        className="w-full h-12 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 text-sm font-medium"
                      >
                        <option value="Offer Accepted">Offer Accepted 🎉</option>
                        <option value="Offer Received">Offer Received</option>
                        <option value="Rejected">Rejected</option>
                        <option value="In Progress">In Progress</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Overall Difficulty</label>
                      <select
                        value={formValues.overall_difficulty}
                        onChange={(e) => setFormValues(prev => ({ ...prev, overall_difficulty: e.target.value }))}
                        className="w-full h-12 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 text-sm font-medium"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                        <option value="Very Hard">Very Hard</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Dynamic Round Components Builder */}
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                        <Layers className="w-4 h-4" /> 2. Round-by-Round Breakdown Components
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Add individual components for each interview round with specific questions asked.
                      </p>
                    </div>

                    <Button
                      type="button"
                      onClick={handleAddRound}
                      size="sm"
                      variant="outline"
                      className="border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl text-xs"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Round Component
                    </Button>
                  </div>

                  {/* List of Dynamic Round Components */}
                  <div className="space-y-4">
                    {rounds.map((round, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 space-y-4 relative group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-black">
                            Round {idx + 1} Component
                          </span>

                          {rounds.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveRound(idx)}
                              className="text-rose-500 hover:text-rose-600 text-xs font-bold flex items-center gap-1 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Remove Round
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Round Title</label>
                            <Input
                              type="text"
                              placeholder="Ex. Online Assessment, Technical DSA Round 1, System Design, HR"
                              value={round.round_name}
                              onChange={(e) => handleRoundChange(idx, "round_name", e.target.value)}
                              className="rounded-xl h-10 text-xs"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Topics / Stack Covered</label>
                            <Input
                              type="text"
                              placeholder="Ex. Binary Trees, Dynamic Programming, Kafka, SQL"
                              value={round.topics_covered}
                              onChange={(e) => handleRoundChange(idx, "topics_covered", e.target.value)}
                              className="rounded-xl h-10 text-xs"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Questions Asked & Discussion Details <span className="text-rose-500">*</span>
                          </label>
                          <Textarea
                            placeholder="Describe the exact questions, problem constraints, approach expected, or behavioral questions asked..."
                            value={round.round_description}
                            onChange={(e) => handleRoundChange(idx, "round_description", e.target.value)}
                            className="min-h-[90px] rounded-xl text-xs resize-none"
                            required
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Overall Description & Tips */}
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/10">
                  <h3 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> 3. Summary & Preparation Tips
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Overall Experience Summary</label>
                    <Textarea
                      placeholder="High level takeaway of the entire recruitment process..."
                      value={formValues.description}
                      onChange={(e) => setFormValues(prev => ({ ...prev, description: e.target.value }))}
                      className="min-h-[80px] rounded-xl text-xs resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Advice & Preparation Tips</label>
                    <Textarea
                      placeholder="Tips on time management, communication, what to focus on..."
                      value={formValues.preparation_tips}
                      onChange={(e) => setFormValues(prev => ({ ...prev, preparation_tips: e.target.value }))}
                      className="min-h-[80px] rounded-xl text-xs resize-none"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="default"
                    onClick={() => setIsShareModalOpen(false)}
                    className="rounded-xl"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={isVerifyingAndSubmitting}
                    variant="default"
                    size="default"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-8 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                  >
                    {isVerifyingAndSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        AI Verifying & Publishing...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Verify & Publish to Pool
                      </>
                    )}
                  </Button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 2: DETAILED ROUND-BY-ROUND BREAKDOWN VIEW                            */}
        {/* ========================================================================= */}
        {selectedExperience && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[85vh] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col">
              
              {/* Modal Top Banner */}
              <div className="p-6 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/80 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                    <span>{selectedExperience.company_name}</span> • <span>{selectedExperience.experience_level}</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    {selectedExperience.role_title}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-md">
                      {selectedExperience.verdict}
                    </span>
                    <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-md">
                      Difficulty: {selectedExperience.overall_difficulty}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedExperience(null)}
                  className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
                
                {/* Author Info & Verified Evidence Box */}
                <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black">
                      {selectedExperience.user_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {selectedExperience.user_name}
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Verified with {selectedExperience.verification_score || 88}% confidence
                      </p>
                    </div>
                  </div>

                  {selectedExperience.linkedin_url && (
                    <a
                      href={selectedExperience.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 self-start sm:self-auto"
                    >
                      <Linkedin className="w-4 h-4" />
                      View Author Profile
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  )}
                </div>

                {/* AI Verification Evidence Explanation */}
                {selectedExperience.verification_evidence && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-white/5 text-xs text-slate-600 dark:text-slate-400 italic">
                    <span className="font-bold text-slate-800 dark:text-slate-200 not-italic block mb-1">
                      🛡️ AI Verification Audit Note:
                    </span>
                    "{selectedExperience.verification_evidence}"
                  </div>
                )}

                {/* Overall Description */}
                {selectedExperience.description && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">Summary</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {selectedExperience.description}
                    </p>
                  </div>
                )}

                {/* Detailed Round Components */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-500" />
                    Round-by-Round Breakdown ({(selectedExperience.rounds || []).length})
                  </h3>

                  {(selectedExperience.rounds || []).map((round, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          Round {round.round_number || idx + 1}: {round.round_name}
                        </h4>
                        {round.topics_covered && (
                          <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-md">
                            {round.topics_covered}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {round.round_description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Prep Tips */}
                {selectedExperience.preparation_tips && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" /> Advice & Preparation Tips
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {selectedExperience.preparation_tips}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer Actions */}
              <div className="p-6 border-t border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-slate-900/80">
                <Button
                  onClick={() => setSelectedExperience(null)}
                  variant="outline"
                  size="default"
                  className="rounded-xl text-xs"
                >
                  Close
                </Button>

                <Button
                  onClick={() => {
                    setSelectedExperience(null);
                    router.push(`/dashboard/CreateButton`);
                  }}
                  variant="default"
                  size="default"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Practice Questions with AI
                </Button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
