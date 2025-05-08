import ItemsRisks from "./ItemsRisks";

export default function Risks() {
  return (
    <>
      <div className="px-4">
        <h1 className="text-2xl  pt-8 font-black">
          {" "}
          ⚠️ Risks to keep in mind:
        </h1>
        <p className="py-4">
          There are multiple risks funders must be aware of as they select the
          intiatives and projects to fund based on the limitations of this
          intent.
        </p>
        <ItemsRisks
          number="1"
          item="Technical Delivery:"
          description="The Interop infra could be delayed or underperfom in production which can lead to projects stalling. Funding projects that take a modular approach to building, have a multi-chain GTM strategy or demonstrate fallback options would be beneficial to the Collective. "
          vocal="a"
        />
        <ItemsRisks
          number="2"
          item="Adoption Risk:"
          description="OP Chains may choose not to adopt or prioritize the deployment/usage of Interop. Additionally, teams building on those chains may choose not to leverage it in their builds. Funding that prioritizes ecosystem partnerships, engagement from protocols active in multiple chains, and educational resources on how to build with Interop for end user benefits can reduce adoption risk."
          vocal="a"
        />
        <ItemsRisks
          number="3"
          item="Liquidity Activation Risk:"
          description="Insufficient incentives or market dynamics can lead to a lack of meaningful movement of assets across chains and failure of meeting $250M/month transacted. Identifying funding opportunities that both contribute to use-cases where Interop is beneficial AND ensuring there are liquidity programs to maintain the flow of funds should be considered."
          vocal="a"
        />
        <ItemsRisks
          number="4"
          item="Measurement + Attribution Risk:"
          description="Early-stage usage (testnet) doesn’t always translate into meaningful impact into production or long-term sustainability. It is desirable to identify and segment the type of rewards in stages based on how they contribute at each stage in the testing, adoption, and scaled usage of Interop. Where if later phases are considered more meaningful, more funds should be directed there. "
          vocal="a"
        />
        <ItemsRisks
          number="5"
          item="Governance Coordination Risk:"
          description="The Collective has multiple Stakeholders enabled to fund initiatives if communication between these parts, and technical teams at the forefront of Interop is not streamlined confusion may arise leading to inconsistencies in funding priorities and redundancy of funded efforts. Encouraging and rewarding projects or initiatives from teams that help align actors can lead to a more efficient use of funds. "
          vocal="a"
        />
      </div>
	  <div className="w-full my-8 border-t border-gray-400" />
    </>
  );
}
