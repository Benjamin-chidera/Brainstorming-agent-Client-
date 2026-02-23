import React from "react";
import { Link, NavLink } from "react-router";
import { useAuthStore } from "store/auth.store";
import { Button } from "~/components/ui/button";
import { Rotate as Hamburger } from "hamburger-react";

export const MobileNavbar = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    setIsLogin,
    isLogin,
    isMenuOpen,
    setIsMenuOpen,
  } = useAuthStore();

  const handleGetStarted = () => {
    setIsModalOpen(true);
    setIsLogin(false);
    setIsMenuOpen(false); 
  };

  const handleLogin = () => {
    setIsModalOpen(true);
    setIsLogin(true);
    setIsMenuOpen(false); 
  };

  return (
    <main>
      {" "}
      <section className="mt-7 lg:hidden">
        <nav className="flex items-center justify-between h-[50px] w-11/12 mx-auto rounded-full bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-100 text-white glass pr-2 fixed top-13 z-50  left-1/2 -translate-x-1/2">
          <div>
            <Link
              to={"/"}
              className="flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <img
                src="/logo.png"
                alt="council.ai"
                className="w-12 h-12 lg:w-14 lg:h-14  "
              />

              <p className="text-xl font-bold hidden lg:block">Council.ai</p>
            </Link>
          </div>

          <div onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {/* <Button className=" bg-transparent hover:bg-transparent"> */}
            <Hamburger toggled={isMenuOpen} />
            {/* </Button> */}
          </div>
        </nav>

        {isMenuOpen && (
          <nav className="glass w-11/12 lg:hidden mx-auto h-[400px] rounded-3xl fixed top-27 left-1/2 -translate-x-1/2 z-50">
            <div className=" items-center gap-2 md:gap-4 flex flex-col justify-center mt-10">
              <NavLink
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `font-medium px-4 py-2 rounded-full transition-colors text-sm ${isActive ? "bg-[#7F0DF2] text-white" : "hover:bg-[#7F0DF2] hover:text-white"}`
                }
              >
                About
              </NavLink>

              <NavLink
                to="/pricing"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `font-medium px-4 py-2 rounded-full transition-colors text-sm ${isActive ? "bg-[#7F0DF2] text-white" : "hover:bg-[#7F0DF2] hover:text-white"}`
                }
              >
                Pricing
              </NavLink>

              <NavLink
                to="/council-setup"
                onClick={() => setIsMenuOpen(false)}
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

              <Button
                className={`font-medium px-4 py-2 rounded-full transition-colors text-sm ${isModalOpen && isLogin ? "bg-[#7F0DF2] text-white" : "hover:bg-[#7F0DF2] hover:text-white"}`}
                onClick={handleLogin}
              >
                Login
              </Button>
              <Button
                className="bg-[#7F0DF2] text-white px-5 py-2 rounded-full font-semibold hover:bg-opacity-90 transition-colors text-sm mt-2"
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            </div>
          </nav>
        )}
      </section>
    </main>
  );
};
