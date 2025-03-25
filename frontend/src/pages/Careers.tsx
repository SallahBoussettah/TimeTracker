
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Heart, Users, Zap, ShieldCheck, LucideIcon, BarChart, GraduationCap } from 'lucide-react';

const Careers = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const benefits: { title: string; description: string; icon: LucideIcon }[] = [
    {
      title: "Work Flexibility",
      description: "Flexible hours and remote work options to help you maintain a healthy work-life balance.",
      icon: Clock
    },
    {
      title: "Health & Wellness",
      description: "Comprehensive health coverage and wellness programs to keep you at your best.",
      icon: Heart
    },
    {
      title: "Collaborative Culture",
      description: "A supportive team environment where everyone's input is valued and respected.",
      icon: Users
    },
    {
      title: "Career Growth",
      description: "Clear paths for advancement and regular opportunities for professional development.",
      icon: BarChart
    },
    {
      title: "Learning Budget",
      description: "Annual budget for courses, conferences, and resources to help you grow your skills.",
      icon: GraduationCap
    },
    {
      title: "Modern Tech Stack",
      description: "Work with cutting-edge technologies and best practices in software development.",
      icon: Zap
    }
  ];

  const openings = [
    {
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote (US Time Zones)",
      type: "Full-time",
      description: "Join our engineering team to build and improve our web application using React, TypeScript, and modern frontend technologies."
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "San Francisco, CA (Hybrid)",
      type: "Full-time",
      description: "Lead product strategy and roadmap planning for our time tracking platform, working closely with design and engineering teams."
    },
    {
      title: "Customer Success Specialist",
      department: "Customer Success",
      location: "Remote (Global)",
      type: "Full-time",
      description: "Help our customers get the most out of TimeTrack through onboarding, training, and ongoing support."
    },
    {
      title: "Growth Marketing Manager",
      department: "Marketing",
      location: "New York, NY (Hybrid)",
      type: "Full-time",
      description: "Drive user acquisition and retention through strategic marketing campaigns and optimization of our growth channels."
    },
    {
      title: "Backend Developer",
      department: "Engineering",
      location: "Remote (EU Time Zones)",
      type: "Full-time",
      description: "Develop and maintain our API and backend services using Node.js, TypeScript, and serverless technologies."
    }
  ];

  const values = [
    { 
      title: "User-Focused", 
      description: "We put our users at the center of everything we do. Their success is our success."
    },
    { 
      title: "Transparent", 
      description: "We believe in open communication, both within our team and with our users and partners."
    },
    { 
      title: "Growth Mindset", 
      description: "We embrace challenges, persist in the face of obstacles, and see effort as the path to mastery."
    },
    { 
      title: "Data-Driven", 
      description: "We make decisions based on data and metrics, not assumptions or opinions."
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
              Join Our Team
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto mb-8">
              Help us build the future of productivity and time management tools for teams around the world.
            </p>
            <a href="#openings">
              <Button size="lg" variant="secondary">
                View Open Positions
              </Button>
            </a>
          </div>
        </section>

        {/* Why Join Us */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-6">Why Join TimeTrack?</h2>
              <div className="mx-auto w-20 h-1 bg-primary mb-8"></div>
              <p className="text-lg max-w-3xl mx-auto">
                We're building a team of passionate individuals who are excited about creating tools that help people work smarter.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-border/50">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-6">Our Values</h2>
              <div className="mx-auto w-20 h-1 bg-primary mb-8"></div>
              <p className="text-lg max-w-3xl mx-auto">
                These principles guide how we work together and build our product.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <div key={index} className="bg-card rounded-xl p-8 shadow-sm border border-border/50">
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section id="openings" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-6">Open Positions</h2>
              <div className="mx-auto w-20 h-1 bg-primary mb-8"></div>
              <p className="text-lg max-w-3xl mx-auto">
                Explore our current opportunities and find where you can make an impact.
              </p>
            </div>
            
            <div className="space-y-6">
              {openings.map((job, index) => (
                <div key={index} className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-border/50">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      <p className="text-primary">{job.department}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </Badge>
                      <Badge variant="secondary">
                        {job.type}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">
                    {job.description}
                  </p>
                  
                  <Button variant="outline">View Job Details</Button>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-lg mb-4">Don't see a position that matches your skills?</p>
              <Button size="lg">Submit Open Application</Button>
            </div>
          </div>
        </section>

        {/* Join Us CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Join Us in Transforming How People Work
            </h2>
            <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto mb-8">
              At TimeTrack, you'll be part of a team that's passionate about helping people work smarter and achieve more.
            </p>
            <a href="#openings">
              <Button size="lg" variant="secondary">
                Explore Opportunities
              </Button>
            </a>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Careers;
