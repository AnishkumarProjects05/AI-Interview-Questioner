import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link' // Fixed: Import Link from next/link for navigation
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Copy, Clock, List, ArrowLeft, Plus, Mail, MessageCircle, Check } from 'lucide-react'
import { toast } from 'sonner'

function CreateInterviewLink({ interviewId, formData }) {

  const [interviewUrl, setInterviewUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (interviewId) {
      GetInterviewUrl();
    }
  }, [interviewId])

  const GetInterviewUrl = () => {
    const url = window.location.origin + '/interview/' + interviewId;
    setInterviewUrl(url);
  }

  const onCopy = () => {
    navigator.clipboard.writeText(interviewUrl);
    setCopied(true);
    toast('Link Copied to Clipboard');

    // Reset icon after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className='flex flex-col items-center justify-center my-10 px-4'>

      {/* Main Success Card */}
      <div className='w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden'>

        {/* Header Section */}
        <div className='bg-emerald-50 p-8 flex flex-col items-center text-center border-b border-emerald-100'>
          <div className='bg-white p-4 rounded-full shadow-sm mb-4'>
            {/* Ensure image path is correct in your public folder */}
            <Image src="/meeting.png" width={150} height={150} alt="Interview Ready" className='object-contain' />
          </div>
          <h2 className='font-extrabold text-3xl text-emerald-900 font-sans'>
            Interview Ready!
          </h2>
          <p className='text-gray-500 mt-2 max-w-md'>
            Your AI-powered interview has been created successfully. Share the link below with your candidates.
          </p>
        </div>

        {/* Link & Details Section */}
        <div className='p-8 space-y-6'>

          {/* URL Copy Section */}
          <div>
            <label className='text-sm font-semibold text-gray-700 ml-1'>Interview Link</label>
            <div className='flex gap-2 mt-2'>
              <Input
                value={interviewUrl}
                readOnly
                className='h-12 bg-gray-50 border-gray-200 text-gray-600 focus-visible:ring-emerald-500'
              />
              <Button
                onClick={onCopy}
                className={`h-12 px-6 transition-all duration-300 ${copied ? 'bg-green-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}
              >
                {copied ? <Check className='w-4 h-4 mr-2' /> : <Copy className='w-4 h-4 mr-2' />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>

          {/* Interview Details Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex items-center gap-3 p-4 bg-emerald-50/50 rounded-lg border border-emerald-100'>
              <div className='p-2 bg-white rounded-full text-emerald-600'>
                <Clock className='w-5 h-5' />
              </div>
              <div>
                <p className='text-xs text-gray-500 font-medium'>Duration</p>
                <p className='font-bold text-gray-800'>{formData?.duration || '0'} Minutes</p>
              </div>
            </div>

            <div className='flex items-center gap-3 p-4 bg-emerald-50/50 rounded-lg border border-emerald-100'>
              <div className='p-2 bg-white rounded-full text-emerald-600'>
                <List className='w-5 h-5' />
              </div>
              <div>
                <p className='text-xs text-gray-500 font-medium'>Interview Type</p>
                <p className='font-bold text-gray-800 capitalize'>
                  {/* Handle if type is array or string */}
                  {Array.isArray(formData?.type)
                    ? formData?.type.join(', ')
                    : formData?.type || 'General'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Share Buttons */}
          <div>
            <p className='text-sm text-center text-gray-400 mb-3'>— Or share directly —</p>
            <div className='flex justify-center gap-4'>
              <Button variant="outline" className='border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'>
                <Mail className='w-4 h-4 mr-2' /> Email
              </Button>
              <Button variant="outline" className='border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'>
                <MessageCircle className='w-4 h-4 mr-2' /> Slack
              </Button>
              <Button variant="outline" className='border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'>
                <MessageCircle className='w-4 h-4 mr-2' /> WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className='flex gap-5 mt-8'>
        <Link href={'/dashboard'}>
          <Button variant="ghost" className='text-gray-500 hover:text-gray-900'>
            <ArrowLeft className='w-4 h-4 mr-2' /> Back to Dashboard
          </Button>
        </Link>
        {/* Note: Depending on your folder structure, verify if '/dashboard/CreateButton' 
                   is a valid route. Usually this would link back to '/dashboard' 
                   or reload the create page. 
                */}
        <Link href={'/create-interview'}>
          <Button className='bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200'>
            <Plus className='w-4 h-4 mr-2' /> Create New Interview
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default CreateInterviewLink