
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const Terms = () => {
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
              Terms of Service
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              Last updated: May 1, 2024
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
            <p className="lead">
              These Terms of Service ("Terms") govern your access to and use of TimeTrack's website, products, and services ("Services"). Please read these Terms carefully, and contact us if you have any questions.
            </p>
            
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy. If you are using our Services on behalf of an organization, you are agreeing to these Terms on behalf of that organization.
            </p>
            
            <h2>2. Description of Services</h2>
            <p>
              TimeTrack provides time tracking and productivity tools for individuals and teams. Our Services include our web application, mobile applications, and related documentation.
            </p>
            
            <h2>3. Account Registration</h2>
            <p>
              To use most aspects of the Services, you must register for an account. When you register, you will be required to provide us with some information, such as your name, email address, and password. You agree to provide accurate, current, and complete information and to update this information to keep it accurate, current, and complete. You are solely responsible for the activity that occurs on your account, and you must keep your account password secure.
            </p>
            
            <h2>4. User Content</h2>
            <p>
              Our Services allow you to create, upload, store, and share information, text, graphics, videos, or other materials ("User Content"). You retain ownership of any intellectual property rights that you hold in that User Content. In other words, what belongs to you stays yours.
            </p>
            <p>
              When you upload, store, send, or receive User Content to or through our Services, you give TimeTrack a worldwide license to host, store, reproduce, modify, create derivative works, communicate, publish, publicly perform, publicly display and distribute such User Content. The rights you grant in this license are for the limited purpose of operating, promoting, and improving our Services, and to develop new ones.
            </p>
            
            <h2>5. Acceptable Use Policy</h2>
            <p>
              You agree not to misuse the Services or help anyone else do so. For example, you must not:
            </p>
            <ul>
              <li>Probe, scan, or test the vulnerability of any system or network</li>
              <li>Breach or otherwise circumvent any security or authentication measures</li>
              <li>Access, tamper with, or use non-public areas or parts of the Services</li>
              <li>Interfere with or disrupt any user, host, or network, for example by sending a virus, overloading, flooding, spamming, or mail-bombing</li>
              <li>Access, search, or create accounts for the Services by any means other than our publicly supported interfaces</li>
              <li>Send unsolicited communications, promotions, or advertisements, or spam</li>
              <li>Send altered, deceptive, or false source-identifying information</li>
              <li>Promote or advertise products or services other than your own without appropriate authorization</li>
              <li>Publish or share materials that are unlawfully pornographic or indecent, or that advocate bigotry, religious, racial, or ethnic hatred</li>
              <li>Violate the law in any way, including storing, publishing, or sharing material that's fraudulent, defamatory, or misleading</li>
            </ul>
            
            <h2>6. Subscription Terms</h2>
            <p>
              Some of our Services are offered on a subscription basis. By subscribing to our Services, you agree to pay the applicable subscription fees as they become due. We may change our subscription fees at any time, but we'll provide you with advance notice of these changes. Subscription fees are non-refundable except as required by law or as explicitly stated in these Terms.
            </p>
            
            <h2>7. Termination</h2>
            <p>
              You can stop using our Services at any time. We reserve the right to suspend or terminate your access to the Services with or without notice if:
            </p>
            <ul>
              <li>You violate these Terms</li>
              <li>You use the Services in a manner that could cause us legal liability</li>
              <li>You are abusing the Services or using them fraudulently</li>
              <li>You have not paid subscription fees that are due</li>
            </ul>
            
            <h2>8. Intellectual Property</h2>
            <p>
              TimeTrack and its licensors own all intellectual property rights in the Services. These Terms do not grant you any rights to use TimeTrack's trademarks, logos, domain names, or other brand features.
            </p>
            
            <h2>9. Disclaimer of Warranties</h2>
            <p>
              THE SERVICES ARE PROVIDED "AS IS," WITHOUT WARRANTY OF ANY KIND. WITHOUT LIMITING THE FOREGOING, WE EXPLICITLY DISCLAIM ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, QUIET ENJOYMENT, AND NON-INFRINGEMENT, AND ANY WARRANTIES ARISING OUT OF COURSE OF DEALING OR USAGE OF TRADE.
            </p>
            
            <h2>10. Limitation of Liability</h2>
            <p>
              IN NO EVENT WILL TIMETRACK BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATING TO YOUR ACCESS TO OR USE OF, OR YOUR INABILITY TO ACCESS OR USE, THE SERVICES, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), STATUTE, OR ANY OTHER LEGAL THEORY, WHETHER OR NOT TIMETRACK HAS BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE.
            </p>
            
            <h2>11. Changes to Terms</h2>
            <p>
              We may modify these Terms from time to time. If we make material changes to these Terms, we will notify you by email or by posting a notice on our website. Your continued use of the Services after the effective date of such changes constitutes your acceptance of the modified Terms.
            </p>
            
            <h2>12. Governing Law and Jurisdiction</h2>
            <p>
              These Terms shall be governed by the laws of the State of California, without respect to its conflict of laws principles. Any dispute arising from or relating to the subject matter of these Terms shall be finally settled by arbitration in San Francisco County, California.
            </p>
            
            <h2>13. Entire Agreement</h2>
            <p>
              These Terms constitute the entire agreement between you and TimeTrack regarding the Services and supersede all prior and contemporaneous agreements, proposals, or representations, written or oral, concerning the subject matter of these Terms.
            </p>
            
            <h2>14. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p>
              TimeTrack, Inc.<br />
              123 Main Street<br />
              San Francisco, CA 94105<br />
              legal@timetrack.com
            </p>
            
            <div className="mt-12 border-t pt-6">
              <p>
                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link> | 
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

export default Terms;
