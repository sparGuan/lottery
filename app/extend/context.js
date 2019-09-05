// exports.returnJson = ({ code = 0, message = '操作成功', success = true, data = {} }) => {
//   console.log(this.body)
//   this.body = {
//     code,
//     success, 
//     message,
//     data,
//   };
// }
// const _ = require('lodash');
module.exports = {
	/**
	 * 返回json
	 * @param {*} code
	 * @param {*} msg
	 * @param {*} data
	 */
	returnJson({ code = 0, message = '操作成功', success = true, data = {} }) {
    this.body = {
      code,
      success, 
      message,
      data,
    };
  }
};

