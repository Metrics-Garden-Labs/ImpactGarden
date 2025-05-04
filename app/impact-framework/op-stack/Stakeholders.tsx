export default function Stakeholders() {
  return (
    <>
      <div className="flex  flex-col px-4">
        <h1 className="text-2xl py-2 pt-8 font-black"> Stakeholders</h1>
        <h2 className="text-xl font-bold pb-2">
          ✨Audiences benefitting from this impact✨:
        </h2>
        <div className="px-4">
          <li>OP Mainnet and other OP Chains (Zora, Base, PGN)</li>
          <li>
            Core Development Teams (OP labs, Test in Prod, Base) and OP Stack
            contributors (and hackers){" "}
          </li>
        </div>
        <h2 className="text-xl font-bold py-8">
          🤝Audiences enabling this impact 🤝:
        </h2>
        <h2 className="text-xl font-bold underline underline-offset-4">
          Creation:
        </h2>
        <div className="px-4">
          <li>
            Creators of code that underpins the OP Stack: Git, Go, Node,
            Foundry, Geth, etc
          </li>
          <li>Code Languages: Solidty, Vyper, Rust, etc</li>
          <li>
            Generation of the base code for the OP Stack: Base, Test in Prod, OP
            Labs, etc
          </li>
          <li>RPC providers: Nethermind, Erigon, Basic, etc</li>
        </div>
        <h2 className="text-xl font-bold underline underline-offset-4 pt-4">
          Operational Maintenance:
        </h2>
        <div className="px-4">
          <li>
            Core Dev Team, Nodes, Sequencers, Clients, Provers, Bug Bounty
            Hunters
          </li>
        </div>
        <h2 className="text-xl font-bold underline underline-offset-4 pt-4">
          Adoption:
        </h2>
        <div className="px-4">
          <li>
            Conduit, Lattice/MUD, OP Stack Documentation editors, OP Stack
            Content/Tutorial creators, TechNERDs
          </li>
          <li>And many more!</li>
        </div>
      </div>
    </>
  );
}
