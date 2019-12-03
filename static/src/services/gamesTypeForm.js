/*
 * @Author: your name
 * @Date: 2019-11-27 14:01:51
 * @LastEditTime: 2019-11-27 20:01:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\static\src\services\gamesTypeForm.js
 */
import { request } from "../utils";

export async function loadGamesType(params) {
  const id = params.id || 0;
	const url = id ? `/api/gamesType/games_types/${id}` : "/api/gamesType/games_types";

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
		url: `/api/gamesType/games_types/${id}`,
		method: "put",
		data: params
	});
}

export async function save(params) {
	return request({
		url: "/api/gamesType/games_types",
		method: "post",
		data: params
	});
}

export async function addGamesTyper(params) {
	return request({
		url: "/api/games_types",
		method: "post",
		data: params
	});
}
export async function updateGamesTyper(params) {
	return request({
		url: "/api/games_types",
		method: "put",
		data: params
	});
}
