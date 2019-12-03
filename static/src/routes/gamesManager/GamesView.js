import React, { Component, PropTypes } from "react";
import {
	Input,
	Form,
	Button,
	Icon,
	message,
	DatePicker,
  Switch,
  Select
} from "antd";
import { UploadFile } from '../../components'
import moment from "moment";
import { routerRedux } from "dva/router";
import { connect } from "dva";

import config from "../../utils/config";

const FormItem = Form.Item;
class GamesView extends Component {
	static contextTypes = {
		router: PropTypes.object
	};

	static defaultProps = {
		games_types_id: "",
		cont: "",
		name: "",
    status: 0,
    img_url: ''
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
		this.props.dispatch(routerRedux.push({ pathname: "/games/gamesManager" }));
	}
  
  returnRespone = ({img_url}) => {
    this.props.dispatch({ type: "gamesForm/setUrl", payload: {img_url} })
  }

	render() {
    const { getFieldDecorator } = this.props.form;
    const { Option } = Select;
    const { list, level_List, status, games_types_id, gamesName, games_level_id, img_url } = this.props
		const formItemLayout = {
			labelCol: { span: 3 },
			wrapperCol: { span: 12 }
    };
    console.log(gamesName)
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
        <FormItem {...formItemLayout} label="赛事类型">
						{getFieldDecorator("games_types_id", {
             initialValue: games_types_id.toString(),
							rules: [
								{
									required: true,
									message: "请输入赛事类型"
								}
							]
						})(<Select placeholder="请输入赛事类型" size="large" style={{minWidth: 180}} >
              {list && list.map((item, i) => <Option value={item.id &&  item.id.toString()} key={item.id}>{item.name}</Option>)}
            </Select>)}
					</FormItem>

          <FormItem {...formItemLayout} label="赛事级别">
						{getFieldDecorator("games_level_id", {
              initialValue: games_level_id.toString(),
							rules: [
								{
									required: true,
									message: "请输入赛事级别"
								}
							]
						})(<Select placeholder="请输入赛事级别" size="large" style={{minWidth: 180}} >
              {level_List && level_List.map((item, i) => <Option value={item.id && item.id.toString()} key={item.id}>{item.name}</Option>)}
            </Select>)}
					</FormItem>

					<FormItem {...formItemLayout} label="赛事名称">
						{getFieldDecorator("gamesName", {
							initialValue: gamesName,
							rules: [
								{
									required: true,
									message: "请输入赛事名称"
								}
							]
						})(<Input placeholder="请输入赛事名称" />)}
					</FormItem>
					
            {/* 图标 */}
          <FormItem {...formItemLayout} label="赛事图标">
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

export default connect(({ gamesManager }) => {
	return {};
})(Form.create()(GamesView));
