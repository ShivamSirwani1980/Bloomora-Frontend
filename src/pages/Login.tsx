import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Flower2, Mail, Lock, User, Eye, EyeOff, Calendar } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
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

  // SIGNUP FIELDS
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { setUser, setCart, setLikedProducts } = useStore();

  const syncUserStateFromDB = async (emailToSync: string) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/main/Bloomora/User/State/`, {
        params: { email: emailToSync }
      });
      if (res.data && res.data.data) {
        setCart(res.data.data.cart || []);
        setLikedProducts(res.data.data.liked_products || []);
      }
    } catch (e) {
      console.error("Failed to fetch user state", e);
    }
  };

  // Calculate the maximum date allowed (Today - 5 years)
  const todayDate = new Date();
  const maxDate = new Date(todayDate.getFullYear() - 5, todayDate.getMonth(), todayDate.getDate())
    .toISOString()
    .split("T")[0];

  // GOOGLE LOGIN/SIGNUP SUCCESS HANDLER
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const emailParam = params.get("email");
    const name = params.get("name");

    if (token && emailParam) {
      setUser({
        id: "google-user",
        email: emailParam,
        name: name || "User",
      });

      localStorage.setItem("token", token); // ✅ Google login saves token
      syncUserStateFromDB(emailParam).then(() => {
        toast.success("Login successful!");
        window.history.replaceState({}, document.title, "/login");
        navigate("/dashboard");
      });
    }
  }, [navigate, setUser]);

  // GOOGLE AUTH
  const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/v1/main/Bloomora/Google/`;
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return false;
    }

    if (!isLogin) {
      const nameRegex = /^[A-Za-z\s]{2,}$/;

      if (!nameRegex.test(firstName.trim())) {
        toast.error("First name must be at least 2 letters (no numbers).");
        return false;
      }
      if (!nameRegex.test(lastName.trim())) {
        toast.error("Last name must be at least 2 letters (no numbers).");
        return false;
      }

      if (!dob) {
        toast.error("Please select your date of birth.");
        return false;
      }

      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 5) {
        toast.error("Registration failed: You must be at least 5 years old.");
        return false;
      }
    }

    return true;
  };

  // SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const key = CryptoJS.enc.Base64.parse(ENCRYPTION_KEY_BASE64);
      let payload: Record<string, string>;

      if (isLogin) {
        const ivWordArray = CryptoJS.lib.WordArray.random(16);
        const ivBase64 = CryptoJS.enc.Base64.stringify(ivWordArray);

        const encryptField = (value: string) =>
          CryptoJS.AES.encrypt(value, key, {
            iv: ivWordArray,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
          }).toString();

        payload = {
          email: encryptField(email.trim().toLowerCase()),
          password: encryptField(password),
          iv: ivBase64,
        };
      } else {
        payload = {
          email: email.trim().toLowerCase(),
          password,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          dob: dob,
        };
      }

      const url = isLogin
        ? `${import.meta.env.VITE_API_BASE_URL}/api/v1/main/Bloomora/Login/`
        : `${import.meta.env.VITE_API_BASE_URL}/api/v1/main/Bloomora/Signup/`;

      const res = await axios.post(url, payload);

      if (isLogin) {
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

        // ✅ FIX: Save token to localStorage so Checkout can find it
        if (decryptedData.token) {
          localStorage.setItem("token", decryptedData.token);
        } else if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }

        setUser({
          id: decryptedData.data.id,
          email: decryptedData.data.email,
          name: decryptedData.data.first_name 
                 ? `${decryptedData.data.first_name} ${decryptedData.data.last_name || ''}`.trim() 
                 : decryptedData.data.name || "User",
        });

        await syncUserStateFromDB(decryptedData.data.email);

      } else {
        // ✅ FIX: Save token for signup too
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }

        setUser({
          id: res.data.data.user_id,
          email: email.toLowerCase(),
          name: `${firstName} ${lastName}`,
        });

        await syncUserStateFromDB(email.toLowerCase());
      }

      toast.success(isLogin ? "Welcome back!" : "Account created successfully!");
      navigate("/dashboard");

    } catch (err: unknown) {
      console.error(err);
      const error = err as import('axios').AxiosError<{error: string}>;
      toast.error(error.response?.data?.error || "Authentication failed");
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
                {isLogin ? "Sign in to your account" : "Join Bloomora today"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value.replace(/[^A-Za-z\s]/g, ""))}
                        className="w-full input-premium pl-10"
                        placeholder="First name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value.replace(/[^A-Za-z\s]/g, ""))}
                        className="w-full input-premium pl-10"
                        placeholder="Last name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">DOB</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="date"
                        value={dob}
                        max={maxDate}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full input-premium pl-10"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
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
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full input-premium pl-10 pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full">
                {isLogin ? "Sign In" : "Create Account"}
              </Button>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-sm text-muted-foreground">OR</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleGoogleAuth}
              >
                <FcGoogle className="w-5 h-5" />
                {isLogin ? "Login with Google" : "Sign up with Google"}
              </Button>
            </form>

            <p className="text-center mt-6 text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
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