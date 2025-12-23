'use client';

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Shield, Zap, Layout, BarChart2, Smartphone, ArrowRight, Check } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Use timeout to trigger animation after mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    if (!loading && user) {
      router.push('/dashboard');
    }
    return () => clearTimeout(timer);
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-950">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-40 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-900/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-900/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 transition-all duration-1000 transform", isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0")}>
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight leading-tight">
            Turn tasks into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 animate-gradient">
              momentum
            </span>.
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            PrismTasks helps you plan your work, track progress, and stay focused through a clean, minimal task management interface.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-20">
            <Link href="/register">
              <Button size="lg" className="rounded-full px-10 py-7 text-lg shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-1 transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white border-0">
                Start for Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="lg" className="rounded-full px-10 py-7 text-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Hero Preview - Glassmorphism */}
          <div className="relative mx-auto max-w-6xl rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl shadow-2xl overflow-hidden aspect-[16/10] sm:aspect-[2.2/1] group transition-all duration-500 hover:shadow-blue-500/10 dark:hover:shadow-blue-900/20">
            <div className="absolute inset-x-0 top-0 h-10 bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-700 flex items-center px-4 space-x-2 backdrop-blur-md z-20">
              <div className="h-3 w-3 rounded-full bg-red-400/80"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-400/80"></div>
              <div className="h-3 w-3 rounded-full bg-green-400/80"></div>
            </div>

            <div className="p-8 mt-6 grid grid-cols-12 gap-8 h-full">
              {/* Sidebar Skeleton */}
              <div className="col-span-3 hidden md:block space-y-4 pt-4">
                <div className="h-8 w-3/4 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
                <div className="h-4 w-1/2 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse delay-75" />
                <div className="h-4 w-2/3 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse delay-100" />
                <div className="h-4 w-1/2 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse delay-150" />
              </div>

              {/* Main Content Skeleton */}
              <div className="col-span-12 md:col-span-9 space-y-6 pt-2">
                <div className="flex justify-between items-center mb-8">
                  <div className="h-10 w-48 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                  <div className="h-10 w-24 bg-blue-100 dark:bg-blue-900/30 rounded-full animate-pulse" />
                </div>

                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center p-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-800/20">
                    <div className="h-6 w-6 rounded-full border-2 border-gray-200 dark:border-gray-700 mr-4" />
                    <div className="h-4 w-2/3 bg-gray-100 dark:bg-gray-800 rounded-lg" />
                    <div className={`ml-auto h-2 w-20 rounded-full ${i === 1 ? 'bg-red-400' : i === 2 ? 'bg-yellow-400' : 'bg-green-400'} opacity-50`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Banner */}
            <div className="absolute inset-0 flex items-center justify-center z-30 transition-opacity duration-500 group-hover:opacity-0">
              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-8 py-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl transform translate-y-0 group-hover:translate-y-4 transition-transform duration-500">
                <p className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Simple. Fast. Focused.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Everything you need to ship.</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Built for individual contributors who value clarity over complexity.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <FeatureCard
              icon={<Zap className="h-6 w-6 text-amber-500" />}
              title="Lightning-fast Flow"
              description="Optimistic UI updates mean you never wait for the server. It feels native."
              delay={0}
            />
            <FeatureCard
              icon={<BarChart2 className="h-6 w-6 text-blue-500" />}
              title="Progress Insights"
              description="Visual stats and progress bars keep you motivated to hit 100%."
              delay={100}
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6 text-emerald-500" />}
              title="Secure Sessions"
              description="Enterprise-grade security with HttpOnly cookies and Argon2 encryption."
              delay={200}
            />
            <FeatureCard
              icon={<Layout className="h-6 w-6 text-purple-500" />}
              title="Beautiful States"
              description="Polished loading, empty, and error states for a premium experience."
              delay={300}
            />
            <FeatureCard
              icon={<Check className="h-6 w-6 text-indigo-500" />}
              title="Priority & Sorting"
              description="Simple 1-5 priority scaling to help you focus on high-impact work."
              delay={400}
            />
            <FeatureCard
              icon={<Smartphone className="h-6 w-6 text-pink-500" />}
              title="Accessible by Default"
              description="Keyboard navigation, focus rings, and screen reader support built-in."
              delay={500}
            />
          </div>
        </div>
      </section>

      {/* How it Works - Redesigned */}
      <section className="py-32 bg-white dark:bg-gray-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Three steps to momentum</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">A simple workflow designed for getting things done.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-16 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 -z-10" />

            <Step
              number="1"
              title="Capture"
              description="Get tasks out of your head and into PrismTasks instantly. Clear your mind."
              color="bg-blue-600"
            />
            <Step
              number="2"
              title="Focus"
              description="Use priority filters to identify your next quick win. Don't get overwhelmed."
              color="bg-indigo-600"
            />
            <Step
              number="3"
              title="Track"
              description="Watch your completion rate grow as you ship small wins. Feel the feedback."
              color="bg-purple-600"
            />
          </div>
        </div>
      </section>

      {/* Modern CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-900 dark:bg-black">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/20 to-purple-900/20" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">Ready to get organised?</h2>
          <p className="text-blue-100/80 text-xl mb-12 max-w-2xl mx-auto">Join users making steady progress every day. Open-source, fast, and free.</p>
          <Link href="/register">
            <Button size="lg" className="rounded-full px-12 py-8 text-xl font-semibold bg-white text-gray-900 hover:bg-blue-50 hover:scale-105 transition-all duration-300 border-none shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
              Start for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-16 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0 font-medium">© 2025 PrismTasks. Built for details.</p>
          <div className="flex space-x-8">
            <Link href="/privacy" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors font-medium">Privacy</Link>
            <Link href="/terms" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors font-medium">Terms</Link>
            <Link href="https://github.com/Maxsimilian" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors font-medium">Github</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={cn(
      "group bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-blue-100 dark:hover:border-blue-900 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 transform",
      isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
    )}>
      <div className="h-14 w-14 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 leading-relaxed group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">{description}</p>
    </div>
  )
}

function Step({ number, title, description, color }: { number: string, title: string, description: string, color: string }) {
  return (
    <div className="relative group p-6 rounded-3xl hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors duration-500">
      <div className={cn("w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-2xl font-bold text-white mb-8 shadow-lg transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300", color)}>
        {number}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
      <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">{description}</p>
    </div>
  )
}
