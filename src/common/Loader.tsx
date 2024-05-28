import React from "react";
import { RotatingLines } from "react-loader-spinner";

const Loader = () => {
	return (
		<div className="center-horizontal center-vertical h-full">
			<RotatingLines
				visible={true}
				width="50"
				strokeWidth="1"
				animationDuration="0.75"
				ariaLabel="rotating-lines-loading"
                strokeColor="gray"
			/>
		</div>
	);
};

export default Loader;
