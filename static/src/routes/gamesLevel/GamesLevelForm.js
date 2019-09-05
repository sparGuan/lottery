import React, { Component, PropTypes } from "react";
import { connect } from "dva";
import GamesLevelView from "./GamesLevelView";
import { routerRedux } from "dva/router";

import { message } from "antd";
import { attachmentURL } from "../../utils/config";

const Const = {
	module: "gamesLevel"
};

class GamesLevelForm extends Component {
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
			dispatch({ type: "gamesLevelForm/loadGamesLevel", payload: { id, ...Const } });
    }
	}

	componentWillUnmount() {
		this.props.dispatch({
			type: "gamesLevelForm/resetState"
		});
	}

	goBack() {
		this.props.dispatch(routerRedux.push({ pathname: "/gamesLevel" }));
	}

	onSubmit(values) {
		const hide = message.loading("正在保存...", 0);

		this.props.dispatch({
			type: "gamesLevelForm/saveGamesLevel",
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
			<GamesLevelView
        name={props.name}
				seotitle={props.seotitle}
				onSubmit={this.onSubmit.bind(this)}
			/>
		);
	}
}

export default connect(({ gamesLevelForm, app }) => {
  console.log(gamesLevelForm)
	return {
		...gamesLevelForm,
		content: gamesLevelForm.con,
		uid: app.user.uid
	};
})(GamesLevelForm);
