import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Rocket,
  Users,
  ArrowRight,
  ArrowLeft,
  User,
  Mail,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import artparkLogo from "../../assets/artpark_in_logo.jpg";
import { useApplicationStore } from "../../store/useApplicationStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Added 'success' to the view types
type AuthView = "selection" | "login" | "signup" | "success";
type UserRole = "founder" | "innovator" | null;

export default function OnboardingAuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { setRole, updateInnovator, updateFounder } = useApplicationStore();

  const [view, setView] = useState<AuthView>("selection");
  const [role, setRoleState] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const typeParam = searchParams.get("type");
    const modeParam = searchParams.get("mode");

    if (modeParam === "login") {
      setView("login");
    } else if (typeParam === "founder" || typeParam === "innovator") {
      setRoleState(typeParam as UserRole);
      if (!modeParam) setView("signup");
    }
  }, [searchParams]);

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRoleState(selectedRole);
    setView("signup");
    setSearchParams({ type: selectedRole!, mode: "apply" });
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          role: "applicant",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      // --- CHANGED LOGIC START ---
      // Instead of logging in immediately, we show the success screen

      // Update store with name/email so it's ready when they eventually login
      if (role) setRole(role);
      if (role === "innovator") {
        updateInnovator({ leadName: formData.fullName, email: formData.email });
      } else {
        updateFounder({ fullName: formData.fullName, email: formData.email });
      }

      // Switch to Success View
      setView("success");
      // --- CHANGED LOGIC END ---
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (view === "signup") {
      setView("selection");
      setRoleState(null);
    } else if (view === "login") {
      setView("selection");
    } else if (view === "success") {
      // If they go back from success, take them to login to check their status
      setView("login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-5xl z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side: Context */}
        <div className="hidden lg:block space-y-6 pr-8">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center p-2 mb-6">
            <span className="font-bold text-blue-600 text-xl">
              <img
                src={artparkLogo}
                alt="ARTPARK"
                className="w-full h-full object-contain"
              />
            </span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            Building the future of <br />
            <span className="text-blue-600">Robotics & AI</span>
          </h1>

          <p className="text-lg text-gray-600 max-w-md">
            Join India's leading ecosystem.{" "}
            {role === "founder"
              ? "Build your deep-tech venture with us."
              : "Find your team and solve big problems."}
          </p>

          <div className="space-y-4 pt-4">
            <FeatureRow text="Access to world-class test labs" />
            <FeatureRow text="Mentorship from industry experts" />
            <FeatureRow text="Seed funding & grant opportunities" />
          </div>
        </div>

        {/* Right Side: The Form Card */}
        <motion.div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md mx-auto overflow-hidden relative h-[570px] flex flex-col">
          {/* Progress Bar - Full width for Success */}
          <div className="h-1.5 w-full bg-gray-100 shrink-0">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: "0%" }}
              animate={{
                width: view === "selection" ? "30%" : "100%",
              }}
            />
          </div>

          {/* Content Area */}
          <div className="p-8 flex-1 overflow-y-auto flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {/* STEP 1: ROLE SELECTION */}
              {view === "selection" && (
                <motion.div
                  key="selection"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 w-full"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Start your journey
                    </h2>
                    <p className="text-gray-500 mt-2">
                      How would you like to participate?
                    </p>
                  </div>

                  <div className="space-y-4">
                    <RoleSelectCard
                      icon={<Rocket className="w-6 h-6 text-white" />}
                      color="bg-blue-600"
                      title="I have a Startup Idea"
                      description="For founders ready to build, incubate, and scale."
                      onClick={() => handleRoleSelect("founder")}
                    />

                    <RoleSelectCard
                      icon={<Users className="w-6 h-6 text-white" />}
                      color="bg-purple-600"
                      title="I want to join a Team"
                      description="For innovators looking for projects and co-founders."
                      onClick={() => handleRoleSelect("innovator")}
                    />
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-500">
                      Already have an account?{" "}
                      <button
                        onClick={() => {
                          setView("login");
                          setSearchParams({ mode: "login" });
                        }}
                        className="text-blue-600 font-medium hover:underline"
                      >
                        Log in
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: MERGED SIGN UP */}
              {view === "signup" && (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full"
                >
                  <HeaderWithBack
                    title="Create Account"
                    subtitle="Enter your details to get started"
                    onBack={goBack}
                  />

                  <form onSubmit={handleSignupSubmit} className="space-y-4">
                    <Input
                      label="Full Name"
                      placeholder="e.g. Rahul Sharma"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      leftIcon={<User className="w-4 h-4" />}
                    />

                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      leftIcon={<Mail className="w-4 h-4" />}
                    />

                    <Input
                      label="Create Password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      leftIcon={<Lock className="w-4 h-4" />}
                    />

                    <Input
                      label="Confirm Password"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      leftIcon={<Lock className="w-4 h-4" />}
                    />

                    <Button
                      className="w-full mt-4"
                      size="lg"
                      isLoading={isLoading}
                    >
                      Create Account
                    </Button>

                    <p className="text-xs text-center text-gray-500 mt-4">
                      By clicking Create Account, you agree to our Terms and
                      Privacy Policy.
                    </p>
                  </form>
                </motion.div>
              )}

              {/* --- NEW STEP 3: SUCCESS / CHECK EMAIL --- */}
              {view === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full text-center py-8"
                >
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-10 h-10" />
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Check your inbox
                  </h2>

                  <p className="text-gray-600 mb-8 max-w-xs mx-auto leading-relaxed">
                    We've sent a verification link to <br />
                    <span className="font-semibold text-gray-900">
                      {formData.email}
                    </span>
                    .
                    <br />
                    <br />
                    Please click the link in the email to verify your account
                    and continue.
                  </p>

                  <Button
                    variant="outline"
                    onClick={() => setView("login")}
                    className="w-full"
                  >
                    Back to Login
                  </Button>
                </motion.div>
              )}

              {/* LOGIN VIEW */}
              {view === "login" && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="w-full"
                >
                  <div className="flex items-center mb-6">
                    <button
                      onClick={goBack}
                      className="mr-3 p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Welcome Back
                      </h2>
                      <p className="text-sm text-gray-500">
                        Sign in to continue
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="space-y-4"
                  >
                    <Input
                      label="Email Address"
                      type="email"
                      leftIcon={<Mail className="w-4 h-4" />}
                    />
                    <Input
                      label="Password"
                      type="password"
                      leftIcon={<Lock className="w-4 h-4" />}
                    />
                    <Button className="w-full mt-2" size="lg">
                      Sign In
                    </Button>
                  </form>

                  <div className="mt-6 text-center text-sm">
                    <button
                      onClick={() => setView("selection")}
                      className="text-blue-600 hover:underline"
                    >
                      Don't have an account? Sign up
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// --- Subcomponents ---

function HeaderWithBack({
  title,
  subtitle,
  onBack,
}: {
  title: string;
  subtitle: string;
  onBack: () => void;
}) {
  return (
    <div className="flex items-center mb-6">
      <button
        type="button"
        onClick={onBack}
        className="mr-3 p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}

function FeatureRow({ text }: { text: string }) {
  return (
    <div className="flex items-center text-gray-600">
      <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
      <span>{text}</span>
    </div>
  );
}

function RoleSelectCard({ icon, title, description, onClick, color }: any) {
  return (
    <div
      onClick={onClick}
      className="group relative flex items-start p-4 rounded-xl border border-gray-200 bg-white hover:border-blue-300 hover:shadow-md cursor-pointer transition-all duration-200"
    >
      <div
        className={`flex-shrink-0 w-12 h-12 rounded-lg ${color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200`}
      >
        {icon}
      </div>
      <div className="ml-4 flex-1">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
          {description}
        </p>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500">
        <ArrowRight className="w-5 h-5" />
      </div>
    </div>
  );
}
