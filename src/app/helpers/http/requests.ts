import Axios from 'axios';
import { AddProductRequestInterface, CloseOrderInterface, CreateNewPermissionPayloadInterface, CreateOrderRequestInterface, GetFilesListResponseNeonRemoteInterface, InitialSetupDeviceVerificationRequestInterface, LoginPayloadInterface, RegisterAccountInterface } from '../variables/interfaces';
import CONFIG from '../variables/config';

// const BACKDOOR = 'http://localhost:3000';
const BACKDOOR = CONFIG.BACKDOOR;
const NEONSERVICE = CONFIG.NEONSERVICE;

async function LoginRequest(payload: LoginPayloadInterface){
    return await Axios.post(`${BACKDOOR}/api/auth/login`, payload).then((response) => {
      return response;
    }).catch((err) => {
      throw new Error(err);
    })
}

async function RefreshAuthRequest(token: string){
  return await Axios.get(`${BACKDOOR}/api/auth/rfsh`, {
    headers: {
      "x-access-token": token
    }
  }).then((response) => {
    return response;
  }).catch((err) => {
    throw new Error(err);
  })
}

async function GetPermissionsRequest(userID: string){
  return await Axios.get(`${BACKDOOR}/api/settings/getpermissions/${userID}`).then((response) => {
    return response;
  }).catch((err) => {
    throw new Error(err);
  })
}

async function CreateNewPermissionRequest(payload: CreateNewPermissionPayloadInterface){
  return await Axios.post(`${BACKDOOR}/api/settings/permissions`, {
    permissionType: payload.permissionType,
    allowedUsers: payload.allowedUsers,
    userID: payload.userID,
    deviceID: payload.deviceID
  }).then((response) => {
    return response;
  }).catch((err) => {
    throw new Error(err);
  })
}

async function GetUsersRequest(userID: string){
  return await Axios.get(`${BACKDOOR}/api/auth/getusers/${userID}`).then((response) => {
    return response;
  }).catch((err) => {
    throw new Error(err);
  })
}

async function GetSpecificUserRequest(userID: string, accountID: string){
  return await Axios.get(`${BACKDOOR}/api/auth/getusers/${userID}/${accountID}`).then((response) => {
    return response;
  }).catch((err) => {
    throw new Error(err);
  })
}

async function RegisterAccountRequest(payload: RegisterAccountInterface) {
  return await Axios.post(`${BACKDOOR}/api/auth/register`, payload).then((response) => {
    return response;
  }).catch((err) => {
    throw new Error(err);
  })
}

async function AddProductRequest(payload: AddProductRequestInterface) {
  return await Axios.post(`${BACKDOOR}/api/menu/addproduct`, payload).then((response) => {
    return response;
  }).catch((err) => {
    throw new Error(err);
  })
}

async function GetProductsListRequest(userID: string) {
  return await Axios.get(`${BACKDOOR}/api/menu/getproducts/${userID}`).then((response) => {
    return response;
  }).catch((err) => {
    throw new Error(err);
  })
}

async function InitialSetupDeviceVerificationRequest(payload: InitialSetupDeviceVerificationRequestInterface) {
  return await Axios.post(`${NEONSERVICE}/access/manualdeviceverification`, payload).then((response) => {
    return response;
  }).catch((err) => {
    throw new Error(err);
  })
}

async function GetFilesListResponseNeonRemote(payload: GetFilesListResponseNeonRemoteInterface) {
  return await Axios.post(`${NEONSERVICE}/device/devicefileslistresponse`, payload).then((response) => {
    return response;
  }).catch((err) => {
    throw new Error(err);
  })
}

async function CreateOrderRequest(payload: CreateOrderRequestInterface) {
  return await Axios.post(`${BACKDOOR}/api/orders/createorder`, payload).then((response) => {
    return response;
  }).catch((err) => {
    throw new Error(err);
  })
}

async function GetOrdersListRequest(token: string) {
  return await Axios.get(`${BACKDOOR}/api/orders/getorders/${token}`).then((response) => {
    return response;
  }).catch((err) => {
    throw new Error(err);
  })
}

async function DeletePermissionRequest(token: string) {
  return await Axios.delete(`${BACKDOOR}/api/settings/deletepermission/${token}`).then((response) => {
    return response;
  }).catch((err) => {
    throw new Error(err);
  })
}

async function RemoveUserRequest(token: string) {
  return await Axios.delete(`${BACKDOOR}/api/auth/removeuser/${token}`).then((response) => {
    return response;
  }).catch((err) => {
    throw new Error(err);
  })
}

async function GetCategoriesListRequest(token: string){
  return await Axios.get(`${BACKDOOR}/api/orders/category`, {
    headers: {
      "access_token": token
    }
  }).then((response) => {
    return response;
  }).catch((err) => {
    throw new Error(err);
  })
}

async function CreateCategoryRequest(token: string){
  return await Axios.post(`${BACKDOOR}/api/orders/category`, { token: token }).then((response) => {
    return response;
  }).catch((err) => {
    throw new Error(err);
  })
}

async function DeleteProductRequest(token: string) {
  return await Axios.delete(`${BACKDOOR}/api/menu/removeproduct/${token}`).then((response) => {
    return response;
  }).catch((err) => {
    throw new Error(err);
  })
}

async function GenerateDailyReport(token: string) {
  return await Axios.get(`${BACKDOOR}/api/accounting/generatereport/${token}`).then((response) => {
    return response;
  }).catch((err) => {
    throw new Error(err);
  })
}

async function CloseOrderRequest(payload: CloseOrderInterface) {
  return await Axios.post(`${BACKDOOR}/api/orders/closeorder`, payload).then((response) => {
    return response;
  }).catch((err) => {
    throw new Error(err);
  })
}

async function CloseOrderRequestV2(payload: CloseOrderInterface) {
  return await Axios.post(`${BACKDOOR}/api/orders/closeorderV2`, payload).then((response) => {
    return response;
  }).catch((err) => {
    throw new Error(err);
  })
}

export {
    LoginRequest,
    RefreshAuthRequest,
    RegisterAccountRequest,
    GetPermissionsRequest,
    CreateNewPermissionRequest,
    GetUsersRequest,
    AddProductRequest,
    GetProductsListRequest,
    InitialSetupDeviceVerificationRequest,
    GetFilesListResponseNeonRemote,
    CreateOrderRequest,
    GetOrdersListRequest,
    GetSpecificUserRequest,
    DeletePermissionRequest,
    RemoveUserRequest,
    GetCategoriesListRequest,
    CreateCategoryRequest,
    DeleteProductRequest,
    GenerateDailyReport,
    CloseOrderRequest,
    CloseOrderRequestV2
}