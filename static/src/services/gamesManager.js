import { request } from "../utils";

export async function query(params) {
	return request({
		url: "/api/games/games",
		method: "GET",
		data: params
	});
}

export async function remove(params) {
	const selectedRowKeys = params.selectedRowKeys || [];
	const ids = selectedRowKeys.join(",");
  console.log(ids)
	return request({
		url: `/api/games/games/${ids}`,
		method: "delete"
	});
}

export function update(params) {
	const id = params.id;
	delete params.id;

	return request({
		url: `/api/games/games/${id}`,
		method: "put",
		data: params
	});
}

export async function removeGames(params) {
	const templateArr = params.templateArr || [];
	const res = templateArr.join(",");

	return request({
		url: `/api/games/${res}`,
		method: "delete"
	});
}
