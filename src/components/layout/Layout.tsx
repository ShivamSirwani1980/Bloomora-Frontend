import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ChatBot } from '@/components/ChatBot';
import { BirthdayExperience } from '@/components/BirthdayExperience';
import { DobModal } from '@/components/auth/DobModal';
import { useStore } from '@/lib/store';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, setUser } = useStore();

  const handleDobSuccess = (dob: string) => {
    if (user) {
      setUser({ ...user, dob });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <BirthdayExperience />
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <ChatBot />
      <DobModal 
        isOpen={!!user && !user.dob} 
        email={user?.email || ""} 
        onSuccess={handleDobSuccess}
      />
    </div>
  );
}
