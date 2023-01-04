import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES, CommonUtils } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import './ManageClinic.scss'
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// convert hmtl qua text
import 'react-markdown-editor-lite/lib/index.css';
import { createNewClinic } from '../../../services/userService'
import { toast } from "react-toastify"

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
        }
    }
    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

    }
    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state }
        copyState[id] = event.target.value
        this.setState({
            ...copyState// copy lại các state k
        })
    }
    handleEditorChange = ({ html, text }) => {// Thông tin giới thiệu text & html
        this.setState({
            descriptionMarkdown: text,
            descriptionHTML: html,
        })
    }
    handleOnChangeImage = async (event) => {// lấy url image
        let data = event.target.files;//list file
        let file = data[0];// lấy ptu đầu tiên
        if (file) {
            let base64 = await CommonUtils.getBase64(file);//convert base64
            this.setState({
                imageBase64: base64,
            })
        }
    }
    saveClinicNew = async () => {
        let res = await createNewClinic(this.state);
        if (res && res.errCode === 0) {
            toast.success('Add new clinic succedd')
            this.setState({
                name: '',
                address: '',
                imageBase64: '',
                descriptionHTML: '',
                descriptionMarkdown: '',
            })
        } else {
            toast.error(' Save clinic failed')
        }
    }
    render() {
        let { language } = this.props
        return (
            <>
                <div className='manage-clinic-contanier'>
                    <div className='manage-clinic-title'><FormattedMessage id='admin.manage-clinic.title' /></div>
                    <div className='manage-clinic-content row'>
                        <div className='col-6 form group name'>
                            <label><FormattedMessage id='admin.manage-clinic.name-clinic' /></label>
                            <input className='form-control' type='text'
                                value={this.state.name}
                                onChange={(event) => this.handleOnChangeInput(event, 'name')} />
                            <label><FormattedMessage id='admin.manage-clinic.address-clinic' /></label>
                            <input className='form-control' type='text'
                                value={this.state.address}
                                onChange={(event) => this.handleOnChangeInput(event, 'address')} />
                        </div>
                        <div className='col-6 form group img'>
                            <label><FormattedMessage id='admin.manage-clinic.image-clinic' /></label>
                            <input className='form-control-file' type='file'
                                onChange={(event) => this.handleOnChangeImage(event)} />
                        </div>
                        <div className='col-12'>
                            <MdEditor style={{ height: '400px' }}
                                renderHTML={text => mdParser.render(text)}
                                onChange={this.handleEditorChange}
                                value={this.state.descriptionMarkdown}
                            />
                        </div>
                        <div className='col-12'>
                            <button className='btn-save'
                                onClick={() => this.saveClinicNew()}><FormattedMessage id='admin.manage-clinic.save' /></button>
                        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
