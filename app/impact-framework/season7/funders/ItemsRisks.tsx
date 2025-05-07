type ItemsRisksProps = {
  number: string;
  item: string;
  description: string;
  vocal: string;
};

export default function ItemsRisks({
	number,
	item,
	vocal,
	description,
  }: ItemsRisksProps) {
	return (
	  <div className="mb-4">
		<div className="flex items-start gap-2">
		  <span className="text-xl font-bold text-white">{number}.</span>
		  <span className="text-lg font-semibold text-white">{item}</span>
		</div>
		<div className="pl-9 mt-1 text-white">
		  <p className="relative text-base leading-relaxed">
			<span className="absolute left-0">{vocal}.</span>
			<span className="pl-6 block">{description}</span>
		  </p>
		</div>
	  </div>
	);
  }
  
