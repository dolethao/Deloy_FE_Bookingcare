import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import _ from 'lodash'

class ModalEditUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
        }
    }

    componentDidMount() {
        let user = this.props.userEdit
        if (user && !_.isEmpty(user)) {
            this.setState({
                id: user.id,
                email: user.email,
                password: 'abbc',
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address,
            })
        }
    }
    toggle = () => {
        this.props.toggleFromParent()
    }
    handleChangeInput = (event, id) => {
        let copyState = { ...this.state }
        copyState[id] = event.target.value
        this.setState({
            ...copyState
        })
    }
    checkValideInput = () => {// Validate data
        let isValid = true;
        let arrInput = ['email', 'password', 'firstName', 'lastName', 'address'];
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {// Check từng gia trị input
                isValid = false;
                alert('Mising parameter: ' + arrInput[i]);
                break;
            }
        }
        return isValid;
    }
    handleEditUser = () => {
        let isValid = this.checkValideInput();
        if (isValid === true) {
            this.props.editUser(this.state)// truyền state lên cho cha
        }
    }
    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                toggle={() => this.toggle()}
                className={'modal-user-container'}
                size='lg'>
                <ModalHeader toggle={() => this.toggle()}>Edit a user</ModalHeader>
                <ModalBody>
                    <div className='modal-user-body'>
                        <div className='input-container'>
                            <label>Email</label>
                            <input
                                className='input'
                                type='email'
                                onChange={(event) => this.handleChangeInput(event, 'email')}
                                value={this.state.email}
                                disabled //Ko cho sửa
                            />
                        </div>
                        <div className='input-container'>
                            <label>Password</label>
                            <input
                                className='input'
                                type='Password'
                                onChange={(event) => this.handleChangeInput(event, 'password')}
                                value={this.state.password}
                                disabled// Ko cho sửa
                            />
                        </div>
                        <div className='input-container'>
                            <label>First name</label>
                            <input
                                className='input'
                                type='text'
                                onChange={(event) => this.handleChangeInput(event, 'firstName')}
                                value={this.state.firstName}
                            />
                        </div>
                        <div className='input-container'>
                            <label>Last name</label>
                            <input
                                className='input'
                                type='text'
                                onChange={(event) => this.handleChangeInput(event, 'lastName')}
                                value={this.state.lastName}
                            />
                        </div>
                        <div className='input-container max-width-input'>
                            <label>Address</label>
                            <input
                                className='input'
                                type='text'
                                onChange={(event) => this.handleChangeInput(event, 'address')}
                                value={this.state.address}
                            />
                        </div>
                    </div>

                </ModalBody>
                <ModalFooter>
                    <Button color='primary px-3' onClick={() => this.handleEditUser()}>Save changes</Button>
                    <Button color='secondary px-3' onClick={() => this.toggle()}>Close</Button>
                </ModalFooter>
            </Modal>
        )
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);
