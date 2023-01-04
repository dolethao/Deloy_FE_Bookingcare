import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import './ManagePatient.scss'
import DatePicker from '../../../components/Input/DatePicker';
import { getAllPatientForDoctor, postSendRemedy } from '../../../services/userService'
import moment from 'moment';
import RemedyModal from './RemedyModal';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay'


class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),// set time về đầu ngày
            dataPatient: [],
            isOpenModalRemedy: false,
            dataModal: {},
            isShowLoading: false
        }
    }
    async componentDidMount() {

        this.getDataPatient()
    }
    getDataPatient = async () => {//Handle data từ sv
        let { user } = this.props;
        let { currentDate } = this.state;
        let formatedDate = new Date(currentDate).getTime(); //format date
        let res = await getAllPatientForDoctor({
            doctorId: user.id,
            date: formatedDate,
        })
        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data
            })
        }
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

    }
    handleDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        }, async () => {//callback mỗi lần onchange lấy lại data để handle
            await this.getDataPatient()
        })
    }
    handleBtnConfirm = (item) => {//mở modal, data => con 
        let data = {
            doctorId: item.doctorId,
            patientId: item.patientId,
            email: item.patientData.email,
            fullName: item.patientData.lastName,
            timeType: item.timeType,
            patientName: item.lastName
        }
        this.setState({
            isOpenModalRemedy: true,
            dataModal: data,
        })
    }
    closeModalRemedy = () => {//Đóng modal =>con
        this.setState({
            isOpenModalRemedy: false,
            dataModal: {},
        })
    }
    sendRemedy = async (dataChild) => {// Nhận state từ con
        let { dataModal } = this.state
        this.setState({// Mở loading khi gọi api gửi mail
            isShowLoading: true
        })
        let res = await postSendRemedy({
            email: dataChild.email,
            imageBase64: dataChild.imageBase64,
            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            timeType: dataModal.timeType,
            language: this.props.language,
            patientName: dataModal.patientName
        });

        if (res && res.errCode === 0) {
            toast.success('Send Remedy succedd')
            this.setState({//đóng loading
                isShowLoading: false
            })
            this.closeModalRemedy()//đóng modal
            await this.getDataPatient()//refesh lại trang quản lý
        } else {
            this.setState({//đóng loading
                isShowLoading: false
            })
            toast.error('Send remedy failed')
        }
    }
    render() {
        let { language } = this.props
        let { dataPatient, isOpenModalRemedy, dataModal } = this.state
        return (
            <>
                <LoadingOverlay
                    active={this.state.isShowLoading}
                    spinner
                    text='Loading...'
                >
                    <div className='manage-patient-container'>
                        <div className='manage-patient-title'>
                            Quản lý bệnh nhân khám bệnh
                        </div>
                        <div className='manage-patient-body row'>
                            <div className='col-4 form group'>
                                <label>Chọn ngày khám</label>
                                <DatePicker className='form-control'
                                    onChange={this.handleDatePicker}
                                    value={this.state.currentDate}
                                />
                            </div>
                            <div className='col-12 table-manage-patient'>
                                <table>
                                    <tbody>
                                        <tr>
                                            <th>STT</th>
                                            <th>Họ và tên</th>
                                            <th>Thời gian</th>
                                            <th>Giới tính</th>
                                            <th>Số điện thoại</th>
                                            <th>Địa chỉ</th>
                                            <th>Action</th>
                                        </tr>

                                        {dataPatient && dataPatient.length > 0 ?
                                            dataPatient.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.patientData.lastName}</td>
                                                        <td>{language === LANGUAGES.VI ?
                                                            item.timeTypeDataPatient.valueVi
                                                            :
                                                            item.timeTypeDataPatient.valueEn
                                                        }
                                                        </td>
                                                        <td>{language === LANGUAGES.VI ?
                                                            item.patientData.genderData.valueVi

                                                            :
                                                            item.patientData.genderData.valueEn
                                                        }
                                                        </td>
                                                        <td>{item.patientData.phonenumber}</td>
                                                        <td>{item.patientData.address}</td>
                                                        <td>
                                                            <button className='mp-btn-confirm' onClick={() => this.handleBtnConfirm(item)}>Xác nhận</button>

                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            :
                                            <tr>
                                                <td colSpan="7" style={{ textAlign: 'center' }}>No data</td>
                                            </tr>

                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <RemedyModal
                        isOpenModalRemedy={isOpenModalRemedy}
                        dataModal={dataModal}
                        closeModalRemedy={this.closeModalRemedy}
                        sendRemedy={this.sendRemedy} />
                </LoadingOverlay>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfo, //lấy user trong Redux
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
