/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import sign from 'jwt-encode';
import { jwtDecode } from 'jwt-decode';
import { Dispatch } from '@reduxjs/toolkit';
import Axios from 'axios';
import { AuthenticationInterface, SettingsInterface } from '../variables/interfaces';
import CONFIG from '../variables/config';

const API = CONFIG.NEONSERVICE;
// const SECRET = CONFIG.JWTSECRET;

let sseNtfsSource: any = null;

const SSENotificationsTRequest = (
  settings: SettingsInterface,
  dispatch?: Dispatch<any>,
  authentication?: AuthenticationInterface
) => {
  sseNtfsSource = new EventSource(`${API}/access/ssehandshake/${settings.connectionToken}`);

  sseNtfsSource.addEventListener('devicefileslist', (e: any) => {
    const parsedresponse = JSON.parse(e.data);

    if (parsedresponse.status) {
      const decodedresult: any = jwtDecode(parsedresponse.result);
      if (decodedresult.data.deviceID === settings.deviceID) {
        try {
          window.ipcRenderer.send('get-directories', decodeURIComponent(decodedresult.data.path));
          // window.Main.sendMessage(JSON.stringify({ event: 'get-directories', data: decodeURIComponent(decodedresult.data.path) }));
        } catch (err) {
          console.log(err);
        }
      }
    }
  });

  sseNtfsSource.addEventListener('fetch_file_request', async (e: any) => {
    const parsedresponse = JSON.parse(e.data);

    if (parsedresponse.status) {
      const decodedresult: any = jwtDecode(parsedresponse.result);

      if (decodedresult?.data) {
        // console.log(decodedresult.data);
        // console.log(decodeURIComponent(decodedresult.data.path));
        window.ipcRenderer.send('extract-feed-file', decodeURIComponent(decodedresult.data.path));
      }
    }
  });
};

const CloseSSENotifications = () => {
  if (sseNtfsSource) {
    sseNtfsSource.close();
  }
};

export { SSENotificationsTRequest, CloseSSENotifications };
