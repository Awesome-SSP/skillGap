import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Upload, Search, BookOpen, BrainCircuit, Target, TrendingUp, Users } from 'lucide-react'

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Navigation */}
      <nav className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <BrainCircuit className="h-8 w-8 text-primary-600" />
              <span className="font-bold text-xl text-gray-900">SkillGap Finder</span>
            </div>
            
            <Link 
              to="/upload"
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
              Bridge Your Skill Gap.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                Get Career-Ready
              </span>{' '}
              Today.
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up">
              Upload your resume, discover missing skills for your dream job, and get personalized learning 
              recommendations to advance your career faster than ever before.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
              <Link 
                to="/upload"
                className="btn-primary flex items-center space-x-2 text-lg px-8 py-4"
              >
                <Upload className="h-5 w-5" />
                <span>Upload Your Resume</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <button className="btn-outline text-lg px-8 py-4">
                Watch Demo
              </button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-bounce-light">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <Target className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        
        <div className="absolute bottom-20 right-10 animate-bounce-light" style={{ animationDelay: '0.5s' }}>
          <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center">
            <TrendingUp className="h-10 w-10 text-secondary-600" />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get career-ready in three simple steps with our AI-powered analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative group">
              <div className="card text-center hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors duration-300">
                  <Upload className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Upload Resume</h3>
                <p className="text-gray-600 leading-relaxed">
                  Upload your PDF resume and select your target job role. Our AI will parse and extract your skills automatically.
                </p>
              </div>
              
              {/* Connector Arrow */}
              <div className="hidden md:block absolute top-20 -right-4 text-primary-300">
                <ArrowRight className="h-8 w-8" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="card text-center hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary-200 transition-colors duration-300">
                  <Search className="h-8 w-8 text-secondary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Analyze Gaps</h3>
                <p className="text-gray-600 leading-relaxed">
                  Compare your skills with job requirements. See exactly which skills you have and what you're missing.
                </p>
              </div>
              
              {/* Connector Arrow */}
              <div className="hidden md:block absolute top-20 -right-4 text-secondary-300">
                <ArrowRight className="h-8 w-8" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="card text-center hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-200 transition-colors duration-300">
                  <BookOpen className="h-8 w-8 text-accent-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Learn & Grow</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get personalized learning recommendations with courses, books, and resources to fill your skill gaps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose SkillGap Finder?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to accelerate your career growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <BrainCircuit className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-600">Advanced NLP algorithms accurately extract skills from your resume</p>
            </div>

            <div className="card hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-secondary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Precise Matching</h3>
              <p className="text-gray-600">Compare your skills against real job requirements with percentage accuracy</p>
            </div>

            <div className="card hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-accent-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Curated Resources</h3>
              <p className="text-gray-600">Hand-picked courses, books, and tutorials for each missing skill</p>
            </div>

            <div className="card hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress Tracking</h3>
              <p className="text-gray-600">Monitor your learning progress and celebrate skill achievements</p>
            </div>

            <div className="card hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-secondary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Multiple Roles</h3>
              <p className="text-gray-600">Support for 8+ tech roles with constantly updated requirements</p>
            </div>

            <div className="card hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-accent-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real PDF Parsing</h3>
              <p className="text-gray-600">No mock data - works with your actual resume files</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Bridge Your Skill Gap?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of professionals who have accelerated their careers with personalized skill development
          </p>
          
          <Link 
            to="/upload"
            className="inline-flex items-center space-x-2 bg-white text-primary-600 hover:bg-gray-50 font-bold px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
          >
            <Upload className="h-6 w-6" />
            <span>Start Your Analysis</span>
            <ArrowRight className="h-6 w-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BrainCircuit className="h-8 w-8 text-primary-400" />
            <span className="font-bold text-xl">SkillGap Finder</span>
          </div>
          <p className="text-gray-400">
            Empowering careers through intelligent skill gap analysis
          </p>
        </div>
      </footer>
    </div>
  )
}