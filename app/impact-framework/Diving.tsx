import Image from "next/image";
import { FaRegArrowAltCircleRight } from "react-icons/fa";

export default function Diving() {
  return (
    <div className="relative h-64 mt-8 sm:h-80 lg:h-auto w-full overflow-hidden max-h-screen">
      <Image
        src="/bg-retropgf2.png"
        alt="background"
        width={1920}
        height={1080}
        className="object-cover size-full max-h-screen"
        priority
      />
      <div className="absolute top-4 sm:top-10 left-4 md:left-12 lg:left-24 z-10">
        <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold">
          RetroPGF3
        </h1>
        <div className="w-8 bg-white h-[2px] my-2" />
      </div>
      <div className="absolute w-full sm:top-1/2  z-0 flex flex-col top-20  sm:-translate-y-1/2 px-4 sm:px-8">
        <div className="flex flex-row justify-center sm:gap-8 w-full gap-4">
          <Image
            src="/retropgf_sun.svg"
            alt="sun"
            width={0}
            height={0}
            className="w-16  md:w-32 h-auto mb-4 sm:mb-0"
          />

          <Image
            src="/othersun.svg"
            alt="sun"
            width={0}
            height={0}
            className="w-16  md:w-32 h-auto mb-4 sm:mb-0"
          />

          <Image
            src="/bluesun.svg"
            alt="sun"
            width={0}
            height={0}
            className="w-16  md:w-32 h-auto mb-4 sm:mb-0"
          />

          <Image
            src="/yellowsun.svg"
            alt="sun"
            width={0}
            height={0}
            className="w-16  md:w-32 h-auto mb-4 sm:mb-0"
          />
        </div>
		<h1 className="text-white whitespace-nowrap text-xl sm:text-2xl md:text-4xl mt-4 text-center font-bold leading-none">
		Let's dive in!
        </h1>
      </div>
      <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-20 z-20">
        <h1 className="text-white text-sm sm:text-xl md:text-2xl font-black text-right">
          Impact = Profit
        </h1>
      </div>
    </div>
  );
}
