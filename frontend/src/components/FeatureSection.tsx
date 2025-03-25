
import {
  Clock,
  BarChart2,
  Calendar,
  BellRing,
  RefreshCw,
  Smartphone,
  Globe,
  Lock
} from 'lucide-react';

const features = [
  {
    title: 'Simple Time Tracking',
    description: 'One-click timer to track your work hours without disrupting your flow.',
    icon: Clock
  },
  {
    title: 'Detailed Reports',
    description: 'Visualize your time distribution and identify productivity patterns.',
    icon: BarChart2
  },
  {
    title: 'Calendar Integration',
    description: 'Sync with your calendar to plan your day efficiently.',
    icon: Calendar
  },
  {
    title: 'Smart Reminders',
    description: 'Get notified when you forget to start or stop your timer.',
    icon: BellRing
  },
  {
    title: 'Automatic Tracking',
    description: 'The app can detect your activity and suggest tracking categories.',
    icon: RefreshCw
  },
  {
    title: 'Mobile Access',
    description: 'Track your time on the go with our mobile-friendly interface.',
    icon: Smartphone
  },
  {
    title: 'Cross-Platform',
    description: 'Works seamlessly across all your devices and operating systems.',
    icon: Globe
  },
  {
    title: 'Privacy Focused',
    description: 'Your data is encrypted and never shared with third parties.',
    icon: Lock
  }
];

const FeatureSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Features designed for your productivity
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to track your time efficiently and boost your productivity.
          </p>
        </div>
        
        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass rounded-xl p-6 card-hover transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
