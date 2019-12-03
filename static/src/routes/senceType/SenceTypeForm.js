/*
 * @Author: your name
 * @Date: 2019-11-28 10:37:14
 * @LastEditTime: 2019-11-28 19:56:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\static\src\routes\senceType\SenceTypeForm.js
 */
import React, { Component, PropTypes } from "react";
import { connect } from "dva";
import SenceTypeView from "./SenceTypeView";
import { routerRedux } from "dva/router";

import { message } from "antd";
import { attachmentURL } from "../../utils/config";

const Const = {
	module: "sceneType"
};

class SenceTypeForm extends Component {
	static contextTypes = {
		router: PropTypes.object
	};

	constructor(props, context) {
		super(props, context);
  }

	componentDidMount() {
		const id = this.props.match.params && this.props.match.params.id;
		const { dispatch } = this.props;
		if (id) {
			dispatch({ type: "senceTypeForm/loadSenceType", payload: { id, ...Const } });
    }
	}

	componentWillUnmount() {
		this.props.dispatch({
			type: "senceTypeForm/resetState"
		});
	}

	goBack() {
		this.props.dispatch(routerRedux.push({ pathname: "/games/senceType" }));
	}

	onSubmit(values) {
		const hide = message.loading("正在保存...", 0);

		this.props.dispatch({
			type: "senceTypeForm/saveSenceType",
			payload: {
				...this.props,
				...values,
				...Const,
				callback: data => {
					hide();
					if (data && data.success) {
						message.success("保存成功");
						this.goBack();
					} else {
						message.error("保存失败");
					}
				}
			}
		});
	}

	render() {
    const props = this.props;
		return (
			<SenceTypeView
        addr_url={props.addr_url}
				sname={props.sname}
				onSubmit={this.onSubmit.bind(this)}
			/>
		);
	}
}

export default connect(({ senceTypeForm, app }) => {
  console.log(senceTypeForm)
	return {
		...senceTypeForm,
		content: senceTypeForm.con,
		uid: app.user.uid,
		username: app.user.name
	};
})(SenceTypeForm);
