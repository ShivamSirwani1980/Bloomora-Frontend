import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flower2, Lock, Mail, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useStore } from '@/lib/store';
import axios from "axios";
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY_BASE64 = import.meta.env.VITE_ENCRYPTION_KEY;

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setAdminAuthenticated } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const key = CryptoJS.enc.Base64.parse(ENCRYPTION_KEY_BASE64);
      const ivWordArray = CryptoJS.lib.WordArray.random(16);
      const ivBase64 = CryptoJS.enc.Base64.stringify(ivWordArray);

      const encryptField = (value: string) =>
        CryptoJS.AES.encrypt(value, key, {
          iv: ivWordArray,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }).toString();

      if (step === 1) {
        const payload = {
          email: encryptField(email.trim().toLowerCase()),
          password: encryptField(password),
          iv: ivBase64,
        };

        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}api/v1/main/Bloomora/AdminLogin/`, payload);

        const { encrypted_response, iv: respIv } = res.data;
        const decryptedBytes = CryptoJS.AES.decrypt(
          encrypted_response,
          key,
          {
            iv: CryptoJS.enc.Base64.parse(respIv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
          }
        );

        const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

        if (decryptedData.require_otp) {
          toast.success(decryptedData.message || 'Verification code sent to your email.');
          setStep(2);
        } else {
          // Save token to localStorage 
          if (decryptedData.token) {
            localStorage.setItem("token", decryptedData.token);
          } else if (res.data.token) {
            localStorage.setItem("token", res.data.token);
          }

          setAdminAuthenticated(true);
          toast.success('Welcome back, Admin!');
          navigate('/admin');
        }
      } else if (step === 2) {
        const payload = {
          email: encryptField(email.trim().toLowerCase()),
          otp: encryptField(otp.trim()),
          iv: ivBase64,
        };

        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}api/v1/main/Bloomora/VerifyAdminOTP/`, payload);

        const { encrypted_response, iv: respIv } = res.data;
        const decryptedBytes = CryptoJS.AES.decrypt(
          encrypted_response,
          key,
          {
            iv: CryptoJS.enc.Base64.parse(respIv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
          }
        );

        const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

        // Save token to localStorage 
        if (decryptedData.token) {
          localStorage.setItem("token", decryptedData.token);
        } else if (res.data.token) {
          localStorage.setItem("token", res.data.token); // fallback
        }

        setAdminAuthenticated(true);
        toast.success('Welcome back, Admin!');
        navigate('/admin');
      }

    } catch (err: unknown) {
      console.error(err);
      const error = err as import('axios').AxiosError<{error: string}>;
      toast.error(error.response?.data?.error || "Authentication failed. Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
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
            <p className="text-muted-foreground text-sm mt-1">Sign in to manage your store</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 ? (
              <>
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
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Verification Code</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="pl-10"
                    maxLength={6}
                    required
                  />
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                step === 1 ? 'Sign In' : 'Verify & Sign In'
              )}
            </Button>
          </form>

          {/* Hint */}
          <div className="mt-6 p-3 rounded-xl bg-muted/50 border border-border/50">
            <p className="text-xs text-muted-foreground text-center">
              {step === 1 
                ? "Please use your secure administrator credentials."
                : "A verification code has been sent to your registered email address."}
            </p>
          </div>

          {/* Back link */}
          <p className="text-center mt-4">
            {step === 1 ? (
              <button 
                type="button"
                onClick={() => navigate('/')} 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                ← Back to store
              </button>
            ) : (
              <button 
                type="button"
                onClick={() => setStep(1)} 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                ← Back to login
              </button>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
