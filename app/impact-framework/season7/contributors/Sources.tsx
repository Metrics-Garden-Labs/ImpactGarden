// components/Link.tsx
import Link from "next/link";

type Props = {
  emoji: string;
  text: string;
  href: string;
};

export default function Sources() {
  return (
	<>
	<h1 className="text-xl font-black py-4">⛳ Sources for a data-driven successful evaluation of funding strategies pursued during S7</h1>
	  <Links
		emoji={"⚪️"}
		text="Superchain: App / Contract Growth Dashboard "
		href="https://app.hex.tech/61bffa12-d60b-484c-80b9-14265e268538/app/cd3f1525-08f0-4a49-a15a-b72f46f2a0d8/latest?tab=app-growth-data-table"
	  />
	  <Links
		emoji={"⚪️"}
		text="Superchain Fee Sources Dashboard"
		href="https://app.hex.tech/61bffa12-d60b-484c-80b9-14265e268538/app/cd3f1525-08f0-4a49-a15a-b72f46f2a0d8/latest?tab=fee-sources"
	  />
	  <Links
		emoji={"⚪️"}
		text="Superchain Health Dashboard"
		href="https://docs.google.com/spreadsheets/d/1f-uIW_PzlGQ_XFAmsf9FYiUf0N9l_nePwDVrw0D5MXY/edit?gid=584971628#gid=584971628"
	  />
	   <Links
		emoji={"⚪️"}
		text="Build interoperable apps on Superchain devnet"
		href="https://docs.optimism.io/interop/get-started"
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
