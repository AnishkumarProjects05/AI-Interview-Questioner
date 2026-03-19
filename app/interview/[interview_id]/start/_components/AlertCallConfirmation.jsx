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
            <AlertDialogContent className="rounded-3xl border border-gray-700/30 bg-[#1a1b1e] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-10 font-inter animate-in zoom-in-95 duration-300">
                <AlertDialogHeader className="space-y-6">
                    <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 border border-red-500/20 mx-auto">
                        <PhoneOff className="w-10 h-10" />
                    </div>
                    <div className="space-y-2 text-center">
                        <AlertDialogTitle className="text-3xl font-black text-white tracking-tight">End Meeting?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400 font-medium leading-relaxed max-w-sm mx-auto">
                            Are you sure you want to end the session? Your progress will be saved automatically.
                        </AlertDialogDescription>
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-10 gap-3 justify-center">
                    <AlertDialogCancel className="rounded-full border-gray-700/50 bg-gray-800 text-gray-300 font-bold px-8 py-6 hover:bg-gray-700 hover:text-white transition-all">
                        Go Back
                    </AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={() => stopInterview && stopInterview()}
                        className="rounded-full bg-red-600 hover:bg-red-700 text-white font-black px-10 py-6 shadow-xl shadow-red-500/20 transition-all active:scale-95"
                    >
                        End Meeting
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
export default AlertCallConfirmation;