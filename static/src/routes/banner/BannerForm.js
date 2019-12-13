/*
 * @Author: your name
 * @Date: 2019-11-20 09:05:53
 * @LastEditTime: 2019-11-28 14:29:09
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\static\src\routes\banner\BannerForm.js
 */
import React, { Component, PropTypes } from "react";
import { connect } from "dva";
import BannerView from "./BannerView";
import { routerRedux } from "dva/router";

import { message } from "antd";
import { attachmentURL } from "../../utils/config";

const Const = {
	module: "banner"
};

class BannerForm extends Component {
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
			dispatch({ type: "bannerForm/loadBanner", payload: { id, ...Const } });
    }
	}

	componentWillUnmount() {
		this.props.dispatch({
			type: "bannerForm/resetState"
		});
	}

	goBack() {
		this.props.dispatch(routerRedux.push({ pathname: "/games/banner" }));
	}

	onSubmit(values) {
		const hide = message.loading("正在保存...", 0);

		this.props.dispatch({
			type: "bannerForm/saveBanner",
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
			<BannerView
        addr_url={props.addr_url}
        img_url={props.img_url}
				status={props.status}
				seotitle={props.seotitle}
				onSubmit={this.onSubmit.bind(this)}
			/>
		);
	}
}

export default connect(({ bannerForm, app }) => {
  console.log(bannerForm)
	return {
		...bannerForm,
		content: bannerForm.con,
		uid: app.user.uid,
		name: app.user.name
	};
})(BannerForm);
