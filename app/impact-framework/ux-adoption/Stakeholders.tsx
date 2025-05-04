export default function Stakeholders() {
  return (
    <>
      <div className="flex  flex-col px-4">
        <h1 className="text-2xl py-2 pt-8 font-black"> Stakeholders</h1>
        <h2 className="text-xl font-bold pb-2">
          ✨Audiences benefitting from this impact✨:
        </h2>
        <div className="px-4">
          <li>Consumers</li>
        </div>
        <h2 className="text-xl font-bold pt-4">
          🤝Audiences enabling this impact 🤝:
        </h2>
        <div className="px-4 pb-4">
          <li>OP Chains</li>
          <li>
            End User Infrastructure providers: Wallets, Stablecoins, On-ramp
            rails, UX Researchers, Front-end frameworks and integrations
          </li>
          <li>
            Discovery sources: Onboarding content generators, Consumer-centric
            documentation.
          </li>
          <li>
            Consumer Support providers: Ambassadors, Optimism Community members,
            Optimism Advocates
          </li>
          <li>
            Consumer facing products: Bridges, DeFi, NFT platforms, Gaming
            platforms, etc.
          </li>
        </div>
      </div>
    </>
  );
}
