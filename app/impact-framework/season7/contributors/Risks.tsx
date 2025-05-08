import ItemsRisks from "../funders/ItemsRisks";

export default function Risks() {
  return (
    <>
      <div className="px-4">
        <h1 className="text-2xl  pt-8 font-black">
          {" "}
          ⚠️ Risks to keep in mind:
        </h1>
        <p className="py-4">
          Season 7’s Intent is ambitious and still unfolding — and so is the
          risk landscape. Being aware of these risks helps you{" "}
          <strong>
            design and plan for contributions that are fundable, resilient, and
            high-impact
          </strong>
          , even if Interop isn’t live in production yet.
        </p>
        <ItemsRisks
          number="1"
          item="Lack of Attribution or Visibility:"
          description="There is a lot going in the Superchain ecosystem, if you’re building a new project or deploying new contracts make sure to label them accordingly to ensure that they are identified and potentially rewarded as part of the RetroRounds.  "
          vocal="a"
        />
        <ItemsRisks
          number="2"
          item="Dependency on Interop Launch Timing and specs"
          description="Interop is still in test phase, a lack of flexibility could lead for your project to be impacted if the production release is delayed. To prevent this, make sure to stay up to date with the developments of Interop through Github, and Discord, make sure to plan with buffer times and avenues to incorporate changes that may be needed along the way."
          vocal="a"
        />
        <ItemsRisks
          number="3"
          item="Insufficient Ecosystem Engagement:"
          description="Interop is pushing for a more interconnected Superchain Ecosystem where users will be able to seamlessly operate between chains. However, adoption won’t happen overnight, it will require you to understand users needs and that of the ecosystems in which they operate for your contribution to have meaningful engagement. "
          vocal="a"
        />
        <ItemsRisks
          number="4"
          item="Non-alignment with Season Intent:"
          description="Interop is the main goal for the Collective during this Season, projects which do not advance this Intent or consider an interoperable functionality in their design might struggle to obtain funding.  "
          vocal="a"
        />
        <ItemsRisks
          number="5"
          item="Lack of Testnet-to-Mainnet Path:"
          description="While Interop is still in testnet, the goal for its development is to contribute to the long term success of the Optimism Collective. While testnet projects are desirable in validating the readiness for Interop in production, ensure that your project is ready to have a clear path to graduate into production to ensure it is fundable through existing retroactive programs.  "
          vocal="a"
        />
      </div>
      <div className="w-full my-8 border-t border-gray-400" />
    </>
  );
}
