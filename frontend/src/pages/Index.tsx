
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, ChevronRight, Users, Zap, Shield } from 'lucide-react';

const Index = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Feature Section */}
        <FeatureSection />
        
        {/* Social Proof Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-8">Trusted by teams worldwide</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
              {['Company 1', 'Company 2', 'Company 3', 'Company 4'].map((company, index) => (
                <div 
                  key={index} 
                  className="h-12 w-full max-w-[160px] flex items-center justify-center bg-secondary/50 rounded-lg"
                >
                  <span className="text-muted-foreground font-medium">{company}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* How it Works Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                How TimeTrack Works
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Simple, intuitive, and designed for maximum productivity.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Track',
                  description: 'Start the timer with one click and focus on your work.',
                  icon: Zap,
                  delay: 0
                },
                {
                  title: 'Analyze',
                  description: 'View detailed reports to understand your time usage.',
                  icon: Users,
                  delay: 0.1
                },
                {
                  title: 'Optimize',
                  description: 'Improve your habits based on insights and boost productivity.',
                  icon: Shield,
                  delay: 0.2
                }
              ].map((step, index) => (
                <div 
                  key={index} 
                  className="flex flex-col items-center text-center animate-fade-in"
                  style={{ animationDelay: `${step.delay}s` }}
                >
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
              Ready to boost your productivity?
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-10">
              Join thousands of users who have transformed their time management with TimeTrack.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Get started for free
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10">
                  Book a demo
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm opacity-80">
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
