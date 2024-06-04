import Script from "next/script";
import React from "react";

const AdBanner = () => {
	return (
		<Script
			async
			src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}`}
			strategy="lazyOnload"
			crossOrigin="anonymous"
		/>
	);
};

export default AdBanner;
