interface PropTextField extends HTMLInputElement {
	boxWidth: string;
	label: string;
	handleFunction: (value: any) => void;
	handleBlur: React.ChangeEventHandler<HTMLTextAreaElement>;
	Icon?: React.ElementType;
}

const TextAreaField: React.FC<Partial<PropTextField>> = (props) => {
	const { handleBlur, handleFunction, placeholder, name, label, value, defaultValue } = props;
	return (
		<div>
			<label
				htmlFor="comment"
				className="block text-xs sm:text-sm sm:font-medium leading-6 text-white"
			>
				{label}
			</label>
			<div>
				<textarea
					rows={5}
					name={name}
					className="block bg-dark-2 w-full rounded-md border-0 p-3 text-white shadow-sm  placeholder:text-gray-400 text-xs sm:text-sm sm:leading-6 outline-none"
					defaultValue={defaultValue}
					onChange={handleFunction}
					onBlur={handleBlur}
					placeholder={placeholder}
					value={value}
				/>
			</div>
		</div>
	);
};

export default TextAreaField;

