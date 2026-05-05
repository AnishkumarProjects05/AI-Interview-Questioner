"use client"
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, LayoutDashboard, List, DockIcon, Menu, X, Moon, Sun, LogOut } from 'lucide-react'
import { SideBarOptions } from '@/services/Constant'
import { toast } from 'sonner'
import { useState } from 'react'
import { useUser } from '@/app/provider'
import { useRouter } from 'next/navigation'
import { supabase } from '@/services/supabaseClient'

function AppNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { user, setUser, theme, toggleTheme } = useUser();
    const router = useRouter();

    const handleLogout = async () => {
        setIsUserMenuOpen(false);
        if (!supabase) return;
        if (setUser) setUser(null);
        await supabase.auth.signOut();
        router.replace('/auth');
    }

    const userInitial = user?.name?.charAt(0).toUpperCase() || "U";

    return (
        <>
            <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl font-inter">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                    {/* Logo Section */}
                    <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Image src="/logo.png" alt="logo" width={140} height={40} className="w-[120px]" priority />
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {SideBarOptions.map((option, index) => {
                            const Icon = option.icon;
                            return (
                                <Link
                                    key={index}
                                    href={option.path}
                                    onClick={(e) => {
                                        if (option.name === "Resume-JD Analyzer") {
                                            e.preventDefault();
                                            toast.info("Feature Coming Soon!", {
                                                description: "We are working hard to bring this feature to life.",
                                                className: "bg-slate-900 border-indigo-500/20 text-white"
                                            });
                                        }
                                    }}
                                    className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors group"
                                >
                                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span>{option.name}</span>
                                    {option.name === "Resume-JD Analyzer" && (
                                        <span className="px-1.5 py-0.5 bg-indigo-100 text-[8px] text-indigo-600 rounded border border-indigo-200 uppercase font-black">Soon</span>
                                    )}
                                </Link>
                            )
                        })}
                    </div>

                    {/* Action Section */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Link href="/dashboard/CreateButton" className="hidden lg:block">
                            <Button className="h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all active:scale-95 border-t border-white/10">
                                <Plus className="w-4 h-4" />
                                <span>New Session</span>
                            </Button>
                        </Link>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95 shadow-sm"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {/* User Avatar & Dropdown */}
                        <div className="relative">
                            <div
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 border-2 border-white dark:border-white/20 shadow-lg flex items-center justify-center text-white font-black text-xs cursor-pointer hover:scale-105 transition-transform"
                            >
                                {userInitial}
                            </div>

                            {/* Dropdown */}
                            {isUserMenuOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200 fade-in slide-in-from-top-2">
                                        <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 flex flex-col">
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Account</span>
                                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{user?.name || "User"}</span>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-3 text-left text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Log out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors z-[60]"
                        >
                            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                        </button>

                    </div>
                </div>
            </nav>

            {/* Backdrop Overlay */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-[100] md:hidden transition-opacity animate-in fade-in duration-300"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Mobile Menu */}
            <div
                className={`
                    fixed top-0 right-0 h-[100dvh] w-full sm:w-[320px] bg-white dark:bg-[#020617] border-l border-slate-200 dark:border-white/10 z-[110] p-8 space-y-8 shadow-2xl md:hidden
                    transition-transform duration-500 ease-out
                    ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                {/* Close Button Inside Menu */}
                <button
                    onClick={() => setIsMenuOpen(false)}
                    className="absolute top-6 right-6 p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    aria-label="Close Menu"
                >
                    <X className="w-6 h-6" />
                </button>
                <div className="flex flex-col gap-6 pt-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                            <DockIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-[10px]">Portal Menu</h3>
                            <p className="text-slate-400 text-xs font-bold">Select destination</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {SideBarOptions.map((option, index) => {
                            const Icon = option.icon;
                            return (
                                <Link
                                    key={index}
                                    href={option.path}
                                    onClick={(e) => {
                                        if (option.name === "Resume-JD Analyzer") {
                                            e.preventDefault();
                                            toast.info("Feature Coming Soon!", {
                                                description: "We are working hard to bring this feature to life.",
                                                className: "bg-slate-900 border-indigo-500/20 text-white"
                                            });
                                        } else {
                                            setIsMenuOpen(false);
                                        }
                                    }}
                                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 group transition-all"
                                >
                                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{option.name}</span>
                                        {option.name === "Resume-JD Analyzer" && (
                                            <span className="text-[8px] bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full w-fit uppercase font-black mt-1">Coming Soon</span>
                                        )}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                        <Link href="/dashboard/CreateButton" onClick={() => setIsMenuOpen(false)}>
                            <Button className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3 transition-all active:scale-95 border-t border-white/10">
                                <Plus className="w-5 h-5" />
                                CREATE NEW SESSION
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="absolute bottom-8 left-8 right-8 text-center">
                    <p className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em]">AI Interviewer v2.0</p>
                </div>
            </div>
        </>
    )
}

export default AppNavbar
