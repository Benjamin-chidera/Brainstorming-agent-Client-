import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/page";
import { Navbar } from "./components/navbar/Navbar";
import About from "./pages/about/page";
import PricingPage from "./pages/pricing/page";
import CouncilSetup from "./pages/council-setup/page";
import LiveMeetingRoom from "./pages/live-meeting-room/page";
import { Auth } from "./components/auth/auth";
import { InputOTPAuth } from "./components/auth/otp.auth";
import { Toaster } from "./components/ui/sonner";
import { useAuthStore } from "./store/auth.store";
import { useEffect } from "react";
import { Protect } from "./components/protected/protect";

function App() {
  const { getUser, isAuth } = useAuthStore();

  
  useEffect(() => {
    getUser();
  }, []);
  
  return (
    <main className=" pt-5">
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, white 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      ></div>

      {/* Gradient Overlays for depth */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-[#12081F] via-[#050505]/0 to-transparent"></div>
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_right,var(--tw-gradient-stops))] from-[#12081F] via-[#050505]/0 to-transparent"></div>

      {/* Neon Glows */}
      <div className="fixed top-[10%] left-[10%] w-[500px] h-[500px] bg-[#7f0df2] rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none z-0"></div>
      <div className="fixed bottom-[10%] right-[10%] w-[600px] h-[600px] bg-cyan-500 rounded-full mix-blend-screen filter blur-[150px] opacity-[0.15] pointer-events-none z-0"></div>

      {/*   pages */}
      <BrowserRouter>
        {/* components */}
        <main className="relative z-10 pt-5">
          <Navbar />
          {/* this is for the auth modal */}
          <Auth />
          <InputOTPAuth />
          <Toaster position="top-right" className="glass" />
        </main>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<PricingPage />} />

          <Route element={<Protect isAuth={isAuth} />}>
            <Route path="/council-setup" element={<CouncilSetup />} />
            <Route path="/live-meeting-room" element={<LiveMeetingRoom />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
