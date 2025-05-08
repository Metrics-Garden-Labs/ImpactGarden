import Image from "next/image";
import Link from "next/link";
import { AiOutlineArrowRight } from "react-icons/ai";

export default function CategoryBox() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="flex flex-wrap justify-center w-full gap-8 px-4">
        <CategoryCard
          imageURL="/op_stack.png"
          description="🔴 OP Stack"
          href="/impact-framework/op-stack"
        />
        <CategoryCard
          imageURL="/collective_governance.png"
          description="⚖️ Collective Governance"
          href="/impact-framework/collective-governance"
        />
        <CategoryCard
          imageURL="/developer_ecosystem.png"
          description="🖥️ Developer Ecosystem"
          href="/impact-framework/developer-ecosystem"
        />
        <CategoryCard
          imageURL="/ux_adoption.png"
          description="💃🏽 End UX and Adoption"
          href="/impact-framework/ux-adoption"
        />
      </div>
    </div>
  );
}

function CategoryCard({
  imageURL,
  description,
  href,
}: {
  imageURL: string;
  description: string;
  href: string;
}): JSX.Element {
  return (
    <Link
      href={href}
      target="_blank"
	  className="w-full max-w-[16rem] sm:max-w-[14rem] md:max-w-[16rem] transition-transform duration-300 ease-in-out hover:scale-[1.03] hover:shadow-xl hover:ring-1 hover:ring-neutral-300 rounded-lg cursor-pointer"    >
      <article className="flex flex-col transition border rounded-lg overflow-hidden border-black hover:shadow-lg cursor-pointer">
        <div className="relative w-full h-48">
          <Image
            src={imageURL}
            alt={description}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex items-center justify-center gap-2 py-4 px-3 text-sm bg-nation text-center">
          <span>{description}</span>
          <AiOutlineArrowRight size={16} />
        </div>
      </article>
    </Link>
  );
}
