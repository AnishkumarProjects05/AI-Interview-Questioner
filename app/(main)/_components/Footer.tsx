"use client"

import React from 'react'
import { Heart, Github, Linkedin, Terminal, Users, Mail } from 'lucide-react'

function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-white/5 bg-white/30 dark:bg-slate-950/30 backdrop-blur-md py-8 mt-auto font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Left Side: Brand and Copyright */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-500/20">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-black text-[#0f172a] dark:text-white tracking-wider uppercase">
              CareerConnect AI
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">
              &copy; {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
        </div>

        {/* Center: The Quote & Contribution Request */}
        <div className="flex flex-col items-center text-center max-w-md space-y-2.5">
          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Community Driven</span>
          </div>
          <div className="space-y-1">
            <p className="text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-400 italic">
              "Developed by an Undergraduate and Used by Job Seekers , Graduates , Undergraduates"
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold flex items-center justify-center gap-1.5 mt-1">
              <Mail className="w-3 h-3 text-indigo-400" />
              If you want to Contribute with me Mail at{" "}
              <a
                href="mailto:anishrkumar2k5@gmail.com"
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-black transition-colors"
              >
                anishrkumar2k5@gmail.com
              </a>
            </p>
          </div>
        </div>

        {/* Right Side: Developed with love / Socials */}
        <div className="flex flex-col md:items-end items-center gap-2">

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/AnishkumarProjects05"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-indigo-500 transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/anish-kumar-129762283/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-indigo-500 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer
