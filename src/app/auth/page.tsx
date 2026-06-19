'use client';

import { useState } from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { LoginForm } from '@/components/auth/LoginForm';
import { Briefcase } from 'lucide-react';
import clsx from 'clsx';

type AuthTab = 'register' | 'login';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<AuthTab>('register');

  return (
    <div className="min-h-screen bg-navy-950 flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-3/5 flex-col justify-between p-12 bg-gradient-to-br from-navy-900 to-navy-950 border-r border-gray-800">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Briefcase className="w-6 h-6 text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold shimmer-text">CareerAI</h1>
          </div>
          <p className="text-xl text-gray-300 leading-relaxed max-w-md">
            Your career, matched by intelligence.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Upload your CV and let our AI find the perfect job opportunities tailored to your skills and preferences.
          </p>
        </div>

        {/* Floating Cards - Ambient Decoration */}
        <div className="relative h-48 hidden xl:block">
          {/* Card 1 */}
          <div className="absolute top-0 left-0 p-4 bg-surface border border-gray-700 rounded-lg max-w-xs animate-bounce" style={{ animationDelay: '0s' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <p className="text-xs font-semibold text-emerald-400">Match Found</p>
            </div>
            <p className="text-sm text-gray-300">Senior Engineer @ TechCorp</p>
            <div className="mt-2 text-xs text-gray-400">92% match • Remote</div>
          </div>

          {/* Card 2 */}
          <div className="absolute top-20 right-0 p-4 bg-surface border border-gray-700 rounded-lg max-w-xs animate-bounce" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <p className="text-xs font-semibold text-cyan-400">New Opportunity</p>
            </div>
            <p className="text-sm text-gray-300">Product Manager @ StartupXY</p>
            <div className="mt-2 text-xs text-gray-400">88% match • Berlin, DE</div>
          </div>

          {/* Card 3 */}
          <div className="absolute bottom-0 left-1/3 p-4 bg-surface border border-gray-700 rounded-lg max-w-xs animate-bounce" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
              <p className="text-xs font-semibold text-indigo-400">Recommended</p>
            </div>
            <p className="text-sm text-gray-300">Full-Stack Dev @ GlobalTech</p>
            <div className="mt-2 text-xs text-gray-400">95% match • Amsterdam, NL</div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-2/5 flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          {/* Logo for mobile */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Briefcase className="w-5 h-5 text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold shimmer-text">CareerAI</h1>
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-2 mb-8 bg-surface p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('register')}
              className={clsx(
                'flex-1 py-2 px-4 rounded-md font-semibold text-sm transition-all',
                activeTab === 'register'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              )}
            >
              Create Account
            </button>
            <button
              onClick={() => setActiveTab('login')}
              className={clsx(
                'flex-1 py-2 px-4 rounded-md font-semibold text-sm transition-all',
                activeTab === 'login'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              )}
            >
              Sign In
            </button>
          </div>

          {/* Form Card */}
          <div className="bg-surface border border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-6 text-gray-100">
              {activeTab === 'register' ? 'Get started with CareerAI' : 'Welcome back'}
            </h2>
            {activeTab === 'register' ? <RegisterForm /> : <LoginForm />}
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
