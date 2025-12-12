
import React from 'react'
import WelcomeContainer from './_components/WelcomeContainer'
import Options from './_components/Options'
import InterviewHistroy from './_components/InterviewHistroy'

function Dashboard() {
  return (
    <div>
        <WelcomeContainer />
        <h1 className='m-5 text-emerald-400 text-4xl font-bold text-center'>Dashboard</h1>
        <Options />
        <InterviewHistroy /> 

      
    </div>
  )
}

export default Dashboard
