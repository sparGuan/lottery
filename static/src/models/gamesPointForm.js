import {
	loadGames,
	update,
  save,
  loadGamesPoint
} from "../services/gamesPointForm";
const _ = require('lodash')
import { message } from 'antd'

const initState = {
	id: "",
  list: [],
  games_id: [],
  master_count: "",
  slave_count: "",
  master_consult: "",
  slave_consult: "",
  commission: "",
  master_start_time: null,
  // slave_start_time: null,
  master_info: '',
  slave_info: '',
  status: 0,
  master_img_url: '',
  slave_img_url: '',
  flat_consult: '',
  gamesPlay: ''
};

export default {
	namespace: "gamesPointForm",

	state: {
		...initState
	},

	effects: {
    *setGamesPlay({ payload }, { call, put }) {
      yield put({ type: "updateGamesPlay" , payload});
    },
    *setMasterUrl({ payload }, { call, put }) {
      yield put({ type: "updateMasterUrl" , payload});
    },
    *setSlaveUrl({ payload }, { call, put }) {
      yield put({ type: "updateSlaveUrl" , payload});
    },
		*loadGames({ payload }, { call, put }) {
			const data = yield call(loadGames, payload);
			if (data && data.success) {
        data.data.list = data.data.record
				yield put({ type: "loadGamesSuccess", payload: data });
			}
    },
    *loadGamesPoint({ payload }, { call, put }) {
			const data = yield call(loadGamesPoint, payload);
			if (data && data.success) {
				yield put({ type: "loadGamesSuccess", payload: data });
			}
		},
		*saveGamesPoint({ payload }, { call, put }) {
			let data = null
			const callback = payload.callback;
      delete payload.callback;
			const params = {
				status: payload.status || 0,
        games_id: payload.games_id,
        master_count: payload.master_count,
        slave_count: payload.slave_count,
        master_consult: payload.master_consult,
        slave_consult: payload.slave_consult,
        master_info: payload.master_info,
        slave_info: payload.slave_info,
        master_info: payload.master_info,
        master_img_url: payload.master_img_url,
        slave_img_url: payload.slave_img_url,
        flat_consult: payload.flat_consult, // 平场赔率参考值
        gamesPlay: payload.gamesPlay,
        // slave_start_time: payload.slave_start_time,
        commission: payload.commission,
        master_start_time: payload.master_start_time
      };
			if (payload.id) {
				params.id = payload.id;
				data = yield call(update, params);
			} else {
				data = yield call(save, params);
			}

			yield put({ type: "loadGamesSuccess", payload: data });
			callback && callback(data);
		}
	},

	reducers: {
    updateGamesPlay(state, action) {
      return {
        ...state,
        gamesPlay: action.payload.gamesPlay
      }
    },
    updateMasterUrl(state, action) {
      return {
        ...state,
        master_img_url: action.payload.master_img_url
      }
    },
    updateSlaveUrl(state, action) {
      return {
        ...state,
        slave_img_url: action.payload.slave_img_url
      }
    },
		loadGamesSuccess(state, action) {
      const data = action.payload && action.payload.data;
			if (data) {
        data.gamesPointName = data.name
        delete data.name
				return {
					...state,
					...data
				};
			}
			return state;
		}
	}
};
