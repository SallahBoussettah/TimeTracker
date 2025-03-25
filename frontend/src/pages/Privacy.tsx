
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const Privacy = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        {/* Header */}
        <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              Last updated: April 15, 2024
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
            <p className="lead">
              This Privacy Policy describes how TimeTrack, Inc. ("TimeTrack," "we," "us," or "our") collects, uses, and discloses your personal information when you visit our website, use our services, or otherwise interact with us.
            </p>
            
            <h2>Information We Collect</h2>
            
            <h3>Information You Provide to Us</h3>
            <p>
              We collect information you provide directly to us when you:
            </p>
            <ul>
              <li>Create an account or register for our services</li>
              <li>Use our time tracking features</li>
              <li>Submit information through our website or services</li>
              <li>Contact our customer support</li>
              <li>Respond to surveys or communications</li>
            </ul>
            
            <p>
              This information may include your name, email address, password, company information, billing information, and any other information you choose to provide.
            </p>
            
            <h3>Information We Collect Automatically</h3>
            <p>
              When you access or use our services, we may automatically collect certain information, including:
            </p>
            <ul>
              <li>Log Information: We collect information about your use of our services, including access times, pages viewed, IP address, and the web page you visited before navigating to our services.</li>
              <li>Device Information: We collect information about the device you use to access our services, including hardware model, operating system and version, unique device identifiers, and mobile network information.</li>
              <li>Usage Information: We collect information about your activities on our services, such as time entries, projects, and features used.</li>
              <li>Cookies and Similar Technologies: We use cookies and similar technologies to collect information about your interactions with our services and to personalize content.</li>
            </ul>
            
            <h2>How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, security alerts, and administrative messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Personalize your experience on our services</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
              <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
              <li>Comply with legal obligations</li>
            </ul>
            
            <h2>How We Share Your Information</h2>
            <p>
              We may share your information as follows:
            </p>
            <ul>
              <li>With vendors, consultants, and other service providers who need access to such information to carry out work on our behalf</li>
              <li>In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process</li>
              <li>If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of TimeTrack or others</li>
              <li>In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company</li>
              <li>Between and among TimeTrack and our current and future parents, affiliates, subsidiaries, and other companies under common control and ownership</li>
              <li>With your consent or at your direction</li>
            </ul>
            
            <h2>Your Choices</h2>
            <p>
              You have several choices regarding the information we collect and how it is used:
            </p>
            <ul>
              <li>Account Information: You may update, correct, or delete your account information at any time by logging into your account or contacting us.</li>
              <li>Cookies: Most web browsers are set to accept cookies by default. You can usually choose to set your browser to remove or reject browser cookies.</li>
              <li>Communications Preferences: You may opt out of receiving promotional communications from us by following the instructions in those communications.</li>
            </ul>
            
            <h2>Data Retention</h2>
            <p>
              We store the information we collect about you for as long as is necessary for the purpose(s) for which we originally collected it. We may retain certain information for legitimate business purposes or as required by law.
            </p>
            
            <h2>International Data Transfers</h2>
            <p>
              We are based in the United States and the information we collect is governed by U.S. law. If you are accessing our services from outside of the U.S., please be aware that information collected through the services may be transferred to, processed, stored, and used in the U.S. and other jurisdictions. Data protection laws in the U.S. may be different from those of your country of residence.
            </p>
            
            <h2>Data Security</h2>
            <p>
              We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.
            </p>
            
            <h2>Children's Privacy</h2>
            <p>
              Our services are not directed to children under 16. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and you believe your child has provided us with personal information, please contact us.
            </p>
            
            <h2>Changes to this Privacy Policy</h2>
            <p>
              We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, we may provide you with additional notice (such as adding a statement to our website or sending you a notification).
            </p>
            
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p>
              TimeTrack, Inc.<br />
              123 Main Street<br />
              San Francisco, CA 94105<br />
              privacy@timetrack.com
            </p>
            
            <div className="mt-12 border-t pt-6">
              <p>
                <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> | 
                <Link to="/cookies" className="text-primary hover:underline ml-3">Cookie Policy</Link> | 
                <Link to="/legal" className="text-primary hover:underline ml-3">Legal Center</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;
