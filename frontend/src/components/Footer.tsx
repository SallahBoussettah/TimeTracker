
import { Link } from 'react-router-dom';
import { Clock, Github, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full py-12 px-4 sm:px-6 lg:px-8 border-t border-border/40 bg-secondary/30">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col space-y-4">
          <Link to="/" className="flex items-center space-x-2">
            <Clock className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">TimeTrack</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Track your time efficiently and boost your productivity with our intuitive time tracking solution.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Github">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Product</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/features" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Features
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/integrations" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Integrations
              </Link>
            </li>
            <li>
              <Link to="/changelog" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Changelog
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Support</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/help-center" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Help Center
              </Link>
            </li>
            <li>
              <Link to="/documentation" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Documentation
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/status" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Status
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/about" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link to="/blog" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/careers" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Careers
              </Link>
            </li>
            <li>
              <Link to="/legal" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Legal
              </Link>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-border/40 text-sm text-muted-foreground">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} TimeTrack. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link to="/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-primary">
              Terms
            </Link>
            <Link to="/cookies" className="hover:text-primary">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
