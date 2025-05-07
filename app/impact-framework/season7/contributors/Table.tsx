export default function Table() {
  return (
    <>
      <div>
        <div className="overflow-x-auto mt-8 rounded-md">
          <table className="min-w-full border border-gray-600 text-left text-sm text-white">
            <thead className="bg-nation/50 text-white">
              <tr>
                <th className="p-4 border border-gray-600">Inputs</th>
                <th className="p-4 border border-gray-600">Activities</th>
                <th className="p-4 border border-gray-600">Outputs</th>
                <th className="p-4 border border-gray-600">Outcomes</th>
                <th className="p-4 border border-gray-600">Impacts</th>
              </tr>
            </thead>
            <tbody className="bg-nation">
              <tr>
                <td className="p-4 align-top border border-gray-700">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Your work: open-source code, integrations, infra, docs,
                      dashboards, governance, research, comms
                    </li>
                    <li>Support from grants, Missions, and Retro Funding</li>
                    <li>
                      Shared ecosystem resources: OP Stack, ERC standards,
                      measurement dashboards
                    </li>
                  </ul>
                </td>
                <td className="p-4 align-top border border-gray-700">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Deploy Interop-aware contracts (ERC-7683/7802)</li>
                    <li>Build tools or infra for OP Chains</li>
                    <li>Publish dashboards, SDKs, or guides</li>
                    <li>
                      Collaborate or be a project running across multiple chains
                    </li>
                    <li>
                      Contribute to Missions that enable Interop, liquidity, or
                      measurement
                    </li>
                  </ul>
                </td>
                <td className="p-4 align-top border border-gray-700">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Working code or assets on testnets</li>
                    <li>Data made available through public dashboards</li>
                    <li>New standards or contracts deployed</li>
                    <li>
                      Tutorials, templates, SDKs or PRs merged into ecosystem
                      repos
                    </li>
                  </ul>
                </td>
                <td className="p-4 align-top border border-gray-700">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Your work is used by OP Chains or apps to be Interop-ready
                    </li>
                    <li>
                      Ecosystem projects build on or with your contributions
                    </li>
                    <li>
                      Users begin testing or adopting Interop UX flows thanks to
                      your contributions
                    </li>
                    <li>
                      Impact can be tracked and attributed to you for Retro
                      Funding or Milestone evals
                    </li>
                  </ul>
                </td>
                <td className="p-4 align-top border border-gray-700">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>The ecosystem is ready for Interop when it launches</li>
                    <li>
                      You directly contribute to a Superchain where value flows
                      seamlessly, freely and securely between chains
                    </li>
                    <li>
                      You are retroactively rewarded for work that pushed the
                      Collective forward
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="  text-zinc-300 pt-4 mt-8 bg-zinc-800 p-4 flex flex-row items-center rounded-lg justify-center gap-4">
        <p className="tex-7xl"> 🎯</p>
        <span className="gap-2 rounded-md text-base font-medium ">
          <strong>This table is your strategic map: </strong> it shows where
          your work fits into the bigger picture, what milestones matter, and
          how to align your contributions with the incentives and infrastructure
          of the Collective.
        </span>
      </div>
      <div className="w-full my-8 border-t border-gray-400" />
    </>
  );
}
