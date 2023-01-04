import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import './RemedyModal.scss'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { toast } from "react-toastify"
import moment from 'moment'
import { CommonUtils } from '../../../utils'

class RemedyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            imageBase64: '',
        }
    }
    async componentDidMount() {
        if (this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email,
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.dataModal !== this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
        }
    }
    handleOnChangeEmail = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    handleOnChangeImage = async (event) => {// convert image
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64: base64,
            })
        }
    }
    handleSendRemedy = () => {
        this.props.sendRemedy(this.state)// truyền state lên cho cha
    }
    render() {
        let { isOpenModalRemedy, closeModalRemedy, } = this.props// lấy props từ cha
        return (
            <Modal
                isOpen={isOpenModalRemedy}
                className={'booking-modal-container'}
                size='md'
                centered>
                <div className='modal-container'>
                    <div className='title'>Gửi hóa đơn khám bệnh
                        <span onClick={closeModalRemedy}><i className="fas fa-window-close close"></i></span></div>
                    <ModalBody>
                        <div className='body row'>
                            <div className='col-6 form-group'>
                                <label>Email bệnh nhân</label>
                                <input className='form-control' type='email' value={this.state.email}
                                    onChange={(event) => this.handleOnChangeEmail(event)} />
                            </div>
                            <div className='col-6 form-group'>
                                <label>Chọn file hóa đơn</label>
                                <input className='form-control-file' type='file'
                                    onChange={(event) => this.handleOnChangeImage(event)} />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color='primary' onClick={() => this.handleSendRemedy()}>Send</Button>
                        <Button color='secondary' onClick={closeModalRemedy} >Cancel</Button>

                    </ModalFooter>
                </div >
            </Modal >

        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
