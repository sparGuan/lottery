/*
 * @Author: your name
 * @Date: 2019-11-27 14:03:56
 * @LastEditTime: 2019-11-28 15:11:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\static\src\routes\gamesType\GamesTypeView.js
 */
import React, { Component, PropTypes } from "react";
import {
	Input,
	Form,
	Button,
  Switch,
} from "antd";
import { UploadFile } from '../../components'
import { routerRedux } from "dva/router";
import { connect } from "dva";


const FormItem = Form.Item;
class GamesTypeView extends Component {
	static contextTypes = {
		router: PropTypes.object
	};

	onSubmit(e) {
    e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
      }
      if (values.status) {
        values.status = 0
      } else {
        values.status = 1
      }
			this.props.onSubmit(values);
		});
	}

	goBack() {
		this.props.dispatch(routerRedux.push({ pathname: "/games/gamesType" }));
	}
  
  returnRespone = ({img_url}) => {
    this.props.dispatch({ type: "gamesTypeForm/setUrl", payload: {img_url} })
  }

	render() {
		const { getFieldDecorator } = this.props.form;
		const {  status, name } = this.props
		const formItemLayout = {
			labelCol: { span: 3 },
			wrapperCol: { span: 12 }
    };
		return (
			<div className="content-inner">
				<div
					style={{
						borderBottom: "1px solid #ddd",
						marginBottom: 20,
						paddingBottom: 10
					}}
				>
					<Button style={{ marginRight: 10 }} onClick={this.goBack.bind(this)}>
						返回
					</Button>
					<Button type="primary" onClick={this.onSubmit.bind(this)}>
						确认
					</Button>
				</div>
        
				<Form>
					<FormItem {...formItemLayout} label="名称">
						{getFieldDecorator("name", {
							initialValue: name,
							rules: [
								{
									required: true,
									message: "请输入赛事类别名称"
								}
							]
						})(<Input placeholder="请输入赛事类别名称" />)}
					</FormItem>
          
					<FormItem {...formItemLayout} label="状态">
						{getFieldDecorator("status", {
							valuePropName: "checked",
							initialValue: !status
						})(<Switch checkedChildren={"启动"} unCheckedChildren={"关闭"} />)}
					</FormItem>
				</Form>
			</div>
		);
	}
}

export default connect(({ gamesType }) => {
	return {};
})(Form.create()(GamesTypeView));
