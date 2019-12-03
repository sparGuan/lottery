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
class BannerView extends Component {
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
		this.props.dispatch(routerRedux.push({ pathname: "/games/banner" }));
	}
  
  returnRespone = ({img_url}) => {
    this.props.dispatch({ type: "bannerForm/setUrl", payload: {img_url} })
  }

	render() {
    const { getFieldDecorator } = this.props.form;
    const {  status, img_url, addr_url } = this.props
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
					<FormItem {...formItemLayout} label="跳转链接">
						{getFieldDecorator("addr_url", {
							initialValue: addr_url,
							rules: [
								{
									required: true,
									message: "请输入跳转链接"
								}
							]
						})(<Input placeholder="请输入跳转链接" />)}
					</FormItem>
					
            {/* 图标 */}
          <FormItem {...formItemLayout} label="banner图">
              <UploadFile  returnRespone={this.returnRespone} img_url={img_url}/>
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

export default connect(({ banner }) => {
	return {};
})(Form.create()(BannerView));
