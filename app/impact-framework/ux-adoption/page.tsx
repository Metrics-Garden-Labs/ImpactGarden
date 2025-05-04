import Definition from "./Definition";
import Stakeholders from "./Stakeholders";
import Head from "./Head";
import RelevantTerms from "./RelevantTerms";
import MetricsTable from "./MetricsTable";

export default function UxAdoption() {
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
