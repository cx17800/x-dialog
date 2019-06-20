/*
 * Created with Visual Studio Code.
 * github: https://github.com/React-Plugin/x-dialog
 * User: 田想兵
 * Date: 2017-05-16
 * Time: 20:00:00
 * Contact: 55342775@qq.com
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import DialogPortal from './DialogPortal';
import I18n from 'x-i18n';

const renderSubtreeIntoContainer = ReactDOM.unstable_renderSubtreeIntoContainer;

export default class Dialog extends Component {
  static show(config) {
    let myRef = React.createRef;
    let div = document.createDocumentFragment('div')
    let currentConfig = { ...config, isShow: true, ref: ref => myRef = ref };
    function render(props) {
      ReactDOM.render(<Dialog {...props} />, div)
    }
    render(currentConfig);
    return myRef;
  }
  static propTypes = {
    isShow: PropTypes.bool.isRequired,
    mask: PropTypes.bool,
    children: PropTypes.node
  };
  static defaultProps = {
    isShow: false,
    mask: true
  };
  // static getDerivedStateFromProps(props, state){
  //   if(state.isShow!==props.isShow){
  //     return {isShow:props.isShow};
  //   }
  // }
  componentWillReceiveProps(newProps) {
    if (newProps.isShow != this.state.isShow) {
      this.setState({ isShow: newProps.isShow });
    }
  }
  constructor(props) {
    super(props);
    this.state = { isShow: props.isShow };
  }
  hide = () => {
    this.setState({ isShow: false },()=>{
      if(this.node){
        ReactDOM.unmountComponentAtNode(this.node);
        this.node.parentNode.removeChild(this.node)
        this.node =null;
      }
    });
  }
  //props有更新时调用事件,更新portal组件，相当于render。
  // componentWillReceiveProps(newProps) {
  //   this.renderPortal(newProps);
  // }
  componentDidUpdate() {
    this.renderPortal();
  }
  //初始化时插入父级和渲染一次portal组件
  componentDidMount() {
   
    this.renderPortal();
  }
  //模拟render方法，调用portal组件时传入父级容器
  renderPortal() {
    // console.log(this.props)
    let dd = (
    <I18n componentName="Dialog" defaultValue={this.props.local}>
      {this.renderContent}
    </I18n>);
    if (!this.state.isShow) {
      dd = null;
    }else if(!this.node){
      this.node = document.createElement("div");
      document.body.appendChild(this.node);
      renderSubtreeIntoContainer(
        this,
        dd,
        this.node
      );
    }
  }
  renderContent = (local) => {
    // console.log(this.props)
    let props = { ...this.props };
    props.afterHide = () => {
      this.props.afterHide && this.props.afterHide();
      this.hide();
    }
    if (this.state.isShow) {
      if (this.props.draggable) {
        return (
          <DialogPortal {...props} {...this.state} local={local} />
        )
      } else {
        return <DialogPortal {...props} {...this.state} local={local} />
      }
    }
  }
  //组件销毁时触发,移除绑定
  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.node);
    this.node.parentNode.removeChild(this.node);
  }
  render() {
    return null;
  }
}

