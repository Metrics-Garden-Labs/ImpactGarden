import Image from "next/image";

export default function Head() {
  return (
    <div className="relative w-full h-[200px] rounded-lg overflow-hidden shadow-lg">
      <Image
        src="/collective_governance.png"
        alt="op stack"
        fill
        className="object-cover"
      />
    </div>
  );
}
