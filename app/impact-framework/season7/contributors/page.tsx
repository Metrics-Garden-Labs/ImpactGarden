import Stakeholders from "./Stakeholders";
import Head from "./Head";
import Definition from "./Definition";
import Risks from "./Risks";
import SmartImage from "./SmartImage";
import Table from "./Table";
import ForContributors from "./ForContributors";
import Sources from "./Sources";

export default function Home() {
  return (
    <>
      <div className="bg-notion  sm:p-16">
        <Head />
        <Stakeholders />
        <Definition />
        <Risks />
        <SmartImage />
		<Table />
		<ForContributors />
		<Sources />
      </div>
    </>
  );
}
