import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import './ManageSchedule.scss'
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import * as actions from "../../../store/actions"
import { dateFormat, LANGUAGES } from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker';
import { toast } from "react-toastify"
import _, { result } from 'lodash';
import { saveBulkScheduleDoctor } from '../../../services/userService'

class ManageSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDoctors: [],
            selectedDoctor: {},
            currentDate: '',
            rangeTime: '',
        }
    }
    handleDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        })
    }
    componentDidMount() {// fire actions all doctor
        this.props.fetchAllDoctors()
        this.props.fetchAllScheduleTime()
    }
    buildDataInputSelect = (inputData) => {//Handle data cho vào Select
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0)
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`;
                let labelEn = `${item.firstName} ${item.lastName}`;
                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.id
                result.push(object)
            })
        return result;
    }
    componentDidUpdate(prevProps, prevState, snapshot) {// before & after
        if (prevProps.alllDoctors !== this.props.alllDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.alllDoctors);//(inputData)
            //Gán state Redux vào React
            this.setState({
                listDoctors: dataSelect
            })
        }
        if (prevProps.allScheduleTime !== this.props.allScheduleTime) {// Time khám bệnh bác sĩ
            //Gán state Redux vào React
            let data = this.props.allScheduleTime
            if (data && data.length > 0) {
                // Thêm thuộc tính vào obj
                data = data.map(item => ({ ...item, isSelected: false }))
            }
            this.setState({
                rangeTime: data
            })
        }

    }
    handleChangeSelect = async (selectedOption) => {// tên bác sĩ và id
        this.setState({ selectedDoctor: selectedOption });
    };
    handleClickBtnTime = (time) => {
        // Ấn vào khoảng time nào
        let { rangeTime } = this.state;
        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map(item => {
                // Gán lại giá trị isSelected: Click1: true : Click2: false
                if (item.id === time.id) item.isSelected = !item.isSelected;
                return item;
            })
            this.setState({
                rangeTime: rangeTime
            })
        }
    }
    handleSaveSchedule = async () => {
        let { rangeTime, selectedDoctor, currentDate } = this.state
        let result = [];// kết quả
        if (!currentDate) {
            toast.error('Ivalid date !')
            return;
        }
        if (selectedDoctor && _.isEmpty(selectedDoctor)) {
            toast.error('Ivalid selected doctor !')
            return;
        }
        // format date: dd//mm//yy
        // let formatedDate = moment(currentDate).format(dateFormat.SEND_TO_SERVER)
        //convert timestamp
        // let formatedDate = moment(currentDate).unix();
        let formatedDate = new Date(currentDate).getTime();
        if (rangeTime && rangeTime.length > 0) {
            //Lọc ra các time đc chọn
            let seletedTime = rangeTime.filter(item => item.isSelected === true);
            if (seletedTime && seletedTime.length > 0) {
                seletedTime.map(schedule => {
                    //Sinh ra 1 obj với các giá trị sau
                    let object = {};
                    object.doctorId = selectedDoctor.value;
                    object.date = formatedDate;
                    object.timeType = schedule.keyMap
                    //Đẩy obj vừa tạo vào result
                    result.push(object)
                })
            } else {
                toast.error('Invalid selected time !')
                return;
            }
        }
        let res = await saveBulkScheduleDoctor({
            // convert sang 1 obj
            arrSchedule: result,
            doctorId: selectedDoctor.value,
            date: formatedDate
        });
        if (res && res.errCode === 0) {
            toast.success('Save schedule succedd !')
        } else {
            console.log('saveBulkScheduleDoctor error', res)
            toast.error('Save schedule failed!')
        }
    }
    render() {
        let { rangeTime } = this.state;
        let { language } = this.props;
        return (
            <>
                <div className='manage-schedule-container'>
                    <div className='manage-schedule-title'><FormattedMessage id="manage-schedule.title" /></div>
                    <div className='contanier'>
                        <div className='row'>
                            <div className='col-6 form group'>
                                <label><FormattedMessage id="manage-schedule.choose-doctor" /></label>
                                <Select
                                    value={this.state.selectedDoctor}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.listDoctors}
                                />
                            </div>
                            <div className='col-6 form group'>
                                <label><FormattedMessage id="manage-schedule.choose-date" /></label>
                                <DatePicker className='form-control'
                                    onChange={this.handleDatePicker}
                                    value={this.state.currentDate}
                                    minDate={new Date().setHours(0, 0, 0, 0)}// disnable các ngày tr ngày hiện tại
                                />
                            </div>
                            <div className='pick-hour-container col-12 '>
                                {rangeTime && rangeTime.length > 0 &&
                                    rangeTime.map((item, index) => {
                                        return (
                                            <button className={item.isSelected === true ? 'btn btn-schedule active' : 'btn btn-schedule'}
                                                key={index}
                                                onClick={() => this.handleClickBtnTime(item)}>
                                                {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                            </button>
                                        )
                                    })}
                            </div>
                            <div className='col-12'>
                                <button className='btn btn-primary btn-save-schedule' onClick={() => this.handleSaveSchedule()}>
                                    <FormattedMessage id="manage-schedule.save" /></button></div>

                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        alllDoctors: state.admin.alllDoctors,//Lấy data từ admin Reducer
        allScheduleTime: state.admin.allScheduleTime,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        //fire action get all doctors (manage doctors)
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        //lấy time khám bệnh của bác sĩ
        fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
