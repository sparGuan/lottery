import React, { Component, PropTypes } from "react";
import { connect } from "dva";
import { Table, Button, Modal, Switch } from "antd";
import { routerRedux } from "dva/router";

const columns = [
  { title: "序号", dataIndex: "id" },
  { title: "赛事名称", dataIndex: "games_name" },
  { title: "主场名称", dataIndex: "master_count" },
  { title: "客场名称", dataIndex: "slave_count" },
  { title: "房间数", dataIndex: "room_nums" },
  { title: "收取佣金(%)", dataIndex: "commission" },
  { title: "状态", dataIndex: "status" },
  { title: "创建时间", dataIndex: "create_time" },
  { title: "更新时间", dataIndex: "update_time" },
	{ title: "操作", width: 150 }
];

const linkStyle = {
	display: "inline-block",
	padding: "0 10px",
	cursor: "pointer"
};

class GamesPoint extends Component {
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
						onClick={this.toGamesPointForm.bind(this, record.id)}
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
			type: "gamesPoint/loadGamesPoint",
			payload: { page, pageSize }
		});
	}

	tableChange(pagination) {
		this.loadTableData(pagination.current, pagination.pageSize);
	}

	selectRow(selectedRowKeys) {
		this.props.dispatch({
			type: "gamesPoint/selectedRowKeys",
			payload: { selectedRowKeys }
		});
	}

	toGamesPointForm(id) {
		if (id) {
			this.props.dispatch(
				routerRedux.push({ pathname: `/gamesPoint/edit/${id}` })
			);
		} else {
			this.props.dispatch(
				routerRedux.push({ pathname: "/gamesPoint/create" })
			);
		}
	}


	deleteGamesPoint() {
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
						type: "gamesPoint/removeGamesPoint",
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
						onClick={this.toGamesPointForm.bind(this, 0)}
						style={{ marginRight: 10 }}
					>
						新增
					</Button>
					<Button onClick={this.deleteGamesPoint.bind(this)}>删除</Button>
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

export default connect(({ gamesPoint }) => {
	return {
		list: gamesPoint.list,
		loading: gamesPoint.loading,
		total: gamesPoint.total,
		selectedRowKeys: gamesPoint.selectedRowKeys,
		pagination: gamesPoint.pagination
	};
})(GamesPoint);
