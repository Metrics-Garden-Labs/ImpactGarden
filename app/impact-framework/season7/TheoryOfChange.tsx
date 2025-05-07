import Image from "next/image";
import { FaRegArrowAltCircleRight } from "react-icons/fa";

export default function TheoryOfChange() {
  return (
    <>
      <div className=" h-64 mt-8 sm:h-80 rounded-xl lg:h-auto w-full overflow-hidden max-h-screen">
        <Image
          src="/theoryofchange.gif"
          alt="background"
          width={1920}
          height={1080}
          className="object-contain w-full h-auto"
          priority
        />
      </div>
      <div className="p-4">
        <p className="text-white">
          For <strong>Optimism Season 7</strong>, this Theory of Change focuses
          on achieving the Collective's Intent:{" "}
          <span className="relative inline-block underline underline-offset-4">
            A set of interoperable Stage 1 chains doing $250m per month in
            cross-chain asset transfers
          </span>
          . Using the Theory of Change framework helps funders, builders, and
          the broader community align on what matters, identify high-leverage
          opportunities, and evaluate what meaningful progress to completing
          this intent looks like.
        </p>
      </div>
      <div className="w-full my-8 border-t border-gray-400" />
    </>
  );
}
