import Image from "next/image";

const items = [
  {
    src: "/first_item.svg",
    alt: "first item",
    text: "What is this + some context",
  },
  {
    src: "/second_item.svg",
    alt: "second item",
    text: "Impact who?",
  },
  {
    src: "/third_item.svg",
    alt: "third item",
    text: "Important terms in the category",
  },
  {
    src: "/four_item.svg",
    alt: "fourth item",
    text: `What\nHow can I think about it?\nThe data`,
  },
];

export default function Categories() {
  return (
    <>
      <h1 className="font-black text-xl sm:text-3xl py-12 px-4">
        In each category you'll find...
      </h1>

      <div
        style={{ backgroundImage: `url('/bg-retropgf2.png')` }}
        className="bg-center bg-repeat-y w-full py-2 overflow-hidden"
      >
        <div className="flex flex-col items-center w-full py-16 px-4 sm:px-12 xl:px-32 space-y-32">
          {items.map(({ src, alt, text }, index) => (
            <div
              key={index}
              className="flex flex-col lg:flex-row items-center gap-12 w-full"
            >
              <div className="w-full lg:w-2/3">
                <Image
                  src={src}
                  alt={alt}
                  width={2000}
                  height={1200}
                  className="w-full h-auto object-contain"
                />
              </div>
              <h1 className="flex-1 text-white text-center lg:text-left text-lg sm:text-4xl lg:text-6xl font-bold whitespace-pre-line">
                {text}
              </h1>
            </div>
          ))}

          {/* Último bloque especial */}
          <div className="flex flex-col lg:flex-row items-center gap-12 w-full">
            <div className="w-full lg:w-2/3">
              <Image
                src="/five_item.svg"
                alt="fifth item"
                width={2000}
                height={1200}
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="flex flex-col items-center lg:items-start gap-6 flex-1">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                <Image
                  src="/othersun.svg"
                  alt="sun"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-white text-center lg:text-left text-lg sm:text-4xl lg:text-6xl font-bold">
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
