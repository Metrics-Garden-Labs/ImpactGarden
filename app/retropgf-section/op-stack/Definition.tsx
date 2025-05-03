export default function Definition() {
  return (
    <>
      <div className="flex flex-col  gap-1 py-2">
        <h1 className="text-2xl  py-2 font-black"> 🔴 OP Stack </h1>
        <h2 className="text-xl font-bold pb-2">
          Definition of impact within the category
        </h2>
        <p>
          The The OP Stack is a collection of shared, standardized, high quality
          Open Source Software that easily supports the creation of secure,
          decentralized and censorship resistant L2’s.
          <br />
          The OP Stack is evolving through various stages of technical
          decentralization, thanks to impactful contributions that have enabled
          its creation, maintenance, continuous development, improvements, and
          adoption.
        </p>
        <span className="flex items-center gap-2 py-3 px-1 rounded-md text-base font-medium text-zinc-300 bg-zinc-800 hover:text-white transition-colors">
          🔴  Optimism’s Monorepo has
          <a
            href="https://github.com/ethereum-optimism/optimism/network/dependencies"
            className="text-white/50 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            over 2.9k dependencies,
          </a>200 contributors, over
          <a
            href="https://github.com/ethereum-optimism/optimism/network/dependents?dependent_type=REPOSITORY&package_id=UGFja2FnZS0xNDk2OTg3ODQ4"
            className="text-white/50 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            13.8k repositories
          </a>{" "}
          that depend on it (end-use of the repo), and
          <a
            href="https://github.com/ethereum-optimism/optimism/network/dependents?dependent_type=PACKAGE&package_id=UGFja2FnZS0xNDk2OTg3ODQ4"
            className="text-white/50 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            91 packages
          </a>{" "}
          that depend on it (extend this library).
        </span>
      </div>
    </>
  );
}
