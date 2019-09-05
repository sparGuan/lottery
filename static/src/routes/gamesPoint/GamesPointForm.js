import React, { Component, PropTypes } from "react";
import { connect } from "dva";
import GamesPointView from "./GamesPointView";
import { routerRedux } from "dva/router";

import { message } from "antd";
import { attachmentURL } from "../../utils/config";

const Const = {
	module: "gamesPoint"
};

class GamesPointForm extends Component {
	static contextTypes = {
		router: PropTypes.object
	};

	constructor(props, context) {
		super(props, context);
  }

	componentDidMount() {
		const id = this.props.match.params && this.props.match.params.id;
		const { dispatch } = this.props;
    dispatch({ type: "gamesPointForm/loadGames", payload: {} });
		if (id) {
			dispatch({ type: "gamesPointForm/loadGamesPoint", payload: { id, ...Const } });
    }
	}

	componentWillUnmount() {
		this.props.dispatch({
			type: "gamesPointForm/resetState"
		});
	}

	goBack() {
		this.props.dispatch(routerRedux.push({ pathname: "/gamesPoint" }));
	}

	onSubmit(values) {
		const hide = message.loading("正在保存...", 0);

		this.props.dispatch({
			type: "gamesPointForm/saveGamesPoint",
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
			<GamesPointView
        master_count={props.master_count}
				slave_count={props.slave_count}
        room_nums={props.room_nums}
        status={props.status}
        master_consult={props.master_consult}
        slave_consult={props.slave_consult}
        commission={props.commission}
        games_id={props.games_id}
        list={props.list}
				onSubmit={this.onSubmit.bind(this)}
			/>
		);
	}
}

export default connect(({ gamesPointForm, app }) => {
	return {
		...gamesPointForm,
		content: gamesPointForm.con,
		uid: app.user.uid,
		name: app.user.name
	};
})(GamesPointForm);
