
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, ChevronRight, BookOpen, Code, FileText, 
  List, BookMarked, LayoutGrid, AlertCircle, Link as LinkIcon
} from 'lucide-react';

const Documentation = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');

  const docSections = [
    {
      title: "Getting Started",
      icon: BookOpen,
      description: "Essential guides for new users",
      links: [
        { title: "Quick Start Guide", url: "#" },
        { title: "Core Concepts", url: "#" },
        { title: "User Interface Overview", url: "#" }
      ]
    },
    {
      title: "API Reference",
      icon: Code,
      description: "Complete API documentation",
      links: [
        { title: "Authentication", url: "#" },
        { title: "Time Entries", url: "#" },
        { title: "Projects", url: "#" },
        { title: "Users", url: "#" }
      ]
    },
    {
      title: "User Guides",
      icon: FileText,
      description: "Step-by-step tutorials",
      links: [
        { title: "Time Tracking Basics", url: "#" },
        { title: "Creating Reports", url: "#" },
        { title: "Team Management", url: "#" }
      ]
    },
    {
      title: "Integrations",
      icon: LinkIcon,
      description: "Connect with other tools",
      links: [
        { title: "Available Integrations", url: "#" },
        { title: "Setting Up Integrations", url: "#" },
        { title: "Webhooks", url: "#" }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              TimeTrack Documentation
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto mb-8">
              Comprehensive guides and reference documentation to help you get the most out of TimeTrack
            </p>
            
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  type="search"
                  className="pl-10 py-6 bg-primary-foreground text-foreground"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <Button variant="outline" className="bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10">
                  <BookMarked className="h-4 w-4 mr-2" />
                  Guides
                </Button>
                <Button variant="outline" className="bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10">
                  <Code className="h-4 w-4 mr-2" />
                  API Reference
                </Button>
                <Button variant="outline" className="bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10">
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  Examples
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Documentation Sections */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {docSections.map((section, index) => (
                <div key={index} className="bg-card rounded-xl p-6 shadow-sm border border-border/50">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mr-4">
                      <section.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{section.title}</h2>
                      <p className="text-muted-foreground text-sm">{section.description}</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-2 mb-4">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a href={link.url} className="text-muted-foreground hover:text-primary hover:underline flex items-center">
                          <ChevronRight className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span>{link.title}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                  
                  <a href="#" className="text-primary hover:underline text-sm font-medium inline-flex items-center">
                    <span>View all {section.title.toLowerCase()}</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Updates */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Latest Documentation Updates</h2>
            
            <div className="space-y-4">
              {[
                {
                  title: "New API Endpoints for Team Management",
                  date: "March 15, 2024",
                  type: "API Reference"
                },
                {
                  title: "Updated Guide: Time Tracking Best Practices",
                  date: "March 10, 2024",
                  type: "Guide"
                },
                {
                  title: "Custom Fields Documentation",
                  date: "March 5, 2024",
                  type: "Feature"
                },
                {
                  title: "Webhook Event Types Reference",
                  date: "February 28, 2024",
                  type: "API Reference"
                }
              ].map((update, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="bg-card rounded-lg p-4 border border-border/50 hover:shadow-sm transition-shadow duration-300 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium hover:text-primary transition-colors">{update.title}</h3>
                    <div className="text-sm text-muted-foreground">
                      {update.type} • {update.date}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </a>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button variant="outline">
                View changelog
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Code Example */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">API Quick Start</h2>
            <p className="text-muted-foreground mb-8">
              Get started with our RESTful API with this simple example:
            </p>
            
            <div className="bg-card rounded-xl p-6 border border-border/50 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium">Using the TimeTrack API</div>
                <Button variant="outline" size="sm">
                  <Code className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <pre className="bg-secondary/50 p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-foreground">
{`// Authentication - Get your API token
const token = 'your_api_token';

// Fetch time entries
fetch('https://api.timetrack.com/v1/time-entries', {
  method: 'GET',
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));

// Create a new time entry
fetch('https://api.timetrack.com/v1/time-entries', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    description: 'Working on documentation',
    project_id: 12345,
    start_time: '2024-03-24T09:00:00Z',
    end_time: '2024-03-24T10:30:00Z'
  })
})
.then(response => response.json())
.then(data => console.log('Created:', data))
.catch(error => console.error('Error:', error));`}
                </code>
              </pre>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <a 
                href="#" 
                className="flex-1 bg-card rounded-lg p-5 border border-border/50 hover:shadow-md transition-shadow duration-300 flex items-center"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mr-4">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Complete API Reference</h3>
                  <p className="text-sm text-muted-foreground">Comprehensive documentation for all endpoints</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
              </a>
              
              <a 
                href="#" 
                className="flex-1 bg-card rounded-lg p-5 border border-border/50 hover:shadow-md transition-shadow duration-300 flex items-center"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mr-4">
                  <List className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">API Tutorials</h3>
                  <p className="text-sm text-muted-foreground">Step-by-step guides for common API tasks</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
              </a>
            </div>
          </div>
        </section>

        {/* Help & Support */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Need More Help?</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
              Our support team is ready to assist you with any questions about the documentation or TimeTrack.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/contact">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Contact Support
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <a href="/help-center">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10">
                  Visit Help Center
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Documentation;
