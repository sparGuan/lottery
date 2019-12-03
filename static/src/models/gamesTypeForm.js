/*
 * @Author: your name
 * @Date: 2019-11-27 14:10:06
 * @LastEditTime: 2019-11-27 19:59:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\static\src\models\gamesTypeForm.js
 */
import {
	loadGamesType,
	update,
	save,
} from "../services/gamesTypeForm";

const initState = {
  id: "",
  name: "",
  status: 0,
};

export default {
	namespace: "gamesTypeForm",

	state: {
		...initState
	},

	effects: {
    *loadGamesType({ payload }, { call, put }) {
      const data = yield call(loadGamesType, payload);
			if (data && data.success) {
				yield put({ type: "loadGamesTypeSuccess", payload: data });
			}
		},

		*saveGamesType({ payload }, { call, put }) {
			let data = null
			const callback = payload.callback;
			delete payload.callback;
			const params = {
				status: payload.status || 0,
        name: payload.name,
			};
			if (payload.id) {
				params.id = payload.id;
				data = yield call(update, params);
			} else {
				data = yield call(save, params);
			}

			yield put({ type: "loadGamesTypeSuccess", payload: data });
			callback && callback(data);
		}
	},

	reducers: {
		resetState(state) {
			return { ...state, ...initState  };
    },
		loadGamesTypeSuccess(state, action) {
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
