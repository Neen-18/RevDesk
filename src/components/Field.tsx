const Field = ({
	label,
	name,
	value,
	onChange,
	type = "text",
	required,
}: {
	label: string;
	name: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	type?: string;
	required?: boolean;
}) => {
	return (
		<div>
			<label className="block text-xs text-gray-400 mb-1">{label}</label>
			<input
				type={type}
				name={name}
				value={value}
				onChange={onChange}
				required={required}
				className="w-full bg-revDeskBlack-dark text-white text-sm rounded-lg px-3 py-2 outline-none border border-white/10 focus:border-revDeskBlue focus:ring-0"
			/>
		</div>
	);
};

export default Field;
