export default function Stakeholders() {
  return (
    <>
      <div className="flex  flex-col px-4">
        <h1 className="text-3xl font-black pt-8">
          Theory of Change for Contributors
        </h1>
        <div className="w-full my-8 border-t border-gray-400" />
        <h1 className="text-2xl py-2 pt-4 font-black"> Stakeholders ✨:</h1>
        <p className="text-justify">
          Any individual, company, project or group of individuals that actively{" "}
          <strong>builds on the Superchain</strong>, contributes{" "}
          <strong>
            infrastructure, tooling, education, research, or liquidity
          </strong>
          , or otherwise advances the <strong>Season 7 Intent</strong> of
          driving <strong>Interop adoption and ecosystem coordination</strong>.
        </p>
        <div className="px-4 pt-2">
          <li className="sm:py-2">
            <strong> Onchain Builders:</strong> Contribute to creation of
            projects that drive onchain usage of Superchain blockspace;
            evaluated based on measurable impact and ecosystem alignment.
          </li>
          <li className="sm:py-2">
            <strong>Open Source Builders & Researchers:</strong> Create or
            maintain public goods (e.g., SDKs, dashboards, technical guides,
            experiments) that unlock shared value across multiple OP Chains.
          </li>
          <li className="sm:py-2">
            <strong> Interop Integrators:</strong> Deploy standards like
            ERC-7683/7802 or tools like paymasters and bridge relayers; test and
            refine on Superchain testnets.
          </li>
          <li className="sm:py-2">
            <strong>DAO Contributors:</strong> Provide support and management of
            new experiments, grantees and enable contribution between
            Stakholders unlocking a more efficient and functioning Collective.
          </li>
          <li className="sm:py-2">
            <strong>Analytics Builders:</strong> Develop Interop-relevant
            dashboards that enable tracking of health and growth metrics,
            contribute to the curation and cleaning of relevant data.
          </li>
        </div>
      </div>
      <div className="w-full my-8 border-t border-gray-400" />
    </>
  );
}
