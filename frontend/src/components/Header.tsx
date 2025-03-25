
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="w-full py-4 px-4 sm:px-6 lg:px-8 border-b border-border/40 glass fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Clock className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold">TimeTrack</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Home
          </Link>
          <Link 
            to="/features" 
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/features') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Features
          </Link>
          <Link 
            to="/pricing" 
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/pricing') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Pricing
          </Link>
        </nav>
        
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login">
            <Button variant="outline" className="btn-hover">Log in</Button>
          </Link>
          <Link to="/register">
            <Button className="btn-hover">Sign up</Button>
          </Link>
        </div>
        
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 p-4 glass-dark animate-fade-in border-t border-b border-border/40">
          <nav className="flex flex-col space-y-4 py-4">
            <Link 
              to="/" 
              className={`text-base font-medium px-2 py-1 rounded-md transition-colors ${isActive('/') ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-secondary'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/features" 
              className={`text-base font-medium px-2 py-1 rounded-md transition-colors ${isActive('/features') ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-secondary'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className={`text-base font-medium px-2 py-1 rounded-md transition-colors ${isActive('/pricing') ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-secondary'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <div className="pt-2 flex flex-col space-y-2">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full">Log in</Button>
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full">Sign up</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
