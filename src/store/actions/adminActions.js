import actionTypes from './actionTypes';
import {
    getAllCodeService, createNewUserService, getAllUsers,
    deleteUserService, editUserService, getDoctorHomeService,
    getAllDoctorsService, saveDetailDoctorService, getAllSpecialtyService
    , getAllClinicService
} from '../../services/userService';
import { toast } from "react-toastify"

//Gender
export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {// Goi đến hàm lấy api
            dispatch({ type: actionTypes.FETCH_GENDER_START })
            let res = await getAllCodeService("GENDER")
            if (res && res.errCode === 0) {
                dispatch(fetchGenderSuccess(res.data));
            } else {
                dispatch(fetchGenderFailed());
            }
        } catch (error) {
            dispatch(fetchGenderFailed());
            console.log("fetch start gender", error)
        }
    }

}

export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
})

export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED
})

//Position
export const fetchPositionStart = () => {
    return async (dispatch, getState) => {
        try {// Goi đến hàm lấy api
            let res = await getAllCodeService("POSITION")
            if (res && res.errCode === 0) {
                dispatch(fetchPositionSuccess(res.data));
            } else {
                dispatch(fetchPositionFailed());
            }
        } catch (error) {
            dispatch(fetchPositionFailed());
            console.log("fetch start position ", error)
        }
    }
}
export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData
})

export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED
})

//Role
export const fetchRoleStart = () => {
    return async (dispatch, getState) => {
        try {// Goi đến hàm lấy api
            let res = await getAllCodeService("ROLE")
            if (res && res.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data));
            } else {
                dispatch(fetchPositionFailed());
            }
        } catch (error) {
            dispatch(fetchRoleFailed());
            console.log("fetch start role ", error)
        }
    }
}
export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData
})

export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED
})

// Create a new user
export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {// Goi đến hàm lấy api tạo user và lưu vào database
            let res = await createNewUserService(data);
            if (res && res.errCode === 0) {
                toast.success('Create new user succeed')
                dispatch(saveUserSuccess());
                dispatch(fetchAllUserStart());// Cập nhật lại bảng users
            } else {
                dispatch(saveUserFailed());
            }
        } catch (error) {
            dispatch(saveUserFailed());
            toast.error('Create a user error')
            console.log("saveUserFailed ", error)
        }
    }
}
export const saveUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS,
})

export const saveUserFailed = () => ({
    type: actionTypes.CREATE_USER_FAILED
})

// Get all user redux
export const fetchAllUserStart = () => {
    return async (dispatch, getState) => {
        try {// Goi đến hàm lấy api lấy all user 
            let res = await getAllUsers("ALL");
            if (res && res.errCode === 0) {
                dispatch(fetchAllUserSuccess(res.user.reverse()));
                // Sắp xếp users theo thứ tự new => old
            } else {
                dispatch(fetchAllUserFailed());
            }
        } catch (error) {
            dispatch(fetchAllUserFailed());
            toast.error('Fetch all users error')
            console.log("fetchAllUserFailed ", error)
        }
    }
}
export const fetchAllUserSuccess = (user) => ({
    type: actionTypes.FETCH_ALL_USERS_SUCCESS,
    users: user // lấy data từ api về và props
})

export const fetchAllUserFailed = () => ({
    type: actionTypes.FETCH_ALL_USERS_FAILED,
})

// Delete a user
export const deleteAUser = (userId) => {
    return async (dispatch, getState) => {
        try {// Goi đến hàm lấy api delete user trong database
            let res = await deleteUserService(userId);
            if (res && res.errCode === 0) {
                toast.success('Delete the user succeed')
                dispatch(deleteUserSuccess());
                dispatch(fetchAllUserStart());// Cập nhật lại bảng users
            } else {
                dispatch(deleteUserFailed());
            }
        } catch (error) {
            dispatch(deleteUserFailed());
            toast.error('Delete the user error')
            console.log("deleteUserFailed ", error)
        }
    }
}
export const deleteUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS,
})

export const deleteUserFailed = () => ({
    type: actionTypes.DELETE_USER_FAILED
})

