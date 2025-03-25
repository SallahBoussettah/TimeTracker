
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { 
  Search, ChevronRight, Clock, BarChart, Calendar, Tag, 
  Users, Settings, HelpCircle, FileQuestion, BookOpen, 
  PhoneCall, AlertCircle
} from 'lucide-react';

const HelpCenter = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      title: "Getting Started",
      icon: Clock,
      articles: [
        "Creating your account",
        "Setting up your first project",
        "Understanding the dashboard",
        "Basic time tracking"
      ]
    },
    {
      title: "Time Tracking",
      icon: Calendar,
      articles: [
        "Using the timer",
        "Manual time entries",
        "Editing time entries",
        "Bulk actions"
      ]
    },
    {
      title: "Reports & Analytics",
      icon: BarChart,
      articles: [
        "Creating reports",
        "Understanding metrics",
        "Exporting data",
        "Scheduled reports"
      ]
    },
    {
      title: "Projects & Teams",
      icon: Users,
      articles: [
        "Project management",
        "Team collaboration",
        "Roles and permissions",
        "Activity monitoring"
      ]
    },
    {
      title: "Integrations",
      icon: Tag,
      articles: [
        "Available integrations",
        "Setting up connections",
        "API documentation",
        "Webhooks"
      ]
    },
    {
      title: "Account & Billing",
      icon: Settings,
      articles: [
        "Subscription management",
        "Payment methods",
        "Invoices",
        "User management"
      ]
    }
  ];

  const popularArticles = [
    {
      title: "How to track time across multiple projects",
      category: "Time Tracking",
      views: 12539
    },
    {
      title: "Setting up team permissions",
      category: "Projects & Teams",
      views: 9872
    },
    {
      title: "Generating detailed time reports",
      category: "Reports & Analytics",
      views: 8654
    },
    {
      title: "Integrating with Google Calendar",
      category: "Integrations",
      views: 7321
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        {/* Hero Section with Search */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              How can we help you?
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto mb-8">
              Search our knowledge base for answers or browse categories below
            </p>
            
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  type="search"
                  className="pl-10 py-6 bg-primary-foreground text-foreground"
                  placeholder="Search for help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <Link to="/documentation">
                  <Button variant="outline" className="bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Documentation
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10">
                    <PhoneCall className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </Link>
                <Link to="/status">
                  <Button variant="outline" className="bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    System Status
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Help Categories */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Browse Help by Category</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <div key={index} className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-border/50">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                      <category.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{category.title}</h3>
                  </div>
                  
                  <ul className="space-y-2 mb-4">
                    {category.articles.map((article, artIndex) => (
                      <li key={artIndex}>
                        <a href="#" className="text-muted-foreground hover:text-primary hover:underline flex items-center">
                          <ChevronRight className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span>{article}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                  
                  <a href="#" className="text-primary hover:underline text-sm font-medium inline-flex items-center">
                    <span>View all articles</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Articles */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">Popular Help Articles</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {popularArticles.map((article, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="bg-card rounded-lg p-5 border border-border/50 hover:shadow-md transition-shadow duration-300"
                >
                  <h3 className="font-medium mb-2 hover:text-primary transition-colors">{article.title}</h3>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{article.category}</span>
                    <span>{article.views.toLocaleString()} views</span>
                  </div>
                </a>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Button variant="outline">
                View all articles
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
            
            <div className="grid gap-6">
              {[
                {
                  question: "How do I create my first time entry?",
                  answer: "To create your first time entry, navigate to the dashboard and click on the 'Start Timer' button. Enter a description for your task, select a project, and click 'Start' to begin tracking time. You can pause or stop the timer at any time."
                },
                {
                  question: "Can I track time for multiple projects simultaneously?",
                  answer: "TimeTrack doesn't support tracking multiple projects simultaneously as this can lead to inaccurate time data. However, you can easily switch between projects by stopping the current timer and starting a new one for a different project."
                },
                {
                  question: "How do I generate reports of my time entries?",
                  answer: "To generate reports, go to the 'Reports' section from the main navigation. Select the type of report you want to create, specify the date range and any filters, then click 'Generate Report'. You can export the report in various formats including PDF, CSV, and Excel."
                },
                {
                  question: "How can I invite team members to my workspace?",
                  answer: "To invite team members, go to 'Settings' > 'Team Members' and click the 'Invite' button. Enter the email addresses of the people you want to invite, select their role and permissions, then send the invitation. They'll receive an email with instructions to join your workspace."
                },
                {
                  question: "How do I integrate TimeTrack with other tools?",
                  answer: "Go to 'Settings' > 'Integrations' to see all available integrations. Click on the tool you want to connect with and follow the setup instructions. Most integrations require you to authorize the connection and configure some settings to determine how data is synced between the systems."
                }
              ].map((item, index) => (
                <div key={index} className="bg-card rounded-xl p-6 border border-border/50">
                  <h3 className="text-lg font-medium mb-3 flex items-start">
                    <HelpCircle className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                    <span>{item.question}</span>
                  </h3>
                  <p className="text-muted-foreground pl-7">{item.answer}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">Still have questions?</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/contact">
                  <Button>
                    Contact Support
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/documentation">
                  <Button variant="outline">
                    Browse Documentation
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HelpCenter;
