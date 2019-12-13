/*
 * @Author: your name
 * @Date: 2019-11-28 10:37:14
 * @LastEditTime: 2019-12-01 16:38:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\static\src\routes\bets\BetsView.js
 */
import React, { Component, PropTypes } from "react";
import {
	Input,
	Form,
	Button,
  Switch,
} from "antd";
import { UploadFile } from '../../components'
import moment from "moment";
import { routerRedux } from "dva/router";
import { connect } from "dva";

import config from "../../utils/config";

const FormItem = Form.Item;
class BetsView extends Component {
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
		this.props.dispatch(routerRedux.push({ pathname: "/games/bets" }));
	}
  

	render() {
    const { getFieldDecorator } = this.props.form;
    const {  sname } = this.props
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
						{getFieldDecorator("sname", {
							initialValue: sname,
							rules: [
								{
									required: true,
									message: "请输入名称"
								}
							]
						})(<Input placeholder="请输入名称" />)}
					</FormItem>
				</Form>
			</div>
		);
	}
}

export default connect(({ bets }) => {
	return {};
})(Form.create()(BetsView));
