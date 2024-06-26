import Navigation from "@/common/Navigation";
import React from "react";
import LoadingWrapper from "../LoadingWrapper";
import { Toaster } from "sonner";

const Pageslayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Toaster position="top-center" />
      <main className="relative py-[4.5rem] mx-auto lg:max-w-6xl px-[2rem] sm:px-[3rem] lg:px-[1.5rem]">
        <Navigation />
        {children}
        {/* <Footer /> */}
      </main>
    </>
  );
};

export default Pageslayout;
