import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";

import * as actions from "../../store/actions";

import './Login.scss';
import { FormattedMessage } from 'react-intl';
import { handleLoginApi } from '../../services/userService'
import { userLoginSuccess } from '../../store/actions';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            showPassword: false,
            errMessage: '',
        }
    }
    handleUsername = (event) => {
        this.setState({
            username: event.target.value,
        })
    }
    handlePassword = (event) => {
        this.setState({
            password: event.target.value,
        })
    }
    handleLogin = async () => {
        this.setState({
            errMessage: ''
        })
        try {
            let data = await handleLoginApi(this.state.username, this.state.password)
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message
                })
            }
            if (data && data.errCode === 0) {
                //Dùng redux lưu tt user vào cache
                this.props.userLoginSuccess(data.user)
            }

        } catch (error) {
            // Check error trong res
            if (error.response) {
                //Check error trong data
                if (error.response.data) {
                    this.setState({
                        //Lấy lỗi ra màn hình
                        errMessage: error.response.data.message
                    })
                }
            }
        }
    }
    handleShowHidePassword = () => {
        this.setState({
            showPassword: !this.state.showPassword
        })
    }
    handleKeyDown = (event) => {// Ấn enter chạy vào hàm login
        if (event.key === "Enter" || event.key === 13) {
            this.handleLogin()
        }
    }
    render() {

        return (
            <div className='login-background'>
                <div className='login-container'>
                    <div className='login-content row'>
                        <div className='col-12 login-text'>Login</div>
                        <div className='col-12 form-group login-input'>
                            <label>Username:</label>
                            <input type='text' className='form-control' placeholder='Enter your username' value={this.state.username} onChange={(event) => this.handleUsername(event)} />
                        </div>
                        <div className='col-12 form-group login-input'>
                            <label>Password:</label>
                            <input
                                type={this.state.showPassword ? 'text' : 'password'}
                                className='form-control' placeholder='Enter your password' value={this.state.password} onChange={(event) => this.handlePassword(event)}
                                onKeyDown={(event) => this.handleKeyDown(event)} />
                            <span onClick={() => this.handleShowHidePassword()}>
                                <i className={this.state.showPassword ? 'fas fa-eye eye' : 'fas fa-eye-slash eye'}></i>
                            </span>
                        </div>
                        <div className='col-12' style={{ color: 'red' }}>
                            {this.state.errMessage}
                        </div>
                        <div className='col-12'>
                            <button className='btn-login' onClick={() => this.handleLogin()}>Login</button>
                        </div>
                        <div className='col-12'>
                            <span className='forgot-password'>Forgot your password?</span>
                        </div>
                        <div className='col-12 other-login'>
                            <span>Or sign in with</span>
                        </div>
                        <div className='col-12 social-login'>
                            <i className="fab fa-google-plus-g goole"></i>
                            <i className="fab fa-facebook facebook"></i>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        // userLoginFail: () => dispatch(actions.adminLoginFail()),
        userLoginSuccess: (userInfor) => dispatch(actions.userLoginSuccess(userInfor)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
