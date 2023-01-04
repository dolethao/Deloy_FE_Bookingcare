import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import './ProfileDoctor.scss'
import { getProfileDoctorById } from '../../../services/userService'
import NumberFormat from 'react-number-format';
import _ from 'lodash';
import moment from 'moment'
import { Link } from 'react-router-dom';


class ProfileDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProfile: {}
        }
    }
    async componentDidMount() {
        let data = await this.getInforDoctor(this.props.doctorId)
        this.setState({// Lưu data nhận đc vào state
            dataProfile: data
        })

    }
    getInforDoctor = async (id) => {
        let result = {};
        if (id) {
            let res = await getProfileDoctorById(id);
            if (res && res.errCode === 0) {
                result = res.data;
            }
        }
        return result
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
        }
    }
    renderTimeBooking = (dataTime) => {// Handle dataTime
        let { language } = this.props
        if (dataTime && !_.isEmpty(dataTime)) {
            // format date
            let date = language === LANGUAGES.VI ?
                //mls => s
                this.capitalizeFirstLetter(moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY'))
                :
                moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY');
            let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;
            return (
                <>
                    <div>{time} {date}</div>
                    <div><FormattedMessage id="patient.booking-model.price-booking" /></div>
                </>
            )
        }
        return <></>
    }
    capitalizeFirstLetter(string) {//Viết hoa chữ cái đầu của thứ Vi
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    render() {
        //Lấy từ cha truyền sang
        let { language, isShowDescriptionDoctor, dataTime, isShowPriceDoctor, isShowLinkDetail, doctorId } = this.props
        let { dataProfile, } = this.state
        let nameVi = '', nameEn = '';
        if (dataProfile && dataProfile.positionData) {
            nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName}`
            nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`
        }
        return (
            <div className='profile-doctor'>
                <div className='intro-doctor'>
                    <div className='content-left' style={{ backgroundImage: `url(${dataProfile && dataProfile.image ? dataProfile.image : ''})` }}>
                    </div>
                    <div className='content-right'>
                        <div className='up'>{language === LANGUAGES.VI ? nameVi : nameEn}</div>
                        <div className='down'>
                            {isShowDescriptionDoctor === true ? // Không show thông tin bác sĩ
                                <>
                                    {dataProfile && dataProfile.Markdown && dataProfile.Markdown.description &&
                                        <div>
                                            {dataProfile.Markdown.description}<br />
                                        </div>
                                    }
                                </>
                                :
                                <>{this.renderTimeBooking(dataTime)}</>
                            }
                        </div>

                    </div>

                </div>
                {isShowLinkDetail === true ?//Điều hướng đến trang detail doctor
                    <div className='link-detail-doctor'>
                        <Link to={`/detail-doctor/${doctorId}`}>Xem thêm</Link>
                    </div>
                    : ''}
                {isShowPriceDoctor === true ?// Show giá khám bệnh
                    <div className='price'><FormattedMessage id="patient.booking-model.price" /> &nbsp;


                        {dataProfile && dataProfile.Doctor_Infor && language === LANGUAGES.VI &&
                            <NumberFormat
                                className='currency'
                                value={dataProfile.Doctor_Infor.priceTypeData.valueVi}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix={'VND'}
                            />
                        }
                        {dataProfile && dataProfile.Doctor_Infor && language === LANGUAGES.EN &&
                            <NumberFormat
                                className='currency'
                                value={dataProfile.Doctor_Infor.priceTypeData.valueEn}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix={'$'}
                            />
                        }

                    </div>
                    :
                    ""
                }
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
