import Image from "next/image";

export default function Categories() {
  return (
    <>
      <h1 className="font-black text-xl sm:text-3xl py-12 px-4">
        In each category you'll find...{" "}
      </h1>
      <div
        style={{
          backgroundImage: `url('/bg-retropgf2.png')`,
        }}
        className="relative bg-center  bg-repeat-y  w-full py-2 overflow-hidden"
      >
        <div className="flex flex-col items-center space-y-12 w-full py-16 px-2 sm:px-24 ">
          <div className="relative w-full flex flex-row items-center">
            <Image
              src="/first_item.svg"
              alt="first item"
              width={0}
              height={0}
              className="w-full h-auto"
            />
            <h1 className="text-white text-lg sm:text-4xl lg:text-7xl font-bold ">
              What is this + some context
            </h1>
          </div>
          <div className="relative w-full flex flex-row items-center">
            <Image
              src="/second_item.svg"
              alt="second item"
              width={0}
              height={0}
              className="w-full h-auto"
            />
            <h1 className="text-white text-lg sm:text-4xl lg:text-7xl font-bold ">
              Impact who?
            </h1>
          </div>
          <div className="relative w-full flex flex-row items-center">
            <Image
              src="/third_item.svg"
              alt="third item"
              width={0}
              height={0}
              className="w-full h-auto"
            />
            <h1 className="text-white text-lg sm:text-4xl lg:text-7xl font-bold ">
              Important terms in the category
            </h1>
          </div>
          <div className="relative w-full flex flex-row items-center">
            <Image
              src="/four_item.svg"
              alt="four item"
              width={0}
              height={0}
              className="w-full h-auto"
            />
            <h1 className="text-white text-lg sm:text-4xl lg:text-7xl font-bold ">
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
              className="w-full h-auto"
            />
            <div className="flex items-center justify-center flex-col">
              <Image
                src="/othersun.svg"
                alt="sun"
                width={0}
                height={0}
                className="w-32 h-auto mb-4 sm:mb-0"
              />
              <h1 className="text-white text-lg sm:text-4xl lg:text-7xl font-bold ">
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
