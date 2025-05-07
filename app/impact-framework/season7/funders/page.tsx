import Head from "@/app/impact-framework/season7/funders/Head";
import Stakeholders from "./Stakeholders";
import Definition from "./Definition";
import Risks from "./Risks";
import SmartImage from "./SmartImage";
import Table from "./Table";
import ForFunders from "./ForFunders";
import Sources from "./Sources";

export default function Home() {
  return (
    <>
      <div className="bg-notion  sm:p-16">
        <Head />
        <Stakeholders />
        <Definition />
        <Risks />
		<SmartImage	/>
		<Table />
		<ForFunders	/>
		<Sources />
      </div>
    </>
  );
}
