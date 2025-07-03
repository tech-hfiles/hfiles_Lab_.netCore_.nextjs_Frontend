import { API_Lab_Reports, endPoints } from "@/apiEndPoints";
import axiosInstance from "@/utils/axiosClient";
import axios from "axios";


export const otpGenerate = async (data: any) => {
  return axios.post(`${endPoints.Lab_Reports.OTP_GENERATE}`, data);
};

export const signUp = async (data: any) => {
  return axios.post(`${endPoints.Lab_Reports.SIGN_UP}`, data);
};

export const SidebarData = async (email:string) => {
  return axiosInstance.get(`${endPoints.Lab_Reports.SIDEBAR_ID}?email=${email}`);
};

// Lab Login

export const SendOTP = async (data: any) => {
  return axios.post(`${endPoints.Lab_Login.LOGIN_SEND_OTP}`, data);
};

export const LoginOTP = async (data: any) => {
  return axios.post(`${endPoints.Lab_Login.LOGIN_OTP}`, data);
};

export const BranchOTP = async (data: any) => {
  return axiosInstance.post(`${endPoints.Lab_Login.BRANCH_OTP}`, data);
};


export const LoginPassword = async (data: any) => {
  return axios.post(`${endPoints.Lab_Login.LOGIN_PASSWORD}`, data);
};

export const ForgotPasswordReq = async (data:any) =>{
  return axios.post(`${endPoints.Lab_Login.PASSWORD_REQUEST}`, data)
}

export const passwordForgot = async (data:any) =>{
  return axiosInstance.put(`${endPoints.Lab_Login.FORGOT_PASSWORD}`,data)
}

export const UserForgotPassword = async (data:any) =>{
  return axiosInstance.post(`${endPoints.Lab_Login.LAB_USER_FORGOT_PASSWORD}`, data)
}


export const ForgotPasswordUser = async (data:any) =>{
  return axiosInstance.put(`${endPoints.Lab_Login.FORGOT_USER_PASSWORD}`,data)
}
// Lab User Reports
// axios Instance pass the token in api header

export const AddLabUserReport = async (data:FormData) => {
  return axiosInstance.post(`${endPoints.Lab_User_Reports.ADD_LAb_USER_REPORT}`, data);
};

export const ListAllReports = async () =>{
  return axiosInstance.get(`${endPoints.Lab_User_Reports.ALL_REPORTS}`)
}

export const ListReport = async (userId:number, reportType:string) => {
  return axiosInstance.get(`${endPoints.Lab_User_Reports.Report_LAB_USERReport}/${userId}?reportType=${reportType}`);
};

export const ListUser = async (labId: number, startDate?: string, endDate?: string) => {
  const baseUrl = endPoints.Lab_User_Reports.LIST_LAB_USERLIST(labId);
  const params = new URLSearchParams();

  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const finalUrl = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

  return axiosInstance.get(finalUrl);
};

export const ListNotification = async (
  labId: number,
  timeframe?: number,
  startDate?: string,
  endDate?: string
) => {
  const baseUrl = endPoints.Lab_User_Reports.NOTIFICATION(labId);
  const params = new URLSearchParams();

  if (timeframe !== undefined) params.append("timeframe", timeframe.toString());
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const finalUrl = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

  return axiosInstance.get(finalUrl);
};



export const AdminCreate = async (data:any) => {
  return axios.post(`${endPoints.Lab_Admin.CREATE_ADMIN}`, data);
}

export const HfidCheck = async (data:any) => {
  return axios.post(`${endPoints.Lab_Login.CHECK_HFID}`, data);
}

export const AdminLogin = async (data:any) => {
  return axios.post(`${endPoints.Lab_Admin.LOGIN_ADMIN}`, data);
}

export const UserCardList = async (labId: number) => {
  return axios.get(endPoints.Lab_User_Reports.USERCARD(labId));
};

export const ResendReport = async (payload: { ids: number[] }) => {
  return axiosInstance.post(`${endPoints.Lab_User_Reports.SEND_REPORT}`,payload);
}

export const PromoteSuperAdmin = async (memberId: number) => {
  return axiosInstance.post(`${endPoints.Lab_User_Reports.SUPER_ADMIN_PROMOTE}`, { memberId });
}


// Profile api MiddleWare 

export const ListBranchData = async () => {
  return axiosInstance.get(`${endPoints.Lab_Profile.LIST_BRANCHDATA}`);
}

export const CreateBranch = async (data:any) => {
 return axiosInstance.post(`${endPoints.Lab_Profile.ADD_BRANCH}`, data)
}

export const UserOTPVerify = async (data:any) =>{
  return axiosInstance.post(`${endPoints.Lab_Profile.VERIFY_OTP}`,data);
}

export const RevertBranch = async (data:any) =>{
  return axiosInstance.patch(`${endPoints.Lab_Profile.REVERT_BRANCH}`,data);
}

export const DeleteBranch = async (branchId:number) => {
  return axiosInstance.put(`${endPoints.Lab_Profile.DELETE_BRANCH}/${branchId}`);
}

export const UpdateProfile = async (formData: FormData) =>{
  return axiosInstance.patch(`${endPoints.Lab_Profile.PROFILE_UPDATE}`,formData);
}

export const Pincode = async (pincode:string) => {
  return axiosInstance.get(`${endPoints.Lab_Profile.PINCODE}/${pincode}`);
}

export const DeleteBrnaches = async () =>{
  return axiosInstance.get(`${endPoints.Lab_Profile.DELETED_BRANCH}`);
}

// All Members API
export const AddMember = async (data:any) => {
  return axiosInstance.post(`${endPoints.All_Members.ADD_Memeber}`, data);
}

export const DeleteMember = async (id:number) => {
  return axiosInstance.put(`${endPoints.All_Members.DELETE_MEMBER}/${id}`);
}

export const RemoveUserList = async (data: any) => {
  return axiosInstance.delete(`${endPoints.All_Members.REMOVE_USER}`, {
    data: data, 
  });
};


export const CreateMemeber = async (data:any) => {
  return axiosInstance.post(`${endPoints.All_Members.Add_MEMBER_CREATE}`, data);
}

export const GetMemberList = async (labId: number) =>{
return axiosInstance.get(`${endPoints.All_Members.GET_DELETE_MEMBER(labId)}`);
}

export const RevertUser = async (data:any) =>{
  return axiosInstance.patch(`${endPoints.All_Members.REVERT_USER}`,data);
}

