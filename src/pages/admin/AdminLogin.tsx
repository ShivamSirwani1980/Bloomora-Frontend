import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flower2, Lock, Mail, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useStore } from '@/lib/store';

// Hardcoded dummy credentials for testing — replace with real backend auth later
const DUMMY_EMAIL = 'admin@bloomora.com';
const DUMMY_PASSWORD = 'admin123';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setAdminAuthenticated } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    if (email === DUMMY_EMAIL && password === DUMMY_PASSWORD) {
      setAdminAuthenticated(true);
      toast.success('Welcome back, Admin!');
      navigate('/admin');
    } else {
      toast.error('Invalid credentials. Try admin@bloomora.com / admin123');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-3xl p-8 shadow-elevated border border-border/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-gradient shadow-glow mb-4">
              <ShieldCheck className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flower2 className="w-6 h-6 text-primary" />
              <span className="font-display text-2xl font-bold text-gradient">Bloomora</span>
            </div>
            <h1 className="text-xl font-display font-bold text-foreground mt-2">Admin Panel</h1>
            <p className="text-muted-foreground text-sm mt-1">Sign in to manage your store</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bloomora.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Hint */}
          <div className="mt-6 p-3 rounded-xl bg-muted/50 border border-border/50">
            <p className="text-xs text-muted-foreground text-center">
              <span className="font-semibold">Demo credentials:</span> admin@bloomora.com / admin123
            </p>
          </div>

          {/* Back link */}
          <p className="text-center mt-4">
            <button onClick={() => navigate('/')} className="text-sm text-muted-foreground hover:text-primary transition-colors">
              ← Back to store
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
