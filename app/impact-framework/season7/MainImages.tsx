import Image from "next/image";
import Link from "next/link";

export default function MainImages() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 justify-items-center gap-8 sm:gap-4 p-4 sm:px-48 py-16">
      <Link
        href="/impact-framework/season7/funders"
        passHref
        className="relative group cursor-pointer"
      >
        <Image
          src="/Funders.png"
          alt="Funders"
          width={500}
          height={280}
          className="object-cover w-full h-auto rounded-md transition-transform duration-300 group-hover:scale-105"
          priority
        />
      </Link>
      <Link
        href="/impact-framework/season7/contributors"
        passHref
        className="relative group cursor-pointer"
      >
        <Image
          src="/Builders.png"
          alt="Builders"
          width={500}
          height={280}
          className="object-cover w-full h-auto rounded-md transition-transform duration-300 group-hover:scale-105"
          priority
        />
      </Link>
    </div>
  );
}
