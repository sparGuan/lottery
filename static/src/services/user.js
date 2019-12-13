/*
 * @Author: your name
 * @Date: 2019-11-29 10:23:48
 * @LastEditTime: 2019-11-30 09:53:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\static\src\services\user.js
 */
/*
 * @Author: your name
 * @Date: 2019-11-28 10:09:38
 * @LastEditTime: 2019-11-29 15:50:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\static\src\services\sceneType.js
 */
import { request } from "../utils";

export async function query(params) {
	return request({
		url: "/api/admin/web_admin",
		method: "GET",
		data: params
	});
}


export async function remove(params) {
	const selectedRowKeys = params.selectedRowKeys || [];
	const ids = selectedRowKeys.join(",");
	return request({
		url: `/api/admin/web_admin/${ids}`,
		method: "delete"
	});
}

export async function save(params) {
	return request({
		url: "/api/admin/web_admin",
		method: "post",
		data: params
	});
}

export function update(params) {
	const id = params.id;
	delete params.id;
	return request({
		url: `/api/admin/web_admin/${id}`,
		method: "put",
		data: params
	});
}

export async function removeUser(params) {
	const templateArr = params.templateArr || [];
	const res = templateArr.join(",");
	return request({
		url: `/api/admin/${res}`,
		method: "delete"
	});
}
