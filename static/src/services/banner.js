import { request } from "../utils";

export async function query(params) {
	return request({
		url: "/api/banner/banner",
		method: "GET",
		data: params
	});
}

export async function remove(params) {
	const selectedRowKeys = params.selectedRowKeys || [];
	const ids = selectedRowKeys.join(",");
	return request({
		url: `/api/banner/banner/${ids}`,
		method: "delete"
	});
}

export function update(params) {
	const id = params.id;
	delete params.id;
	return request({
		url: `/api/banner/banner/${id}`,
		method: "put",
		data: params
	});
}

export async function removeBanner(params) {
	const templateArr = params.templateArr || [];
	const res = templateArr.join(",");
	return request({
		url: `/api/banner/${res}`,
		method: "delete"
	});
}
