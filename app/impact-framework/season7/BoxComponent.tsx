interface BoxComponentProps {
	emoji: string;
	number: string;
	title: string;
	descriptionOne: string;
	descriptionLi: string;
	emojiTwo: string;
	numberTwo: string;
	titleTwo: string;
	descriptionOneTwo: string;
	descriptionLiTwo: string;
  }
  
  const BoxComponent: React.FC<BoxComponentProps> = ({
	emoji,
	number,
	title,
	descriptionOne,
	descriptionLi,
	emojiTwo,
	numberTwo,
	titleTwo,
	descriptionOneTwo,
	descriptionLiTwo,
  }) => {
	return (
	  <div className="bg-nation mt-8 p-8 rounded-xl">
		<ol className="space-y-6 text-white">
		  <li className="relative pl-6 italic">
			<span className="absolute left-0 not-italic">{emoji}</span>
			<div className="flex flex-row items-center space-x-2">
			  <p className="not-italic">{number}</p>
			  <span className="font-bold not-italic">{title}:</span>
			</div>
			<p>{descriptionOne}</p>
			<ul className="list-disc pl-6 mt-2">
			  <li className="not-italic">{descriptionLi}</li>
			</ul>
		  </li>
		  <li className="relative pl-6 italic">
			<span className="absolute left-0 not-italic">{emojiTwo}</span>
			<div className="flex flex-row items-center space-x-2">
			  <p className="not-italic">{numberTwo}</p>
			  <span className="font-bold not-italic">{titleTwo}:</span>
			</div>
			<p>{descriptionOneTwo}</p>
			<ul className="list-disc pl-6 mt-2">
			  <li className="not-italic">{descriptionLiTwo}</li>
			</ul>
		  </li>
		</ol>
	  </div>
	);
  };
  
  export default BoxComponent;
  