import React from "react";

const ErrorText = ({ text }: { text: string }) => {
	return <p className="text-red-500 text-xs text-start">{text}</p>;
};

export default ErrorText;
