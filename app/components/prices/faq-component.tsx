import React from "react";

export const FAQComponent = () => {
  const faqs = [
    {
      q: "Can I switch plans at any time?",
      a: "Yes. Upgrades take effect immediately and downgrades apply at the end of your billing cycle.",
    },
    {
      q: "What counts as a session?",
      a: "A session is one complete council conversation from opening to closing the strategy loop.",
    },
    {
      q: "Is my data secure?",
      a: "All sessions are encrypted at rest and in transit. We never train on your private strategy data.",
    },
    {
      q: "Do you offer a student or non-profit discount?",
      a: "Yes — reach out to our team and we'll hook you up with a special rate.",
    },
  ];
  return (
    <main>
      <div className="mt-24 px-4 max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          Frequently Asked <span className="text-[#7F0DF2]">Questions</span>
        </h2>
      </div>
    </main>
  );
};
