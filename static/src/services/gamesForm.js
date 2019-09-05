import { request } from "../utils";

export async function loadGames(params) {
  const id = params.id || 0;
	const url = id ? `/api/games/games/${id}` : "/api/games/games";

	return request({
		url,
		method: "get"
	});
}

export async function loadTypes(params) {
  
	return request({
		url: "/api/restql/games_types",
		method: "GET",
		data: params
	});
}
export async function loadLevel(params) {
  
	return request({
		url: "/api/restql/games_level",
		method: "GET",
		data: params
	});
}

export async function update(params) {
	const id = params.id || 0;
	if (!id) {
		return;
	}

	delete params.id;

	return request({
		url: `/api/games/games/${id}`,
		method: "put",
		data: params
	});
}

export async function save(params) {
	return request({
		url: "/api/games/games",
		method: "post",
		data: params
	});
}

export async function addGames(params) {
	return request({
		url: "/api/games",
		method: "post",
		data: params
	});
}
export async function updateGames(params) {
	return request({
		url: "/api/games",
		method: "put",
		data: params
	});
}
