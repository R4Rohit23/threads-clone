import axios, { AxiosResponse } from "axios";

export interface APIPromise {
	status: boolean;
	data?: any;
	message?: string;
	error?: string;
	type?: string;
}

export const ActionHandler = async (
	action: string,
	url: string,
	data: any,
	headers = {}
): Promise<AxiosResponse> => {
	switch (action) {
		case "GET":
			return await axios.get(url, {
				headers,
			});

		case "POST":
			return await axios.post(url, data, {
				headers,
			});

		case "PUT":
			return await axios.put(url, data, {
				headers,
			});

		case "DELETE":
			return await axios.delete(url, { data, headers });

		default:
			throw new Error(`Invalid action: ${action}`);
	}
};

export const APIHandler = async (
	action: string,
	url: string,
	data = {},
	headers = {}
): Promise<APIPromise> => {
	try {
		const response = await ActionHandler(action, url, data, headers);

		if (response.status >= 200 && response.status <= 299) {
			return {
				status: true,
				data: response.data,
				message: response.data.message,
			};
		}

		return {
			status: false,
			error: "API Failed",
			message: "API Failed",
		};
	} catch (e) {
		if (axios.isAxiosError(e)) {
			console.log(e);
			if (e.message === "Network Error") {
				return {
					status: false,
					error: "Network Error",
					message: "Network Error",
				};
			}
			return {
				status: false,
				type: e.response?.data?.type,
				message: e.response?.data.message,
				error: e.response?.data.error,
			};
		}
		return {
			status: false,
			error: "API Failed",
			message: "API Failed",
		};
	}
};
