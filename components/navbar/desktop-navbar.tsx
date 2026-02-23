import React from "react";
import { Link, NavLink } from "react-router";
import { useAuthStore } from "store/auth.store";
import { Button } from "~/components/ui/button";

export const DesktopNavbar = () => {
  const { isModalOpen, setIsModalOpen, setIsLogin, isLogin } = useAuthStore();

  const handleGetStarted = () => {
    setIsModalOpen(true);
    setIsLogin(false);
  };

  const handleLogin = () => {
    setIsModalOpen(true);
    setIsLogin(true);
  };

  return (
    <main>
      {" "}
      <section className="hidden lg:block">
        <nav className="flex items-center justify-between h-12.5 w-11/12 2xl:container mx-auto rounded-full bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-100 text-white glass pr-2  fixed top-3 z-50  left-1/2 -translate-x-1/2">
          <div>
            <Link to={"/"} className="flex items-center">
              <img
                src="/logo.png"
                alt="council.ai"
                className="w-12 h-12 lg:w-14 lg:h-14  "
              />

              <p className="text-xl font-bold hidden lg:block">Council.ai</p>
            </Link>
          </div>

          <div className="lg:flex items-center gap-2 md:gap-4 hidden">
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `font-medium px-4 py-2 rounded-full transition-colors text-sm ${isActive ? "bg-[#7F0DF2] text-white" : "hover:bg-[#7F0DF2] hover:text-white"}`
              }
            >
              About
            </NavLink>

            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                `font-medium px-4 py-2 rounded-full transition-colors text-sm ${isActive ? "bg-[#7F0DF2] text-white" : "hover:bg-[#7F0DF2] hover:text-white"}`
              }
            >
              Pricing
            </NavLink>

            <NavLink
              to="/council-setup"
              className={({ isActive }) =>
                `font-medium px-4 py-2 rounded-full transition-colors text-sm ${isActive ? "bg-[#7F0DF2] text-white" : "hover:bg-[#7F0DF2] hover:text-white"}`
              }
            >
              Council Setup
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `font-medium px-4 py-2 rounded-full transition-colors text-sm ${isActive ? "bg-[#7F0DF2] text-white" : "hover:bg-[#7F0DF2] hover:text-white"}`
              }
            >
              Contact
            </NavLink>
          </div>

          <div className="lg:flex items-center gap-4 hidden">
            <Button
              className={`font-medium px-4 py-2 rounded-full transition-colors text-sm ${isModalOpen && isLogin ? "bg-[#7F0DF2] text-white" : "hover:bg-[#7F0DF2] hover:text-white"}`}
              onClick={handleLogin}
            >
              Login
            </Button>
            <Button
              className="bg-[#7F0DF2] text-white px-5 py-2 rounded-full font-semibold hover:bg-opacity-90 transition-colors text-sm"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
          </div>
        </nav>
      </section>
    </main>
  );
};
