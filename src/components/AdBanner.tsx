import { useEffect } from "react";

const AdBanner = (props: any) => {
	useEffect(() => {
		try {
			// @ts-ignore
			(window.adsbygoogle = window.adsbygoogle || []).push({});
		} catch (err) {
			console.log(err);
		}
	}, []);

	return (
		// <ins
		// 	className="adsbygoogle adbanner-customize"
		// 	style={{
		// 		display: "block",
		// 		overflow: "hidden",
		// 	}}
		// 	data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}
		// 	{...props}
		// />
		<ins
			className="adsbygoogle"
			style={{
				display: "block",
				overflow: "hidden",
			}}
			data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}
			data-ad-slot="7878193581"
			data-ad-format="auto"
			data-full-width-responsive="true"
		></ins>
	);
};
export default AdBanner;
