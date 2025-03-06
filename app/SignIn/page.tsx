"use client"
import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Icon } from '@iconify/react';


interface FormState {
  email: string;
  password: string;
  isSignUp: boolean;
}

export default function AuthPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isVisible, setIsVisible] = useState(false);
  const [form, setForm] = useState<FormState>({ email: '', password: '', isSignUp: false });
  const [agree, setAgree] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleMode = () => setForm({ ...form, isSignUp: !form.isSignUp });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAuth = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    let result;
    if (form.isSignUp) {
      result=await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });
    }
    else {
      result = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
    }
    if (result.error) {
      alert(result.error.message);
    } else {
        router.push('/SetUp');
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        redirectTo: `${window.location.protocol}//${window.location.host}/api/auth/confirm`
      },
    });
    if (error) alert(error.message);
  };

  return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-2xl dark:bg-zinc-800">
          <div className="text-center">
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">
              {form.isSignUp ? 'Create an Account' : 'Sign in to your account'}
            </h1>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Email Address <span className="text-red-500">*</span></label>
              <input 
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
                className={form.isSignUp? "w-full px-4 py-1 mt-1 border rounded-2xl dark:bg-zinc-700 dark:text-white focus:ring focus:ring-teal-500":"w-full px-4 py-2 mt-1 border rounded-2xl dark:bg-zinc-700 dark:text-white focus:ring focus:ring-teal-500"}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type={isVisible ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className={form.isSignUp? "w-full px-4 py-1 mt-1 border rounded-2xl dark:bg-zinc-700 dark:text-white focus:ring focus:ring-teal-500":"w-full px-4 py-2 mt-1 border rounded-2xl dark:bg-zinc-700 dark:text-white focus:ring focus:ring-teal-500"}
                />
                <button type="button" onClick={toggleVisibility} className="absolute inset-y-0 right-3 flex items-center">
                  <Icon icon={isVisible ? 'solar:eye-closed-linear' : 'solar:eye-bold'} className="text-zinc-500 dark:text-zinc-300" />
                </button>
              </div>
            </div>
            {form.isSignUp? <div className="flex items-center space-x-2">
              <input
                required
                type="checkbox"
                checked={agree}
                onChange={() => setAgree(!agree)}
                className="w-4 h-4"
              />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                I agree to the
                <a href="/terms" className="text-teal-500 hover:underline"> Terms</a> &amp;
                <a href="/privacy" className="text-teal-500 hover:underline"> Privacy Policy</a>
              </span>
            </div>:''}
            <button type="submit" className="w-full px-4 py-2 text-white bg-pink-500 dark:bg-pink-600 rounded-full hover:bg-pink-600 dark:hover:bg-pink-700">
              {form.isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>
          <div className="flex items-center justify-between">
            <hr className="w-full border-zinc-300 dark:border-zinc-600" />
            <span className="px-2 text-sm text-zinc-500 dark:text-zinc-400">OR</span>
            <hr className="w-full border-zinc-300 dark:border-zinc-600" />
          </div>
          <button onClick={handleGoogleLogin} className="flex items-center justify-center w-full px-4 py-2 border rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700">
            <Icon icon="flat-color-icons:google" width={24} className="mr-2" /> Continue with Google
          </button>
          <p className="text-center text-sm text-zinc-400">
            {form.isSignUp ? 'Already have an account?' : 'Need to create an account?'}
            <button onClick={toggleMode} className="text-teal-400 hover:underline ml-1">
              {form.isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
  );
}