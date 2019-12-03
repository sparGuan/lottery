import React, { Component, PropTypes } from "react";
import { connect } from "dva";
import { Table, Button, Modal, Form, Icon, Input, TreeSelect  } from "antd";
const FormItem = Form.Item;
import { routerRedux } from "dva/router";

const SHOW_PARENT = TreeSelect.SHOW_PARENT;

const columns = [
	{ title: "序号", dataIndex: "uid" },
	{ title: "名称", dataIndex: "name" },
	{ title: "级别", dataIndex: "level" },
  { title: "创建时间", dataIndex: "create_time" },
  { title: "更新时间", dataIndex: "update_time" },
	{ title: "操作", width: 150 }
];

const linkStyle = {
	display: "inline-block",
	padding: "0 10px",
	cursor: "pointer"
};

const treeData = [
	{
		label: '赛事',
		value: 'games',
		key: '0',
		children: [
			{
				label: '赛事类别',
				value: 'gamesType',
				key: '0-0',
			},
			{
				label: '轮播图管理',
				value: 'banner',
				key: '0-1',
			},
			{
				label: '赛事级别',
				value: 'gamesLevel',
				key: '0-2',
			},
			{
				label: '联赛管理',
				value: 'gamesManager',
				key: '0-3',
			},
			{
				label: '赛事管理',
				value: 'gamesPoint',
				key: '0-4',
			}
	],
	}, 
  {
		label: '投注管理',
		value: 'betManager',
		key: '1-0',
		children: [],
	},
	{
		label: '客户管理',
		value: 'customer',
		key: '2-0',
		children: [],
	},
	{
		label: '财务管理',
		value: 'finance',
		key: '3-0',
		children: [],
	}
];

class User extends Component {
	static contextTypes = {
		router: PropTypes.object
	};
	state = { visibleUserForm: false,  value: ['0-0-0'], }

	onChange = (value) => {
    console.log('onChange ', value, arguments);
    this.setState({ value });
  }
	
	constructor(props, context) {
		super(props, context);

		const len = columns.length;
		columns[len - 1].render = (text, record, index) => {
			if (record.level !== 1) {
				return (
					<div>
						<span
							onClick={this.touserForm.bind(this, record.id)}
							style={linkStyle}
						>
							编辑
						</span>
					</div>
				);
			}
			
    };
	}

	componentDidMount() {
		this.loadTableData();
	}

	loadTableData(page = 1, pageSize = 10) {
		this.props.dispatch({
			type: "user/loadUser",
			payload: { page, pageSize }
		});
	}

	tableChange(pagination) {
		this.loadTableData(pagination.current, pagination.pageSize);
	}

	selectRow(selectedRowKeys) {
		this.props.dispatch({
			type: "user/selectedRowKeys",
			payload: { selectedRowKeys }
		});
	}

	// 弹窗
	showModal = () => {
    this.setState({
      visibleUserForm: true,
    });
  }
  handleCancel = (e) => {
    this.setState({
      visibleUserForm: false,
    });
	}
	
	touserForm(id) {
		if (id) {
			this.props.dispatch(
				routerRedux.push({ pathname: `/user/edit/${id}` })
			);
			// yield put(routerRedux.push({pathname: `/user/edit/${id}`}))
			// this.context.router.push({ pathname: `/user/edit/${id}` });
		} else {
			this.props.dispatch(
				routerRedux.push({ pathname: "/user/create" })
			);
			// yield put(routerRedux.push({pathname: '/user/create'}))
			// this.context.router.push({ pathname: '/user/create' });
		}
	}

	changeuserState(record) {
		this.props.dispatch({
			type: "user/updateUser",
			payload: {
				...record,
				status,
				page: this.props.pagination.current,
				pageSize: this.props.pagination.pageSize
			}
		});
	}
	addAdmin = () => {
		// 新增超级用户
		this.showModal()
	}

	deleteuser() {
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
						type: "user/removeUser",
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

	handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
				if (err) {
					return;
				}
				if (values.confirm === values.pass) {
					this.props.dispatch({
						type: "user/saveUser",
						payload: {
							...values,
							callback: (data) => {
								console.log(data)
								this.setState({
									visibleUserForm: false,
								});
							}
						}
					});
				}
      }
    });
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
		const tProps = {
			treeData,
			placeholder: '请选择用户权限',
      value: this.state.value,
      onChange: this.onChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: 'Please select',
      style: {
        width: 300,
      },
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
						onClick={() => this.addAdmin()}
						style={{ marginRight: 10 }}
					>
						新增
					</Button>
					<Button onClick={this.deleteuser.bind(this)}>删除</Button>
				</div>

				<Table
					columns={columns}
					rowSelection={rowSelection}
					pagination={pagination}
					dataSource={this.props.list}
					rowKey="uid"
					loading={this.props.loading}
					bordered
					onChange={this.tableChange.bind(this)}
				/>
				<Modal
          title="新增管理人员"
          visible={this.state.visibleUserForm}
					onOk={this.handleSubmit}
          onCancel={this.handleCancel}
        >
						<Form onSubmit={this.handleSubmit} className="login-form">
								<TreeSelect {...tProps} 	style={{
									marginBottom: 10,
								}}/>

								<FormItem>
									{getFieldDecorator('name', {
										rules: [{ required: true, message: '请输入账号!' }],
									})(
										<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="账号" />
									)}
								</FormItem>
								<FormItem>
									{getFieldDecorator('pass', {
										rules: [{ required: true, message: '请输入密码!' }],
									})(
										<Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
									)}
								</FormItem>
								<FormItem>
									{getFieldDecorator('confirm', {
										rules: [{ required: true, message: '请输入确认密码!' }],
									})(
										<Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="确认密码" />
									)}
								</FormItem>
      			</Form>

        </Modal>
			</div>
		);
	}
}
const WrappedNormalLoginForm = Form.create()(User);

export default connect(({ user }) => {
	return {
		list: user.list,
		loading: user.loading,
		total: user.total,
		selectedRowKeys: user.selectedRowKeys,
		pagination: user.pagination
	};
})(WrappedNormalLoginForm);
