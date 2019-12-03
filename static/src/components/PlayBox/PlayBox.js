import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import styles from './PlayBox.less'
import { Card, Row, Col, Button, Form, Input, Icon, Select } from 'antd'
import { connect } from "dva";
import { query } from '../../services/senceType'
const FormItem = Form.Item;
const Option = Select.Option;
class PlayBox extends React.Component {
  state = {
    playList: [
      
    ],
    senceList: []
  }
  async componentDidMount() {
    const getSenceData = await query({})
    this.setState({senceList: getSenceData.data.record})
  }
  
  componentWillReveiceProps(nextProps) {
    console.log(nextProps)
  }


  addPlay = () => {
    let { returnToParentData ,playList } = this.props
    playList.push({
      name: '',
      type: '0',
      master_consult: '',
      flat_consult: '',
      slave_consult: '',
      sence_types_id: '6'
    })
    returnToParentData(playList)
    // this.setState({ playList })
  }
  componentWillUpdate(props,state) {
    const { returnToParentData } = props
    if (state.playList.length > 0 && returnToParentData) {
        returnToParentData(state.playList)
    }
    // this.setState({playList})
  }
  remove = (e, i) => {
    let { playList, returnToParentData } = this.props
    if (playList.length > 1) {
      playList.splice(i, 1)
    } 
    else {
      playList = []
    }
    returnToParentData(playList)
    // this.setState({ playList })
  }
  handelChange = (e, i, key) => {
    let { playList, returnToParentData } = this.props
    playList[i][key] = e.target.value
    returnToParentData(playList)
    // this.setState({ playList  })
  }
  handlePlayTypeChange = (e, i, key) => {
    let { playList,returnToParentData } = this.props
    playList[i][key] = e.target.value
    returnToParentData(playList)
    // this.setState({ playList })
  }

  render () {
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 12 }
    };
    let { playList } = this.props
    return (
     <div style={{ background: '#ECECEC', padding: '10px' }}>
        <Button style={{ marginBottom: 15}} onClick={e => this.addPlay()}>+ 添加玩法</Button>
        <Row gutter={16}>
        {playList.length > 0 &&
          playList.map((item,index) => (
            <Col span={8} key={index} style={{ marginBottom: 15}} >
              <Card  bordered={false} className={styles.playCard}   >
                  <div className="play-top" onClick={(event) => {this.remove(event, index)}}>
                    <Icon type="close-circle-o" />
                  </div>
                  <FormItem {...formItemLayout} label="名称：">
                      <Input placeholder="请输入玩法名称"  value={item.name} onChange={(event) => {this.handelChange(event, index, 'name')}}/>
                  </FormItem> 

                  <FormItem {...formItemLayout} label="玩法类别：">
                      <Select defaultValue={item.type} style={{ width: 90 }} onChange={(event) => {this.handelChange(event, index, 'type')}}>
                          <Option value="0">胜平负</Option>
                          <Option value="1" disabled>比分</Option>
                          <Option value="2" disabled>大小</Option>
                      </Select>
                  </FormItem> 

                  {/* <FormItem {...formItemLayout} label="场次：">
                      <Select defaultValue={String(item.sence_types_id)} style={{ width: 90 }} onChange={(event) => {this.handelChange(event, index, 'sence_types_id')}}>
                        { this.state.senceList.map((item, index) => (
                            <Option value={String(item.id)} key={index} disabled>{item.sname}</Option>
                        ))}
                      </Select>
                  </FormItem> */}
                  

                  <FormItem {...formItemLayout} label="主盘参考赔率：" >
                      <Input placeholder="default size" type="number" value={item.master_consult} onChange={(event) => {this.handelChange(event, index, 'master_consult')}}/>
                  </FormItem> 

                  <FormItem {...formItemLayout} label="平盘参考赔率：">
                      <Input placeholder="default size" type="number" value={item.flat_consult} onChange={(event) => {this.handelChange(event, index, 'flat_consult')}}/>
                  </FormItem> 

                  <FormItem {...formItemLayout} label="客盘参考赔率：">
                      <Input placeholder="default size" type="number" value={item.slave_consult} onChange={(event) => {this.handelChange(event, index, 'slave_consult')}}/>
                  </FormItem> 
              </Card>
            </Col>
          ))}
          </Row>
     </div>
    )
  }
}


PlayBox.propTypes = {
}

// export default PlayBox
export default PlayBox;
