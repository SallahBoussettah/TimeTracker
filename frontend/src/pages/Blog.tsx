
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Search, Calendar, Clock, User, ChevronRight, ArrowRight } from 'lucide-react';

const Blog = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const featuredPosts = [
    {
      id: "1",
      title: "10 Time Management Techniques That Actually Work",
      excerpt: "Discover proven methods to manage your time more effectively and boost your productivity in both work and personal life.",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      date: "May 10, 2024",
      readTime: "8 min read",
      author: "Sarah Johnson",
      authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      category: "Productivity"
    },
    {
      id: "2",
      title: "The Science Behind Effective Time Tracking",
      excerpt: "Learn about the research-backed benefits of time tracking and how it can transform your work habits and effectiveness.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      date: "April 28, 2024",
      readTime: "6 min read",
      author: "Michael Zhang",
      authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      category: "Research"
    }
  ];

  const recentPosts = [
    {
      id: "3",
      title: "How to Implement Time Tracking in Remote Teams",
      excerpt: "Practical strategies for introducing and maintaining effective time tracking practices in distributed teams.",
      image: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      date: "April 22, 2024",
      readTime: "5 min read",
      author: "Elena Rodriguez",
      category: "Remote Work"
    },
    {
      id: "4",
      title: "Time Tracking for Freelancers: A Complete Guide",
      excerpt: "Everything freelancers need to know about tracking time, from client billing to personal productivity.",
      image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      date: "April 15, 2024",
      readTime: "7 min read",
      author: "David Wilson",
      category: "Freelancing"
    },
    {
      id: "5",
      title: "Overcoming Time Management Challenges in Creative Work",
      excerpt: "Strategies for balancing creative flow with effective time management for designers, writers, and artists.",
      image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      date: "April 8, 2024",
      readTime: "6 min read",
      author: "Sarah Johnson",
      category: "Creativity"
    },
    {
      id: "6",
      title: "TimeTrack vs Competitors: An Honest Comparison",
      excerpt: "A detailed analysis of how TimeTrack stacks up against other popular time tracking tools in the market.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      date: "April 1, 2024",
      readTime: "9 min read",
      author: "Michael Zhang",
      category: "Product"
    }
  ];

  const categories = [
    "Productivity", "Remote Work", "Time Management", 
    "Freelancing", "Product Updates", "Case Studies", 
    "Research", "Tips & Tricks"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        {/* Hero Section with Search */}
        <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              TimeTrack Blog
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto mb-8">
              Insights, tips, and resources to help you master time management and boost productivity.
            </p>
            
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  type="search"
                  className="pl-10 py-6 bg-primary-foreground text-foreground"
                  placeholder="Search articles..."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Featured Articles</h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <div key={post.id} className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-border/50">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <Badge variant="secondary" className="text-xs font-normal">
                        {post.category}
                      </Badge>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>{post.date}</span>
                        <Clock className="h-3.5 w-3.5 ml-3 mr-1" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3">
                      <a href="#" className="hover:text-primary transition-colors">
                        {post.title}
                      </a>
                    </h3>
                    
                    <p className="text-muted-foreground mb-4">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <img 
                          src={post.authorImage} 
                          alt={post.author} 
                          className="h-8 w-8 rounded-full mr-2 object-cover"
                        />
                        <span className="text-sm">{post.author}</span>
                      </div>
                      
                      <a href="#" className="text-primary hover:underline text-sm font-medium inline-flex items-center">
                        <span>Read article</span>
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Posts */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Recent Articles</h2>
              <a href="#" className="text-primary hover:underline text-sm font-medium inline-flex items-center">
                <span>View all articles</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </a>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <div key={post.id} className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-border/50">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <Badge variant="secondary" className="text-xs font-normal">
                        {post.category}
                      </Badge>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-3">
                      <a href="#" className="hover:text-primary transition-colors">
                        {post.title}
                      </a>
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-4">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{post.author}</span>
                      </div>
                      
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories and Newsletter */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
            {/* Categories */}
            <div className="md:col-span-1">
              <h3 className="text-xl font-semibold mb-6">Categories</h3>
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <a 
                    key={index} 
                    href="#" 
                    className="flex items-center py-2 px-3 rounded-md hover:bg-secondary transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 mr-2 text-primary" />
                    <span>{category}</span>
                  </a>
                ))}
              </div>
            </div>
            
            {/* Newsletter */}
            <div className="md:col-span-2 bg-card rounded-xl p-8 border border-border/50">
              <h3 className="text-xl font-semibold mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-muted-foreground mb-6">
                Get the latest articles, resources, and tips on time management delivered straight to your inbox.
              </p>
              
              <form className="flex flex-col sm:flex-row gap-3">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-grow" 
                  required
                />
                <Button type="submit">
                  Subscribe
                </Button>
              </form>
              
              <p className="text-xs text-muted-foreground mt-4">
                By subscribing, you agree to our <Link to="/privacy" className="underline hover:text-primary">Privacy Policy</Link> and to receive our emails.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
