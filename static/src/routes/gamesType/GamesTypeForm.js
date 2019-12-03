/*
 * @Author: your name
 * @Date: 2019-11-27 14:03:56
 * @LastEditTime: 2019-11-28 14:28:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\static\src\routes\gamesType\gamesTypeForm.js
 */
import React, { Component, PropTypes } from "react";
import { connect } from "dva";
import GamesTypeView from "./GamesTypeView";
import { routerRedux } from "dva/router";

import { message } from "antd";
import { attachmentURL } from "../../utils/config";

const Const = {
	module: "gamesType"
};

class GamesTypeForm extends Component {
	static contextTypes = {
		router: PropTypes.object
	};

	constructor(props, context) {
		super(props, context);
  }

	componentDidMount() {
		const id = this.props.match.params && this.props.match.params.id;
		const { dispatch } = this.props;
		console.log(id)
		if (id) {
			dispatch({ type: "gamesTypeForm/loadGamesType", payload: { id, ...Const } });
    }
	}

	componentWillUnmount() {
		this.props.dispatch({
			type: "gamesTypeForm/resetState"
		});
	}

	goBack() {
		this.props.dispatch(routerRedux.push({ pathname: "/games/gamesType" }));
	}

	onSubmit(values) {
		const hide = message.loading("正在保存...", 0);

		this.props.dispatch({
			type: "gamesTypeForm/saveGamesType",
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
			<GamesTypeView
				status={props.status}
				name={props.name}
				onSubmit={this.onSubmit.bind(this)}
			/>
		);
	}
}

export default connect(({ gamesTypeForm, app }) => {
	return {
		...gamesTypeForm,
		content: gamesTypeForm.con,
		uid: app.user.uid,
		username: app.user.name
	};
})(GamesTypeForm);
