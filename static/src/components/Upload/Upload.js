/*
 * @Author: your name
 * @Date: 2019-11-20 09:05:53
 * @LastEditTime: 2019-11-28 15:07:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\static\src\components\Upload\Upload.js
 */
import React, { PureComponent } from 'react'
import { Upload, Icon, message } from 'antd';
import Cookie from "../../utils/js.cookie"

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

class UploadFile extends PureComponent {
  state = {
    loading: false,
    imageUrl: ''
  };

  handleChange = async (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }, () => {
          // 返回给父组件
          this.props.returnRespone({
            img_url: info.file.response.file
          })
        }),
      );
    }
  };

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { imageUrl } = this.state;
    const { img_url } = this.props;
    return (
      <Upload
        name="Upload"
        listType="picture-card"
        className="upload-uploader"
        showUploadList={false}
        headers={{Authorization: Cookie.get("SESSION_TOKEN") }}
        action="http://127.0.0.1:7001/api/upload"
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {imageUrl || img_url ? <img src={imageUrl || `http://127.0.0.1:7001/public/uploads/${img_url}`} alt="Upload" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    );
  }
}

export default UploadFile