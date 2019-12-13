import { query, remove, update, removeUser,save } from "../services/user";

export default {
  namespace: "user",

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
    *saveUser({ payload }, { call, put }) {
      let data = null
			const callback = payload.callback;
			const params = {
				name: payload.name,
        pass: payload.pass,
      };
			if (payload.id) {
				params.id = payload.id;
				data = yield call(update, params);
			} else {
        data = yield call(save, params);
			}

			yield put({ type: "loadGamesSuccess", payload: data });
			callback && callback(data);
		},
    *loadUser({ payload }, { call, put }) {
      yield put({ type: "showLoading" });
      payload.sortField = "create_time";
      payload.sortOrder = "desc";
      const data = yield call(query, payload);
      console.log(data)
      yield put({
        type: "loadUserSuccess",
        payload: {
          data,
          current: payload.page,
          pageSize: payload.pageSize
        }
      });
      yield put({ type: "hideLoading" });
      yield put({ type: "selectedRowKeys", payload: { selectedRowKeys: [] } });
    },

    *removeUser({ payload }, { call, put }) {
      yield put({ type: "showLoading" });
      const data = yield call(remove, payload);
      // const tableData = yield call(removeUser, payload);
      if (data && data.success) {
        yield put({
          type: "loadUser",
          payload: {
            page: 1,
            pageSize: 10
          }
        });
      } else {
        yield put({ type: "hideLoading" });
      }
    },
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
    loadUserSuccess(state, action) {
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
