import Image from "next/image";

export default function Categories() {
  return (
    <>
      <h1 className="font-black text-xl sm:text-3xl py-12 px-4">
        In each category you'll find...{" "}
      </h1>
      <div className="relative w-full h-[2000px] overflow-hidden">
        <Image
          src="/bg-retropgf2.png"
          alt="background"
          width={1920}
          height={1080}
          className="object-fill w-full h-[2000px]"
          priority
        />
        <div className="flex flex-col items-center space-y-12 w-full absolute top-1/2 px-24 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative w-full flex flex-row items-center">
            <Image
              src="/first_item.svg"
              alt="first item"
              width={0}
              height={0}
              className="w-5/6 h-auto"
            />
            <h1 className="text-white text-lg sm:text-7xl font-bold text-center">
              What is this + some context
            </h1>
          </div>
          <div className="relative w-full flex flex-row items-center">
            <Image
              src="/second_item.svg"
              alt="second item"
              width={0}
              height={0}
              className="w-5/6 h-auto"
            />
            <h1 className="text-white text-lg sm:text-7xl font-bold text-center">
              Impact who?
            </h1>
          </div>
          <div className="relative w-full flex flex-row items-center">
            <Image
              src="/third_item.svg"
              alt="third item"
              width={0}
              height={0}
              className="w-5/6 h-auto"
            />
            <h1 className="text-white text-lg sm:text-7xl font-bold text-center">
              Important terms in the category
            </h1>
          </div>
          <div className="relative w-full flex flex-row items-center">
            <Image
              src="/four_item.svg"
              alt="four item"
              width={0}
              height={0}
              className="w-5/6 h-auto"
            />
            <h1 className="text-white text-lg sm:text-7xl font-bold ">
              What
              <br />
              How can I think about it?
              <br />
              The data
            </h1>
          </div>
          <div className="relative w-full flex flex-row items-center gap-16">
            <Image
              src="/five_item.svg"
              alt="four item"
              width={0}
              height={0}
              className="w-1/2 h-auto"
            />
            <div className="flex items-center justify-center flex-col">
              <Image
                src="/othersun.svg"
                alt="sun"
                width={0}
                height={0}
                className="w-32 h-auto mb-4 sm:mb-0"
              />
              <h1 className="text-white  text-lg sm:text-7xl font-bold ">
                I want moar!
                <br />
                (metrics)
              </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
