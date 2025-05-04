import Head from "./Head";
import Definition from "./Definition";
import Stakeholders from "./Stakeholders";
import RelevantTerms from "./RelevantTerms";
import MetricsTable from "./MetricsTable";

export default function OpStack() {
  return (
    <>
      <div className="sm:p-16 bg-notion ">
        <Head />
		<Definition />
		<Stakeholders />
		<RelevantTerms />
		<MetricsTable />
      </div>
    </>
  );
}
