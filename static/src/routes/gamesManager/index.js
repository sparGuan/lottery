import React, { Component, PropTypes } from "react";
import { connect } from "dva";
import { Table, Button, Modal, Switch } from "antd";
import { routerRedux } from "dva/router";

const columns = [
	{ title: "序号", dataIndex: "id" },
	{ title: "名称", dataIndex: "name" },
  { title: "比赛类型", dataIndex: "type_name" },
  { title: "级别", dataIndex: "level_name" },
  { title: "创建时间", dataIndex: "create_time" },
  { title: "更新时间", dataIndex: "update_time" },
	{ title: "操作", width: 150 }
];

const linkStyle = {
	display: "inline-block",
	padding: "0 10px",
	cursor: "pointer"
};

class GamesManager extends Component {
	static contextTypes = {
		router: PropTypes.object
	};

	constructor(props, context) {
		super(props, context);

		const len = columns.length;
		columns[len - 1].render = (text, record, index) => {
			return (
				<div>
					<span
						onClick={this.togamesManagerForm.bind(this, record.id)}
						style={linkStyle}
					>
						编辑
					</span>
				</div>
			);
		};
	}

	componentDidMount() {
		this.loadTableData();
	}

	loadTableData(page = 1, pageSize = 10) {
		this.props.dispatch({
			type: "gamesManager/loadGamesManager",
			payload: { page, pageSize }
		});
	}

	tableChange(pagination) {
		this.loadTableData(pagination.current, pagination.pageSize);
	}

	selectRow(selectedRowKeys) {
		this.props.dispatch({
			type: "gamesManager/selectedRowKeys",
			payload: { selectedRowKeys }
		});
	}

	togamesManagerForm(id) {
		if (id) {
			this.props.dispatch(
				routerRedux.push({ pathname: `/gamesManager/edit/${id}` })
			);
			// yield put(routerRedux.push({pathname: `/gamesManager/edit/${id}`}))
			// this.context.router.push({ pathname: `/gamesManager/edit/${id}` });
		} else {
			this.props.dispatch(
				routerRedux.push({ pathname: "/gamesManager/create" })
			);
			// yield put(routerRedux.push({pathname: '/gamesManager/create'}))
			// this.context.router.push({ pathname: '/gamesManager/create' });
		}
	}

	changegamesManagerState(record) {
		const status = record.status ? 0 : 1;
		this.props.dispatch({
			type: "gamesManager/updateGamesManager",
			payload: {
				...record,
				status,
				page: this.props.pagination.current,
				pageSize: this.props.pagination.pageSize
			}
		});
	}

	deletegamesManager() {
		if (this.props.selectedRowKeys.length > 0) {
			Modal.confirm({
				title: "确定要删除所选数据?",
				content: "点击确定，数据则被删除",
				onOk: () => {
					let templateArr = [];
					this.props.list.forEach((v, index) => {
						if (this.props.selectedRowKeys.indexOf(v.id) !== -1) {
							templateArr.push(v.template);
						}
					});
					this.props.dispatch({
						type: "gamesManager/removeGamesManager",
						payload: {
							selectedRowKeys: this.props.selectedRowKeys,
							templateArr
						}
					});
				}
			});
		} else {
			Modal.warning({
				title: "未选中任何数据",
				content: "请选择要删除的数据"
			});
		}
	}

	render() {
		const rowSelection = {
			selectedRowKeys: this.props.selectedRowKeys,
			onChange: this.selectRow.bind(this)
		};

		const pagination = {
			showTotal: total => `共${total}条数据`,
			showSizeChanger: true,
			showQuickJumper: true,
			...this.props.pagination
		};

		return (
			<div className="content-inner">
				<div
					style={{
						paddingBottom: 10,
						marginBottom: 20,
						borderBottom: "1px solid #ddd"
					}}
				>
					<Button
						onClick={this.togamesManagerForm.bind(this, 0)}
						style={{ marginRight: 10 }}
					>
						新增
					</Button>
					<Button onClick={this.deletegamesManager.bind(this)}>删除</Button>
				</div>

				<Table
					columns={columns}
					rowSelection={rowSelection}
					pagination={pagination}
					dataSource={this.props.list}
					rowKey="id"
					loading={this.props.loading}
					bordered
					onChange={this.tableChange.bind(this)}
				/>
			</div>
		);
	}
}

export default connect(({ gamesManager }) => {
	return {
		list: gamesManager.list,
		loading: gamesManager.loading,
		total: gamesManager.total,
		selectedRowKeys: gamesManager.selectedRowKeys,
		pagination: gamesManager.pagination
	};
})(GamesManager);
