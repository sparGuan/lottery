import { request } from "../utils";

export async function loadGamesPoint(params) {
  const id = params.id || 0;
	const url = id ? `/api/gamesPoint/games_point/${id}` : "/api/gamesPoint/games_point";
	return request({
		url,
		method: "get"
	});
}

export async function loadGames(params) {
	return request({
		url: "/api/restql/games",
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
		url: `/api/gamesPoint/games_point/${id}`,
		method: "put",
		data: params
	});
}

export async function save(params) {
	return request({
		url: "/api/gamesPoint/games_point",
		method: "post",
		data: params
	});
}

export async function addGames(params) {
	return request({
		url: "/api/gamesPoint/games_point",
		method: "post",
		data: params
	});
}

export async function updatePoint(params) {
	return request({
		url: "/api/gamesPoint",
		method: "put",
		data: params
	});
}
