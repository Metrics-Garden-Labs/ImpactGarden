import Image from "next/image";
import { FaRegArrowAltCircleRight } from "react-icons/fa";

export default function SmartImage() {
  return (
    <>
      <div className=" h-64 mt-8 sm:h-80 rounded-xl lg:h-auto w-full overflow-hidden max-h-screen">
        <Image
          src="/smart.gif"
          alt="background"
          width={1920}
          height={1080}
          className="object-contain w-full h-auto"
          priority
        />
      </div>
      <div className="p-4">
        <h1 className="text-xl font-black py-4">
          🏗️ An Actionable Theory of Change:
        </h1>
        <p className="text-white">
          This <strong> SMART</strong> (Specific, Measurable, Achievable,
          Relevant, Time-bound) <strong>Theory of Change</strong> outlines the
          path from your contributions to ecosystem-wide impact for{" "}
          <strong>Optimism Season 7’s Interoperability Intent</strong> It is
          designed to help <strong> contributors like you </strong>
          understand what the Collective is working toward, how progress is
          measured, and how to shape your work so that it's{" "}
          <strong>
            recognized, adopted, and rewarded especially in Retro Funding and
            Mission evaluations.
          </strong>
        </p>
        <br />
        <p>
          Each column in the table breaks down the logical steps needed to reach
          that goal, helping you identify where projects fit in, where gaps
          exist, and how to track progress throughout the Season.
        </p>
      </div>
      <div className="w-full my-8 border-t border-gray-400" />
    </>
  );
}
