import { request } from "../utils";

export async function query(params) {
	return request({
		url: "/api/gamesType/games_types",
		method: "GET",
		data: params
	});
}

export async function remove(params) {
	const selectedRowKeys = params.selectedRowKeys || [];
	const ids = selectedRowKeys.join(",");
	return request({
		url: `/api/gamesType/games_types/${ids}`,
		method: "delete"
	});
}

export function update(params) {
	const id = params.id;
	delete params.id;
	return request({
		url: `/api/gamesType/games_types/${id}`,
		method: "put",
		data: params
	});
}

export async function removeBanner(params) {
	const templateArr = params.templateArr || [];
	const res = templateArr.join(",");
	return request({
		url: `/api/gamesType/${res}`,
		method: "delete"
	});
}
