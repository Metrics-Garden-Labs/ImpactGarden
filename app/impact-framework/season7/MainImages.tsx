import Image from "next/image";
import Link from "next/link";

export default function MainImages() {
  return (
    <div className="grid grid-cols-2 justify-center gap-8 sm:p-8 p-4">
      {/* Primer enlace de imagen */}
      <Link
        href="https://example1.com"
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

      {/* Segundo enlace de imagen */}
      <Link
        href="https://example2.com"
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
