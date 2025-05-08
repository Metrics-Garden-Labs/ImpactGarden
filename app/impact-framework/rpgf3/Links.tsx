// components/Link.tsx
import Link from "next/link";

type Props = {
  emoji: string;
  text: string;
  href: string;
};

export default function NotionLinks() {
  return (
    <>
      <Links
        emoji={"🍃"}
        text="Metrics Garden"
        href="https://plaid-cement-e44.notion.site/a60768062a2e4e5f8b4ea787e73d38b5?v=468228b4f651454aaf4296934a8a18bd"
      />
      <Links
        emoji={"💡"}
        text="RetroPGF3 Impact Categories"
        href="https://plaid-cement-e44.notion.site/5c71874e95714507bce3a636d15987c2?v=ddf95902639d4423a3d5b879bc9a659a&pvs=25"
      />
      <Links
        emoji={"🔴"}
        text="OP Stack subcategories - workshops"
        href="https://plaid-cement-e44.notion.site/OP-Stack-subcategories-workshops-32c2021d06c0451e8af752f9388e4c1d"
      />
      <Links
        emoji={"⚖️"}
        text="Collective Governance subcategories - workshops"
        href="https://plaid-cement-e44.notion.site/Collective-Governance-subcategories-workshops-bcb5d1540feb4017a3b0965c712e6348"
      />
      <Links
        emoji={"💻"}
        text="Developer Ecosystem subcategories - workshops"
        href="https://plaid-cement-e44.notion.site/Developer-Ecosystem-subcategories-workshops-5d8b48b07f794e94819458578402df0b"
      />
    </>
  );
}

function Links({ emoji, text, href }: Props) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-1 rounded-md text-base font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
    >
      <span className="text-xl">{emoji}</span>
      <span className="underline underline-offset-4 decoration-zinc-500 decoration-1 ">
        {text}
      </span>
    </Link>
  );
}
