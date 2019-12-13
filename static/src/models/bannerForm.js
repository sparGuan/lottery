import {
	loadBanner,
	update,
	save,
} from "../services/bannerForm";

const initState = {
  id: "",
  addr_url: "",
  status: 0,
  img_url: ''
};

export default {
	namespace: "bannerForm",

	state: {
		...initState
	},

	effects: {
    *loadBanner({ payload }, { call, put }) {
      const data = yield call(loadBanner, payload);
			if (data && data.success) {
				yield put({ type: "loadBannerSuccess", payload: data });
			}
		},
    *setUrl({ payload }, { call, put }) {
      yield put({ type: "updateUrl" , payload});
    },

		*saveBanner({ payload }, { call, put }) {
			let data = null
			const callback = payload.callback;
			delete payload.callback;
			const params = {
				status: payload.status || 0,
        img_url: payload.img_url,
        addr_url: payload.addr_url
			};
			if (payload.id) {
				params.id = payload.id;
				data = yield call(update, params);
			} else {
				data = yield call(save, params);
			}

			yield put({ type: "loadBannerSuccess", payload: data });
			callback && callback(data);
		}
	},

	reducers: {
		resetState(state) {
			return { ...state, ...initState  };
    },
    updateUrl(state, action) {
      return {
        ...state,
        img_url: action.payload.img_url
      }
    },
		loadBannerSuccess(state, action) {
      const data = action.payload && action.payload.data;
			if (data) {
				return {
					...state,
					...data
				};
			}
			return state;
		}
	}
};
