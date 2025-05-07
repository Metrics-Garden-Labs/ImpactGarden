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
                      35–40M OP from Foundation, Governance Fund, and Retro
                      Funding
                    </li>
                    <li>Public roadmaps from OP Labs & Foundation</li>
                    <li>Missions framework (Retro, Foundation, Gov Fund)</li>
                    <li>
                      Measurement systems (OSO, Dev Advisory Board, Milestones
                      and Metrics Council)
                    </li>
                  </ul>
                </td>
                <td className="p-4 align-top border border-gray-700">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Fund Interop MVP on ≥3 testnet chains</li>
                    <li>Support ERC-7683 & ERC-7802 standards</li>
                    <li>Create dashboards for usage and readiness</li>
                    <li>Fund liquidity/TLV growth & stablecoin campaigns</li>
                    <li>
                      Launch predictive grant methods (decision markets, OSO
                      evals)
                    </li>
                  </ul>
                </td>
                <td className="p-4 align-top border border-gray-700">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>≥3 OP Chains running Interop MVP</li>
                    <li>≥100 ERC-7802 deployments on testnet</li>
                    <li>≥2 dashboards measuring ecosystem readiness</li>
                    <li>Published impact tracking plans across Missions</li>
                  </ul>
                </td>
                <td className="p-4 align-top border border-gray-700">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Interop in production on ≥2 OP Chains</li>
                    <li>≥5 OP Chains reach Stage 1 (L2Beat)</li>
                    <li>Verified measurement system active</li>
                    <li>≥3 public apps using Interop-native UX</li>
                    <li>
                      ≥$250M/month in cross-chain asset transfers (if Interop
                      ships before end of S7)
                    </li>
                  </ul>
                </td>
                <td className="p-4 align-top border border-gray-700">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      A trust-minimized, production-ready Interoperable
                      Superchain
                    </li>
                    <li>Liquidity and UX standardized across OP Chains</li>
                    <li>Reduced reliance on core teams</li>
                    <li>Coordinated decentralization across the Collective</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
	  <div className="w-full my-8 border-t border-gray-400" />
    </>
  );
}
