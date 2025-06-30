import React, { useState } from 'react';
import { 
  Download, 
  Heart, 
  Users, 
  Smartphone, 
  Zap, 
  Mail, 
  ArrowRight, 
  Star,
  Check,
  Globe,
  Bookmark,
  AlertCircle,
  Cat,
  Book
} from 'lucide-react';
import { Analytics, trackEvent } from './components/Analytics';

function App() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const formData = new FormData();
      formData.append('access_key', import.meta.env.VITE_WEB3FORMS_ACCESS_KEY); // Replace with your actual access key
      formData.append('email', email);
      formData.append('subject', 'New MangaFlow Early Access Signup');
      formData.append('message', `New early access signup from: ${email}`);
      formData.append('from_name', 'MangaFlow Landing Page');
      formData.append('redirect', 'false'); // We'll handle the response ourselves

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        },
        body: JSON.stringify({...formData})
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        setEmail('');
        
        // Track successful email signup
        trackEvent('email-signup', { 
          email_domain: email.split('@')[1],
          source: 'hero-form',
          success: true
        });
        
        // Reset success message after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        throw new Error(result.message || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError('Failed to join waitlist. Please try again.');
      
      // Track failed email signup
      trackEvent('email-signup', { 
        email_domain: email.split('@')[1],
        source: 'hero-form',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinWaitlistClick = (source: string) => {
    trackEvent('join-waitlist-click', { source });
    // Scroll to email form
    const emailForm = document.querySelector('form');
    emailForm?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFeatureClick = (featureName: string) => {
    trackEvent('feature-interaction', { feature: featureName });
  };

  const handleSocialProofView = () => {
    trackEvent('social-proof-view');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Analytics />
      
      {/* Header */}
      <header className="relative z-10 px-4 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center relative">
              <Cat className="h-5 w-5 text-white" />
              <Book className="h-3 w-3 text-white absolute -bottom-0.5 -right-0.5 bg-gradient-to-br from-pink-500 to-purple-600 rounded-sm p-0.5" />
            </div>
            <span className="text-2xl font-bold text-white">MangaFlow</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#features" 
              className="text-gray-300 hover:text-white transition-colors"
              onClick={() => trackEvent('nav-click', { section: 'features' })}
            >
              Features
            </a>
            <a 
              href="#about" 
              className="text-gray-300 hover:text-white transition-colors"
              onClick={() => trackEvent('nav-click', { section: 'about' })}
            >
              About
            </a>
            <button 
              onClick={() => handleJoinWaitlistClick('header')}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              Join Waitlist
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-block bg-gradient-to-r from-pink-500/20 to-purple-600/20 text-pink-400 px-4 py-2 rounded-full text-sm font-medium border border-pink-500/30">
              🐱 Early Access Available
            </span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            The Future of
            <span className="block bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Manga Reading
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience manga like never before with AI-powered recommendations, 
            seamless reading, and a community of passionate readers.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => trackEvent('email-input-focus')}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Joining...
                  </>
                ) : isSubmitted ? (
                  <>
                    <Check className="h-5 w-5" />
                    Joined!
                  </>
                ) : (
                  <>
                    Get Early Access
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
            
            {/* Error Message */}
            {submitError && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{submitError}</span>
              </div>
            )}
            
            {/* Success Message */}
            {isSubmitted && (
              <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-2 text-green-400">
                <Check className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Welcome to the waitlist! We'll notify you when early access is available.</span>
              </div>
            )}
          </form>

          <p 
            className="text-gray-400 text-sm cursor-pointer"
            onClick={handleSocialProofView}
          >
            Join <span className="text-pink-400 font-semibold">12,847</span> manga enthusiasts already on the waitlist
          </p>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-pink-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-20 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Why Choose MangaFlow?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We're reimagining how you discover, read, and share manga with cutting-edge features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Instant page loading with advanced caching technology for seamless reading experience",
                key: "lightning-fast"
              },
              {
                icon: Heart,
                title: "AI Recommendations",
                description: "Discover your next favorite manga with personalized recommendations powered by AI",
                key: "ai-recommendations"
              },
              {
                icon: Download,
                title: "Offline Reading",
                description: "Download chapters and read anywhere, anytime, even without internet connection",
                key: "offline-reading"
              },
              {
                icon: Users,
                title: "Community Driven",
                description: "Connect with fellow manga enthusiasts, share reviews, and discuss your favorites",
                key: "community-driven"
              },
              {
                icon: Smartphone,
                title: "Cross-Platform Sync",
                description: "Seamlessly sync your reading progress across all your devices",
                key: "cross-platform-sync"
              },
              {
                icon: Globe,
                title: "Multi-Language",
                description: "Read manga in multiple languages with automatic translation capabilities",
                key: "multi-language"
              }
            ].map((feature, index) => (
              <div
                key={index}
                onClick={() => handleFeatureClick(feature.key)}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 group cursor-pointer"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-pink-500/10 to-purple-600/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { number: "50K+", label: "Manga Titles", icon: Book, key: "manga-titles" },
              { number: "1M+", label: "Active Readers", icon: Users, key: "active-readers" },
              { number: "99.9%", label: "Uptime", icon: Zap, key: "uptime" }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="group cursor-pointer"
                onClick={() => trackEvent('stat-interaction', { stat: stat.key })}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-300 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Loved by Beta Users
            </h2>
            <p className="text-xl text-gray-300">
              See what early adopters are saying about MangaFlow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Manga Enthusiast",
                content: "The reading experience is incredibly smooth. The AI recommendations introduced me to series I never would have found!",
                rating: 5,
                key: "sarah-chen"
              },
              {
                name: "Alex Rivera",
                role: "Digital Artist",
                content: "Finally, a manga app that understands readers. The offline feature is a game-changer for my daily commute.",
                rating: 5,
                key: "alex-rivera"
              },
              {
                name: "Yuki Tanaka",
                role: "College Student",
                content: "Love the community features! Discussing chapters with other readers adds so much to the experience.",
                rating: 5,
                key: "yuki-tanaka"
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                onClick={() => trackEvent('testimonial-interaction', { testimonial: testimonial.key })}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-pink-500/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 relative">
            <Cat className="h-8 w-8 text-white" />
            <Book className="h-5 w-5 text-white absolute -bottom-1 -right-1 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full p-1" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Reading?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Join thousands of manga lovers who are already experiencing the future of digital reading.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => handleJoinWaitlistClick('cta-primary')}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold text-lg"
            >
              Get Early Access
            </button>
            <a 
              href="#features" 
              onClick={() => trackEvent('cta-secondary-click')}
              className="border-2 border-white/20 text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-300 font-semibold text-lg"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center relative">
                <Cat className="h-4 w-4 text-white" />
                <Book className="h-2.5 w-2.5 text-white absolute -bottom-0.5 -right-0.5 bg-gradient-to-br from-pink-500 to-purple-600 rounded-sm p-0.5" />
              </div>
              <span className="text-xl font-bold text-white">MangaFlow</span>
            </div>
            <div className="flex items-center space-x-6 text-gray-400">
              <a 
                href="#" 
                onClick={() => trackEvent('footer-link-click', { link: 'privacy' })}
                className="hover:text-white transition-colors"
              >
                Privacy
              </a>
              <a 
                href="#" 
                onClick={() => trackEvent('footer-link-click', { link: 'terms' })}
                className="hover:text-white transition-colors"
              >
                Terms
              </a>
              <a 
                href="#" 
                onClick={() => trackEvent('footer-link-click', { link: 'contact' })}
                className="hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400">
            <p>&copy; 2025 MangaFlow. All rights reserved. Coming soon.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;