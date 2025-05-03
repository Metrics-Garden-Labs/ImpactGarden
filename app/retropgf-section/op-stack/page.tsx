import Definition from "./Definition";
import MetricsTable from "./MetricsTable";
import RelevantTerms from "./RelevantTerms";
import Stakeholders from "./Stakeholders";
import Head from "./Head";

export default function OpStack() {
  return (
    <>
      <div className="p-16 bg-notion ">
		<Head />
        <Definition />
        <Stakeholders />
        <RelevantTerms />
		<MetricsTable />
      </div>
    </>
  );
}
