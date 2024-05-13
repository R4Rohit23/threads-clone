const ROUTES = {
	AUTH: {
		LOGIN: "/api/auth/login",
		REGISTER: "/api/auth/register",
	},
	THREAD: "/api/thread",
	GET_THREAD_BY_ID: "/api/thread",
	COMMENT: "/api/comment",
	PROFILE: {
		USER_PROFILE: "/api/profile",
		SEARCH_USER: "/api/profile/search"
	},
	FOLLOW: {
		FOLLOW: "/api/follow",
		REQUEST: "/api/follow/request"
	}
};

export default ROUTES;
