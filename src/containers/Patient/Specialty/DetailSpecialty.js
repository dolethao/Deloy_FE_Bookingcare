import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import './DetailSpecialty.scss'
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtralinfor from '../Doctor/DoctorExtralinfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { getDetailSpecialtyById, getAllCodeService } from '../../../services/userService'
import _ from 'lodash';
class DetailSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctors: [],//doctor of specialty
            dataDetailSpecialty: {},//mô tả specialty
            listProvince: [],//search tỉnh thành
        }
    }
    async componentDidMount() {
        // Lấy id specialty trên thanh URL 
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id

            // Truyền xuống id doctor cần lấy thông tin và hứng vào res
            let res = await getDetailSpecialtyById({
                id: id,
                location: 'ALL'
            });
            let resProvince = await getAllCodeService('PROVINCE');// Lấy all tỉnh thành
            if (res && res.errCode === 0 && resProvince && resProvince.errCode === 0) {
                let data = res.data;
                let arrDoctorId = [];
                if (data && !_.isEmpty(res.data)) {
                    let arr = data.doctorSpecialty;
                    if (arr && arr.length > 0) {
                        arr.map(item => {//Đẩy doctorId vào
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }
                let dataProvince = resProvince.data;
                if (dataProvince && dataProvince.length > 0) {
                    dataProvince.unshift({// Thêm ptu vào đẩy vào vị trí đầu tiên
                        keyMap: 'ALL',
                        type: 'PROVINCE',
                        valueVi: "Toàn quốc",
                        valueEn: 'ALL'
                    })
                }
                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctors: arrDoctorId,
                    listProvince: dataProvince ? dataProvince : []
                })
            }

        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

    }
    handleSelectProvince = async (event) => {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id
            let location = event.target.value
            // Truyền xuống id doctor cần lấy thông tin và hứng vào res
            let res = await getDetailSpecialtyById({
                id: id,
                location: location
            });
            let resProvince = await getAllCodeService(location);// Lấy tỉnh thành
            if (res && res.errCode === 0 && resProvince && resProvince.errCode === 0) {
                let data = res.data;
                let arrDoctorId = [];
                if (data && !_.isEmpty(res.data)) {
                    let arr = data.doctorSpecialty;
                    if (arr && arr.length > 0) {
                        arr.map(item => {//Đẩy doctorId vào
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }
                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctors: arrDoctorId,
                })
            }
        }
    }
    render() {
        let { language } = this.props
        let { arrDoctors, dataDetailSpecialty, listProvince } = this.state
        console.log('Check state', this.state)
        return (
            <div className='detail-specialty-container'>
                <HomeHeader />
                <div className='detail-specialty-description'>
                    {dataDetailSpecialty && dataDetailSpecialty.descriptionHTML &&
                        <div dangerouslySetInnerHTML={{ __html: dataDetailSpecialty.descriptionHTML }}></div>}
                </div>
                <div className='detail-specialty-body'>
                    <div className='search-specialty-doctor'>
                        <select onChange={(event) => this.handleSelectProvince(event)} className='selected-province'>
                            {listProvince && listProvince.length > 0 &&
                                listProvince.map((item, index) => {
                                    return (
                                        <option key={index} value={item.keyMap}>{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                                    )

                                })}
                        </select>
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
