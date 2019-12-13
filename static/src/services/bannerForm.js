import { request } from "../utils";

export async function loadBanner(params) {
  const id = params.id || 0;
	const url = id ? `/api/banner/banner/${id}` : "/api/banner/banner";

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
		url: `/api/banner/banner/${id}`,
		method: "put",
		data: params
	});
}

export async function save(params) {
	return request({
		url: "/api/banner/banner",
		method: "post",
		data: params
	});
}

export async function addBanner(params) {
	return request({
		url: "/api/banner",
		method: "post",
		data: params
	});
}
export async function updateBanner(params) {
	return request({
		url: "/api/banner",
		method: "put",
		data: params
	});
}
