import React from "react";

export const CeoPic = () => {
  return (
    <main>
      <section className=" w-[1232px] mx-auto flex items-center gap-10 mt-32 glass rounded-4xl">
        <div className="p-7">
          <h1 className="text-5xl font-bold max-w-2xl mx-auto mt-10 italic">
            "We didn't need a smarter model. We needed a better{" "}
            <span className="text-[#7F0DF2]">structure</span>."
          </h1>

          <div>
            <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto mt-10">
              The problem with single-model AI is that it’s a dead end. It can
              generate text, but it can’t challenge itself. It can analyze data,
              but it can’t question its own assumptions. It’s a powerful tool,
              but it’s not a strategic partner.
            </p>
          </div>

          <div>
            <p className="text-xl font-bold max-w-2xl mx-auto mt-5">
              Benjamin Chidera
            </p>
            <p className="text-lg font-semibold text-[#7F0DF2] max-w-2xl mx-auto mt-5">
              CEO, Brainstorming Agents
            </p>
          </div>
        </div>

        <div
          className="w-[804px] h-[600px] bg-cover bg-center bg-no-repeat rounded-3xl"
          style={{ backgroundImage: "url('/ben.jpeg')" }}
        ></div>
      </section>
    </main>
  );
};
