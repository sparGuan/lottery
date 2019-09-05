import React, { Component, PropTypes } from "react";
import {
  Input,
  Form,
  Button,
  Switch,
  Select
} from "antd";
import moment from "moment";
import { routerRedux } from "dva/router";
import { connect } from "dva";

import config from "../../utils/config";

const FormItem = Form.Item;
class GamesPointView extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  onSubmit (e) {
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
      // 提交所有数据
      console.log(values)
      this.props.onSubmit(values);
    });
  }

  goBack () {
    this.props.dispatch(routerRedux.push({ pathname: "/gamesPoint" }));
  }

  returnRespone = ({ img_url }) => {
    this.props.dispatch({ type: "gamesPointForm/setUrl", payload: { img_url } })
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    const { Option } = Select;
    const { list, status, master_count, slave_count, master_consult, slave_consult, commission, games_id } = this.props
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
          <FormItem {...formItemLayout} label="赛事">
            {getFieldDecorator("games_id", {
              initialValue: (games_id && games_id.toString()),
              rules: [
                {
                  required: true,
                  message: "请输入赛事"
                }
              ]
            })(<Select placeholder="请输入赛事" size="large" style={{ minWidth: 180 }} >
              {list && list.map((item, i) => <Option value={item.id && item.id.toString()} key={item.id}>{item.name}</Option>)}
            </Select>)}
          </FormItem>

          <FormItem {...formItemLayout} label="主场名称">
            {getFieldDecorator("master_count", {
              initialValue: master_count,
              rules: [
                {
                  required: true,
                  message: "请输入主场名称"
                }
              ]
            })(<Input placeholder="请输入主场名称" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="客场名称">
            {getFieldDecorator("slave_count", {
              initialValue: slave_count,
              rules: [
                {
                  required: true,
                  message: "请输入客场名称"
                }
              ]
            })(<Input placeholder="请输入客场名称" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="主场赔率参考值">
            {getFieldDecorator("master_consult", {
              initialValue: master_consult,
              rules: [
                {
                  required: true,
                  message: "请输入主场赔率参考值"
                }
              ]
            })(<Input placeholder="请输入主场赔率参考值" type="number"/>)}
          </FormItem>

          <FormItem {...formItemLayout} label="客场赔率参考值">
            {getFieldDecorator("slave_consult", {
              initialValue: slave_consult,
              rules: [
                {
                  required: true,
                  message: "请输入客场赔率参考值"
                }
              ]
            })(<Input placeholder="请输入客场赔率参考值" type="number"/>)}
          </FormItem>

          <FormItem {...formItemLayout} label="收取佣金(%)">
            {getFieldDecorator("commission", {
              initialValue: commission,
              rules: [
                {
                  required: true,
                  message: "请输入佣金比率"
                }
              ]
            })(<Input placeholder="请输入佣金比率" type="number"/>)}
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

export default connect(({ gamesPoint }) => {
  return {};
})(Form.create()(GamesPointView));
