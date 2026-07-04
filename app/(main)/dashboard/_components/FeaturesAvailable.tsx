"use client"

import React from 'react'
import { Bot, FileSearch, Sliders, History, Sparkles } from 'lucide-react'

interface FeatureItem {
    icon: React.ComponentType<any>
    title: string
    description: string
    badge?: string
}

function FeaturesAvailable() {
    const features: FeatureItem[] = [
        {
            icon: Bot,
            title: "Interactive Voice Interview",
            description: "Experience a live technical round in our Google Meet-style interface, complete with natural voice synthesis and real-time audio visualization.",
            badge: "Advanced AI"
        },
        {
            icon: FileSearch,
            title: "Resume & JD Meta Analyzer",
            description: "Upload a candidate PDF resume or paste a job description to automatically extract key skill grids and experience metrics.",
            badge: "Available"
        },
        {
            icon: Sliders,
            title: "Custom Session Scope",
            description: "Tailor your assessment path by selecting target nodes, duration settings, and specialization nodes for a customized mock interview.",
            badge: "Configurable"
        },
        {
            icon: History,
            title: "Intelligence History & Metrics",
            description: "Save and index every single mock interview question and performance record securely with persistent storage .",
            badge: "Secure"
        }
    ]

    return (
        <div className="space-y-6 font-inter mt-10">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                    <div className="h-8 w-1.5 bg-indigo-600 rounded-full"></div>
                    Platform Features
                </h2>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Capabilities</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {features.map((feature, index) => {
                    const Icon = feature.icon
                    return (
                        <div
                            key={index}
                            className="group relative flex flex-col p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/30 dark:hover:border-indigo-500/50 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 dark:shadow-black/20"
                        >
                            {/* Light glow on hover */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-600/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 dark:group-hover:bg-indigo-600/10 transition-all duration-500"></div>

                            <div className="relative z-10 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 border border-indigo-100 dark:border-transparent">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    {feature.badge && (
                                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                            {feature.badge}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-sm font-black text-[#0f172a] dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                                        {feature.title}
                                    </h4>
                                    <p className="text-slate-500 dark:text-slate-400 text-[11px] font-medium leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default FeaturesAvailable
