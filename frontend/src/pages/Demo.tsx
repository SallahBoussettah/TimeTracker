
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Calendar, Clock, Users, ArrowRight, CheckCircle } from 'lucide-react';

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Name is required' }),
  email: z.string().email({ message: 'Valid email is required' }),
  company: z.string().min(2, { message: 'Company name is required' }),
  phone: z.string().optional(),
  teamSize: z.string().min(1, { message: 'Team size is required' }),
  message: z.string().optional(),
});

const Demo = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      company: '',
      phone: '',
      teamSize: '',
      message: '',
    },
  });

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, you would submit this to your backend
    console.log(values);
    
    // Show success message
    toast.success('Demo request submitted successfully!', {
      description: "We'll contact you shortly to schedule your demo.",
    });
    
    setIsSubmitted(true);
  }

  const benefits = [
    {
      title: "See TimeTrack in action",
      description: "Get a personalized tour of all features tailored to your needs",
      icon: Clock,
    },
    {
      title: "Ask questions directly",
      description: "Speak with our product experts and get answers to your specific questions",
      icon: Users,
    },
    {
      title: "Flexible scheduling",
      description: "Choose a time that works for your team, across all time zones",
      icon: Calendar,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                  See How TimeTrack Works for Your Team
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Schedule a personalized demo with our product experts and discover how TimeTrack can help your team save time and boost productivity.
                </p>
                
                <div className="space-y-6 mb-8">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mr-4 shrink-0">
                        <benefit.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1">{benefit.title}</h3>
                        <p className="text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-5 bg-muted rounded-lg">
                  <p className="italic text-muted-foreground">
                    "The demo was incredibly helpful. It showed us exactly how TimeTrack could solve our specific challenges. We implemented it the next day."
                  </p>
                  <p className="mt-3 font-medium">— Marketing Director, Enterprise Company</p>
                </div>
              </div>
              
              <div className="bg-card shadow-sm rounded-xl p-8 border border-border">
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3">Thank You!</h2>
                    <p className="text-muted-foreground mb-6">
                      Your demo request has been successfully submitted. One of our product experts will contact you shortly to schedule your personalized demo.
                    </p>
                    <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                      Submit another request
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-2">Schedule Your Free Demo</h2>
                    <p className="text-muted-foreground mb-6">
                      Fill out the form below and we'll get back to you within 24 hours.
                    </p>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Work Email</FormLabel>
                              <FormControl>
                                <Input placeholder="john@company.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="company"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your company" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="+1 (555) 000-0000" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="teamSize"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Team Size</FormLabel>
                              <FormControl>
                                <select
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  {...field}
                                >
                                  <option value="">Select team size</option>
                                  <option value="1-10">1-10 employees</option>
                                  <option value="11-50">11-50 employees</option>
                                  <option value="51-200">51-200 employees</option>
                                  <option value="201-500">201-500 employees</option>
                                  <option value="501+">501+ employees</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Additional Information (Optional)</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Let us know about your specific needs or questions"
                                  className="resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" className="w-full">
                          Schedule Demo
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </form>
                    </Form>
                    
                    <p className="text-sm text-muted-foreground mt-6 text-center">
                      By submitting this form, you agree to our{" "}
                      <a href="#" className="underline hover:text-primary">
                        Privacy Policy
                      </a>
                      .
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Common questions about our demo process
              </p>
            </div>
            
            <div className="space-y-6">
              {[
                {
                  question: "How long does the demo typically last?",
                  answer: "Our demos usually last 30-45 minutes, including time for questions. We can adjust the length based on your needs."
                },
                {
                  question: "Who should attend the demo?",
                  answer: "We recommend including decision-makers and team members who will be using the platform directly. This ensures all perspectives are considered."
                },
                {
                  question: "Will the demo be tailored to our specific needs?",
                  answer: "Yes! We customize each demo to focus on the features most relevant to your team's workflow and challenges."
                },
                {
                  question: "Is there any cost or obligation for the demo?",
                  answer: "No, our demos are completely free with no obligation. We want to ensure TimeTrack is the right fit for your team."
                },
                {
                  question: "Can we try the product after the demo?",
                  answer: "Absolutely! After the demo, we can set you up with a free trial so your team can experience TimeTrack firsthand."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-background rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Demo;
