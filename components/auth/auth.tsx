import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { useAuthStore } from "store/auth.store";
import { Input } from "~/components/ui/input";
import { ArrowRight, X } from "lucide-react";

export const Auth = () => {
  const { isModalOpen, setIsModalOpen, isLogin, setIsLogin } = useAuthStore();

  return (
    <main>
      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent className="glass text-center sm:w-[450px] w-[95vw] sm:max-w-[450px] mx-auto max-h-[95vh] overflow-y-auto p-6">
          <AlertDialogHeader>
            <AlertDialogFooter className="absolute top-2 right-2">
              <AlertDialogCancel className=" rounded-full cursor-pointer bg-transparent border-none">
                <X size={10} className="text-white" />
              </AlertDialogCancel>
            </AlertDialogFooter>

            <AlertDialogTitle className=" text-center">
              {isLogin ? "Welcome Back" : "Join the Council"}
            </AlertDialogTitle>
            <AlertDialogDescription className=" text-center">
              <p className="text-sm text-[#94A3B8]">
                {isLogin
                  ? "Sign in to continue your session."
                  : "Access the future of AI governance. "}
              </p>
              <section className=" mt-5 w-full sm:w-[398px] mx-auto space-y-4 sm:space-y-5 flex flex-col">
                {!isLogin && (
                  <div className=" space-y-1 flex flex-col text-start">
                    <label htmlFor="name" className="text-[#CBD5E1]">
                      Name
                    </label>
                    <Input
                      placeholder="John Doe"
                      className="w-full h-10 outline-none focus:outline-none"
                      id="name"
                    />
                  </div>
                )}

                <div className=" space-y-1 flex flex-col text-start">
                  <label htmlFor="email" className="text-[#CBD5E1]">
                    Email
                  </label>
                  <Input
                    placeholder="name@company.com"
                    className="w-full h-10"
                    id="email"
                  />
                </div>

                <div>
                  <Button className="w-full bg-[#7F0DF2] text-white hover:bg-[#7427c1] hover:text-white cursor-pointer h-10">
                    {isLogin ? "Sign In" : "Sign Up"} <ArrowRight />
                  </Button>
                </div>
              </section>

              <p className="text-xs text-[#94A3B8] mt-5">OR CONTINUE WITH</p>

              <section className="flex items-center gap-5 justify-around mt-5 w-full">
                {/* google */}
                <Button className="glass w-[100px] md:w-[120px] lg:w-[150px] lg:h-[40px] rounded-full flex justify-center items-center gap-3 cursor-pointer  ">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.8 10.2083C18.8 9.55831 18.7417 8.93331 18.6333 8.33331H10V11.8833H14.9333C14.7167 13.025 14.0667 13.9916 13.0917 14.6416V16.95H16.0667C17.8 15.35 18.8 13 18.8 10.2083Z"
                      fill="#F1F5F9"
                    />
                    <path
                      d="M9.99998 19.1667C12.475 19.1667 14.55 18.35 16.0667 16.95L13.0917 14.6417C12.275 15.1917 11.2333 15.525 9.99998 15.525C7.61665 15.525 5.59165 13.9167 4.86665 11.75H1.81665V14.1167C3.32498 17.1083 6.41665 19.1667 9.99998 19.1667Z"
                      fill="#F1F5F9"
                    />
                    <path
                      d="M4.86659 11.7417C4.68325 11.1917 4.57492 10.6083 4.57492 10C4.57492 9.39166 4.68325 8.80833 4.86659 8.25833V5.89166H1.81659C1.19159 7.125 0.833252 8.51666 0.833252 10C0.833252 11.4833 1.19159 12.875 1.81659 14.1083L4.19159 12.2583L4.86659 11.7417Z"
                      fill="#F1F5F9"
                    />
                    <path
                      d="M9.99998 4.48331C11.35 4.48331 12.55 4.94998 13.5083 5.86665L16.1333 3.24165C14.5417 1.74165 12.475 0.833313 9.99998 0.833313C6.41665 0.833313 3.32498 2.89165 1.81665 5.89165L4.86665 8.25831C5.59165 6.09165 7.61665 4.48331 14.8666 4.48331H9.99998Z"
                      fill="#F1F5F9"
                    />
                  </svg>

                  <p className="text-sm text-[#94A3B8]">Google</p>
                </Button>
                {/* github   */}

                <Button className="glass w-[100px] md:w-[120px] lg:w-[150px] lg:h-[40px] rounded-full flex justify-center items-center gap-3 cursor-pointer">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_1_504)">
                      <path
                        d="M10 0C4.47833 0 0 4.4775 0 10C0 14.4183 2.865 18.1667 6.83917 19.4892C7.33833 19.5817 7.5 19.2717 7.5 19.0083V17.1467C4.71833 17.7517 4.13917 15.9667 4.13917 15.9667C3.68417 14.8108 3.02833 14.5033 3.02833 14.5033C2.12083 13.8825 3.0975 13.8958 3.0975 13.8958C4.10167 13.9658 4.63 14.9267 4.63 14.9267C5.52167 16.455 6.96917 16.0133 7.54 15.7575C7.62917 15.1117 7.88833 14.67 8.175 14.4208C5.95417 14.1667 3.61917 13.3092 3.61917 9.47833C3.61917 8.38583 4.01 7.49417 4.64917 6.79417C4.54583 6.54167 4.20333 5.52417 4.74667 4.1475C4.74667 4.1475 5.58667 3.87917 7.4975 5.1725C8.295 4.95083 9.15 4.84 10 4.83583C10.85 4.84 11.7058 4.95083 12.505 5.1725C14.4142 3.87917 15.2525 4.1475 15.2525 4.1475C15.7967 5.525 15.4542 6.5425 15.3508 6.79417C15.9925 7.49417 16.38 8.38667 16.38 9.47833C16.38 13.3192 14.0408 14.165 11.8142 14.4125C12.1725 14.7225 12.5 15.3308 12.5 16.2642V19.0083C12.5 19.2742 12.66 19.5867 13.1675 19.4883C17.1383 18.1642 20 14.4167 20 10C20 4.4775 15.5225 0 10 0V0Z"
                        fill="#F1F5F9"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1_504">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  <p className="text-sm text-[#94A3B8]">Github</p>
                </Button>
              </section>

              <div className="mt-5">
                <p className="text-xs text-[#94A3B8]">
                  {isLogin
                    ? "Don't have an account? "
                    : "Already have an account? "}
                  <span
                    className="text-[#7F0DF2] cursor-pointer"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? "Sign Up" : "Sign In"}
                  </span>
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};
