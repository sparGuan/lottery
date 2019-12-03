/*
 * @Author: your name
 * @Date: 2019-11-27 14:10:06
 * @LastEditTime: 2019-12-01 16:46:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\static\src\models\betsForm.js
 */
import {
	loadBetsForm,
	update,
	save,
} from "../services/betsForm";

const initState = {
  id: "",
  sname: "",
};

export default {
	namespace: "betsForm",

	state: {
		...initState
	},

	effects: {
		*saveBetsForm({ payload }, { call, put }) {
			let data = null
			const callback = payload.callback;
			delete payload.callback;
			const params = {
        sname: payload.sname,
			};
			if (payload.id) {
				params.id = payload.id;
				data = yield call(update, params);
			} else {
				data = yield call(save, params);
			}

			yield put({ type: "loadBetsFormSuccess", payload: data });
			callback && callback(data);
		}
	},

	reducers: {
		resetState(state) {
			return { ...state, ...initState  };
    },
		loadBetsFormSuccess(state, action) {
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
