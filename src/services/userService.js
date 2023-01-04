import axios from '../axios'

//Gọi API xuống server để check login
const handleLoginApi = (email, password) => {
    return axios.post('/api/login', { email: email, password: password })// truyển theo email và password input
}
//Lấy tt user từ database
const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-user?id=${inputId}`)
}
//Create new a user
const createNewUserService = (data) => {
    return axios.post('/api/create-new-user', data)
}
//Delete user
const deleteUserService = (userId) => {
    return axios.delete('/api/delete-user', {
        data: {
            id: userId
        }
    });
}
//Edit user
const editUserService = (inputData) => {
    return axios.put('/api/edit-user', inputData)
}
//Lấy tt user: auto render
const getAllCodeService = (inputType) => {
    return axios.get(`/api/allcode?type=${inputType}`)
}
//api get top doctor home
const getDoctorHomeService = (limitInput) => {
    return axios.get(`/api/top-doctor-home?limit=${limitInput}`)
}
//api get all doctors(manage doctors)
const getAllDoctorsService = () => {
    return axios.get(`/api/all-doctors`)
}
//api save infor doctor (manage doctors)
const saveDetailDoctorService = (data) => {
    return axios.post('/api/save-infor-doctors', data)
}
//api lấy thông tin chi tiết của doctor
const getDetailInforDoctorService = (inputId) => {
    return axios.get(`/api/get-detail-doctor-by-id?id=${inputId}`)
}
//api lưu lịch khám của doctor
const saveBulkScheduleDoctor = (data) => {
    return axios.post(`/api/bulk-create-schedule`, data)
}
//api lấy lịch khám doctor theo date
const getScheduleDoctorByDate = (doctorId, date) => {
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`)
}
//api lấy giá khám tên, địa chỉ phòng khám
const getExtraInforDoctorById = (doctorId) => {
    return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`)
}
//api lấy profile doctor modal đặt lịch khám
const getProfileDoctorById = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`)
}
//api post đặt lịch khám patient
const getPatientBookAppoinment = (data) => {
    return axios.post(`/api/patient-book-appointment`, data)
}
//api xác nhận đặt lịch khám url token & doctorId
const getVerifyBookAppoinment = (data) => {
    return axios.post(`/api/verify-book-appointment`, data)
}
//Tạo thông tin chuyên khoa
const createNewSpecialty = (data) => {
    return axios.post(`/api/create-new-specialty`, data)
}
//api get all specialty(manage specialty)
const getAllSpecialtyService = () => {
    return axios.get(`/api/all-specialty`)
}
//lấy doctor theo chuyên khoa và tỉnh thành
const getDetailSpecialtyById = (data) => {
    return axios.get(`/api/detail-specialty-by-id?id=${data.id}&location=${data.location}`)
}
//Tạo thông tin phòng khám
const createNewClinic = (data) => {
    return axios.post(`/api/create-new-clinic`, data)
}
//api get all clinic(manage clinic)
const getAllClinicService = () => {
    return axios.get(`/api/all-clinic`)
}
//lấy doctor theo phòng khám
const getDetailClinictyById = (data) => {
    return axios.get(`/api/detail-clinic-by-id?id=${data.id}`)
}
const getAllPatientForDoctor = (data) => {
    return axios.get(`/api/list-paitent-for-doctor?doctorId=${data.doctorId}&date=${data.date}`)
}
//Khám bệnh xong va gửi đơn thuốc
const postSendRemedy = (data) => {
    return axios.post(`/api/send-remedy`, data)
}
export {
    handleLoginApi,
    getAllUsers,
    createNewUserService,
    deleteUserService,
    editUserService,
    getAllCodeService,
    getDoctorHomeService,
    getAllDoctorsService,
    saveDetailDoctorService,
    getDetailInforDoctorService,
    saveBulkScheduleDoctor,
    getScheduleDoctorByDate,
    getExtraInforDoctorById,
    getProfileDoctorById,
    getPatientBookAppoinment,
    getVerifyBookAppoinment,
    createNewSpecialty,
    getAllSpecialtyService,
    getDetailSpecialtyById,
    createNewClinic,
    getAllClinicService,
    getDetailClinictyById,
    getAllPatientForDoctor,
    postSendRemedy
}