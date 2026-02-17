import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Flower2, Mail, Lock, User } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import axios from "axios";
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY_BASE64 = import.meta.env.VITE_ENCRYPTION_KEY;

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();
  const { setUser } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const key = CryptoJS.enc.Base64.parse(ENCRYPTION_KEY_BASE64);

      let payload: any;

      if (isLogin) {
        // LOGIN → requires IV
        const ivWordArray = CryptoJS.lib.WordArray.random(16);
        const ivBase64 = CryptoJS.enc.Base64.stringify(ivWordArray);

        const encryptField = (value: string) =>
          CryptoJS.AES.encrypt(value, key, {
            iv: ivWordArray,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
          }).toString();

        payload = {
          email: encryptField(email),
          password: encryptField(password),
          iv: ivBase64,
        };
      } else {
        // SIGNUP → no IV required
        const encryptField = (value: string) =>
          CryptoJS.AES.encrypt(value, key, {
            mode: CryptoJS.mode.ECB, // usually used if no IV
            padding: CryptoJS.pad.Pkcs7,
          }).toString();

        payload = {
          email: email,
          password: password,
          username: name,
        };
      }

      const url = isLogin
        ? `${import.meta.env.VITE_API_BASE_URL}Login/`
        : `${import.meta.env.VITE_API_BASE_URL}Signup/`;

      const res = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setUser({
        id: res.data?.id ?? "1",
        email,
        name: res.data?.username || name,
      });

      toast.success(
        isLogin ? "Welcome back!" : "Account created successfully!"
      );

      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Authentication failed"
      );
    }
  };

  return (
    <Layout>
      <div className="pt-24 section-padding min-h-screen flex items-center justify-center bg-hero-gradient">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-card rounded-3xl p-8 shadow-elevated border border-border">
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2 mb-4">
                <Flower2 className="w-8 h-8 text-primary" />
                <span className="font-display text-2xl font-bold text-gradient">
                  Bloomora
                </span>
              </Link>

              <h1 className="text-2xl font-bold text-foreground">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>

              <p className="text-muted-foreground mt-2">
                {isLogin
                  ? "Sign in to your account"
                  : "Join Bloomora today"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full input-premium pl-10"
                      placeholder="Your name"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full input-premium pl-10"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full input-premium pl-10"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <p className="text-center mt-6 text-muted-foreground">
              {isLogin
                ? "Don't have an account?"
                : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-medium ml-1 hover:underline"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
