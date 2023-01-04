import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss'
import { getAllUsers, createNewUserService, deleteUserService, editUserService } from '../../services/userService'
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser'
import { emitter } from '../../utils/emitter'


class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser: false,
            isOpenModalEditUser: false,
            userEit: {}
        }

    }
    async componentDidMount() {
        await this.getAllUserFromReact();
    }
    getAllUserFromReact = async () => {
        let response = await getAllUsers('ALL');
        if (response && response.errCode === 0) {
            this.setState({//re-render
                arrUsers: response.user
            })
        }
    }
    handleAddNewUser = () => {//Bảng thêm user
        this.setState({
            isOpenModalUser: true
        })
    }
    toggleModalUser = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser //trái ngược vs state
        })
    }
    toggleModalEditUser = () => {
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser //trái ngược vs state
        })
    }
    createNewUser = async (data) => {
        try {
            let response = await createNewUserService(data)// Truyền data vào database
            if (response && response.errCode !== 0) {
                alert(response.errMessage)
            } else {
                // Create user thành công cập nhật lại danh sách user
                await this.getAllUserFromReact();
                this.setState({// Tắt bảng thêm user
                    isOpenModalUser: false
                })
                //nodejs listen with cha va con
                emitter.emit('EVENT_CLEAR_MODAL_DATA')
            }
        } catch (error) {
            console.log(error)
        }
        console.log('Check state form chid', data)

    }
    handleDeleteUser = async (user) => {
        try {
            let res = await deleteUserService(user.id)
            if (res && res.errCode === 0) {
                //Delete user thành công cập nhật lại danh sách user
                await this.getAllUserFromReact();
            } else {
                alert(res.errMessage)
            }
        } catch (error) {
            console.log(error)
        }
    }
    handleEditUser = (user) => {
        this.setState({
            isOpenModalEditUser: true,
            userEit: user
        })
    }
    doEditUser = async (user) => {
        try {
            let res = await editUserService(user)
            if (res && res.errCode == 0) {
                this.setState({// Tắt bảng edit user
                    isOpenModalEditUser: false
                })
                // Edit user thành công cập nhật lại danh sách user
                await this.getAllUserFromReact();
            } else {
                alert(res.errCode)
            }
        } catch (error) {
            console.log(error)
        }


    }
    render() {
        let arrUsers = this.state.arrUsers
        return (
            <div className="users-container">
                <ModalUser
                    isOpen={this.state.isOpenModalUser}
                    toggleFromParent={this.toggleModalUser}
                    createNewUser={this.createNewUser}
                />
                {this.state.isOpenModalEditUser &&
                    //Nếu có thì mới chèn componet(or did update)
                    <ModalEditUser
                        isOpen={this.state.isOpenModalEditUser}
                        toggleFromParent={this.toggleModalEditUser}
                        userEdit={this.state.userEit}// Truyền tt user cần eidit sang con
                        editUser={this.doEditUser}
                    />}
                <div className='title text-center'> Manage users </div>
                <div className='btn btn-primary px-3'
                    onClick={() => this.handleAddNewUser()}>
                    <i className="fas fa-plus"></i> Add new user</div>
                <div className='users-table mt-3 mx-1'>
                    <table id="customers">
                        <tbody>
                            <tr>
                                <th>Email</th>
                                <th>Firstname</th>
                                <th>Lastname</th>
                                <th>Address</th>
                                <th>Action</th>
                            </tr>

                            {arrUsers && arrUsers.map((item, index) => {
                                return (
                                    <tr key={item.id}>
                                        <td>{item.email}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.address}</td>
                                        <td>
                                            <button className='btn-edit' onClick={() => this.handleEditUser(item)}><i className="fas fa-pencil-alt"></i></button>
                                            <button className='btn-delete' onClick={() => this.handleDeleteUser(item)}><i className="fas fa-trash"></i></button>
                                        </td>
                                    </tr>
                                )
                            })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
