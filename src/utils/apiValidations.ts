export const validateRequestBody = (body: any, keys: string[]) => {
	try {
		let missingKeys: string = ``;
		let payload: any = {};

		for (const key of keys) {
			const value = body[key];

			if (!value) {
				if (missingKeys === ``) {
					missingKeys = key;
				} else {
					missingKeys += `, ${key}`;
				}
			} else {
				payload[key] = value;
			}
		}

		if (missingKeys.length) {
			throw new Error(`Missing fields in input are - ${missingKeys}`);
		}

		console.log(`Processed payload - ${JSON.stringify(payload)}`);
		return payload;
	} catch (error) {
		console.log(
			`Error occurred while validating request body - ${JSON.stringify(
				body
			)}, keys - ${JSON.stringify(keys)} & error - ${error}`
		);
		throw error;
	}
};
