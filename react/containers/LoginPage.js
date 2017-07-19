import React from "react";
import style from "./styles/login.css";
import pageStyle from "./styles/page.css";
import {connect} from "react-redux";
import {closeAlert, login} from "../actions/user";
import {Button, Checkbox, Form, Icon, Input, message} from "antd";
import FooterView from "../components/FooterView";
import {isStringEmpty} from "../../util/checker";
import {MSG_ACCOUNT, MSG_PASSWORD} from "../constants/stringConstant";
import {ROUTER_MODIFY_PASSWORD} from "../constants/routerConstant";

const FormItem = Form.Item;

class LoginPage extends React.Component {

    constructor() {
        super();
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div className={pageStyle.page}>
                {this._loginStatus()}
                <div className={pageStyle.pageHeader}>
                    Demeter
                </div>
                <div className={pageStyle.pageContent}>
                    <Form onSubmit={this._handleSubmit.bind(this)} className={style.loginForm}>
                        <FormItem>
                            {getFieldDecorator('account', {
                                rules: [{required: true, min: 3, message: MSG_ACCOUNT}],
                            })(
                                <Input prefix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="账号"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{required: true, min: 6, message: MSG_PASSWORD}],
                            })(
                                <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>} type="password"
                                       placeholder="密码"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <div className={style.loginFormRememberPassword}>
                                    <Checkbox>{'记住密码'}</Checkbox>
                                </div>
                            )}
                            <a
                                className={style.loginFormModify}
                                onClick={()=> this.props.history.push(ROUTER_MODIFY_PASSWORD)}>
                                {'修改密码'}
                            </a>
                            <Button type="primary" htmlType="submit" className={style.loginFormButton}>
                                {'登录'}
                            </Button>
                            <div className={style.loginFormContact}>
                                {'注册账号/重置密码 请联系管理员'}
                            </div>
                        </FormItem>
                    </Form>
                </div>
                <div className={pageStyle.pageFooter}>
                    <FooterView />
                </div>
            </div>
        );
    }

    /**
     * 表单数据回调
     * @param e
     * @private
     */
    _handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.login(values.account, values.password);
            }
        });
    }

    /**
     * 登录状态处理
     * @private
     */
    _loginStatus() {
        if (isStringEmpty(this.props.loginMessage) && !this.props.alertMsg) {
            return;
        }

        if (this.props.loginStatus === 0) {
            message.success(this.props.loginMessage);
        } else {
            message.error(this.props.loginMessage);
        }
        this.props.closeAlert();
    }
}

const LoginPageForm = Form.create()(LoginPage);

function select(state) {
    return {
        alertMsg: state.user.alertMsg,
        loginStatus: state.user.loginStatus,
        loginMessage: state.user.loginMessage
    };
}

function mapDispatchToProps(dispatch) {
    return {
        login: (account, pwd) => login(dispatch, account, pwd),
        closeAlert: () => dispatch(closeAlert)
    }
}

export default connect(select, mapDispatchToProps)(LoginPageForm);