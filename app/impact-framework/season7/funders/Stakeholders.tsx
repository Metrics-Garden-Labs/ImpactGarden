export default function Stakeholders() {
  return (
    <>
      <div className="flex  flex-col px-4">
        <h1 className="text-3xl font-black pt-8">
          Theory of Change for Funders
        </h1>
        <div className="w-full my-8 border-t border-gray-400" />
        <h1 className="text-2xl py-2 pt-4 font-black"> Stakeholders ✨:</h1>
        Any individual or group of individuals who is in the position to
        allocate funding from the Collective to an initiative, project or set of
        projects tasked with delivering results towards the intent.
        <div className="px-4 pt-2">
          <li className="sm:py-2">
            Citizens: Endorsement of proposed{" "}
            <span className="italic">
              RetroFunding Missions and Algorithm selection{" "}
            </span>{" "}
            for reward allocation.{" "}
          </li>
          <li className="sm:py-2">
            Grants Council:
            <span className="italic"> Selection of projects </span>to receive
            funding in each season in accordance to the Seasonal Intent.{" "}
          </li>
          <li className="sm:py-2">
            Delegates: Vote to approve{" "}
            <span className="italic">
              {" "}
              allocation of funding to initiatives
            </span>{" "}
            such as Futarchy or the Grants Council.{" "}
          </li>
          <li className="sm:py-2">
            Broader Optimism Collective: Participation in allocating funding to
            projects in <span className="italic">experiments</span> such as the
            Futarchy experiment.{" "}
          </li>
        </div>
        Another group that benefits from this view, similar to the stakeholders
        above but that is not in charge of allocating funding, is the Milestones
        and Metrics Council in charge of evaluating the benefit generated to the
        Optimism Collective by any contributor.
      </div>

      <div className="w-full my-8 border-t border-gray-400" />
    </>
  );
}
