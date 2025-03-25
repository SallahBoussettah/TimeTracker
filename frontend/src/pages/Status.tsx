
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, AlertTriangle, Clock, RefreshCw } from 'lucide-react';

const Status = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  // Mock data for service statuses
  const services = [
    {
      name: "Time Tracking API",
      status: "operational",
      uptime: "99.99%",
      statusText: "All Systems Operational"
    },
    {
      name: "Authentication Services",
      status: "operational",
      uptime: "99.98%",
      statusText: "All Systems Operational"
    },
    {
      name: "Web Application",
      status: "operational",
      uptime: "100%",
      statusText: "All Systems Operational"
    },
    {
      name: "Database Services",
      status: "operational",
      uptime: "99.95%",
      statusText: "All Systems Operational"
    },
    {
      name: "Mobile API",
      status: "operational",
      uptime: "99.97%",
      statusText: "All Systems Operational"
    },
    {
      name: "Reporting Engine",
      status: "degraded",
      uptime: "98.54%",
      statusText: "Minor Performance Issues"
    },
    {
      name: "Integration Services",
      status: "operational",
      uptime: "99.91%",
      statusText: "All Systems Operational"
    },
    {
      name: "Notification System",
      status: "operational",
      uptime: "99.89%",
      statusText: "All Systems Operational"
    }
  ];

  // Mock data for past incidents
  const incidents = [
    {
      title: "Reporting Engine Performance Issues",
      date: "March 24, 2024",
      status: "investigating",
      updates: [
        {
          time: "10:30 AM EST",
          message: "We're investigating issues with the reporting engine causing slower than normal report generation."
        },
        {
          time: "11:45 AM EST",
          message: "We've identified a database query optimization issue and are implementing a fix."
        }
      ]
    },
    {
      title: "Brief API Outage",
      date: "March 15, 2024",
      status: "resolved",
      updates: [
        {
          time: "3:15 PM EST",
          message: "We're investigating reports of API unavailability for some users."
        },
        {
          time: "3:35 PM EST",
          message: "The issue has been identified as a configuration problem with our load balancer."
        },
        {
          time: "4:10 PM EST",
          message: "The issue has been resolved and all systems are now operational. Total outage time was approximately 55 minutes."
        }
      ]
    },
    {
      title: "Scheduled Maintenance",
      date: "March 10, 2024",
      status: "completed",
      updates: [
        {
          time: "1:00 AM EST",
          message: "Scheduled maintenance has begun. Systems will be unavailable for approximately 2 hours."
        },
        {
          time: "2:45 AM EST",
          message: "Maintenance completed successfully. All systems are back online with improved performance."
        }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "degraded":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "outage":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getIncidentStatusBadge = (status: string) => {
    switch (status) {
      case "investigating":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Investigating</span>;
      case "identified":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Identified</span>;
      case "monitoring":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Monitoring</span>;
      case "resolved":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Resolved</span>;
      case "completed":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        {/* Status Overview */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              System Status
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto mb-8">
              Current status of TimeTrack services and recent incidents
            </p>
            
            <div className="flex items-center justify-center space-x-2 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-400" />
              <span className="text-2xl font-bold">All Systems Operational</span>
            </div>
            
            <p className="opacity-90">
              Last updated: March 24, 2024 at 12:30 PM EST
            </p>
            
            <Button 
              variant="outline" 
              className="mt-6 bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
          </div>
        </section>

        {/* Service Statuses */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Service Status</h2>
            
            <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Service</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Uptime</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {services.map((service, index) => (
                    <tr key={index} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm">
                        {service.name}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center">
                          {getStatusIcon(service.status)}
                          <span className="ml-2">{service.statusText}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {service.uptime}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Incidents */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Recent Incidents</h2>
            
            <div className="space-y-8">
              {incidents.map((incident, index) => (
                <div key={index} className="bg-card rounded-xl p-6 border border-border/50">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{incident.title}</h3>
                      <p className="text-sm text-muted-foreground">{incident.date}</p>
                    </div>
                    <div>
                      {getIncidentStatusBadge(incident.status)}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {incident.updates.map((update, updateIndex) => (
                      <div key={updateIndex} className="border-l-2 border-border pl-4 ml-2">
                        <div className="text-sm font-medium">{update.time}</div>
                        <div className="text-sm text-muted-foreground mt-1">{update.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button variant="outline">
                View All Incidents
              </Button>
            </div>
          </div>
        </section>

        {/* Subscription Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Subscribe to Updates</h2>
            <p className="text-muted-foreground mb-8">
              Receive notifications when TimeTrack services experience issues or scheduled maintenance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-4 py-2 rounded-md border border-border bg-background flex-grow" 
              />
              <Button>
                Subscribe
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-4">
              We'll only send you important service notifications. You can unsubscribe at any time.
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Status;
