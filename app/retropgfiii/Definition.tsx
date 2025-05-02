import Image from "next/image";
import { FaRegArrowAltCircleRight } from "react-icons/fa";

export default function Definition() {
  return (
    <>
      <div className="relative w-full overflow-hidden max-h-screen">
        <Image
          src="/bg-retropgf2.png"
          alt="background"
          width={1920}
          height={1080}
          className="object-cover w-full h-auto max-h-screen"
          priority
        />
        <div className="absolute top-16 left-4 md:left-12 lg:left-24 z-10">
          <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold">
            RetroPGF3
          </h1>
          <div className="w-8 bg-white h-[2px] my-2" />
          <div className="space-y-2"></div>
        </div>
        <div className="absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-center sm:gap-4">
            <Image
              src="/retropgf_sun.svg"
              alt="sun"
              width={0}
              height={0}
              className="w-24 sm:w-32 md:w-48 h-auto mb-4 sm:mb-00"
            />
            <Image
              src="/arrow.svg"
              alt="sun"
              width={0}
              height={0}
              className="w-24 sm:w-64 h-auto mb-4 sm:mb-0 rotate-180"
            />
              <Image
                src="/othersun.svg"
                alt="sun"
                width={0}
                height={0}
              className="w-24 sm:w-32 md:w-48 h-auto mb-4 sm:mb-00 shrink-0"
              />
          </div>
          <h1 className="text-white text-xl sm:text-2xl mt-8 md:text-4xl text-center font-bold leading-none">
            Broad definition to specific scope
          </h1>
        </div>
      </div>
    </>
  );
}
