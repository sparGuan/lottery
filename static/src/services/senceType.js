/*
 * @Author: your name
 * @Date: 2019-11-28 10:09:38
 * @LastEditTime: 2019-11-29 09:48:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\static\src\services\sceneType.js
 */
import { request } from "../utils";

export async function query(params) {
	return request({
		url: "/api/senceType/sence_types",
		method: "GET",
		data: params
	});
}

export async function remove(params) {
	const selectedRowKeys = params.selectedRowKeys || [];
	const ids = selectedRowKeys.join(",");
	return request({
		url: `/api/senceType/sence_types/${ids}`,
		method: "delete"
	});
}

export function update(params) {
	const id = params.id;
	delete params.id;
	return request({
		url: `/api/senceType/sence_types/${id}`,
		method: "put",
		data: params
	});
}

export async function removeBanner(params) {
	const templateArr = params.templateArr || [];
	const res = templateArr.join(",");
	return request({
		url: `/api/senceType/${res}`,
		method: "delete"
	});
}
