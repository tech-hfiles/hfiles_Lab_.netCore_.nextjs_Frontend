// Api EndPoints

export const API_Lab_Reports = "https://localhost:7227/api/";


export const endPoints = {
    Lab_Reports: {
        OTP_GENERATE: API_Lab_Reports + "labs/signup/otp",
        SIGN_UP: API_Lab_Reports + "labs",
        SIDEBAR_ID : API_Lab_Reports + "labs/hfid"
    },
    Lab_Login: {
        LOGIN_SEND_OTP: API_Lab_Reports + "labs/otp",
        LOGIN_OTP: API_Lab_Reports + "labs/login/otp",
        LOGIN_PASSWORD: API_Lab_Reports + "labs/login/password",
        CHECK_HFID: API_Lab_Reports + "users/hfid",
        PASSWORD_REQUEST: API_Lab_Reports + "labs/password-reset/request",
        FORGOT_PASSWORD: API_Lab_Reports + "labs/password-reset",
        BRANCH_OTP: API_Lab_Reports + "labs/branches/verify/otp",
        LAB_USER_FORGOT_PASSWORD: API_Lab_Reports + "labs/users/password-reset/request",
        FORGOT_USER_PASSWORD : API_Lab_Reports + "labs/users/password-reset"
    },
    Lab_User_Reports:{
        ADD_LAb_USER_REPORT: API_Lab_Reports + "labs/reports/upload",
        Report_LAB_USERReport :  API_Lab_Reports + "labs/reports",
        LIST_LAB_USERLIST: (labId:number) => `${API_Lab_Reports}labs/${labId}/reports`,
         USERCARD: (labId: number) => `${API_Lab_Reports}labs/${labId}/users`,
        SEND_REPORT: API_Lab_Reports + "labs/reports/resend",
        NOTIFICATION: (labId:number) => `${API_Lab_Reports}labs/${labId}/notifications`,
        SUPER_ADMIN_PROMOTE : API_Lab_Reports + "labs/admin/promote"
    },
    Lab_Admin:{
        CREATE_ADMIN: API_Lab_Reports + "labs/super-admins",
        LOGIN_ADMIN: API_Lab_Reports + "labs/users/login",
    },
    Lab_Profile:{
        LIST_BRANCHDATA: API_Lab_Reports + "labs",
        ADD_BRANCH : API_Lab_Reports + "labs/branches",
        DELETE_BRANCH : API_Lab_Reports + "labs/branches",
        PROFILE_UPDATE : API_Lab_Reports + "labs/update",
        PINCODE : API_Lab_Reports + "labs/branches"
    },
    All_Members: {
        ADD_Memeber: API_Lab_Reports + "labs/members/promote",
        DELETE_MEMBER : API_Lab_Reports + "labs/members",
        Add_MEMBER_CREATE: API_Lab_Reports +"labs/members"
    }
};