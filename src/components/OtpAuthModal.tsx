import React, { useState, useEffect } from "react";
import {
  Phone,
  ShieldCheck,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  RefreshCw,
  UserCheck,
  Smartphone,
  Lock,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useFarm } from "../context/FarmContext";

interface OtpAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OtpAuthModal: React.FC<OtpAuthModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const { profile, updateProfile } = useFarm();

  const [step, setStep] = useState<"phone" | "otp" | "success">("phone");
  const [phoneInput, setPhoneInput] = useState("");
  const [otpInput, setOtpInput] = useState(["", "", "", "", "", ""]);
  const [generatedOtp, setGeneratedOtp] = useState("123456");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [farmerNameInput, setFarmerNameInput] = useState(profile.name || "Kisan Patel");

  // Timer countdown for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneInput.trim().replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setErrorMsg(
        language === "hi"
          ? "कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें"
          : "Please enter a valid 10-digit mobile number"
      );
      return;
    }

    setErrorMsg("");
    setIsSending(true);

    // Simulate OTP SMS send
    setTimeout(() => {
      // Demo test OTP default
      const randomCode = "123456";
      setGeneratedOtp(randomCode);
      setIsSending(false);
      setStep("otp");
      setTimer(30);
      setCanResend(false);
    }, 800);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otpInput];
    newOtp[index] = value;
    setOtpInput(newOtp);
    setErrorMsg("");

    // Auto focus next field
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp_input_${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpInput[index] && index > 0) {
      const prevInput = document.getElementById(`otp_input_${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpInput.join("");
    if (entered.length < 6) {
      setErrorMsg(
        language === "hi"
          ? "कृपया पूरा 6 अंकों का ओटीपी कोड दर्ज करें"
          : "Please enter the complete 6-digit OTP code"
      );
      return;
    }

    if (entered !== generatedOtp && entered !== "123456") {
      setErrorMsg(
        language === "hi"
          ? "गलत ओटीपी कोड! कृपया फिर से प्रयास करें (परीक्षण कोड: 123456)"
          : "Incorrect OTP! Please try again (Test OTP: 123456)"
      );
      return;
    }

    setIsVerifying(true);
    setErrorMsg("");

    setTimeout(() => {
      setIsVerifying(false);

      // Save updated profile with logged-in mobile number
      const formattedPhone = `+91 ${phoneInput.replace(/\D/g, "")}`;
      updateProfile({
        phone: formattedPhone,
        name: farmerNameInput.trim() || "Kisan Patel",
      });

      setStep("success");
    }, 600);
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(30);
    setCanResend(false);
    setOtpInput(["", "", "", "", "", ""]);
    setErrorMsg("");
    // Random test OTP
    setGeneratedOtp("123456");
  };

  const handleQuickFill = () => {
    setPhoneInput("9876543210");
    setErrorMsg("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-100 dark:border-slate-800 relative overflow-hidden">
        {/* Background Decorative Accent */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-emerald-400/10 dark:bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-inner border border-emerald-200 dark:border-emerald-800">
            {step === "phone" ? (
              <Smartphone className="w-7 h-7" />
            ) : step === "otp" ? (
              <ShieldCheck className="w-7 h-7 text-emerald-600 animate-pulse" />
            ) : (
              <UserCheck className="w-7 h-7 text-emerald-600" />
            )}
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {step === "phone" && (language === "hi" ? "मोबाइल नंबर से लॉगिन करें" : "Login with Mobile OTP")}
            {step === "otp" && (language === "hi" ? "ओटीपी (OTP) सत्यापन" : "Enter Verification Code")}
            {step === "success" && (language === "hi" ? "लॉगिन सफल रहा!" : "Login Successful!")}
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {step === "phone" &&
              (language === "hi"
                ? "अपने खेत के डेटा, मंडी भाव और सलाह को सुरक्षित रखने के लिए मोबाइल नंबर दर्ज करें"
                : "Enter your mobile number to access your saved fields, price alerts & AI guidance")}
            {step === "otp" &&
              (language === "hi"
                ? `+91 ${phoneInput} पर 6 अंकों का सुरक्षा कोड भेजा गया है`
                : `Enter the 6-digit verification code sent to +91 ${phoneInput}`)}
            {step === "success" &&
              (language === "hi"
                ? "आपका मोबाइल नंबर सफलतापूर्वक सत्यापित हो गया है"
                : "Your mobile number has been verified successfully")}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <Lock className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Phone Number Input */}
        {step === "phone" && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === "hi" ? "किसान का नाम (वैकल्पिक)" : "Farmer Name (Optional)"}
              </label>
              <input
                type="text"
                value={farmerNameInput}
                onChange={(e) => setFarmerNameInput(e.target.value)}
                placeholder={language === "hi" ? "उदाहरण: रमेश पटेल" : "e.g. Ramesh Patel"}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === "hi" ? "10 अंकों का मोबाइल नंबर" : "10-Digit Mobile Number"}
              </label>
              <div className="flex rounded-xl border border-slate-300 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800/80 focus-within:ring-2 focus-within:ring-emerald-500">
                <span className="px-3 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border-r border-slate-300 dark:border-slate-700 flex items-center gap-1">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phoneInput}
                  onChange={(e) => {
                    setPhoneInput(e.target.value.replace(/\D/g, ""));
                    setErrorMsg("");
                  }}
                  placeholder="9876543210"
                  className="w-full px-3.5 py-2.5 bg-transparent text-slate-900 dark:text-slate-100 font-mono font-bold text-sm tracking-wider outline-none"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>{language === "hi" ? "डेमो नंबर भरें" : "Auto-fill Demo Number"}</span>
              </button>
              <span>SMS Charges May Apply</span>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
            >
              {isSending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{language === "hi" ? "ओटीपी भेजा जा रहा है..." : "Sending OTP SMS..."}</span>
                </>
              ) : (
                <>
                  <span>{language === "hi" ? "ओटीपी (OTP) प्राप्त करें" : "Get OTP via SMS"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: OTP Verification Input */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60 text-center">
              <p className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                {language === "hi"
                  ? "परीक्षण ओटीपी कोड (Demo OTP): "
                  : "Test OTP Code: "}
                <span className="font-mono font-bold text-sm underline">{generatedOtp}</span>
              </p>
            </div>

            <div className="flex items-center justify-center gap-2">
              {otpInput.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp_input_${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-11 h-12 text-center text-lg font-bold font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="text-slate-600 dark:text-slate-400 hover:underline"
              >
                {language === "hi" ? "← नंबर बदलें" : "← Change Number"}
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend}
                className={`font-semibold ${
                  canResend
                    ? "text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                    : "text-slate-400 cursor-not-allowed"
                }`}
              >
                {canResend
                  ? language === "hi"
                    ? "पुनः ओटीपी भेजें"
                    : "Resend OTP"
                  : `${language === "hi" ? "पुनः भेजें" : "Resend in"} (${timer}s)`}
              </button>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{language === "hi" ? "सत्यापित किया जा रहा है..." : "Verifying Code..."}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === "hi" ? "ओटीपी सत्यापित करें एवं लॉगिन करें" : "Verify OTP & Login"}</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 3: Login Success */}
        {step === "success" && (
          <div className="text-center space-y-4 py-2">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                {language === "hi" ? "आपका स्वागत है, " : "Welcome back, "}
                <span>{profile.name}</span>!
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 font-mono mt-1">
                +91 {phoneInput || profile.phone}
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
            >
              {language === "hi" ? "ऐप का उपयोग शुरू करें" : "Continue to KrishiMitra"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
