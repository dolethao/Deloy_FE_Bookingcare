import React, { Component } from 'react';
import { connect } from "react-redux";
import './DoctorExtralinfor.scss';
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import { getExtraInforDoctorById } from '../../../services/userService'
import NumberFormat from 'react-number-format';

class DoctorExtralinfor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowHidePrice: false,
            extraInfor: {}
        }
    }
    async componentDidMount() {
        if (this.props.doctorIdFromParent) {//Nếu có props từ cha truyền xuống thì thực hiện
            let res = await getExtraInforDoctorById(this.props.doctorIdFromParent);
            if (res && res.errCode == 0) {
                this.setState({
                    extraInfor: res.data
                })
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            // Lấy giá khám tên, địa chỉ phòng khám nếu có theo id doctor
            let res = await getExtraInforDoctorById(this.props.doctorIdFromParent);
            if (res && res.errCode == 0) {
                this.setState({
                    extraInfor: res.data
                })
            }
        }
    }
    handleShowHide = (status) => {//  Ẩn hiện giá khám
        this.setState({
            isShowHidePrice: status
        })
    }
    render() {
        let { isShowHidePrice, extraInfor } = this.state
        let { language } = this.props
        return (
            <>
                <div className='doctor-extral-infor-container'>
                    <div className='content-up'>
                        <div className='text-address'><FormattedMessage id='patient.extra-infor-doctor.text-address' /></div>
                        <div className='name-cilinic'>{extraInfor && extraInfor.nameCilinic ? extraInfor.nameCilinic : ''}</div>
                        <div className='address-cilinic'>{extraInfor && extraInfor.addressClinic ? extraInfor.addressClinic : ''}</div>
                    </div>
                    <div className='content-down'>
                        {isShowHidePrice === false &&
                            <div className='show'><FormattedMessage id='patient.extra-infor-doctor.price' />:
                                {extraInfor && extraInfor.priceTypeData && language === LANGUAGES.VI &&
                                    <NumberFormat
                                        className='currency'
                                        value={extraInfor.priceTypeData.valueVi}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        suffix={'VND'}
                                    />
                                }
                                {extraInfor && extraInfor.priceTypeData && language === LANGUAGES.EN &&
                                    <NumberFormat
                                        className='currency'
                                        value={extraInfor.priceTypeData.valueEn}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        suffix={'$'}
                                    />
                                }
                                <span onClick={() => this.handleShowHide(true)}><a href='#'><FormattedMessage id='patient.extra-infor-doctor.show' /></a></span></div>
                        }
                        {isShowHidePrice === true &&
                            <>
                                <div className='title-price'><FormattedMessage id='patient.extra-infor-doctor.price' />: .</div>
                                <div className='text-up'>
                                    <div>
                                        <span className='left'><FormattedMessage id='patient.extra-infor-doctor.price' /></span>
                                        <span className='right'>
                                            {extraInfor && extraInfor.priceTypeData && language === LANGUAGES.VI &&
                                                <NumberFormat
                                                    className='currency'
                                                    value={extraInfor.priceTypeData.valueVi}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    suffix={'VND'}
                                                />
                                            }
                                            {extraInfor && extraInfor.priceTypeData && language === LANGUAGES.EN &&
                                                <NumberFormat
                                                    className='currency'
                                                    value={extraInfor.priceTypeData.valueEn}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    suffix={'$'}
                                                />
                                            }

                                        </span>
                                    </div>

                                    <div className='bottom'>
                                        {extraInfor && extraInfor.note ? extraInfor.note : ''}
                                    </div>
                                </div>

                                <div className='text-down'><FormattedMessage id='patient.extra-infor-doctor.payment' /> &nbsp;
                                    {extraInfor && extraInfor.paymentTypeData && language === LANGUAGES.VI ?
                                        extraInfor.paymentTypeData.valueVi : ''}
                                    {extraInfor && extraInfor.paymentTypeData && language === LANGUAGES.EN ?
                                        extraInfor.paymentTypeData.valueEn : ''}

                                </div>
                                <div onClick={() => this.handleShowHide(false)} className='hide'><a href='#'><FormattedMessage id='patient.extra-infor-doctor.hide' /></a></div>
                            </>
                        }
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtralinfor);
