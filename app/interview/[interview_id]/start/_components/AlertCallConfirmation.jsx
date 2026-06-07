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
            <AlertDialogContent className="rounded-3xl border border-gray-700/30 bg-[#1a1b1e] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 sm:p-10 font-inter animate-in zoom-in-95 duration-300 max-w-[92%] sm:max-w-lg">
                <AlertDialogHeader className="space-y-4 sm:space-y-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 border border-red-500/20 mx-auto">
                        <PhoneOff className="w-8 h-8 sm:w-10 sm:h-10" />
                    </div>
                    <div className="space-y-2 text-center">
                        <AlertDialogTitle className="text-2xl sm:text-3xl font-black text-white tracking-tight">End Meeting?</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm sm:text-base text-gray-400 font-medium leading-relaxed max-w-xs sm:max-w-sm mx-auto">
                            Are you sure you want to end the session? Your progress will be saved automatically.
                        </AlertDialogDescription>
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-6 sm:mt-10 gap-3 flex flex-col-reverse sm:flex-row justify-center">
                    <AlertDialogCancel className="w-full sm:w-auto mt-0 rounded-full border-gray-700/50 bg-gray-800 text-gray-300 font-bold px-6 py-3 sm:px-8 sm:py-6 text-sm sm:text-base hover:bg-gray-700 hover:text-white transition-all">
                        Go Back
                    </AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={() => stopInterview && stopInterview()}
                        className="w-full sm:w-auto rounded-full bg-red-600 hover:bg-red-700 text-white font-black px-6 py-3 sm:px-10 sm:py-6 text-sm sm:text-base shadow-xl shadow-red-500/20 transition-all active:scale-95"
                    >
                        End Meeting
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
export default AlertCallConfirmation;