import { query, remove, update, removeTable, toOpenLottery, todestoryGames  } from "../services/gamesPoint";

export default {
  namespace: "gamesPoint",

  state: {
    list: [],
    selectedRowKeys: [],
    loading: false,
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0
    },

  },

  effects: {
    *toOpenLottery({ payload }, { call, put }) {
      const {result, score, id} = payload
      const data = yield call(toOpenLottery, {result, score, id});
      payload.callback(data)
    },

    *todestoryGames({ payload }, { call, put }) {
      const { id } = payload
      const data = yield call(todestoryGames, { id });
      payload.callback(data)
    },

    *loadGamesPoint({ payload }, { call, put }) {
      yield put({ type: "showLoading" });
      payload.sortField = "create_time";
      payload.sortOrder = "desc";
      const data = yield call(query, payload);
      yield put({
        type: "loadGamesPointSuccess",
        payload: {
          data,
          current: payload.page,
          pageSize: payload.pageSize
        }
      });
      yield put({ type: "hideLoading" });
      yield put({ type: "selectedRowKeys", payload: { selectedRowKeys: [] } });
    },

    *removeGamesPoint({ payload }, { call, put }) {
      yield put({ type: "showLoading" });
      const data = yield call(remove, payload);
      // const tableData = yield call(removeTable, payload);
      if (data && data.success) {
        yield put({
          type: "loadGamesPoint",
          payload: {
            page: 1,
            pageSize: 10
          }
        });
      } else {
        yield put({ type: "hideLoading" });
      }
    },

    *updateGamesPoint({ payload }, { call, put }) {
      yield put({ type: "showLoading" });
      const page = payload.page;
      const pageSize = payload.pageSize;

      delete payload.page;
      delete payload.pageSize;

      const data = yield call(update, payload);

      if (data && data.success) {
        yield put({
          type: "loadGamesPoint",
          payload: {
            page: page,
            pageSize: pageSize
          }
        });
      } else {
        yield put({ type: "hideLoading" });
      }
    }
  },

  reducers: {
    showLoading(state) {
      return { ...state, loading: true };
    },
    hideLoading(state) {
      return { ...state, loading: false };
    },
    selectedRowKeys(state, action) {
      return { ...state, selectedRowKeys: action.payload.selectedRowKeys };
    },
    loadGamesPointSuccess(state, action) {
      const actionData = action.payload.data;
      return {
        ...state,
        list: actionData.data.record,
        selectedRowKeys: [],
        pagination: {
          current: action.payload.current,
          pageSize: action.payload.pageSize,
          total: actionData.data.totalRecord || 0
        }
      };
    }
  }
};
