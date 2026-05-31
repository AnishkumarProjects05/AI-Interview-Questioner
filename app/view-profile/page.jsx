"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, User, Mail, Linkedin, Github, 
  Code2, Save, Edit2, Loader2 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import LeetCodeStats from "./leetcodeProfileStat"; // Your stats component

export default function ViewProfilePage() {
  const router = useRouter();
  
  // Operational States
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Crucial: Controls whether we are viewing stats or editing inputs
  const [isEditing, setIsEditing] = useState(false); 

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    linkedinprofile: "",
    githubprofile: "",
    leetcodeprofile: ""
  });

  // Fetch Logged-in User Profile
  useEffect(() => {
    async function fetchProfileData() {
      try {
        setLoading(true);
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) return;
        
        const emailAddress = user.email;
        setUserEmail(emailAddress); 

        const { data, error } = await supabase
          .from("user_details")
          .select("*")
          .eq("email", emailAddress)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setFormData({
            name: data.name || "",
            email: data.email || emailAddress,
            linkedinprofile: data.linkedinprofile || "",
            githubprofile: data.githubprofile || "",
            leetcodeprofile: data.leetcodeprofile || ""
          });
          // If profile records exist, show the stats layout by default
          setIsEditing(false); 
        } else {
          // If it's a completely brand new profile, force edit mode open first
          setFormData(prev => ({ ...prev, name: user.user_metadata?.full_name || "", email: emailAddress }));
          setIsEditing(true);
        }
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userEmail) return alert("User session not found.");

    try {
      setSaving(true);
      const payload = {
        email: userEmail,
        name: formData.name,
        linkedinprofile: formData.linkedinprofile,
        githubprofile: formData.githubprofile,
        leetcodeprofile: formData.leetcodeprofile
      };

      const { data: existingRecord } = await supabase
        .from("user_details")
        .select("email")
        .eq("email", userEmail)
        .maybeSingle();

      if (existingRecord) {
        await supabase.from("user_details").update(payload).eq("email", userEmail);
      } else {
        await supabase.from("user_details").insert(payload);
      }
      
      alert("Profile updated successfully!");
      setIsEditing(false); // Switch out of edit mode back to dashboard stats preview!
    } catch (err) {
      alert(`Failed to save changes: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      {/* Navigation Row */}
      <div className="max-w-3xl mx-auto flex items-center justify-between mb-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        {/* Show Edit Profile Button ONLY when viewing the stats overview */}
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-sm font-medium px-4 py-2 rounded-xl transition-all"
          >
            <Edit2 className="w-4 h-4 text-slate-400" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Conditional Title Header */}
        <div className="border-b border-slate-800 pb-6 mb-8">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            {isEditing ? "Edit Profile Configurations" : "Candidate Profile Overview"}
          </h1>
        </div>

        {/* ----------------- MODE A: EDITING STATE ----------------- */}
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" /> Full Name
                </label>
                <input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" /> Email Address
                </label>
                <input type="email" value={formData.email} disabled className="w-full bg-slate-900/50 border border-slate-800/80 rounded-xl px-4 py-3 text-sm text-slate-400 cursor-not-allowed" />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Professional Handles</h3>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 flex items-center gap-2"><Linkedin className="w-4 h-4 text-blue-400" /> LinkedIn Link</label>
                <input type="url" name="linkedinprofile" value={formData.linkedinprofile} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-200" placeholder="https://linkedin.com/in/username" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 flex items-center gap-2"><Github className="w-4 h-4 text-slate-300" /> GitHub Link</label>
                <input type="url" name="githubprofile" value={formData.githubprofile} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-200" placeholder="https://github.com/username" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 flex items-center gap-2"><Code2 className="w-4 h-4 text-amber-500" /> LeetCode Link</label>
                <input type="url" name="leetcodeprofile" value={formData.leetcodeprofile} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-200" placeholder="https://leetcode.com/username" />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setIsEditing(false)} 
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-medium px-5 py-3 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-medium text-sm px-6 py-3 rounded-xl transition-all"
              >
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Configurations</>}
              </button>
            </div>
          </form>
        ) : (
          /* ----------------- MODE B: VIEW STATS STATE ----------------- */
          <div className="space-y-8">
            {/* Quick Profile Info Row */}
            <div className="p-6 bg-slate-900/40 border border-slate-900 rounded-2xl flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-100">{formData.name}</h2>
                <p className="text-sm text-slate-400 mt-0.5">{formData.email}</p>
              </div>
              <div className="flex gap-3">
                {formData.linkedinprofile && <a href={formData.linkedinprofile} target="_blank" rel="noreferrer" className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-blue-400 transition-colors"><Linkedin className="w-4 h-4" /></a>}
                {formData.githubprofile && <a href={formData.githubprofile} target="_blank" rel="noreferrer" className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 transition-colors"><Github className="w-4 h-4" /></a>}
                {formData.leetcodeprofile && <a href={formData.leetcodeprofile} target="_blank" rel="noreferrer" className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-amber-500 transition-colors"><Code2 className="w-4 h-4" /></a>}
              </div>
            </div>

            {/* Metric Displays Layout */}
            <div className="grid gap-6 md:grid-cols-2 items-start">
              {/* LeetCode Statistics Box */}
              {formData.leetcodeprofile ? (
  <LeetCodeStats 
    // 1. Adding this key forces React to reset the component instantly when the link changes
    key={formData.leetcodeprofile} 
    username={(() => {
      const cleanUrl = formData.leetcodeprofile.trim().replace(/\/+$/, "");
      const segment = cleanUrl.split("/").pop() || "";
      return segment.replace(/\s+/g, "_");
    })()} 
  />
) : (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-500 text-sm">
    Add LeetCode handle link to display metrics preview.
  </div>
)}

              {/* GitHub Placeholder Box (Ready for your future code setup) */}
              <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[220px] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Github className="w-4 h-4 text-slate-400" /> GitHub Profile Overview
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    Active
                  </span>
                </div>
                <div className="text-center py-4 text-slate-500 text-sm">
                  {formData.githubprofile ? (
                    <p className="text-indigo-400 font-medium">
                      Link synced: {formData.githubprofile.trim().replace(/\/+$/, "").split("/").pop()}
                    </p>
                  ) : (
                    <p>Add GitHub link handle to sync configurations.</p>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 text-right italic">Stats widget integration slot</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}