
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, FileText, Star, Rocket, Shield, Zap, Gem } from 'lucide-react';

const Changelog = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const releases = [
    {
      version: "2.3.0",
      date: "March 15, 2024",
      title: "Enhanced Reporting & Custom Fields",
      description: "This release focuses on expanding reporting capabilities and adding support for custom fields.",
      changes: [
        { type: "feature", text: "Added 5 new report templates for better productivity insights" },
        { type: "feature", text: "Introduced custom fields for time entries and projects" },
        { type: "improvement", text: "Redesigned the reports dashboard for better usability" },
        { type: "improvement", text: "Enhanced export functionality with more format options" },
        { type: "fix", text: "Fixed an issue with date filters in weekly reports" }
      ],
      icon: FileText
    },
    {
      version: "2.2.0",
      date: "February 1, 2024",
      title: "Team Collaboration Update",
      description: "Major improvements to team features and collaboration tools.",
      changes: [
        { type: "feature", text: "Introduced team dashboards with shared metrics" },
        { type: "feature", text: "Added ability to assign time entries to team members" },
        { type: "feature", text: "New team permissions system with granular controls" },
        { type: "improvement", text: "Enhanced notification system for team activities" },
        { type: "improvement", text: "Optimized team view loading times by 40%" },
        { type: "fix", text: "Resolved syncing issues in team calendar view" }
      ],
      icon: Star
    },
    {
      version: "2.1.2",
      date: "January 10, 2024",
      title: "Performance & Bug Fixes",
      description: "This maintenance release focuses on performance improvements and bug fixes.",
      changes: [
        { type: "improvement", text: "Improved dashboard loading time by 25%" },
        { type: "improvement", text: "Enhanced mobile responsiveness throughout the app" },
        { type: "fix", text: "Fixed timer synchronization issues between devices" },
        { type: "fix", text: "Resolved data export formatting problems" },
        { type: "fix", text: "Addressed login issues on certain browsers" }
      ],
      icon: Zap
    },
    {
      version: "2.1.0",
      date: "December 5, 2023",
      title: "Integration Expansion",
      description: "Expanded our integration ecosystem with popular tools and services.",
      changes: [
        { type: "feature", text: "Added integration with Asana for task synchronization" },
        { type: "feature", text: "New Slack integration for time tracking notifications" },
        { type: "feature", text: "Introduced Google Calendar two-way sync" },
        { type: "improvement", text: "Enhanced existing integrations with better data mapping" },
        { type: "fix", text: "Fixed token refresh issues with third-party connections" }
      ],
      icon: Rocket
    },
    {
      version: "2.0.0",
      date: "November 1, 2023",
      title: "Major Platform Upgrade",
      description: "A complete redesign and rebuild of the TimeTrack platform with new features and improvements.",
      changes: [
        { type: "feature", text: "Completely redesigned user interface for better usability" },
        { type: "feature", text: "New analytics engine with advanced reporting capabilities" },
        { type: "feature", text: "Introduced project budgeting and forecasting tools" },
        { type: "feature", text: "Added AI-powered productivity insights" },
        { type: "improvement", text: "Rebuilt the timer core for better accuracy" },
        { type: "improvement", text: "Enhanced security with two-factor authentication" },
        { type: "improvement", text: "Optimized database for faster performance" }
      ],
      icon: Gem
    }
  ];

  // Badge colors based on type
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "feature":
        return "default";
      case "improvement":
        return "secondary";
      case "fix":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        {/* Header */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 mb-4">
              <Clock className="h-6 w-6" />
              <h1 className="text-2xl font-semibold">TimeTrack</h1>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Changelog
            </h2>
            <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
              Stay up to date with the latest improvements, features, and fixes to TimeTrack.
            </p>
          </div>
        </section>

        {/* Changelog Content */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-16">
              {releases.map((release, index) => (
                <div key={index} className="relative">
                  {/* Version indicator */}
                  <div className="flex items-center mb-6">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <release.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-2xl font-bold mr-3">
                          v{release.version}
                        </h3>
                        <Badge variant="secondary" className="font-normal">
                          {release.date}
                        </Badge>
                      </div>
                      <h4 className="text-lg font-medium mt-1">{release.title}</h4>
                    </div>
                  </div>
                  
                  {/* Release description */}
                  <p className="text-muted-foreground mb-6 ml-16">
                    {release.description}
                  </p>
                  
                  {/* Changes list */}
                  <div className="ml-16 bg-card rounded-xl p-5 border border-border/50">
                    <h5 className="font-medium mb-4">Changes:</h5>
                    <div className="space-y-3">
                      {release.changes.map((change, changeIndex) => (
                        <div key={changeIndex} className="flex items-start">
                          <Badge variant={getBadgeVariant(change.type)} className="mt-0.5 mr-3">
                            {change.type}
                          </Badge>
                          <p className="text-sm">{change.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Separator between releases */}
                  {index < releases.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-0 w-px bg-border h-[calc(100%+30px)]"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Subscribe Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter to be notified about new releases and features.
            </p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-4 py-2 rounded-md border border-border bg-background flex-grow" 
              />
              <button 
                type="submit" 
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Changelog;
