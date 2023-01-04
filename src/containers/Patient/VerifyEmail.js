import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { getVerifyBookAppoinment } from '../../services/userService'
import HomeHeader from '../HomePage/HomeHeader'
import './VerifyEmail.scss'
class VerifyEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statusVerify: false,//Trạng thái data
            errCode: ''//Kết quả
        }
    }
    async componentDidMount() {//Lấy token & dotorId trên URL
        if (this.props.location && this.props.location.search) {
            let urlParams = new URLSearchParams(this.props.location.search);
            let token = urlParams.get('token');
            let doctorId = urlParams.get('doctorId');
            let res = await getVerifyBookAppoinment({
                token: token,
                doctorId: doctorId
            })
            if (res && res.errCode === 0) {
                this.setState({
                    statusVerify: true,
                    errCode: res.errCode
                })
            } else {
                this.setState({
                    statusVerify: true,
                    errCode: -1
                })
            }

        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

    }
    render() {
        let { errCode, statusVerify } = this.state;
        return (
            <>
                <HomeHeader />
                <div className='verify-email-container'>
                    {statusVerify === false ?

                        <div><FormattedMessage id='patient.verify-email.loading-data' /></div>
                        :
                        <div>
                            {errCode === 0 ?
                                <div className='infor-booking'><FormattedMessage id='patient.verify-email.succedd' /></div>
                                :
                                <div className='infor-booking'><FormattedMessage id='patient.verify-email.failed' /></div>
                            }
                        </div>
                    }
                </div>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
