interface LastBoxProps {
	emoji: string;
	number: string;
	title: string;
	descriptionOne: string;
	descriptionLi: string;
  }
  
  const LastBox: React.FC<LastBoxProps> = ({
	emoji,
	number,
	title,
	descriptionOne,
	descriptionLi,
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
		</ol>
	  </div>
	);
  };
  
  export default LastBox;
  