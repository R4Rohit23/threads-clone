const Spinner = ({ color  }: { color?: string}) => {
	return (
		<div className=" flex justify-center items-center gap-4">
			<div className={`animate-spin rounded-full h-4 w-4 border-b-2 ${color ? "border-black" : "border-white"}`}></div>
		</div>
	);
};

export default Spinner;
