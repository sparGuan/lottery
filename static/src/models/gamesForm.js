import {
	loadGames,
	update,
	save,
  addGames,
  loadTypes,
  loadLevel
} from "../services/gamesForm";

const initState = {
	id: "",
  list: [],
  level_List: [],
  games_types_id: "",
  games_level_id: "",
  cont: "",
  gamesName: "",
  status: 0,
  img_url: ''
};

export default {
	namespace: "gamesForm",

	state: {
		...initState
	},

	effects: {
    *setUrl({ payload }, { call, put }) {
      yield put({ type: "updateUrl" , payload});
    },
    *loadTypes({ payload }, { call, put }) {
			const data = yield call(loadTypes, payload);
			if (data && data.success) {
        data.data.list = data.data.record
				yield put({ type: "loadGamesSuccess", payload: data });
			}
    },
    *loadLevel({ payload }, { call, put }) {
			const data = yield call(loadLevel, payload);
			if (data && data.success) {
        data.data.level_List = data.data.record
				yield put({ type: "loadGamesSuccess", payload: data });
			}
		},
		*loadGames({ payload }, { call, put }) {
			const data = yield call(loadGames, payload);
			if (data && data.success) {
				yield put({ type: "loadGamesSuccess", payload: data });
			}
		},

		*saveGames({ payload }, { call, put }) {
			let data = null
			const callback = payload.callback;
			delete payload.callback;
			const params = {
				status: payload.status || 0,
        img_url: payload.img_url,
        games_types_id: payload.games_types_id,
        games_level_id: payload.games_level_id,
        name: payload.gamesName
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
        data.gamesName = data.name
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
