import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import './DetailClinic.scss'
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtralinfor from '../Doctor/DoctorExtralinfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { getDetailClinictyById } from '../../../services/userService'
import _ from 'lodash';
import HomeFooter from '../../HomePage/HomeFooter';
class DetailClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctors: [],//doctor of clinic
            dataDetailClinic: {},//mô tả clinic
        }
    }
    async componentDidMount() {
        // Lấy id specialty trên thanh URL 
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id

            // Truyền xuống id doctor cần lấy thông tin và hứng vào res
            let res = await getDetailClinictyById({
                id: id,
            });
            if (res && res.errCode === 0) {
                let data = res.data;
                let arrDoctorId = [];
                if (data && !_.isEmpty(res.data)) {
                    let arr = data.doctorClinic;
                    if (arr && arr.length > 0) {
                        arr.map(item => {//Đẩy doctorId vào
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }

                this.setState({
                    dataDetailClinic: res.data,
                    arrDoctors: arrDoctorId,
                })
            }

        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

    }
    render() {
        let { language } = this.props
        let { arrDoctors, dataDetailClinic } = this.state
        console.log('Check state', this.state)
        return (
            <div className='detail-specialty-container'>
                <HomeHeader />
                <div className='detail-specialty-description'>
                    {dataDetailClinic && dataDetailClinic.descriptionHTML &&
                        <>
                            <div>{dataDetailClinic.name}</div>
                            <div dangerouslySetInnerHTML={{ __html: dataDetailClinic.descriptionHTML }}></div>
                        </>

                    }
                </div>
                <div className='detail-specialty-body'>
                    {arrDoctors && arrDoctors.length > 0 &&
                        arrDoctors.map((item, index) => {
                            return (
                                <div className='each-doctor' key={index}>
                                    <div className='specialty-content-left'>
                                        <div className='profile-doctor'>
                                            <ProfileDoctor
                                                doctorId={item}
                                                isShowDescriptionDoctor={true}
                                                isShowPriceDoctor={false}
                                                isShowLinkDetail={true}
                                            />
                                        </div>
                                    </div>
                                    <div className='specialty-content-right'>
                                        <div className='doctor-schedule'>
                                            <DoctorSchedule // Truyền sang con id doctor
                                                doctorIdFromParent={item} />
                                        </div>
                                        <div className='doctor-extrainfor'>
                                            <DoctorExtralinfor
                                                doctorIdFromParent={item} />
                                        </div>

                                    </div>

                                </div>
                            )
                        })}
                </div>
                <HomeFooter />
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
