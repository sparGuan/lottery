import React, { Component, PropTypes } from "react";
import {
  Input,
  Form,
  Button,
  Switch,
  Select,
  DatePicker
} from "antd";
import moment from "moment";
import { routerRedux } from "dva/router";
import { connect } from "dva";
import { UploadFile, PlayBox } from '../../components'

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
      values.master_start_time = moment(values.master_start_time).format("YYYY-MM-DD HH:mm");
      // 提交所有数据
      this.props.onSubmit(values);
    });
  }
  
  goBack () {
    this.props.dispatch(routerRedux.push({ pathname: "/games/gamesPoint" }));
  }

  returnResponeMaster = ({ img_url }) => {
    this.props.dispatch({ type: "gamesPointForm/setMasterUrl", payload: { master_img_url: img_url } })
  }
  returnResponeSlave = ({ img_url }) => {
    this.props.dispatch({ type: "gamesPointForm/setSlaveUrl", payload: { slave_img_url: img_url } })
  }
  returnToParentData = (data) => {
    let gamesPlay = encodeURI(JSON.stringify(data))  
    this.props.dispatch({ type: "gamesPointForm/setGamesPlay", payload: { gamesPlay } })
  }
  componentDidMount() {
    
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    const { Option } = Select;
    let { list, status, master_count, slave_count, master_consult, slave_consult, commission, games_id, master_info, slave_info, master_start_time,master_img_url, slave_img_url, flat_consult, gamesPlay } = this.props
    if (master_start_time) {
      master_start_time = moment(master_start_time, 'YYYY-MM-DD HH:mm')
    }
    if (gamesPlay) {
      gamesPlay = JSON.parse(decodeURI(gamesPlay))
    } else {
      gamesPlay = []
    }
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

          {/** 主场logo */}
          <FormItem {...formItemLayout} label="主场logo">
              <UploadFile  returnRespone={this.returnResponeMaster} img_url={master_img_url}/>
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
          
          {/** 主场描述 */}
          <FormItem {...formItemLayout} label="主场描述(例如：主+ 1，主-2)">
            {getFieldDecorator("master_info", {
              initialValue: master_info,
              rules: [
                {
                  required: true,
                  message: "请输入主场描述"
                  
                }
              ]
            })(<Input placeholder="请输入主场描述" />)}
          </FormItem>

          {/** 主场开始时间 */}
          <FormItem {...formItemLayout} label="赛点开始时间">
            {getFieldDecorator("master_start_time", {
              initialValue: master_start_time,
              rules: [
                {
                  required: true,
                  message: "请输入赛点开始时间"
                }
              ]
            })(<DatePicker format="YYYY-MM-DD HH:mm" />)}
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
          
          {/** 客场logo */}
          <FormItem {...formItemLayout} label="客场logo">
              <UploadFile  returnRespone={this.returnResponeSlave} img_url={slave_img_url}/>
					</FormItem>

          {/** 客场描述 */}
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

          <FormItem {...formItemLayout} label="客场描述(例如：客+ 1，客-2)">
            {getFieldDecorator("slave_info", {
              initialValue: slave_info,
              rules: [
                {
                  required: true,
                  message: "请输入客场描述(例如：客+ 1，客-2)"
                }
              ]
            })(<Input placeholder="请输入客场描述(例如：客+ 1，客-2)" />)}
          </FormItem>

           {/** 客场开始时间 */}
          {/* <FormItem {...formItemLayout} label="客场开始时间">
            {getFieldDecorator("slave_start_time", {
              initialValue: slave_start_time,
              rules: [
                {
                  required: true,
                  message: "请输入客场开始时间"
                }
              ]
            })(<DatePicker format="MM-DD" />)}
          </FormItem>  */}

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


          <FormItem {...formItemLayout} label="平场赔率参考值">
              {getFieldDecorator('flat_consult', {
                initialValue: flat_consult,
              })(<Input type="number" />)}
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
            {/*玩法  */}
          <FormItem {...formItemLayout} label="庄盘玩法：">
              <PlayBox returnToParentData={(data) => {this.returnToParentData(data)}} playList={gamesPlay}></PlayBox>
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
