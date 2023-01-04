import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './ManageDoctor.scss'
import * as actions from "../../../store/actions"
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// convert hmtl qua text
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select';
import { CRUD_ACTIONS, LANGUAGES } from '../../../utils';
import { getDetailInforDoctorService } from '../../../services/userService'


const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //save to markdown table
            contentMarkdown: '',
            contentHTML: '',
            selectedOption: '',
            description: '',
            listDoctors: [],
            hasOlData: false, //doctor có infor?

            //save to doctor_infor table
            listPrice: [],
            listPayment: [],
            listProvince: [],
            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            nameCilinic: '',
            addressClinic: '',
            note: '',

            selectedSpecialty: '',
            selectedClinic: '',
            listClinic: [],
            listSpecialty: [],
            specialtyId: '',
            clinicId: '',
        }
    }
    componentDidMount() {// fire actions
        this.props.fetchAllDoctors()
        this.props.getRequiredDoctorInfor()// truyền state Redux vào React
    }
    buildDataInputSelect = (inputData, type) => {//Handle data cho vào Select
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            if (type === 'USERS') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.lastName} ${item.firstName}`;
                    let labelEn = `${item.firstName} ${item.lastName}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id
                    result.push(object)
                })
            }
            if (type === 'Price') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi} VND`;
                    let labelEn = `${item.valueEn} USD`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap
                    result.push(object)
                })
            }
            if (type === 'Payment' || type === 'Province') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap
                    result.push(object)
                })
            }
            if (type === 'Clinic') {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.name
                    object.value = item.id
                    result.push(object)
                })
            }
            if (type === 'Specialty') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.nameVi}`;
                    let labelEn = `${item.nameEn}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id
                    result.push(object)
                })
            }
        }
        return result;
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.alllDoctors !== this.props.alllDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.alllDoctors, 'USERS');//handle data đưa vào select
            this.setState({
                listDoctors: dataSelect
            })
        }
        if (prevProps.language !== this.props.language) {// Check thay đổi language
            let dataSelect = this.buildDataInputSelect(this.props.alllDoctors, 'USERS');
            let { resPayment, resPrice, resProvince, resSpecialty, } = this.props.allRequiredDoctorInfor
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'Price');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'Payment');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'Province');
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'Specialty');
            this.setState({
                listDoctors: dataSelect,
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listSpecialty: dataSelectSpecialty,
            })
        }
        if (prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor) {
            let { resPayment, resPrice, resProvince, resSpecialty, resClinic } = this.props.allRequiredDoctorInfor// Lấy data ra
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'Price');//handle data select
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'Payment');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'Province');
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'Specialty');
            let dataSelectClinic = this.buildDataInputSelect(resClinic, 'Clinic');
            this.setState({
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listSpecialty: dataSelectSpecialty,
                listClinic: dataSelectClinic
            })
        }
    }
    handleEditorChange = ({ html, text }) => {// Thông tin text & html
        this.setState({
            contentMarkdown: text,
            contentHTML: html,
        })
    }
    handleChangeSelect = async (selectedOption) => {// tên bác sĩ
        this.setState({ selectedOption });
        //Lấy trong state ra: emtpy
        let { listPayment, listPrice, listProvince, listSpecialty, listClinic } = this.state
        let res = await getDetailInforDoctorService(selectedOption.value)
        if (res && res.errCode === 0 && res.data && res.data.Markdown) {
            let markdown = res.data.Markdown
            //Hứng data từ dưới sv
            let addressClinic = '', nameCilinic = '', note = '',
                paymentId = '', priceId = '', provinceId = '',
                selectedPrice = '', selectedPayment = '', selectedProvince = '',
                specialtyId = '', selectedSpecialty = '', selectedClinic = '', clinicId = ''
            if (res.data.Doctor_Infor) {
                addressClinic = res.data.Doctor_Infor.addressClinic;
                nameCilinic = res.data.Doctor_Infor.nameCilinic;
                note = res.data.Doctor_Infor.note;

                paymentId = res.data.Doctor_Infor.paymentId;
                priceId = res.data.Doctor_Infor.priceId;
                provinceId = res.data.Doctor_Infor.provinceId;

                specialtyId = res.data.Doctor_Infor.specialtyId
                clinicId = res.data.Doctor_Infor.clinicId
                //build data Selected payment, pricem, province
                selectedPrice = listPrice.find(item => {
                    return item && item.value === priceId
                })
                selectedPayment = listPayment.find(item => {
                    return item && item.value === paymentId
                })
                selectedProvince = listProvince.find(item => {
                    return item && item.value === provinceId
                })
                selectedSpecialty = listSpecialty.find(item => {
                    return item && item.value === specialtyId
                })
                selectedClinic = listClinic.find(item => {
                    return item && item.value === clinicId
                })
            }
            this.setState({// hiện state nếu có
                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contentMarkdown,
                description: markdown.description,
                hasOlData: true,
                addressClinic: addressClinic,
                nameCilinic: nameCilinic,
                note: note,
                selectedPrice: selectedPrice,
                selectedPayment: selectedPayment,
                selectedProvince: selectedProvince,
                selectedSpecialty: selectedSpecialty,
                selectedClinic: selectedClinic
            })
        } else {
            this.setState({
                contentHTML: '',
                contentMarkdown: '',
                description: '',
                hasOlData: false,
                addressClinic: '',
                nameCilinic: '',
                note: '',
                selectedPrice: '',
                selectedPayment: '',
                selectedProvince: '',
                selectedSpecialty: '',
                selectedClinic: ''
            })
        }
    };
    handleSelecDoctorInfor = async (selectedOption, name) => {
        let stateName = name.name
        let stateCopy = { ...this.state };
        //Gán state selectedPrice, selectedPayment,selectedProvince bằng selectedOption
        stateCopy[stateName] = selectedOption;
        this.setState({
            ...stateCopy
        })
    }
    handleSaveContent = () => {// Lưu lại tất cả thông tin
        let { hasOlData } = this.state;
        this.props.saveDetailDoctor({// Gán state cho data truyền đi(request)
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedOption.value,
            //Check có content thực hiện action eidit và ngược lại
            action: hasOlData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,// truyền theo action là create hay edit
            selectedPrice: this.state.selectedPrice.value,
            selectedPayment: this.state.selectedPayment.value,
            selectedProvince: this.state.selectedProvince.value,
            nameCilinic: this.state.nameCilinic,
            addressClinic: this.state.addressClinic,
            note: this.state.note,
            specialtyId: this.state.selectedSpecialty.value,
            clinicId: this.state.selectedClinic.value
        })
    }
    handleOnChangeText = (event, id) => {// thông tin bác sĩ, phòng khám, địa chỉ phòng khám
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }
    render() {
        let { hasOlData } = this.state
        return (
            <div className='manager-doctor-container'>
                <div className='manage-doctor-title'><FormattedMessage id="admin.manage-doctor.title" /></div>
                <div className='more-info'>
                    <div className='content-left'>
                        <label><FormattedMessage id="admin.manage-doctor.choose-doctor" /></label>
                        <Select
                            value={this.state.selectedOption}
                            onChange={this.handleChangeSelect}
                            options={this.state.listDoctors}
                            placeholder={<FormattedMessage id="admin.manage-doctor.choose-doctor" />}
                        />
                    </div>
                    <div className='content-right'>
                        <label><FormattedMessage id="admin.manage-doctor.intro" /></label>
                        <textarea
                            onChange={(event) => this.handleOnChangeText(event, 'description')}
                            value={this.state.description}
                            className='form-control'></textarea>
                    </div>
                </div>
                <div className='more-infor-extra row'>
                    <div className='col-4 form group'>
                        <label><FormattedMessage id="admin.manage-doctor.choose-price" /></label>
                        <Select
                            value={this.state.selectedPrice}
                            onChange={this.handleSelecDoctorInfor}
                            options={this.state.listPrice}
                            name='selectedPrice'
                            placeholder={<FormattedMessage id="admin.manage-doctor.choose-price" />}
                        />
                    </div>
                    <div className='col-4 form group'>
                        <label><FormattedMessage id="admin.manage-doctor.choose-payment" /></label>
                        <Select
                            value={this.state.selectedPayment}
                            onChange={this.handleSelecDoctorInfor}
                            options={this.state.listPayment}
                            name='selectedPayment'
                            placeholder={<FormattedMessage id="admin.manage-doctor.choose-payment" />}
                        />
                    </div>
                    <div className='col-4 form group'>
                        <label><FormattedMessage id="admin.manage-doctor.choose-province" /></label>
                        <Select
                            value={this.state.selectedProvince}
                            onChange={this.handleSelecDoctorInfor}
                            options={this.state.listProvince}
                            name='selectedProvince'
                            placeholder={<FormattedMessage id="admin.manage-doctor.choose-province" />}
                        />
                    </div>

                    <div className='col-4 form group'>
                        <label><FormattedMessage id="admin.manage-doctor.clinic-name" /></label>
                        <input className='form-control'
                            onChange={(event) => this.handleOnChangeText(event, 'nameCilinic')}
                            value={this.state.nameCilinic} />
                    </div>
                    <div className='col-4 form group'>
                        <label><FormattedMessage id="admin.manage-doctor.address-clinic" /></label>
                        <input className='form-control'
                            onChange={(event) => this.handleOnChangeText(event, 'addressClinic')}
                            value={this.state.addressClinic} />
                    </div>
                    <div className='col-4 form group'>
                        <label><FormattedMessage id="admin.manage-doctor.note" /></label>
                        <input className='form-control'
                            onChange={(event) => this.handleOnChangeText(event, 'note')}
                            value={this.state.note} />
                    </div>
                    <div className='col-4 form group'>
                        <label><FormattedMessage id="admin.manage-doctor.choose-specialty" /></label>
                        <Select
                            value={this.state.selectedSpecialty}
                            onChange={this.handleSelecDoctorInfor}
                            options={this.state.listSpecialty}
                            name='selectedSpecialty'
                            placeholder={<FormattedMessage id="admin.manage-doctor.choose-specialty" />}
                        />
                    </div>
                    <div className='col-4 form group'>
                        <label><FormattedMessage id="admin.manage-doctor.choose-cilinic" /></label>
                        <Select
                            value={this.state.selectedClinic}
                            onChange={this.handleSelecDoctorInfor}
                            options={this.state.listClinic}
                            name='selectedClinic'
                            placeholder={<FormattedMessage id="admin.manage-doctor.choose-cilinic" />}
                        />
                    </div>
                </div>
                <div className='manager-doctor-editor'>
                    <MdEditor style={{ height: '400px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown} />
                </div>
                <button
                    onClick={() => this.handleSaveContent()}
                    className={hasOlData === true ? 'save-content-doctor' : 'create-content-doctor'}>
                    {hasOlData === true ?
                        <span><FormattedMessage id="admin.manage-doctor.save" /></span>
                        :
                        <span><FormattedMessage id="admin.manage-doctor.create" /></span>
                    }
                </button>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        alllDoctors: state.admin.alllDoctors,//Lấy data từ admin Reducer(state Redux)
        allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        //fire action get all doctors (manage doctors)
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        //fire action save infor doctor (manage doctors)
        saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
        // lấy giá khám, tỉnh thành, phương thức thanh toán & chuyên khoa , phòng khám
        getRequiredDoctorInfor: () => dispatch(actions.getRequiredDoctorInfor()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
