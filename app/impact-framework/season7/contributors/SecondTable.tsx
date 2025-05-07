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
				  1. Superchain Readiness Contribution
				</td>
				<td className="p-4 align-top border border-gray-700">
				  <ul className="list-disc pl-5 space-y-2">
					<li>Help OP Chains test Interop</li>
					<li>Test Interop readiness in your deployments</li>
					<li>Contribute to public infra (relayers, paymasters, routers)</li>
				  </ul>
				</td>
				<td className="p-4 align-top border border-gray-700">
				  Helps prepare the ecosystem for a production Interop launch; ensures you’re contributing to the Collective’s most urgent priority.
				</td>
			  </tr>
			  <tr>
				<td className="p-4 align-top border border-gray-700 font-semibold">
				  2. Standards + Infra Adoption Signal
				</td>
				<td className="p-4 align-top border border-gray-700">
				  <ul className="list-disc pl-5 space-y-2">
					<li>Build and promote the usage of reusable tooling around shared standards</li>
					<li>Collaborate with multiple OP Chains using the same patterns</li>
				  </ul>
				</td>
				<td className="p-4 align-top border border-gray-700">
				  Shows your work is composable, adopted, and ecosystem-aligned, not isolated or redundant.
				</td>
			  </tr>
			  <tr>
				<td className="p-4 align-top border border-gray-700 font-semibold">
				  3. Liquidity and UX Enablement
				</td>
				<td className="p-4 align-top border border-gray-700">
				  <ul className="list-disc pl-5 space-y-2">
					<li>Improve bridging UX or multichain interfaces</li>
					<li>Deploy paymasters or fee abstraction tools</li>
					<li>Create apps or protocols that encourage asset flows between OP Chains</li>
				  </ul>
				</td>
				<td className="p-4 align-top border border-gray-700">
				  Enables user-facing, real-world usage of Interop. This is the high-signal outcome that makes the $250M/month goal real and tangible.
				</td>
			  </tr>
			</tbody>
		  </table>
		</div>
	  </>
	);
  }
  