import React, { Component, PropTypes } from "react";
import { connect } from "dva";
import GamesView from "./GamesView";
import { routerRedux } from "dva/router";

import { message } from "antd";
import { attachmentURL } from "../../utils/config";

const Const = {
	module: "gamesManager"
};

class GamesForm extends Component {
	static contextTypes = {
		router: PropTypes.object
	};

	constructor(props, context) {
		super(props, context);
  }

	componentDidMount() {
		const id = this.props.match.params && this.props.match.params.id;
		const { dispatch } = this.props;
    dispatch({ type: "gamesForm/loadTypes", payload: {} });
    dispatch({ type: "gamesForm/loadLevel", payload: {} });
		if (id) {
			dispatch({ type: "gamesForm/loadGames", payload: { id, ...Const } });
    }
	}

	componentWillUnmount() {
		this.props.dispatch({
			type: "gamesForm/resetState"
		});
	}

	goBack() {
		this.props.dispatch(routerRedux.push({ pathname: "/gamesManager" }));
	}

	onSubmit(values) {
		const hide = message.loading("正在保存...", 0);

		this.props.dispatch({
			type: "gamesForm/saveGames",
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
			<GamesView
        gamesName={props.gamesName}
        img_url={props.img_url}
        games_types_id={props.games_types_id}
        games_level_id={props.games_level_id}
				status={props.status}
				seotitle={props.seotitle}
        list={props.list}
        level_List={props.level_List}
				onSubmit={this.onSubmit.bind(this)}
			/>
		);
	}
}

export default connect(({ gamesForm, app }) => {
	return {
		...gamesForm,
		content: gamesForm.con,
		uid: app.user.uid,
		name: app.user.name
	};
})(GamesForm);
