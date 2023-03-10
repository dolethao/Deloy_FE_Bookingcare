import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES } from '../../../../utils/';
import { FormattedMessage } from 'react-intl';
import './BookingModal.scss'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import ProfileDoctor from '../ProfileDoctor';
import _ from 'lodash';
import DatePicker from '../../../../components/Input/DatePicker';
import * as actions from '../../../../store/actions'
import Select from 'react-select';
import { getPatientBookAppoinment } from '../../../../services/userService'
import { toast } from "react-toastify"
import moment from 'moment'
import LoadingOverlay from 'react-loading-overlay'


class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            selectedGender: '',
            genders: '',
            birthday: '',
            doctorId: '',
            timeType: '',

            isShowLoading: false
        }
    }
    async componentDidMount() {
        this.props.getGenders()//fire actions
    }

    buildDataGender = (data) => {
        let result = [];
        let { language } = this.props;
        if (data && data.length > 0) {
            data.map((item => {
                let object = {};
                object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn
                object.value = item.keyMap
                result.push(object)
            }))
        }
        return result;
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if (this.props.genders !== prevProps.genders) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if (this.props.dataTime !== prevProps.dataTime) {//L???y th??m doctorId & timeType
            if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
                let doctorId = this.props.dataTime.doctorId
                let timeType = this.props.dataTime.timeType
                this.setState({
                    doctorId: doctorId,
                    timeType: timeType
                })
            }
        }
    }
    handleChangeInPut = (event, id) => {// L???y DL input
        let valueInput = event.target.value
        let stateCopy = { ...this.states }
        stateCopy[id] = valueInput// g??n state theo id
        this.setState({
            ...stateCopy
        })
    }
    handleDatePicker = (date) => {
        this.setState({
            birthday: date[0]//L???y ????ng g??a tr???
        })
    }
    handleChangeSelect = (selectedOption) => {
        this.setState({
            selectedGender: selectedOption
        })
    }
    buildTimeBooking = (dataTime) => {// Handle dataTime truy???n ??i ????? g??? mail
        let { language } = this.props
        if (dataTime && !_.isEmpty(dataTime)) {
            // format date
            let date = language === LANGUAGES.VI ?
                //mls => s
                this.capitalizeFirstLetter(moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY'))
                :
                moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY');
            let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueEn : dataTime.timeTypeData.valueVi;
            return `${time} - ${date}` //8:00 - 9:00  Ch??? nh???t 25/09/2022
        }
        return ''
    }
    buildDoctorName = (dataTime) => {// Handle doctorName truy???n ??i ????? g??? mail
        let { language } = this.props
        if (dataTime && !_.isEmpty(dataTime)) {
            let name = language === LANGUAGES.VI ? `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
                :
                `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName} `
            return name
        }
        return ''
    }
    capitalizeFirstLetter(string) {//Vi???t hoa ch??? c??i ?????u c???a th??? Vi
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    handleConfirmBooking = async () => {
        let date = new Date(this.state.birthday).getTime()// Convert timestamp
        let timeString = this.buildTimeBooking(this.props.dataTime)// Truy???n v??o dataTime ????? build timeString truy???n ??i
        let doctorName = this.buildDoctorName(this.props.dataTime)// Truy???n v??o dataTime ????? build doctorName truy???n ??i
        this.setState({
            isShowLoading: true
        })
        let res = await getPatientBookAppoinment({
            fullName: this.state.fullName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            selectedGender: this.state.selectedGender.value,
            date: this.props.dataTime.date,
            birthday: date,
            doctorId: this.state.doctorId,
            timeType: this.state.timeType,
            language: this.props.language,
            timeString: timeString,
            doctorName: doctorName
        })
        this.setState({
            isShowLoading: false
        })
        if (res && res.errCode === 0) {
            toast.success('Booking a new appointment sussed')
            this.props.isCloseModalBooking({})// ????ng modal
            this.setState({
                fullName: '',
                phoneNumber: '',
                email: '',
                address: '',
                reason: '',
                selectedGender: '',
                birthday: '',

            })
        } else {
            toast.error('Booking a new appointment failed')
        }
    }
    render() {
        // l???y t??? cha truy???n sang
        let { language, isOpenModalBooking, isCloseModalBooking, dataTime, } = this.props
        let doctorId = ''// truy???n sang con Profile
        if (dataTime && !_.isEmpty(dataTime)) {
            doctorId = dataTime.doctorId
        }
        return (
            <LoadingOverlay
                active={this.state.isShowLoading}
                spinner
                text='Loading...'
            >
                <Modal
                    isOpen={isOpenModalBooking}
                    className={'booking-modal-container'}
                    size='lg'
                    centered>
                    <div className="booking-modal-content">
                        <div className='booking-modal-header'>
                            <span className='left'><FormattedMessage id="patient.booking-model.title" /></span>
                            <span className='right'
                                onClick={isCloseModalBooking}>
                                <i className="fas fa-window-close"></i>
                            </span>
                        </div>
                        <div className='booking-modal-body'>
                            <div className='doctor-infor'>
                                <ProfileDoctor
                                    doctorId={doctorId}
                                    isShowDescriptionDoctor={false}//Cho show description?
                                    isShowPriceDoctor={true}//Cho show gi?? kh??m?
                                    dataTime={dataTime}
                                    isShowLinkDetail={false} //Show xem th??m link detail doctor
                                />
                            </div>
                            <div className='row'>
                                <div className='col-6 form-group'>
                                    <label><FormattedMessage id="patient.booking-model.name" /></label>
                                    <input className='form-control'
                                        value={this.state.fullName}
                                        onChange={(event) => this.handleChangeInPut(event, 'fullName')} />
                                </div>
                                <div className='col-6 form-group'>
                                    <label><FormattedMessage id="patient.booking-model.phone-number" /></label>
                                    <input className='form-control'
                                        value={this.state.phoneNumber}
                                        onChange={(event) => this.handleChangeInPut(event, 'phoneNumber')} />
                                </div>
                                <div className='col-6 form-group'>
                                    <label><FormattedMessage id="patient.booking-model.email" /></label>
                                    <input className='form-control'
                                        value={this.state.email}
                                        onChange={(event) => this.handleChangeInPut(event, 'email')} />
                                </div>
                                <div className='col-6 form-group'>
                                    <label><FormattedMessage id="patient.booking-model.address" /></label>
                                    <input className='form-control'
                                        value={this.state.address}
                                        onChange={(event) => this.handleChangeInPut(event, 'address')} />
                                </div>
                                <div className='col-12 form-group'>
                                    <label><FormattedMessage id="patient.booking-model.reason" /></label>
                                    <input className='form-control'
                                        value={this.state.reason}
                                        onChange={(event) => this.handleChangeInPut(event, 'reason')} />
                                </div>
                                <div className='col-6 form-group'>
                                    <label><FormattedMessage id="patient.booking-model.brithday" /></label>
                                    <DatePicker className='form-control'
                                        onChange={this.handleDatePicker}
                                        value={this.state.birthday}
                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <label><FormattedMessage id="patient.booking-model.gender" /></label>
                                    <Select
                                        value={this.state.selectedGender}
                                        onChange={this.handleChangeSelect}
                                        options={this.state.genders}
                                        placeholder='Select...'
                                    />
                                </div>
                            </div>

                        </div>
                        <div className='booking-modal-footer'>
                            <button className='btn-save' onClick={() => this.handleConfirmBooking()}>X??c nh???n</button>
                            <button className='btn-cancel' onClick={isCloseModalBooking}>H???y</button>
                        </div>
                    </div>
                </Modal>

            </LoadingOverlay >
        )
    }
};

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenders: () => dispatch(actions.fetchGenderStart()),//State Redux
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
