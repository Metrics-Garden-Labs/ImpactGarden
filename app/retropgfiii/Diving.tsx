import Image from "next/image";
import { FaRegArrowAltCircleRight } from "react-icons/fa";

export default function Diving() {
  return (
	<div className="relative w-full overflow-hidden max-h-screen">
	  <Image
		src="/bgretropgfiii.png"
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
		 
	  </div>
	  <div className="absolute top-1/2 left-1/2 z-0 flex flex-row -translate-x-1/2 -translate-y-1/2 px-4 sm:px-8">
		<div className="flex flex-col sm:flex-row items-center sm:items-start sm:gap-16">
		  <Image
			src="/retropgf_sun.svg"
			alt="sun"
			width={0}
			height={0}
			className="w-24 sm:w-32 md:w-48 h-auto mb-4 sm:mb-0"
		  />
		 
		</div>
		<div className="flex flex-col sm:flex-row items-center sm:items-start sm:gap-16">
		  <Image
			src="/othersun.svg"
			alt="sun"
			width={0}
			height={0}
			className="w-24 sm:w-32 md:w-48 h-auto mb-4 sm:mb-0"
		  />
		 
		</div>
		<div className="flex flex-col sm:flex-row items-center sm:items-start sm:gap-16">
		  <Image
			src="/bluesun.svg"
			alt="sun"
			width={0}
			height={0}
			className="w-24 sm:w-32 md:w-48 h-auto mb-4 sm:mb-0"
		  />
		 
		</div>
		<div className="flex flex-col sm:flex-row items-center sm:items-start sm:gap-16">
		  <Image
			src="/yellowsun.svg"
			alt="sun"
			width={0}
			height={0}
			className="w-24 sm:w-32 md:w-48 h-auto mb-4 sm:mb-0"
		  />
		 
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
