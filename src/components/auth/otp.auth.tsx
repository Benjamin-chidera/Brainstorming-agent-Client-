import { useAuthStore } from "@/store/auth.store";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X, ArrowRight } from "lucide-react";

export const InputOTPAuth = () => {
  const { isOtpModalOpen, setIsOtpModalOpen, verifyOtp, otp, setOtp } =
    useAuthStore();

  return (
    <AlertDialog open={isOtpModalOpen} onOpenChange={setIsOtpModalOpen}>
      <AlertDialogContent className="glass text-center sm:w-[450px] w-[95vw] sm:max-w-[450px] mx-auto max-h-[95vh] overflow-y-auto p-8">
        <AlertDialogHeader className="relative">
          <AlertDialogTitle className="text-2xl font-bold text-white mb-2">
            Verify Your Identity
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            <p className="text-sm text-[#94A3B8] mb-8">
              We've sent a 6-digit code to your email. <br />
              Enter it below to continue.
            </p>

            <div className="flex justify-center items-center w-full mb-8">
              <InputOTP
                maxLength={6}
                className="mx-auto"
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup className="gap-2 sm:gap-4">
                  <InputOTPSlot 
                    index={0}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-lg border-white/10 bg-white/5"
                  />
                  <InputOTPSlot
                    index={1}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-lg border-white/10 bg-white/5"
                  />
                  <InputOTPSlot
                    index={2}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-lg border-white/10 bg-white/5"
                  />
                  <InputOTPSlot
                    index={3}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-lg border-white/10 bg-white/5"
                  />
                  <InputOTPSlot
                    index={4}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-lg border-white/10 bg-white/5"
                  />
                  <InputOTPSlot
                    index={5}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-lg border-white/10 bg-white/5"
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="space-y-4">
              <Button
                className="w-full bg-[#7F0DF2] text-white hover:bg-[#7427c1] transition-all cursor-pointer h-12 text-base font-medium"
                onClick={verifyOtp}
              >
                Verify Code <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <p className="text-xs text-[#94A3B8]">
                Didn't receive the code?{" "}
                <span className="text-[#7F0DF2] cursor-pointer hover:underline font-medium">
                  Resend OTP
                </span>
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};
