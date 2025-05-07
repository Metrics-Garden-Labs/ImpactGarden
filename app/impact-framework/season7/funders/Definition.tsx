export default function Definition() {
  return (
    <>
      <div className="flex flex-col px-4 gap-1 py-2">
        <h1 className="text-2xl  py-2 font-black">
          {" "}
          How does the Strategic Intent translate for these Stakeholders?
        </h1>
        <div className="  text-zinc-300 bg-zinc-800 p-4 flex flex-row items-center rounded-xl justify-center gap-4">
          <p className="tex-7xl"> 🎯</p>
          <span className="gap-2 py-3 rounded-md text-base font-medium ">
            We need to prepare the ecosystem to adopt Interop, targeting
            $250M/month in cross-chain asset transfers by end of Season 7. As of
            May 2025, Interop is still in testnet — funders must ensure that
            capital from the Collective drives systemic readiness, infra
            maturity, adoption potential, and ecosystem preparation.
          </span>
        </div>
      </div>
    </>
  );
}
