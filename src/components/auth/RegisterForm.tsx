'use client';

import { useState } from 'react';
import { createClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import clsx from 'clsx';
import { JobPreference } from '@/types';

const JOB_PREFERENCES: JobPreference[] = [
  'Software Engineer',
  'Product Manager',
  'Data Scientist',
  'Designer',
  'Marketing',
  'DevOps',
  'Sales',
  'Other',
];

export function RegisterForm() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    job_preference: 'Software Engineer' as JobPreference,
    location: '',
    password: '',
    confirm_password: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      setPasswordStrength('weak');
    } else if (password.length < 12 || !/[^a-zA-Z0-9]/.test(password)) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    validatePassword(password);
    
    if (formData.confirm_password) {
      setPasswordMatch(password === formData.confirm_password);
    }
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirm = e.target.value;
    setFormData({ ...formData, confirm_password: confirm });
    setPasswordMatch(confirm === formData.password);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.full_name.trim()) errors.full_name = 'Full name is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.email = 'Valid email required';
    if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirm_password) errors.confirm_password = 'Passwords do not match';
    if (!formData.location.trim()) errors.location = 'Location is required';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            full_name: formData.full_name,
            email: formData.email,
            job_preference: formData.job_preference,
            location: formData.location,
          },
        ]);

      if (profileError) throw profileError;

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Full Name
        </label>
        <input
          type="text"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          placeholder="Jane Doe"
          className={clsx(
            'w-full px-4 py-3 rounded-lg bg-surface border transition-all',
            fieldErrors.full_name
              ? 'border-red-500/50 focus:border-red-500'
              : 'border-gray-700 focus:border-indigo-500'
          )}
        />
        {fieldErrors.full_name && (
          <p className="mt-1 text-xs text-red-400">{fieldErrors.full_name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="jane@example.com"
          className={clsx(
            'w-full px-4 py-3 rounded-lg bg-surface border transition-all',
            fieldErrors.email
              ? 'border-red-500/50 focus:border-red-500'
              : 'border-gray-700 focus:border-indigo-500'
          )}
        />
        {fieldErrors.email && (
          <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
        )}
      </div>

      {/* Job Preference */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Job Preference
        </label>
        <select
          value={formData.job_preference}
          onChange={(e) => setFormData({ ...formData, job_preference: e.target.value as JobPreference })}
          className="w-full px-4 py-3 rounded-lg bg-surface border border-gray-700 text-gray-100 transition-all focus:border-indigo-500"
        >
          {JOB_PREFERENCES.map((pref) => (
            <option key={pref} value={pref}>
              {pref}
            </option>
          ))}
        </select>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Location
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Berlin, Germany"
          className={clsx(
            'w-full px-4 py-3 rounded-lg bg-surface border transition-all',
            fieldErrors.location
              ? 'border-red-500/50 focus:border-red-500'
              : 'border-gray-700 focus:border-indigo-500'
          )}
        />
        {fieldErrors.location && (
          <p className="mt-1 text-xs text-red-400">{fieldErrors.location}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handlePasswordChange}
            placeholder="Min 8 characters"
            className={clsx(
              'w-full px-4 py-3 rounded-lg bg-surface border pr-10 transition-all',
              fieldErrors.password
                ? 'border-red-500/50 focus:border-red-500'
                : 'border-gray-700 focus:border-indigo-500'
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-200"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {passwordStrength && formData.password && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={clsx(
                  'h-full',
                  passwordStrength === 'weak'
                    ? 'w-1/3 bg-red-500'
                    : passwordStrength === 'medium'
                    ? 'w-2/3 bg-yellow-500'
                    : 'w-full bg-emerald-500'
                )}
              />
            </div>
            <span className="text-xs text-gray-400 capitalize">{passwordStrength}</span>
          </div>
        )}
        {fieldErrors.password && (
          <p className="mt-1 text-xs text-red-400">{fieldErrors.password}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            value={formData.confirm_password}
            onChange={handleConfirmChange}
            placeholder="Re-enter password"
            className={clsx(
              'w-full px-4 py-3 rounded-lg bg-surface border pr-10 transition-all',
              fieldErrors.confirm_password
                ? 'border-red-500/50 focus:border-red-500'
                : 'border-gray-700 focus:border-indigo-500'
            )}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-200"
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {formData.confirm_password && passwordMatch !== null && (
            <div className="absolute right-10 top-3">
              {passwordMatch ? (
                <Check className="w-5 h-5 text-emerald-500" />
              ) : (
                <X className="w-5 h-5 text-red-500" />
              )}
            </div>
          )}
        </div>
        {fieldErrors.confirm_password && (
          <p className="mt-1 text-xs text-red-400">{fieldErrors.confirm_password}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 mt-6 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating Account...' : 'Create Account →'}
      </button>
    </form>
  );
}
