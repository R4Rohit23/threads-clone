const Spinner = ({ color = "black" }: { color: string}) => {
	return (
		<div className=" flex justify-center items-center gap-4">
			<div className={`animate-spin rounded-full h-4 w-4 border-b-2 border-${color}`}></div>
		</div>
	);
};

export default Spinner;
