import React, { Component, PropTypes } from "react";
import { connect } from "dva";
import { Table, Button, Modal, Switch } from "antd";
import { routerRedux } from "dva/router";

const columns = [
	{ title: "投注编号", dataIndex: "id" },
  { title: "房间编号", dataIndex: "games_room_id" },
  { title: "庄家账号", dataIndex: "created_by" },
	{ title: "对战队伍", dataIndex: "againster" },
	{ title: "赔率", dataIndex: "consult" },
	{ title: "投注金额", dataIndex: "amount" },
	{ title: "状态", dataIndex: "status" },
];

const linkStyle = {
	display: "inline-block",
	padding: "0 10px",
	cursor: "pointer"
};

class Bets extends Component {
	static contextTypes = {
		router: PropTypes.object
	};

	constructor(props, context) {
		super(props, context);

		const len = columns.length;
	}

	componentDidMount() {
		this.loadTableData();
	}

	loadTableData(page = 1, pageSize = 10) {
		this.props.dispatch({
			type: "bets/loadBets",
			payload: { page, pageSize }
		});
	}

	tableChange(pagination) {
		this.loadTableData(pagination.current, pagination.pageSize);
	}

	selectRow(selectedRowKeys) {
		this.props.dispatch({
			type: "bets/selectedRowKeys",
			payload: { selectedRowKeys }
		});
	}

	tobetsForm(id) {
		if (id) {
			this.props.dispatch(
				routerRedux.push({ pathname: `/bets/edit/${id}` })
			);
		} else {
			this.props.dispatch(
				routerRedux.push({ pathname: "/bets/create" })
			);
		}
	}

	changebetsState(record) {
		const status = record.status ? 0 : 1;
		this.props.dispatch({
			type: "bets/updateBets",
			payload: {
				...record,
				status,
				page: this.props.pagination.current,
				pageSize: this.props.pagination.pageSize
			}
		});
	}

	deletebets() {
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
						type: "bets/removeBets",
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
						onClick={this.tobetsForm.bind(this, 0)}
						style={{ marginRight: 10 }}
					>
						新增
					</Button>
					<Button onClick={this.deletebets.bind(this)}>删除</Button>
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

export default connect(({ bets }) => {
	return {
		list: bets.list,
		loading: bets.loading,
		total: bets.total,
		selectedRowKeys: bets.selectedRowKeys,
		pagination: bets.pagination
	};
})(Bets);
