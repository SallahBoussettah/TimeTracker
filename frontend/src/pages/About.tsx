
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Clock, Users, Award, Heart, BarChart, Target } from 'lucide-react';

const About = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Co-Founder",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      bio: "With over 15 years in project management, Sarah founded TimeTrack to solve the productivity challenges she observed throughout her career."
    },
    {
      name: "Michael Zhang",
      role: "CTO & Co-Founder",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      bio: "A software engineer with extensive experience in SaaS products, Michael leads our technical strategy and product development."
    },
    {
      name: "Elena Rodriguez",
      role: "Head of Design",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      bio: "Elena brings her passion for user-centered design to create intuitive interfaces that make time tracking effortless."
    },
    {
      name: "David Wilson",
      role: "Head of Customer Success",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      bio: "David ensures our customers get the most out of TimeTrack with his expertise in customer experience and support."
    }
  ];

  const values = [
    {
      title: "Simplicity",
      description: "We believe productivity tools should simplify work, not complicate it. We focus on intuitive design and essential features.",
      icon: Target
    },
    {
      title: "Transparency",
      description: "We're committed to clear communication with our customers about our practices, pricing, and product roadmap.",
      icon: Users
    },
    {
      title: "Excellence",
      description: "We strive for excellence in every aspect of our product and service, constantly improving based on user feedback.",
      icon: Award
    },
    {
      title: "Empathy",
      description: "We build our product with genuine empathy for our users' needs, challenges, and work environments.",
      icon: Heart
    },
    {
      title: "Data-Driven",
      description: "We make decisions based on data and metrics, both in our own operations and in the insights we provide to users.",
      icon: BarChart
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
              About TimeTrack
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
              We're on a mission to help teams work smarter and achieve more with effective time management.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="mx-auto w-20 h-1 bg-primary mb-8"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg mb-6">
                  TimeTrack was founded in 2019 by Sarah Johnson and Michael Zhang, who experienced firsthand the challenges of tracking time across multiple projects and teams.
                </p>
                <p className="text-lg mb-6">
                  After trying numerous existing solutions and finding them either too complex or too simplistic, they decided to build the time tracking tool they wished existed – one that balanced powerful features with an intuitive user experience.
                </p>
                <p className="text-lg">
                  Today, TimeTrack serves thousands of teams and freelancers around the world, helping them gain insights into their work habits, improve productivity, and bill clients accurately.
                </p>
              </div>
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary/10 rounded-lg"></div>
                <div className="relative z-10 bg-card shadow-lg rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                    alt="Team working together" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-primary/10 rounded-lg"></div>
              </div>
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
                These core principles guide everything we do, from product development to customer support.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-border/50">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-6">Meet Our Team</h2>
              <div className="mx-auto w-20 h-1 bg-primary mb-8"></div>
              <p className="text-lg max-w-3xl mx-auto">
                The passionate people behind TimeTrack who are dedicated to making your workday more productive.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-border/50">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <p className="text-primary text-sm mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-sm">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-16">
              <Link to="/careers">
                <Button size="lg">
                  Join Our Team
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 mb-4">
              <Clock className="h-6 w-6" />
              <h3 className="text-2xl font-semibold">TimeTrack</h3>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Ready to transform how you track time?
            </h2>
            <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto mb-8">
              Join thousands of teams who use TimeTrack to improve productivity and simplify their workflow.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button size="lg" variant="secondary">
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/demo">
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10">
                  Schedule a Demo
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

export default About;
