"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, verifyOTP } from "@/lib/slices/authSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { toast, Toaster } from "sonner";



const Verification = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { email } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      return;
    }

    // Limit to single digit
    if (value.length > 1) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();

      const newOtp = [...otp];
      if (otp[index]) {
        // Clear current input
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // Auto focus to previous input
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length === 4) {
      // Verify OTP logic here
      console.log("OTP submitted:", otpCode);
      // Redirect to password reset page or dashboard
      await dispatch(verifyOTP({ otp: otpCode, email:email || "" })).unwrap();
      router.push("/auth/reset-password");
    }
    } catch (error) {
     toast.error(error as string);
    }
  };
  const [timer, setTimer] = useState(30);
 useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

    const handleResend = async () => {
    if (!email) {
      toast.error("Email address is missing.");
      return;
    }

    try {
      await dispatch(forgotPassword({ email })).unwrap();

      toast.success("OTP Resent");
      setTimer(30); // reset timer
    } catch (err) {
      toast.error(err as string);
    }
  };

  const isComplete = otp.every((digit) => digit !== "");

  return (
    <div className="w-full max-w-md">
        <Toaster position="top-right" />
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
        <p className="text-gray-600">
          We've sent a 4-digit code to your email address. Enter it below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              aria-label={`OTP digit ${index + 1}`}
            />
          ))}
        </div>

        <Button type="submit" className="w-full" disabled={!isComplete}>
          Verify OTP
        </Button>

        <div className="text-center">
          <Link href="/auth/login" className="text-sm text-primary hover:underline">
            Back to Sign In
          </Link>
          <button 
            onClick={handleResend}
            disabled={timer > 0}
            className="text-sm text-red-400 hover:underline ml-2"
          >
            {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Verification;
