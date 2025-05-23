export default function MetricsTable() {
  return (
    <>
      <CollapsibleII
        TableData={[
          {
            metric: "Off-chain content Engagement (shares, likes clicks, etc)s",
            strength: "Low",
            description:
              "Measures: Engagement a piece of content has had. Why this level? There is no clear way to know how much value was derived by the Collective based on this metric.",
            keyword: "communication",
          },
          {
            metric: "Content impressions (views, reproductions)",
            strength: "Low",
            description:
              "Measures: Number of impressions a piece of content has had. Why this level? There is no clear way to know how much value was derived by the Collective based on this metric.",
            keyword: "communication",
          },
          {
            metric: "Positive testimonials from badgeholders/delegates",
            strength: "Medium",
            description:
              "Measures: How satisfied badgeholder/delegates are with the  contribution in improving their ability to understand governance. Why this level? Verifying testimonials can be challenging, but it can provide insight into how useful a contribution has been. ",
            keyword: "coomprehensibleness",
          },
          {
            metric:
              "On-chain content engagement (NFT mints, attestations) with Governance Accessibility resources",
            strength: "Medium",
            description:
              "Measures: On-chain engagement with content. Why this level? Some value is being generated so that people feel compelled to interact on-chain with it. The provision of on-chain data can contribute to identity development.",
            keyword: "lower barriers to entry",
          },
          {
            metric:
              "Changes in voting power distribution held within the top 10 delegates",
            strength: "Medium",
            description:
              "Measures: Changes in voting power distribution generated by a contribution. Why this level?.",
            keyword: "capture resistance",
          },
          {
            metric: "Increase in number of delegates",
            strength: "Medium",
            description:
              "Measures: Increase in number of delegates generated by an initiative. Why this level? While an increase in delegates is good, how good it is will increase based on their active engagement in the Collective.",
            keyword: "new delegates",
          },
          {
            metric: "Increase in number of delegates voting in a proposal",
            strength: "High",
            description:
              "Measures: Number of delegates that voted in a proposal as a result of a contribution. Why this level? Participation in the decision-making of the collective is fundamental and information on this participation increases the ability to hold delegates accountable. ",
            keyword: "monitoring",
          },
          {
            metric: "Attestations received by the RetroPGF applicant",
            strength: "High",
            description:
              "Measures: Public signaling by users on the impact of a contribution through attestations.  Why this level? The use of attestations increases data availability for Optimism’s Citizenship.",
            keyword: "accesibility of data",
          },
          {
            metric: "Increase in votable supply",
            strength: "High",
            description:
              "Measures: Increase in delegated tokens. Why this level? An increase in votable supply translates to more participants in governance (through delegation).",
            keyword: "votable supply",
          },
          {
            metric:
              "Increase in number of delegations from minority holder wallets",
            strength: "High",
            description:
              "Measures: Increase in minority wallets that have delegated their tokens after an initiative. Why this level? This metric clearly signals that more people understand how to delegate and increases the total votable supply. ",
            keyword: "comprehensibleness",
          },
          {
            metric:
              "Increase in number of delegates explaining their voting rationale",
            strength: "High",
            description:
              " Measures: Number of delegates that have shared their voting rationale derived from a contribution. Why this level? An increase in information that is shared by delegates enables their token holders to hold them accountable for their participation.  ",
            keyword: "transparency",
          },
          {
            metric: "Number of grants executed as specified",
            strength: "High",
            description:
              "Measures: Number of grants an applicant has completed according to the requirements. Why this level? By completing their grants according to the requirements Grantees increase the trust Token holders have in the Optimism Governance. ",
            keyword: "monitoring",
          },
          {
            metric: "Increase in delegate individual activeness in proposals",
            strength: "High",
            description:
              "Measures: Increase in delegate participation on a proposal generated by a contribution. Why this level? Optimism’s Governance changes rapidly, improvements in communication that makes it easier for delegates to keep up and be involved in governance benefits the Collective.",
            keyword: "communication",
          },

          {
            metric: "Monthly active delegates/badgeholders using the platform",
            strength: "High",
            description:
              "Measures: Number of delegates or badgeholders who have participated in governance through a platform. Why this level? Tooling for governance improves the experience and ease of participating in governance. ",
            keyword: "engagement",
          },
        ]}
      />
    </>
  );
}

export function CollapsibleII({
  TableData,
}: {
  TableData: {
    metric: string;
    strength: string;
    description: string;
    keyword: string;
  }[];
}) {
  function getKeywordColor(keyword?: string) {
    if (!keyword) return "bg-gray-600 text-gray-100";

    const colorMap: { [key: string]: string } = {
      awareness: "bg-violet-700 text-violet-100",
      adaptability: "bg-indigo-700 text-indigo-100",
      dependability: "bg-gray-700 text-gray-100",
      familiarity: "bg-amber-700 text-emerald-100",
      "gas fees": "bg-orange-700 text-orange-100",
      reliability: "bg-blue-700 text-blue-100",
      simplicity: "bg-purple-700 text-purple-100",
      stability: "bg-pink-700 text-pink-100",
      redundancy: "bg-cyan-700 text-green-100",
      extensibility: "bg-orange-600 text-yellow-100",
      utility: "bg-red-700 text-red-100",
      modularity: "bg-slate-700 text-green-100",
      understanding: "bg-teal-700 text-teal-100",
    };

    const key = keyword.toLowerCase();
    return colorMap[key] || "bg-blue-700 text-blue-100";
  }

  function getStrengthColor(strength?: string) {
    if (!strength) return "bg-gray-600 text-white";

    const colorMap: { [key: string]: string } = {
      high: "bg-green-600 text-white",
      medium: "bg-sky-700 text-slate-100",
      low: "bg-red-600 text-white",
    };

    const key = strength.toLowerCase();
    return colorMap[key] || "bg-gray-600 text-white";
  }
  return (
    <>
      <div className="flex flex-col px-4">
        <h1 className="text-2xl py-2 pt-8 font-black"> 📊 🌱 Metrics Garden</h1>
        <p>
          Here you can find some metrics associated to the relevant terms
          described above. These metrics are examples (there’s many more!) of
          what can be used to measure the impact of a contribution. Always
          consider how the metrics chosen by a project and how they are measured
          signal the impact generated to the Collective Governance.
        </p>
        <br />
        <p className="py-4">
          Metrics have been graded as low-medium-high impact, based on how
          useful a metric is at informing the direct impact of a contribution to
          the Optimism Ecosystem.
        </p>
      </div>
      <table className="w-full text-left mt-2 border-separate border-spacing-y-1">
        <thead>
          <tr className="text-zinc-400 text-sm">
            <th className="px-2">Metric name</th>
            <th className="px-2">Metric strength</th>
            <th className="px-2">What & Why</th>
            <th className="px-2">Keyword it relates to</th>
          </tr>
        </thead>
        <tbody>
          {TableData.map((row, idx) => (
            <tr key={idx} className="bg-zinc-800 text-sm rounded-md">
              <td className="px-2 py-2 text-zinc-100">{row.metric}</td>
              <td className="px-2 py-2">
                <span
                  className={`px-2 py-0.5 rounded-md text-xs font-medium ${getStrengthColor(
                    row.strength
                  )}`}
                >
                  {row.strength ?? "—"}
                </span>
              </td>
              <td className="px-2 py-2 w-1/2 text-zinc-300">
                {row.description}
              </td>
              <td className="px-2 py-2">
                <span
                  className={`px-2 py-0.5 rounded-md text-xs font-medium ${getKeywordColor(
                    row.keyword
                  )}`}
                >
                  {row.keyword ?? "—"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
