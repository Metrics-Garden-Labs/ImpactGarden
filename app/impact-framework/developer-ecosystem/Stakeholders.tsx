export default function Stakeholders() {
  return (
    <>
      <div className="flex  flex-col">
        <h1 className="text-2xl py-2 pt-8 font-black"> Stakeholders</h1>
        <h2 className="text-xl font-bold pb-2">
          ✨Audiences benefitting from this impact✨:
        </h2>
        <div className="px-4">
          <li>OP Chains (Mainnet, Zora, Base, PGN)</li>
          <li>
            Non-coders developing the ecosystem (Product, Design, BD, Marketing,
            Researchers, etc)
          </li>
          <li>
            Developers: Application, Front-end, Smart contract, Game, Artists.{" "}
          </li>
        </div>
        <h2 className="text-xl font-bold pt-4">
          🤝Audiences enabling this impact 🤝:
        </h2>
        <div className="px-4 pb-4">
          <li>
            Infrastructure providers: Nodes, Bridges, Oracles, Block Explorers
          </li>
          <li>
            Dev tooling providers: libraries, frameworks, smart contract
            tooling, SDKs, APIs, Account Abstraction tools, testing and
            deployment tools
          </li>
          <li>
            Discovery sources: Content generators, Researchers, Developer
            documentation generators and up keepers
          </li>
          <li>Funders: VCs, Grants programs, RetroPGF</li>
          <li>
            Dev Support providers: TechNERDs, OP Chain teams, Infrastructure
            providers, etc
          </li>
          <li>Educators: Hackathons, tooling, tutorials, bootcamps</li>
        </div>
      </div>
    </>
  );
}
