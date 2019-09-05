import { request } from "../utils";

export async function loadGamesLevel(params) {
  const id = params.id || 0;
	const url = id ? `/api/gamesLevel/games_level/${id}` : "/api/gamesLevel/games_level";

	return request({
		url,
		method: "get"
	});
}

export async function update(params) {
	const id = params.id || 0;
	if (!id) {
		return;
	}

	delete params.id;

	return request({
		url: `/api/gamesLevel/games_level/${id}`,
		method: "put",
		data: params
	});
}

export async function save(params) {
	return request({
		url: "/api/gamesLevel/games_level",
		method: "post",
		data: params
	});
}

export async function addGamesLevel(params) {
	return request({
		url: "/api/gamesLevel",
		method: "post",
		data: params
	});
}
export async function updateGamesLevel(params) {
	return request({
		url: "/api/gamesLevel",
		method: "put",
		data: params
	});
}
