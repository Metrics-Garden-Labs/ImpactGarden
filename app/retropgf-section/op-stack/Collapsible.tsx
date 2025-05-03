export default function Collapsible({
	Title,
	Definition,
	QuestionOne,
	QuestionTwo,
	Example,
	Keywords,
	TableData,
  }: {
	Title: string;
	Definition: string;
	QuestionOne: string;
	QuestionTwo: string;
	Example: string;
	Keywords: string[];
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
		"gas fees": "bg-orange-700 text-orange-100",
		reliability: "bg-blue-700 text-blue-100",
		simplicity: "bg-purple-700 text-purple-100",
		stability: "bg-pink-700 text-pink-100",
		redundancy: "bg-cyan-700 text-green-100",
		extensibility: "bg-orange-600 text-yellow-100",
		utility: "bg-red-700 text-red-100",
		modularity: "bg-slate-700 text-green-100",
		familiarity: "bg-amber-700 text-emerald-100",
		understanding: "bg-teal-700 text-teal-100",
		awareness: "bg-violet-700 text-violet-100",
		adaptability: "bg-indigo-700 text-indigo-100",
		dependability: "bg-gray-700 text-gray-100",
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
	  <div className="mb-6">
		<details className="bg-zinc-900 rounded-md p-4">
		  <summary className="cursor-pointer text-xl font-bold text-white">
			{Title}
		  </summary>
		  <div className="mt-4 space-y-4 text-zinc-200 text-sm leading-relaxed">
			<div>
			  <strong>Definition:</strong>
			  <p className="ml-2 mt-1 text-zinc-300">{Definition}</p>
			</div>
			<div>
			  <p className="font-semibold ">
				🤔 Questions you can ask yourself to recognize impact in this
				term:
			  </p>
			  <ul className="list-disc ml-6 mt-1 space-y-1">
				<li>{QuestionOne}</li>
				<li>{QuestionTwo}</li>
			  </ul>
			</div>
			<div>
			  <p>
				<strong className="underline">Example:</strong>
				<br /> {Example}
			  </p>
			</div>
			<div className="bg-zinc-800 px-4 py-2 rounded-md text-sm font-medium">
			  <span className="text-red-500 font-semibold	">🔴 Keywords:</span>{" "}
			  {Keywords.map((kw, idx) => (
				<span key={idx} className="text-zinc-300">
				  {kw}
				  {idx !== Keywords.length - 1 && ", "}
				</span>
			  ))}
			</div>
			<div>
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
			</div>
		  </div>
		</details>
	  </div>
	);
  }
  