/*
 * @Author: your name
 * @Date: 2019-11-27 14:01:51
 * @LastEditTime: 2019-11-29 14:35:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\static\src\services\senceTypeForm.js
 */
import { request } from "../utils";

export async function loadGamesType(params) {
  const id = params.id || 0;
	const url = id ? `/api/senceType/sence_types/${id}` : "/api/senceType/sence_types";

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
		url: `/api/senceType/sence_types/${id}`,
		method: "put",
		data: params
	});
}

export async function save(params) {
	return request({
		url: "/api/senceType/sence_types",
		method: "post",
		data: params
	});
}

export async function addGamesType(params) {
	return request({
		url: "/api/sence_types",
		method: "post",
		data: params
	});
}
export async function updateGamesType(params) {
	return request({
		url: "/api/sence_types",
		method: "put",
		data: params
	});
}
