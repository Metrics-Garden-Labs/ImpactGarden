import BoxComponent from "./BoxComponent";
import LastBox from "./LastBox";

export default function MainBoxes() {
  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full px-4">
        <BoxComponent
          emoji="🔴"
          number="1."
          title="Clarity"
          descriptionOne="ToC helps contributors zoom out to see how their work connects to Collective Intents."
          descriptionLi="Encourages everyone to articulate not just what they’re building, but why it matters and how it creates change towards the Intent."
          emojiTwo="🔴"
          numberTwo="2."
          titleTwo="Alignment"
          descriptionOneTwo="It aligns diverse projects and stakeholders around common outcomes—even if their methods differ."
          descriptionLiTwo="Builders can tailor their roadmaps to reinforce key milestones in Optimism’s broader journey."
        />
        <BoxComponent
          emoji="🔴"
          number="3."
          title="Transparency"
          descriptionOne="By making assumptions and intended outcomes explicit, ToC reduces ambiguity."
          descriptionLi="By surfacing unstated beliefs, it enables meaningful critique and iteration—not just of projects, but of the ecosystem’s own strategy."
          emojiTwo="🔴"
          numberTwo="4."
          titleTwo="Adaptability"
          descriptionOneTwo="As the Collective evolves, ToC helps track whether our theory still holds—or needs an update."
          descriptionLiTwo="If an initiative doesn’t produce expected outcomes, we can revisit our logic and assumptions. Learning loops, not rigid plans."
        />
      </div>
      <div className="w-full flex justify-center">
        <LastBox
          emoji="🔴"
          number="5."
          title="Stronger Governance"
          descriptionOne="Theory of Change provides badgeholders and the Grants Council a clearer lens for making funding decisions."
          descriptionLi="It shifts the conversation from “Who do we like?” to “What change are they driving—and how useful is this for the Intent?"
        />
      </div>
	  <div className="w-full my-8 border-t border-gray-400" />
    </div>
  );
}
