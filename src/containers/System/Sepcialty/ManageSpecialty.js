import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES, CommonUtils } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import './ManageSpecialty.scss'
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// convert hmtl qua text
import 'react-markdown-editor-lite/lib/index.css';
import { createNewSpecialty } from '../../../services/userService'
import { toast } from "react-toastify"

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameVi: '',
            nameEn: '',
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
    saveSpecialtyNew = async () => {
        let res = await createNewSpecialty(this.state);
        if (res && res.errCode === 0) {
            toast.success('Add new specialty succedd')
            this.setState({
                nameVi: '',
                nameEn: '',
                imageBase64: '',
                descriptionHTML: '',
                descriptionMarkdown: '',
            })
        } else {
            toast.error(' Save specialty failed')
            console.log('Check error', res)
        }
    }
    render() {
        let { language } = this.props
        return (
            <>
                <div className='manage-specialty-contanier'>
                    <div className='manage-specialty-title'><FormattedMessage id='admin.manage-specialty.title' /></div>
                    <div className='manage-specialty-content row'>
                        <div className='col-6 form group name'>
                            <label><FormattedMessage id='admin.manage-specialty.name-specialty' /></label>
                            <input className='form-control' type='text'
                                value={this.state.nameVi}
                                onChange={(event) => this.handleOnChangeInput(event, 'nameVi')} />
                            <label><FormattedMessage id='admin.manage-specialty.name-specialty-en' /></label>
                            <input className='form-control' type='text'
                                value={this.state.nameEn}
                                onChange={(event) => this.handleOnChangeInput(event, 'nameEn')} />
                        </div>
                        <div className='col-6 form group img'>
                            <label><FormattedMessage id='admin.manage-specialty.image-specialty' /></label>
                            <input className='form-control-file' type='file'
                                onChange={(event) => this.handleOnChangeImage(event)} />
                        </div>
                        <div className='col-12'>
                            <MdEditor style={{ height: '490px' }}
                                renderHTML={text => mdParser.render(text)}
                                onChange={this.handleEditorChange}
                                value={this.state.descriptionMarkdown}
                            />
                        </div>
                        <div className='col-12'>
                            <button className='btn-save'
                                onClick={() => this.saveSpecialtyNew()}><FormattedMessage id='admin.manage-specialty.save' /></button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
