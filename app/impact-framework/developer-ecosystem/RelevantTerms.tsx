import Collapsible from "../op-stack/Collapsible";

export default function RelevantTerms() {
  return (
	<>
		  <h1 className="text-2xl py-2 pt-8 font-black px-4">  Relevant terms:</h1>
	  <Collapsible
		Title="Discoverability"
		Definition="Discoverability refers to the ease with which members of the Developer Ecosystem can gain awareness of, find, and utilize various resources, tools, and projects within the Optimism Ecosystem."
		QuestionOne="Did this contribution increase public awareness of existing projects in the ecosystem?"
		QuestionTwo="Did this contribution shorten the discovery journey members of the Developer Ecosystem go through?"
		Example="The guide yellow sunny created listing all resources available to create a Social Platform in the Optimism Ecosystem reduced the builder discovery journey by ## of hours. "
		Keywords={["awareness", "resources", "simplicity", "discovery journey", "research", "visibility"]}
		TableData={[
		  {
			metric: "On-chain content engagement (NFT mints, attestations) with Governance Accessibility resources",
			strength: "Medium",
			description:
			  "Measures: On-chain engagement with content. Why this level? Some value is being generated so that people feel compelled to interact on-chain with it. The provision of on-chain data can contribute to identity development.",
			keyword: "Lower barriers to entry",
		  },
		  {
			metric: "Increase in number of delegates",
			strength: "Medium",
			description:
			  "Measures: Increase in number of delegates generated by an initiative. Why this level? While an increase in delegates is good, how good it is will increase based on their active engagement in the Collective.",
			keyword: "New delegates",
		  },
		]}
	  />
	  <Collapsible
		Title="Developer Tooling"
		Definition="Developer tooling comprises a collection of resources designed to support developers throughout the development process (from ideation to deployment).."
		QuestionOne="Did this contribution result in increased efficiency during any stages of the development process?"
		QuestionTwo="Did this contribution introduce new tooling that is interoperable and beneficial to the Optimism Developer Ecosystem?"
		Example="The framework in rust developed by green sunny enabled the launch of 3 new rust based projects in the Optimism Ecosystem.   "
		Keywords={[
		  "frameworsk",
		  "libraries",
		  "platforms",
		  "availability",
		  "accessibility",
		  "friendliness",
		  "interoperable",
		  "development process",
		  "compatible"
		]}
		TableData={[
		  {
			metric: "Increase in delegate individual activeness in proposals",
			strength: "High",
			description:
			  "Measures: Increase in delegate participation on a proposal generated by a contribution. Why this level? Optimism’s Governance changes rapidly, improvements in communication that makes it easier for delegates to keep up and be involved in governance benefits the Collective. ",
			keyword: "Communication",
		  },
		  {
			metric: "Monthly active delegates/badgeholders using the platform",
			strength: "High",
			description:
			  "Measures: Number of delegates or badgeholders who have participated in governance through a platform. Why this level? Tooling for governance improves the experience and ease of participating in governance. ",
			keyword: "Engagement",
		  },
		]}
	  />
	  <Collapsible
		Title="Developer Support"
		Definition="Developer Support encompasses providing resources and assistance so developers have a seamless experience throughout the entire development lifecycle."
		QuestionOne="Did this contribution decrease the time a developer had to wait to resolve the development issues they faced? "
		QuestionTwo="Did this contribution increase accessibility or overview of funding opportunities?"
		Example="The creation of the TechNERD program reduced the waiting time for ticket resolution by over 90 minutes.   "
		Keywords={["experience", "support", "resources", "documentation", "accessibility"]}
		TableData={[
		  {
			metric: "Off-chain content Engagement (shares, likes clicks, etc)",
			strength: "Low",
			description:
			  "Measures: Engagement a piece of content has had. Why this level? There is no clear way to know how much value was derived by the Collective based on this metric. ",
			keyword: "Understandability",
		  },
		  {
			metric: "Content impressions (views, reproductions)",
			strength: "Low",
			description:
			  "Measures: Number of impressions a piece of content has had. Why this level? There is no clear way to know how much value was derived by the Collective based on this metric.",
			keyword: "Understandability",
		  },
		  {
			metric: "Positive testimonials from badgeholders/delegates",
			strength: "Medium",
			description:
			  "Measures: How satisfied badgeholder/delegates are with the  contribution in improving their ability to understand governance. Why this level? Verifying testimonials can be challenging, but it can provide insight into how useful a contribution has been.",
			keyword: "Understandability",
		  },
		  {
			metric: "Increase in number of delegations from minority holder wallets",
			strength: "Medium",
			description:
			  "Measures: Increase in minority wallets that have delegated their tokens after an initiative. Why this level? This metric clearly signals that more people understand how to delegate and increases the total votable supply. ",
			keyword: "Comprehensibleness",
		  },
		]}
	  />
	   <Collapsible
		Title="Collaboration"
		Definition="In the developer ecosystem, collaboration is the process where parties communicate, come together to share knowledge, and pool resources to innovate and co-create solutions."
		QuestionOne="Did this initiative enabled collaboration among members of the Developer Ecosystem?  "
		QuestionTwo="Did this initiative enhanced the engagement of diverse members of the Developer Ecosystem?"
		Example="The workshop on Attestations held by green sunny led to the creation of an attestation graph to study network effects in the Collective created with attendees."
		Keywords={["cooperation", "knowledge sharing", "co-creation", "communcation", "problem solving"]}
		TableData={[
		  {
			metric: "Number of dependent Github repositories",
			strength: "Medium",
			description:
			  "Measures: Number of dependencies from other repositories. Why this level? A repository which is not Optimism specific may include dependencies that are not benefiting the Optimism Ecosystem, making its impact appear greater than it is.  ",
			keyword: "Extensibility",
		  },
		  {
			metric: "Number of positive testimonies from OP Stack core contributors",
			strength: "High",
			description:
			  "Measures: How useful core contributors have found a resource to be. Why this level? This metric clearly signals the perceived positive value of a contribution by OP specific beneficiaries.  ",
			keyword: "Utility",
		  },
		  {
			metric: "Number of dependencies from the OP Stack",
			strength: "High",
			description:
			  "Measures: Dependencies the OP Stack has on an external resource. Why this level? A larger number of dependencies could point to this resources being extremely valuable to the Ecosystem.  ",
			keyword: "Utility",
		  },
		  {
			metric: "Type of dependency from the OP Stack",
			strength: "High",
			description:
			  "Measures: Type of dependencies the OP Stack has on an external resource. Why this level? Some dependencies are fundamental to the OP Stack, while others could be less critical. However, for now recommendation is to value both highly. ",
			keyword: "       ",
		  },
		]}
	  />
	   <Collapsible
		Title="Education"
		Definition="Education, within the developer ecosystem, refers to the strategic assimilation of knowledge and skills, empowering individuals to proficiently navigate and innovate through various stages of the development process.  "
		QuestionOne="Did this contribution support the integration of new developer audiences in the Optimism Ecosystem? "
		QuestionTwo="Did this contribution increase access to funding opportunities?  "
		Example="The creation of a guide to teach artists how to apply for a grant increased the number of innovative applications built on Optimism during Season 4.  "
		Keywords={["accesibility", "diversity", "novelty", "content", "audience"]}
		TableData={[
		  {
			metric: "Content impressions",
			strength: "Low",
			description:
			  "Measures: Number of impressions this piece of content has had. Why this level? There is no clear way to know how much value was derived by the Collective based on this metric. ",
			keyword: "Familiarity",
		  },
		  {
			metric: "Number of Github stars",
			strength: "Low",
			description:
			  "Measures: Number of stars a Github repo has received. Why this level? There is no clear way to know if starring a project can be equated to any value being derived from it. ",
			keyword: "Familiarity",
		  },
		  {
			metric: "Number of event attendees",
			strength: "Low",
			description:
			  "Measures: Number of people who attended an event. Why this level? Depending on the type and content in the event, its value to the Optimism Ecosystem may be low or high based on how fruitful it is to engage people with Optimism. ",
			keyword: "Understanding",
		  },
		  {
			metric: "Number of content material created on the OP Stack",
			strength: "Low",
			description:
			  "Measures: Content created on the OP Stack. Why this level? There is no clear way to know how much value was derived by the Collective based on this metric.",
			keyword: "Familiarity",
		  },
		  {
			metric: "Level of engagement with OP Stack content",
			strength: "Low",
			description:
			  "Measures: Engagement a piece of content has had. Why this level? There is no clear way to know how much value was derived by the Collective based on this metric.",
			keyword: "Understanding",
		  },
		]}
	  />
	</>
  );
}

