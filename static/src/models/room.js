import { query, remove, update, removeTable } from "../services/gamesRoom";
import _ from 'lodash'
export default {
  namespace: "room",

  state: {
    list: [],
    selectedRowKeys: [],
    loading: false,
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0
    }
  },

  effects: {
    *loadRoom({ payload }, { call, put }) {
      yield put({ type: "showLoading" });
      payload.sortField = "create_time";
      payload.sortOrder = "desc";
      const data = yield call(query, payload);
      data && data.data.record && data.data.record.forEach(element => {
        if (element.rule === 0) {
          element.rule_play = '胜平负'
        }
        element.games_place = element.master_count + 'vs' + element.slave_count
      });
      yield put({
        type: "loadRoomSuccess",
        payload: {
          data,
          current: payload.page,
          pageSize: payload.pageSize
        }
      });
      yield put({ type: "hideLoading" });
      yield put({ type: "selectedRowKeys", payload: { selectedRowKeys: [] } });
    },

    *removeRoom({ payload }, { call, put }) {
      yield put({ type: "showLoading" });
      const data = yield call(remove, payload);
      const tableData = yield call(removeTable, payload);
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

    *updateRoom({ payload }, { call, put }) {
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
    loadRoomSuccess(state, action) {
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
