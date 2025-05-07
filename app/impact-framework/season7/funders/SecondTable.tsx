export default function SecondTable() {
  return (
    <>
      <div className="overflow-x-auto mt-8 rounded-md">
        <table className="min-w-full border border-gray-600 text-left text-sm text-white">
          <thead className="bg-nation/50 text-white">
            <tr>
              <th className="p-4 border border-gray-600">Impact Vector</th>
              <th className="p-4 border border-gray-600">Components</th>
              <th className="p-4 border border-gray-600">
                Why It’s Robust & Useful
              </th>
            </tr>
          </thead>
          <tbody className="bg-nation">
            <tr>
              <td className="p-4 align-top border border-gray-700 font-semibold">
                1. Ecosystem Readiness Index
              </td>
              <td className="p-4 align-top border border-gray-700">
                <ul className="list-disc pl-5 space-y-2">
                  <li># of chains testing Interop</li>
                  <li># of standards-based contracts (ERC-7683/7802)</li>
                  <li>
                    % growth of Stage1 OP Chains based on L2Beat definition
                  </li>
                </ul>
              </td>
              <td className="p-4 align-top border border-gray-700">
                Combines technical progress with ecosystem adoption; can't be
                gamed by single actors
              </td>
            </tr>
            <tr>
              <td className="p-4 align-top border border-gray-700 font-semibold">
                2. Standards-Driven Activity Score
              </td>
              <td className="p-4 align-top border border-gray-700">
                <ul className="list-disc pl-5 space-y-2">
                  <li>% of Mission-funded projects using open standards</li>
                  <li>
                    # of grants resulting in reusable Interop enabling-tooling
                  </li>
                  <li># of unique dev teams adopting Interop per OP Chain</li>
                </ul>
              </td>
              <td className="p-4 align-top border border-gray-700">
                Encourages ecosystem-wide convergence, deters isolated custom
                infra
              </td>
            </tr>
            <tr>
              <td className="p-4 align-top border border-gray-700 font-semibold">
                3. Measurable Liquidity Enablement
              </td>
              <td className="p-4 align-top border border-gray-700">
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Pre-interop Superchain TVL growth (Stablecoin + Bridged
                    Asset)
                  </li>
                  <li>$ moved during testnet Interop demos</li>
                  <li># of liquidity protocols upgraded for Interop</li>
                </ul>
              </td>
              <td className="p-4 align-top border border-gray-700">
                Ensures that even "gaming" with high volume boosts ecosystem
                liquidity and infrastructure maturity
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
