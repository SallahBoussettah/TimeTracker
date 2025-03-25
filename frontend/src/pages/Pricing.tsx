
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Check, ChevronRight } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const plans = [
    {
      name: "Free",
      description: "For individuals just getting started with time tracking",
      monthlyPrice: "$0",
      annualPrice: "$0",
      features: [
        "Basic time tracking",
        "Limited reports",
        "Up to 3 projects",
        "Single user only",
        "7-day data history"
      ],
      isPopular: false,
      ctaText: "Start for free",
    },
    {
      name: "Pro",
      description: "For freelancers and professionals who need more power",
      monthlyPrice: "$12",
      annualPrice: "$9",
      features: [
        "Advanced time tracking",
        "Comprehensive reports",
        "Unlimited projects",
        "Client management",
        "Team collaboration (up to 3)",
        "Unlimited data history",
        "Priority support"
      ],
      isPopular: true,
      ctaText: "Get started",
    },
    {
      name: "Business",
      description: "For teams and businesses that need complete solutions",
      monthlyPrice: "$29",
      annualPrice: "$19",
      features: [
        "Everything in Pro",
        "Unlimited team members",
        "Advanced permissions",
        "Custom branding",
        "Priority support",
        "API access",
        "SSO authentication",
        "Dedicated account manager"
      ],
      isPopular: false,
      ctaText: "Contact sales",
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
              Choose the right plan for your needs. All plans come with a 14-day free trial.
            </p>
            
            <div className="flex items-center justify-center mb-16">
              <span className={`mr-3 text-sm ${!isAnnual ? 'font-medium' : 'text-muted-foreground'}`}>Monthly</span>
              <Switch 
                checked={isAnnual} 
                onCheckedChange={setIsAnnual} 
                className="data-[state=checked]:bg-primary"
              />
              <span className={`ml-3 text-sm ${isAnnual ? 'font-medium' : 'text-muted-foreground'}`}>Annual <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">Save 20%</span></span>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <Card key={index} className={`relative flex flex-col h-full border ${plan.isPopular ? 'border-primary shadow-md' : 'border-border'}`}>
                  {plan.isPopular && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                  
                  <CardHeader className={plan.isPopular ? 'pb-2' : ''}>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription className="min-h-12">{plan.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-grow">
                    <div className="mb-6">
                      <p className="text-3xl font-bold">
                        {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                        <span className="text-sm font-normal text-muted-foreground"> /month</span>
                      </p>
                      {isAnnual && <p className="text-sm text-muted-foreground">Billed annually</p>}
                    </div>
                    
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      className={`w-full ${plan.isPopular ? '' : 'bg-primary/90 hover:bg-primary'}`}
                      variant={plan.name === "Business" ? "outline" : "default"}
                    >
                      {plan.ctaText}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Find answers to common questions about TimeTrack pricing and features
              </p>
            </div>
            
            <div className="space-y-6">
              {[
                {
                  question: "Can I change plans later?",
                  answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll adjust your billing accordingly."
                },
                {
                  question: "Do you offer a free trial?",
                  answer: "Yes, all paid plans come with a 14-day free trial. No credit card required to start."
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards, PayPal, and bank transfers for annual business plans."
                },
                {
                  question: "Can I cancel my subscription?",
                  answer: "Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your billing period."
                },
                {
                  question: "Do you offer refunds?",
                  answer: "We offer a 30-day money-back guarantee for annual subscriptions if you're not satisfied with our service."
                },
                {
                  question: "Do you offer discounts for nonprofits or educational institutions?",
                  answer: "Yes, we offer special pricing for nonprofits, educational institutions, and open-source projects. Please contact our sales team for more information."
                },
              ].map((faq, index) => (
                <div key={index} className="bg-background rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enterprise Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12">
              <div className="md:flex items-center justify-between">
                <div className="md:w-2/3 mb-8 md:mb-0">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Need a custom solution?</h2>
                  <p className="text-lg opacity-90 mb-6">
                    Contact our sales team to get a tailored solution for your enterprise needs.
                    We offer custom integrations, dedicated support, and flexible pricing.
                  </p>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {[
                      "Custom integrations",
                      "Dedicated support",
                      "On-premise deployment",
                      "Custom SLAs",
                      "Advanced security",
                      "Tailored onboarding"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-5 w-5 text-green-400 mr-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="md:w-1/3 text-center md:text-right">
                  <Button size="lg" variant="secondary" className="px-8">
                    Contact Sales
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight">
                What Our Customers Say
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join thousands of happy customers who trust TimeTrack
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote: "TimeTrack has transformed how our team manages time. The ROI was immediate and substantial.",
                  name: "Sarah Johnson",
                  title: "Project Manager, Tech Solutions Inc."
                },
                {
                  quote: "The best time tracking solution I've used. Easy to implement and the team loves it.",
                  name: "Michael Chen",
                  title: "CEO, StartUp Labs"
                },
                {
                  quote: "We've tried many solutions, but TimeTrack offers the perfect balance of features and simplicity.",
                  name: "Emma Rodriguez",
                  title: "Operations Director, Creative Agency"
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-background rounded-lg shadow-sm p-6">
                  <p className="italic mb-4">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Start tracking your time today
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              No credit card required. 14-day free trial for all paid plans.
            </p>
            <Link to="/register">
              <Button size="lg" className="px-8">
                Get started for free
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;
