import React from "react";
import { MobileNavbar } from "./mobile-navbar";
import { DesktopNavbar } from "./desktop-navbar";

export const Navbar = () => {
  return (
    <main className=" relative">
      {/* this is the desktop navbar */}
      <DesktopNavbar />

      {/* this is the mobile navbar */}
      <MobileNavbar />
    </main>
  );
};
