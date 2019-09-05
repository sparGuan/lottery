import { request } from "../utils";

export async function query(params) {
	return request({
		url: "/api/gamesPoint/games_point",
		method: "GET",
		data: params
	});
}

export async function remove(params) {
	const selectedRowKeys = params.selectedRowKeys || [];
	const ids = selectedRowKeys.join(",");
	return request({
		url: `/api/gamesPoint/games_point/${ids}`,
		method: "delete"
	});
}

export function update(params) {
	const id = params.id;
	delete params.id;
	return request({
		url: `/api/gamesPoint/games_point/${id}`,
		method: "put",
		data: params
	});
}

export async function removeGames(params) {
	const templateArr = params.templateArr || [];
	const res = templateArr.join(",");
	return request({
		url: `/api/gamesPoint/${res}`,
		method: "delete"
	});
}
