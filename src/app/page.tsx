
import Navbar from "@/components/Navbar";
import Showcase from "@/components/showcase";
import React from "react";

// Import Showcase dynamically (disable SSR)

function Page() {
  return (
    <div className="h-screen w-full bg-amber-300">
      <Navbar />
      <Showcase />
    </div>
  );
}

export default Page;
