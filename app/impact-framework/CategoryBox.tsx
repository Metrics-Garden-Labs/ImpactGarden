import Image from "next/image";
import Link from "next/link";
import { AiOutlineArrowRight } from "react-icons/ai";

export default function CategoryBox() {
  return (
    <>
      <div className="flex flex-col items-center justify-center pb-8">
        <div className="flex flex-row flex-wrap items-center justify-center w-full gap-12">
          <CategoryCard
            imageURL="/op_stack.png"
            description=" 🔴 OP Stack"
            href="/impact-framework/op-stack"
          />
          <CategoryCard
            imageURL="/collective_governance.png"
            description=" ⚖️ Collective Governance"
            href="/impact-framework/collective-governance"
          />
          <CategoryCard
            imageURL="/developer_ecosystem.png"
            description=" 🖥️ Developer Ecosystem"
            href="/impact-framework/developer-ecosystem"
          />

          <CategoryCard
            imageURL="/ux_adoption.png"
            description=" 💃🏽 End UX and Adoption"
            href="/impact-framework/ux-adoption"
          />
        </div>
      </div>
    </>
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
    <article className="flex flex-col w-full max-w-[16rem] mt-8 transition  border rounded-lg overflow-hidden border-black hover:shadow-m sm: ">
      <div className="relative w-full h-[12rem] ">
        <Image
          className="object-cover w-full h-full rounded-b-none"
          fill
          src={imageURL}
          alt=""
        />
      </div>

      <div className="py-4 bg-nation">
        <div className="scale-150">
          <Link
            href={href}
            target="_blank"
            className="flex flex-row items-center justify-center gap-3 px-6 py-1 -mb-2 text-xs transition scale-75 hover:underline"
          >
            {description}
            <AiOutlineArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
