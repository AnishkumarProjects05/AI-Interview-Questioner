import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { PhoneOff } from 'lucide-react'

function AlertCallConfirmation({ children, stopInterview }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl border border-white/5 bg-slate-900 shadow-2xl p-10 font-inter animate-in zoom-in-95 duration-300">
                <AlertDialogHeader className="space-y-6">
                    <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 border border-red-500/20">
                        <PhoneOff className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <AlertDialogTitle className="text-2xl font-black text-white tracking-tight">End Session?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400 font-medium leading-relaxed">
                            Exiting will terminate the neural link with our AI. Your session data will be indexed and saved to your history.
                        </AlertDialogDescription>
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-10 gap-4">
                    <AlertDialogCancel className="rounded-xl border-white/5 bg-slate-800 text-slate-300 font-bold px-6 py-4 hover:bg-slate-700 hover:text-white transition-all">Resume Session</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={() => stopInterview && stopInterview()}
                        className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-black px-8 py-4 shadow-xl shadow-red-500/20 transition-all active:scale-95"
                    >
                        End Meeting
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
export default AlertCallConfirmation;