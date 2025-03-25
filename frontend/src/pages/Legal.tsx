
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { FileText, Lock, Shield, Info } from 'lucide-react';

const Legal = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const legalDocuments = [
    {
      title: "Terms of Service",
      description: "The agreement governing your use of TimeTrack services.",
      icon: FileText,
      path: "/terms",
      lastUpdated: "May 1, 2024"
    },
    {
      title: "Privacy Policy",
      description: "How we collect, use, and protect your personal information.",
      icon: Lock,
      path: "/privacy",
      lastUpdated: "April 15, 2024"
    },
    {
      title: "Cookie Policy",
      description: "Information about cookies and similar technologies we use.",
      icon: Info,
      path: "/cookies",
      lastUpdated: "April 15, 2024"
    },
    {
      title: "Data Processing Agreement",
      description: "Terms for processing personal data in compliance with data protection laws.",
      icon: Shield,
      path: "/dpa",
      lastUpdated: "March 10, 2024"
    }
  ];

  const faqs = [
    {
      question: "How does TimeTrack comply with GDPR?",
      answer: "TimeTrack is fully GDPR compliant. We act as a data processor for our customers' data and provide all necessary tools for data subjects to exercise their rights. We maintain appropriate security measures and only process data according to our customers' instructions."
    },
    {
      question: "Where is my data stored?",
      answer: "TimeTrack uses secure cloud infrastructure with data centers in the United States and European Union. Enterprise customers can choose their preferred data residency location. All data is encrypted both in transit and at rest."
    },
    {
      question: "How long does TimeTrack retain my data?",
      answer: "We retain your account and usage data for as long as you maintain an active account with us. After account closure, we retain certain information for a limited period as required by law or for legitimate business purposes. You can request data deletion at any time."
    },
    {
      question: "Does TimeTrack share my data with third parties?",
      answer: "We only share data with third-party service providers who help us deliver our services, and we ensure they maintain the same level of data protection. We don't sell your data to third parties for marketing purposes."
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
              Legal Information
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
              Transparency is important to us. Find our legal documents and learn how we protect your data.
            </p>
          </div>
        </section>

        {/* Legal Documents */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Legal Documents</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {legalDocuments.map((doc, index) => (
                <Link 
                  key={index} 
                  to={doc.path}
                  className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-border/50 flex"
                >
                  <div className="mr-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <doc.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{doc.title}</h3>
                    <p className="text-muted-foreground mb-4">{doc.description}</p>
                    <p className="text-sm">Last updated: {doc.lastUpdated}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Security & Compliance */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Security & Compliance</h2>
            <p className="text-center text-lg mb-12 max-w-3xl mx-auto">
              We take the security and privacy of your data seriously. Here's how we protect your information.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50">
                <h3 className="text-xl font-semibold mb-4">Data Security</h3>
                <ul className="space-y-3">
                  <li className="flex">
                    <Shield className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>End-to-end encryption for all data</span>
                  </li>
                  <li className="flex">
                    <Shield className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>Regular security audits and penetration testing</span>
                  </li>
                  <li className="flex">
                    <Shield className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>Multi-factor authentication support</span>
                  </li>
                  <li className="flex">
                    <Shield className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>Automated threat detection systems</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50">
                <h3 className="text-xl font-semibold mb-4">Compliance</h3>
                <ul className="space-y-3">
                  <li className="flex">
                    <FileText className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>GDPR compliant</span>
                  </li>
                  <li className="flex">
                    <FileText className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>CCPA compliant</span>
                  </li>
                  <li className="flex">
                    <FileText className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>SOC 2 Type II certified</span>
                  </li>
                  <li className="flex">
                    <FileText className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>ISO 27001 certified</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-card rounded-xl p-6 shadow-sm border border-border/50">
                  <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Still Have Questions?</h2>
            <p className="text-lg opacity-90 mb-8">
              Our legal and compliance team is here to help with any questions about our terms, privacy practices, or data security.
            </p>
            <Link to="/contact">
              <Button size="lg" variant="secondary">
                Contact Our Team
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Legal;
