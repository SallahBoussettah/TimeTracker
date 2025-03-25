import { ChevronRight, Clock, BarChart, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden pt-24 pb-20 lg:pt-28 lg:pb-28">
      <div className="absolute inset-0 bg-gradient-to-br from-background to-secondary/50 dark:from-background dark:to-secondary/30 -z-10"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.03] -z-10"></div>
      
      <div className="page-container relative">
        <div className="max-w-3xl mx-auto text-center">
          <p className="inline-flex items-center rounded-full bg-secondary/70 px-3 py-1 text-sm font-medium text-primary mb-6 backdrop-blur-sm border border-border/10 animate-fade-in">
            <span>Just launched</span>
            <span className="mx-1.5">•</span>
            <span>Track time efficiently</span>
          </p>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight md:leading-tight animate-slide-down">
            Track Time, <br /> 
            <span className="text-primary">Boost Productivity</span>
          </h1>
          
          <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground animate-slide-up">
            Effortlessly track, manage and analyze how you spend your time. Gain insights to optimize your productivity and work-life balance.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto btn-hover">
                Start for free
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline" className="w-full sm:w-auto btn-hover">
                See how it works
              </Button>
            </Link>
          </div>
          
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground animate-fade-in">
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-primary" />
              <span>Free 14-day trial</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-primary" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
        
        <div className="mt-16 md:mt-20 max-w-5xl mx-auto bg-card/80 backdrop-blur-sm dark:bg-card/60 p-2 rounded-xl shadow-lg border border-border/20 animate-scale-in">
          <div className="aspect-[16/9] rounded-lg overflow-hidden bg-secondary/50 dark:bg-secondary/30 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Clock className="h-16 w-16 text-primary" />
              </div>
              <div className="max-w-md mx-auto">
                <p className="text-lg font-medium">
                  Dashboard Preview
                </p>
                <p className="text-sm text-muted-foreground">
                  A preview of the beautiful timer interface will be displayed here
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
