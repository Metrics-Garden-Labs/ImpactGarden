import Image from "next/image";

export default function Mision() {
  return (
    <>
      <div className="relative h-64 sm:h-80 lg:h-auto w-full overflow-hidden rounded-xl max-h-screen">
        <Image
          src="/season7_head.png"
          alt="background"
          width={1920}
          height={1080}
          className="object-cover size-full max-h-screen"
          priority
        />

        <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 px-4 w-full max-w-8xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 w-full">
            <div className="  grow py-6 rounded-md w-full max-w-full">
              <h1 className="text-white text-3xl sm:text-5xl md:text-6xl font-black leading-tight">
                These are two perspectives that feed into the same Mission{" "}!
              </h1>
            </div>
            <div className=" p-2 sm:p-4 rounded-md shrink-0">
              <Image
                src="/othersun.svg"
                alt="sun"
                width={0}
                height={0}
                className="w-32 sm:w-48 md:w-64 h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
