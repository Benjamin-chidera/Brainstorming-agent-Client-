import React from "react";

export const CeoPic = () => {
  return (
    <main>
      <section className=" container mx-auto flex flex-col lg:flex-row items-center gap-10 lg:mt-32 mt-10 glass rounded-4xl justify-between">
        <div className="p-7">
          <h1 className="text-4xl font-bold max-w-2xl mx-auto lg:mt-10 mt-5 italic">
            "We didn't need a smarter model. We needed a better{" "}
            <span className="text-[#7F0DF2]">structure</span>."
          </h1>

          <div>
            <p className="text-sm text-[#94A3B8] max-w-2xl mx-auto mt-5">
              The problem with single-model AI is that it’s a dead end. It can
              generate text, but it can’t challenge itself. It can analyze data,
              but it can’t question its own assumptions. It’s a powerful tool,
              but it’s not a strategic partner.
            </p>
          </div>

          <div>
            <p className="text-lg font-bold max-w-2xl mx-auto mt-3">
              Benjamin Chidera
            </p>
            <p className="text-sm font-semibold text-[#7F0DF2] max-w-2xl mx-auto mt-3 ">
              CEO, Brainstorming Agents
            </p>
          </div>
        </div>

        <div
          className="w-[604px] h-[550px] bg-cover bg-center bg-no-repeat rounded-3xl"
          style={{ backgroundImage: "url('/ben.jpeg')" }}
        ></div>
      </section>
    </main>
  );
};
