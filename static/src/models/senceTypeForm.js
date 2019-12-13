/*
 * @Author: your name
 * @Date: 2019-11-27 14:10:06
 * @LastEditTime: 2019-11-28 19:59:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\static\src\models\senceTypeForm.js
 */
import {
	loadSenceType,
	update,
	save,
} from "../services/senceTypeForm";

const initState = {
  id: "",
  sname: "",
};

export default {
	namespace: "senceTypeForm",

	state: {
		...initState
	},

	effects: {
    *loadSenceType({ payload }, { call, put }) {
      const data = yield call(loadSenceType, payload);
			if (data && data.success) {
				yield put({ type: "loadSenceTypeSuccess", payload: data });
			}
		},

		*saveSenceType({ payload }, { call, put }) {
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

			yield put({ type: "loadSenceTypeSuccess", payload: data });
			callback && callback(data);
		}
	},

	reducers: {
		resetState(state) {
			return { ...state, ...initState  };
    },
		loadSenceTypeSuccess(state, action) {
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
