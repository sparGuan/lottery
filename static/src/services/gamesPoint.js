/*
 * @Author: your name
 * @Date: 2019-11-20 09:05:53
 * @LastEditTime: 2019-12-01 09:52:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\static\src\services\gamesPoint.js
 */
import { request } from "../utils";

export async function query(params) {
	return request({
		url: "/api/gamesPoint/games_point",
		method: "GET",
		data: params
	});
}
export async function toOpenLottery(params) {
	return request({
		url: "/api/v1/publishGames",
		method: "POST",
		data: params
	});
}

export async function todestoryGames(params) {
	return request({
		url: "/api/v1/do_destroy_games_point",
		method: "POST",
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
