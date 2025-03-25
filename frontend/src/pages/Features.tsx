
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Check, Clock, BarChart, Calendar, Tag, Users, Settings, ChevronRight } from 'lucide-react';

const Features = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Powerful Features for Effective Time Management
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto mb-8">
              Discover all the tools and features that make TimeTrack the preferred choice for professionals and teams looking to optimize their productivity.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="rounded-full">
                  Start for free
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button size="lg" variant="outline" className="rounded-full bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10">
                  Book a demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Main Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Core Features
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                Every tool you need to track, analyze, and optimize your time usage
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Time Tracking",
                  description: "Start and stop timers with a single click. Add notes and tags to each time entry for detailed records.",
                  icon: Clock
                },
                {
                  title: "Detailed Reports",
                  description: "Generate comprehensive reports to analyze how your time is spent across projects and tasks.",
                  icon: BarChart
                },
                {
                  title: "Calendar Integration",
                  description: "Sync with your calendar to automatically track time spent in meetings and appointments.",
                  icon: Calendar
                },
                {
                  title: "Project Management",
                  description: "Organize time entries by projects and clients. Set budgets and track progress.",
                  icon: Tag
                },
                {
                  title: "Team Collaboration",
                  description: "Invite team members, assign tasks, and monitor team productivity in real-time.",
                  icon: Users
                },
                {
                  title: "Customizable Settings",
                  description: "Tailor TimeTrack to your specific needs with flexible configuration options.",
                  icon: Settings
                },
              ].map((feature, index) => (
                <div key={index} className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Seamless Integrations
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                Connect TimeTrack with your favorite tools for a streamlined workflow
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {Array(12).fill(0).map((_, index) => (
                <div key={index} className="h-20 bg-white rounded-lg shadow-sm flex items-center justify-center">
                  <span className="text-muted-foreground font-medium">Integration {index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Why Choose TimeTrack?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                See how we compare to other time tracking solutions
              </p>
            </div>

            <div className="overflow-x-auto shadow-sm rounded-xl">
              <table className="min-w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-foreground">Features</th>
                    <th className="py-4 px-6 text-center text-sm font-semibold text-foreground">TimeTrack</th>
                    <th className="py-4 px-6 text-center text-sm font-semibold text-foreground">Competitor A</th>
                    <th className="py-4 px-6 text-center text-sm font-semibold text-foreground">Competitor B</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {[
                    "One-click time tracking",
                    "Detailed reports & analytics",
                    "Project management",
                    "Team collaboration",
                    "Calendar integration",
                    "Mobile app",
                    "Offline mode",
                    "Unlimited projects",
                    "24/7 support"
                  ].map((feature, index) => (
                    <tr key={index}>
                      <td className="py-4 px-6 text-sm text-foreground">{feature}</td>
                      <td className="py-4 px-6 text-center">
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="py-4 px-6 text-center">
                        {index % 3 === 0 ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <div className="h-5 w-5 rounded-full bg-muted mx-auto" />
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {index % 2 === 0 ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <div className="h-5 w-5 rounded-full bg-muted mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
              Ready to boost your productivity?
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-10">
              Join thousands of professionals who trust TimeTrack to manage their time effectively.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Start for free
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10">
                  View pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Features;
