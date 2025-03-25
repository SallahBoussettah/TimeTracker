
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronRight, Link as LinkIcon, PackagePlus, Server, Check } from 'lucide-react';

const Integrations = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const integrationCategories = [
    {
      title: "Project Management",
      description: "Connect your projects and tasks seamlessly",
      integrations: [
        { name: "Asana", icon: "A", color: "bg-red-100 text-red-600" },
        { name: "Trello", icon: "T", color: "bg-blue-100 text-blue-600" },
        { name: "Jira", icon: "J", color: "bg-indigo-100 text-indigo-600" },
        { name: "Monday", icon: "M", color: "bg-yellow-100 text-yellow-600" }
      ]
    },
    {
      title: "Communication",
      description: "Stay connected with your team",
      integrations: [
        { name: "Slack", icon: "S", color: "bg-emerald-100 text-emerald-600" },
        { name: "Teams", icon: "T", color: "bg-purple-100 text-purple-600" },
        { name: "Discord", icon: "D", color: "bg-violet-100 text-violet-600" },
        { name: "Zoom", icon: "Z", color: "bg-teal-100 text-teal-600" }
      ]
    },
    {
      title: "Calendar & Scheduling",
      description: "Sync your time entries with calendars",
      integrations: [
        { name: "Google Calendar", icon: "G", color: "bg-blue-100 text-blue-600" },
        { name: "Outlook", icon: "O", color: "bg-cyan-100 text-cyan-600" },
        { name: "Apple Calendar", icon: "A", color: "bg-gray-100 text-gray-600" },
        { name: "Calendly", icon: "C", color: "bg-green-100 text-green-600" }
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
              Connect TimeTrack with Your Favorite Tools
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto mb-8">
              Supercharge your productivity by integrating TimeTrack with the tools you already use every day.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="rounded-full">
                  Start integrating
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/documentation">
                <Button size="lg" variant="outline" className="rounded-full bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10">
                  View documentation
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Integration Categories */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Powerful Integrations
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                Connect TimeTrack with your existing workflow for seamless time tracking
              </p>
            </div>

            <div className="grid gap-12">
              {integrationCategories.map((category, idx) => (
                <div key={idx} className="space-y-6">
                  <div className="mb-8">
                    <h3 className="text-2xl font-semibold mb-2">{category.title}</h3>
                    <p className="text-muted-foreground">{category.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {category.integrations.map((integration, index) => (
                      <div key={index} className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-border/50">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className={`h-10 w-10 rounded-lg ${integration.color} flex items-center justify-center font-bold`}>
                            {integration.icon}
                          </div>
                          <h4 className="text-lg font-medium">{integration.name}</h4>
                        </div>
                        <p className="text-muted-foreground text-sm mb-4">
                          Integration with {integration.name} allows you to sync your tasks and time entries.
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          Connect
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* API Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-6">
                  Build Custom Integrations with Our API
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Need a custom integration? Our developer-friendly API makes it easy to connect TimeTrack to any service or tool.
                </p>
                <div className="space-y-4">
                  {[
                    { title: "RESTful API", description: "Simple and intuitive REST API with comprehensive documentation", icon: Server },
                    { title: "Webhooks", description: "Real-time notifications for critical events", icon: LinkIcon },
                    { title: "SDK Support", description: "Libraries for JavaScript, Python, Ruby, and more", icon: PackagePlus }
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <feature.icon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Link to="/documentation">
                    <Button variant="outline">
                      View API Documentation
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="bg-card rounded-xl p-6 border border-border/50 shadow-sm overflow-hidden">
                <div className="text-sm mb-2 text-muted-foreground">Example API Request</div>
                <pre className="bg-secondary/50 p-4 rounded-lg overflow-x-auto text-xs">
                  <code className="text-foreground">
{`// Fetch time entries for a user
fetch('https://api.timetrack.com/v1/time-entries', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
              Ready to supercharge your workflow?
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-10">
              Connect TimeTrack with your favorite tools and boost your productivity today.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Get started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10">
                  Book a demo
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

export default Integrations;
