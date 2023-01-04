export const path = {
    HOME: '/',
    HOMEPAGE: '/Home',
    LOGIN: '/login',
    LOG_OUT: '/logout',
    SYSTEM: '/system',
    DETAIL_DOCTOR: '/detail-doctor/:id',//Top doctor
    VERIFY_EMAIL_BOOKING: '/verify-booking',//Xác nhận lịch khám bệnh
    DETAIL_SPECIALTY: '/detail-specialty/:id',// Chuyên khoa phổ biến
    DETAIL_CLINIC: '/detail-clinic/:id', //Cơ sở y tế nổi bật
};

export const LANGUAGES = {
    VI: 'vi',
    EN: 'en'
};

export const CRUD_ACTIONS = {
    CREATE: "CREATE",
    EDIT: "EDIT",
    DELETE: "DELETE",
    READ: "READ"
};

export const dateFormat = {
    SEND_TO_SERVER: 'DD/MM/YYYY'
};

export const YesNoObj = {
    YES: 'Y',
    NO: 'N'
};
export const USER_ROLE = {// Phân quyền người dùng
    ADMIN: 'R1',
    DOCTOR: 'R2',
    PATIENT: 'R3',
}