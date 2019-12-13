/*
 * @Author: your name
 * @Date: 2019-11-28 10:09:38
 * @LastEditTime: 2019-12-02 20:39:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\static\src\services\sceneType.js
 */
import { request } from "../utils";

export async function query(params) {
	return request({
		url: "/api/bets/loadBets",
		method: "GET",
		data: params
	});
}

export function update(params) {
	const id = params.id;
	delete params.id;
	return request({
		url: `/api/bet/sence_types/${id}`,
		method: "put",
		data: params
	});
}

