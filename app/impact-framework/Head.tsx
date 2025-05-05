import Image from "next/image";
import { FaRegArrowAltCircleRight } from "react-icons/fa";

export default function Head() {
  return (
    <div className="relative h-64 sm:h-80 lg:h-auto w-full overflow-hidden max-h-screen">
      <Image
        src="/bgretropgfiii.png"
        alt="background"
        width={1920}
        height={1080}
        className="object-cover size-full max-h-screen"
        priority
      />
      <div className="absolute sm:top-10 top-4 left-4 md:left-12 lg:left-24 z-10">
        <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold">
          RetroPGF3
        </h1>
        <div className="w-8 bg-white h-[2px] my-2" />
        <div className="space-y-2">
          {["Define", "Who", "How", "Evaluate!"].map((word, idx) => (
            <div
              key={idx}
              className="flex items-center text-white text-base sm:text-lg md:text-xl"
            >
              <FaRegArrowAltCircleRight className="mr-2 text-lg sm:text-xl" />
              <p>{word}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:gap-16">
          <Image
            src="/retropgf_sun.svg"
            alt="sun"
            width={0}
            height={0}
            className="w-24 sm:w-32 md:w-48 h-auto mb-4 sm:mb-0"
          />
          <div className="text-center sm:text-left">
            <h1 className="text-white text-2xl  md:text-5xl pl-10 font-black leading-none">
              Impact
            </h1>
            <h1 className="text-white text-2xl sm:text-4xl md:text-7xl font-black leading-none">
              Evaluation
            </h1>
            <h1 className="text-white text-2xl  md:text-5xl pl-32 font-black leading-none">
              Framework
            </h1>
          </div>
        </div>
      </div>
      <div className="absolute top-6 right-6 sm:top-10 sm:right-10 md:top-16 md:right-24 z-20">
        <h1 className="text-white text-sm sm:text-xl md:text-2xl font-black text-right">
          Impact = Profit
        </h1>
      </div>
    </div>
  );
}
