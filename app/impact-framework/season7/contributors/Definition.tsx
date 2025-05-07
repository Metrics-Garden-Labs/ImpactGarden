export default function Definition() {
  return (
    <>
      <div className="flex flex-col px-4 gap-1 py-2">
        <h1 className="text-2xl  py-2 font-black">
          {" "}
          How does the Strategic Intent translate for these Stakeholders?
        </h1>
        <div className="  text-zinc-300 bg-zinc-800 p-4 flex flex-row items-center rounded-xl justify-center gap-4">
          <p className="tex-7xl"> 👷🏽</p>
          <span className="gap-2 py-3 rounded-md text-base font-medium ">
            Interop is not yet live — but your work now determines how
            successful the Collective will be when it is.
            <p className="py-1">
              As a contributor, your role is to help prepare the Superchain for
              Interop adoption by building tools, infrastructure, education, or
              liquidity systems that enable
              <strong> $250M/month in cross-chain asset transfers </strong>by
              the end of Season 7.
            </p>
            <p className="py-1">
              Every line of code, guide, integration, and deployment you ship
              moves the Collective closer to scalable, trust-minimized
              coordination across OP Chains!
            </p>
          </span>
        </div>
      </div>
    </>
  );
}
