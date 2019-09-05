import {
	loadGames,
	update,
  save,
  loadGamesPoint
} from "../services/gamesPointForm";

const initState = {
	id: "",
  list: [],
  games_id: [],
  master_count: "",
  slave_count: "",
  master_consult: "",
  slave_consult: "",
  commission: "",
  status: 0,
  img_url: ''
};

export default {
	namespace: "gamesPointForm",

	state: {
		...initState
	},

	effects: {
    *setUrl({ payload }, { call, put }) {
      yield put({ type: "updateUrl" , payload});
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
        commission: payload.commission
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
		resetState(state) {
			return { ...state, ...initState  };
    },
    updateUrl(state, action) {
      return {
        ...state,
        img_url: action.payload.img_url
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
