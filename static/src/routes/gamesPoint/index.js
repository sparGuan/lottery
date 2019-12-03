import React, { Component, PropTypes } from "react";
import { connect } from "dva";
import { Table, Button, Modal, Switch, Radio, Form, Input, Icon, notification, message     } from "antd";
import { routerRedux } from "dva/router";
import  indexStyle   from "./index.less"
import { moment } from "../../utils";
// import { gamesPoint } from "../../services";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const columns = [
  { title: "序号", dataIndex: "id" },
  { title: "赛事名称", dataIndex: "games_name" },
  { title: "主场名称", dataIndex: "master_count" },
  { title: "客场名称", dataIndex: "slave_count" },
	{ title: "状态", dataIndex: "status" ,render: (text, record, index) => {
		let statu = ''
		switch (record.status) {
			case 0:
				statu = '启动中'
				break;
			case 1:
					statu = '关闭'
					break;
			case 2:
				statu = '待开奖'
				break;
			case 3:
					statu = '已开奖'
					break;
			default:
				break;
		}
			return (
				<div>
					{statu}
				</div>

			);
		
		}},
  { title: "创建时间", dataIndex: "create_time", render: (text, record, index) => {
			return (
				<div>
					{moment.unix(record.create_time).format('YYYY-MM-DD HH:mm:ss')}
				</div>
			);
		
		} },
  { title: "更新时间", dataIndex: "update_time", render: (text, record, index) => {
		return (
			<div>
				{moment.unix(record.update_time).format('YYYY-MM-DD HH:mm:ss')}
			</div>
		);
	
	} },
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
	state = {
		visibleLottery: false,
		openLotteryData: {},
		current: 1,
		pageSize: 10
	}
	constructor(props, context) {
		super(props, context);

		const len = columns.length;
		columns[len - 1].render = (text, record, index) => {
			return (
				<div>
					<div className="b-m-15">
						<span
							onClick={this.toGamesPointForm.bind(this, record.id)}
							style={linkStyle}
						>
							编辑
						</span>
						<span
							onClick={this.viewRoom.bind(this, record.id)}
							style={linkStyle}
						>
							查看房间
						</span>
					</div>
					
					<div >
						{
							record.status === 2 && 
							<span
							onClick={this.toOpenLottery.bind(this, record)}
							style={linkStyle}
							>
								开奖
							</span>
						}
						{
							record.status <= 1 &&
							<span
							onClick={this.cancelGames.bind(this, record.id)}
							style={linkStyle}
						>
							取消比赛
						</span>
						}
						
					</div>

				</div>
			);
		};

		
	}

	openNotification = (description) => {
		notification.open({
			message: '开奖提示',
			description
		});
	};
	// 取消比赛
	cancelGames = (id) =>{
		// 资金原路打回
		const _this = this
		confirm({
			title: '取消赛事确认',
			content: '请认真确认该操作！确定取消该赛事？取消赛事后所有参与赛事的资金将原路返回。',
			onOk() {
				_this.props.dispatch({
					type: "gamesPoint/todestoryGames",
					payload: { 
						id,
						callback: (data) => {
							if (data.code === 0) {
								message.success('取消比赛成功，资金即将原路返回！');
								_this.loadTableData(_this.state.current, _this.state.pageSize)
							} else {
								message.error(data.message);
							}
						}
					 },
					
				});
			},
			onCancel() {
				console.log('Cancel');
			},
		});
	}

	componentDidMount() {
		this.loadTableData();
	}
	toOpenLottery(row) {
		// 开奖
		// 通过该id开奖
		this.setState({visibleLottery: true})
		this.setState({openLotteryData: row})
	}

	loadTableData(page = 1, pageSize = 10) {
		this.props.dispatch({
			type: "gamesPoint/loadGamesPoint",
			payload: { page, pageSize }
		});
	}

	tableChange(pagination) {
		const {current, pageSize} = pagination
		this.setState({current})
		this.setState({pageSize})
		this.loadTableData(pagination.current, pagination.pageSize);
	}

	selectRow(selectedRowKeys) {
		this.props.dispatch({
			type: "gamesPoint/selectedRowKeys",
			payload: { selectedRowKeys }
		});
	}
	viewRoom(id) {

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
	handleLotterySubmit()  {
		this.props.form.validateFields((err, values) => {
      if (!err) {
				// 开奖前做一步检测，检测每个房间预备金是否大于所有玩家下注金额
				
				this.props.dispatch({
					type: "gamesPoint/toOpenLottery",
					payload: {
						id: this.state.openLotteryData.id,
						...values,
						callback: (data) => {
							this.setState({visibleLottery: false})
							this.loadTableData(this.state.current, this.state.pageSize)
							this.openNotification(data.message)
						}
					}
				});
      }
    });
	}

	handleLotteryCancel() {
		this.setState({visibleLottery: false})
	}
	onChange(e) {
		console.log(`radio checked:${e.target.value}`);
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
		const { getFieldDecorator } = this.props.form;
		const { openLotteryData } = this.state
		 
		return (
			<div className={indexStyle.contentInner}>
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
				<Modal
          title="赛事开奖"
          visible={this.state.visibleLottery}
					onOk={() => this.handleLotterySubmit()}
          onCancel={() => this.handleLotteryCancel()}
        >
						<Form onSubmit={() => this.handleLotterySubmit()} className="login-form">
								<FormItem>
									{getFieldDecorator('result', {
											initialValue: 0,
											rules: [{ required: true, message: '请输入获奖队伍!' }],
										})(
											<RadioGroup onChange={this.onChange} >
											<RadioButton value={0}>{openLotteryData.master_count} - 胜</RadioButton>
											<RadioButton value={1}>平局</RadioButton>
											<RadioButton value={2}>{openLotteryData.slave_count} - 胜</RadioButton>
										</RadioGroup>
										)}
								</FormItem>
								<FormItem>
									{getFieldDecorator('score', {
										rules: [{ required: true, message: '请输入比分!' }],
									})(
										<Input  placeholder="得分 如2:1" />
									)}
								</FormItem>
      			</Form>

        </Modal>
			</div>
		);
	}
}
const GamesPointForm = Form.create()(GamesPoint);
export default connect(({ gamesPoint }) => {
	return {
		list: gamesPoint.list,
		loading: gamesPoint.loading,
		total: gamesPoint.total,
		selectedRowKeys: gamesPoint.selectedRowKeys,
		pagination: gamesPoint.pagination
	};
})(GamesPointForm);
