import React, { Suspense } from "react";
import SharedReportsPage from "../components/SharedReportsPage";
// import SharedReportsPage from "@/components/SharedReportsPage"; // ✅ correct import path

export const dynamic = "force-dynamic";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading Shared Reports...</div>}>
      <SharedReportsPage />
    </Suspense>
  );
};

export default Page;
