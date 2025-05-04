export default function Stakeholders() {
  return (
    <>
      <div className="flex  flex-col">
        <h1 className="text-2xl py-2 pt-8 font-black"> Stakeholders</h1>
        <h2 className="text-xl font-bold pb-2">
          ✨Audiences benefitting from this impact✨:
        </h2>
        <div className="px-4">
          <li>Delegates, including Council members.</li>
          <li>Badgeholders</li>
          <li>OP Chains governed by the Collective </li>
          <li>Projects that interact with Governance, Grants, RetroPGF. </li>
        </div>
        <h2 className="text-xl font-bold pt-4">
          🤝Audiences enabling this impact 🤝:
        </h2>
        <div className="px-4 pb-4">
          <li>
            Contributors to Governance: design, infrastructure, operation,
            awareness, and many more!
          </li>
        </div>
      </div>
    </>
  );
}
