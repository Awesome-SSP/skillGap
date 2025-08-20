import React, { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Header } from './components/Header'
import { LandingPage } from './pages/LandingPage'
import { UploadPage } from './pages/UploadPage'
import { AnalysisPage } from './pages/AnalysisPage'
import { RecommendationsPage } from './pages/RecommendationsPage'
import { Dashboard } from './pages/Dashboard'
import { ResumeData, SkillGapAnalysis, LearningResource } from './types/api'

export interface AppState {
  resumeData: ResumeData | null
  analysisData: SkillGapAnalysis | null
  recommendations: LearningResource[]
  currentUserId: string | null
}

function App() {
  const location = useLocation()
  
  const [appState, setAppState] = useState<AppState>({
    resumeData: null,
    analysisData: null,
    recommendations: [],
    currentUserId: null
  })

  const updateAppState = (updates: Partial<AppState>) => {
    setAppState(prev => ({ ...prev, ...updates }))
  }

  // Don't show header on landing page
  const showHeader = location.pathname !== '/'

  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && <Header />}
      
      <main className={showHeader ? 'pt-20' : ''}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/upload" 
            element={
              <UploadPage 
                onResumeUploaded={(data) => updateAppState({ 
                  resumeData: data, 
                  currentUserId: data.user_id 
                })} 
              />
            } 
          />
          <Route 
            path="/analysis" 
            element={
              <AnalysisPage 
                resumeData={appState.resumeData}
                onAnalysisComplete={(analysis) => updateAppState({ analysisData: analysis })}
              />
            } 
          />
          <Route 
            path="/recommendations" 
            element={
              <RecommendationsPage 
                analysisData={appState.analysisData}
                recommendations={appState.recommendations}
                onRecommendationsLoaded={(recs) => updateAppState({ recommendations: recs })}
                userId={appState.currentUserId}
              />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <Dashboard userId={appState.currentUserId} />
            } 
          />
        </Routes>
      </main>
    </div>
  )
}

export default App