// Edit a user
export const editAUser = (data) => {
    return async (dispatch, getState) => {
        try {// Goi đến hàm api lưu thông tin user đc edit vào trong database
            let res = await editUserService(data);
            console.log("Check res", res)
            if (res && res.errCode === 0) {
                toast.success('Update the user succeed')
                dispatch(editUserSuccess());
                dispatch(fetchAllUserStart());// Cập nhật lại bảng users
            } else {
                dispatch(editUserFailed());
            }
        } catch (error) {
            dispatch(editUserFailed());
            toast.error('Update the user error')
            console.log("editUserFailed ", error)
        }
    }
}
export const editUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS,
})

export const editUserFailed = () => ({
    type: actionTypes.EDIT_USER_FAILED
})

//Top doctors home
export const fetchTopDoctor = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getDoctorHomeService('');
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTORS_SUCCESS,
                    dataDoctors: res.data //Lưu data và state Redux
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTORS_FAILED
                })
            }
        } catch (error) {
            console.log('FETCH_TOP_DOCTORS_FAILED', error)
            dispatch({
                type: actionTypes.FETCH_TOP_DOCTORS_FAILED
            })
        }
    }
}
//Get all doctors(manage doctors)
export const fetchAllDoctors = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllDoctorsService('');// lấy data từ database respone lên
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_SUCCESS,
                    dataDoctors: res.data //Lưu data và state Redux
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_FAILED
                })
            }
        } catch (error) {
            console.log('FETCH_ALL_DOCTORS_FAILED', error)
            dispatch({
                type: actionTypes.FETCH_ALL_DOCTORS_FAILED
            })
        }
    }
}
//Post save infor doctors(manage doctors)
export const saveDetailDoctor = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await saveDetailDoctorService(data);// lấy data truyền lên request
            if (res && res.errCode === 0) {
                toast.success('Save infor detail doctor succeed !')
                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS,
                })
            } else {
                toast.error('Save infor detail doctor error !')
                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED
                })
            }
        } catch (error) {
            toast.error('Save infor detail doctor error !')
            console.log('SAVE_DETAIL_DOCTOR_FAILED', error)
            dispatch({
                type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED
            })
        }
    }
}
//Get khung giờ khám bệnh của bác sĩ
export const fetchAllScheduleTime = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService('TIME');// lấy data từ database respone lên
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS,
                    dataTime: res.data //Lưu data và state Redux
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED
                })
            }
        } catch (error) {
            console.log('FETCH_ALLCODE_SCHEDULE_TIME_FAILED', error)
            dispatch({
                type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED
            })
        }
    }
}
// APi lấy giá khám, tỉnh thành, phương thức thanh toán chuyên khoa và phòng khám
export const getRequiredDoctorInfor = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_START })
            let resPrice = await getAllCodeService("PRICE");
            let resPayment = await getAllCodeService("PAYMENT");
            let resProvince = await getAllCodeService("PROVINCE");
            let resSpecialty = await getAllSpecialtyService();
            let resClinic = await getAllClinicService();
            if (resPrice && resPrice.errCode === 0
                && resPayment && resPayment.errCode === 0
                && resProvince && resProvince.errCode === 0
                && resSpecialty && resSpecialty.errCode === 0
                && resClinic && resClinic.errCode === 0) {
                let data = {
                    resPrice: resPrice.data,
                    resPayment: resPayment.data,
                    resProvince: resProvince.data,
                    resSpecialty: resSpecialty.data,
                    resClinic: resClinic.data
                }

                dispatch(fetchRequiredDoctorInforSuccess(data));
            } else {
                dispatch(fetchRequiredDoctorInforFailed());
            }
        } catch (error) {
            dispatch(fetchRequiredDoctorInforFailed());
            console.log("fetchRequiredDoctorInfor", error)
        }
    }
}
export const fetchRequiredDoctorInforSuccess = (allRequiredData) => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS,
    data: allRequiredData
})

export const fetchRequiredDoctorInforFailed = () => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAILED
})