/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import sign from 'jwt-encode';
import { Dispatch as ReactDispatch, SetStateAction } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Dispatch } from '@reduxjs/toolkit';
import Axios from 'axios';
import { AuthenticationInterface, SettingsInterface } from '../variables/interfaces';
import CONFIG from '../variables/config';
import { SET_TRANSMISSION_LOGS } from '../../redux/types/types';

const API = CONFIG.NEONSERVICE;
// const SECRET = CONFIG.JWTSECRET;

let sseNtfsSource: any = null;

const SSENotificationsTRequest = (
  settings: SettingsInterface,
  setIsConnected: ReactDispatch<SetStateAction<boolean>>,
  dispatch?: Dispatch<any>,
  authentication?: AuthenticationInterface
) => {
  sseNtfsSource = new EventSource(`${API}/access/ssehandshake/${settings.connectionToken}`);

  sseNtfsSource.onopen = () => {
    // console.log(e);
    setIsConnected(true);
    if (dispatch) {
      dispatch({
        type: SET_TRANSMISSION_LOGS,
        payload: {
          newlog: {
            type: 'upload',
            message: 'Connected to server',
            timestamp: Date.now()
          }
        }
      });
    }
  };

  sseNtfsSource.onerror = () => {
    // console.log(e);
    setIsConnected(false);
  };

  sseNtfsSource.addEventListener('devicefileslist', (e: any) => {
    const parsedresponse = JSON.parse(e.data);

    if (parsedresponse.status) {
      const decodedresult: any = jwtDecode(parsedresponse.result);
      if (decodedresult.data.deviceID === settings.deviceID) {
        try {
          window.ipcRenderer.send('get-directories', decodeURIComponent(decodedresult.data.path));
          if (dispatch) {
            dispatch({
              type: SET_TRANSMISSION_LOGS,
              payload: {
                newlog: {
                  type: 'download',
                  message: `Path Request in ${decodedresult.data.path}`,
                  timestamp: Date.now()
                }
              }
            });

            dispatch({
              type: SET_TRANSMISSION_LOGS,
              payload: {
                newlog: {
                  type: 'info',
                  message: `Scanning path ...`,
                  timestamp: Date.now()
                }
              }
            });
          }
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
        if (dispatch) {
          dispatch({
            type: SET_TRANSMISSION_LOGS,
            payload: {
              newlog: {
                type: 'download',
                message: `File Request at path ${decodeURIComponent(decodedresult.data.path)}`,
                timestamp: Date.now()
              }
            }
          });

          setTimeout(() => {
            dispatch({
              type: SET_TRANSMISSION_LOGS,
              payload: {
                newlog: {
                  type: 'info',
                  message: `Scanning file ...`,
                  timestamp: Date.now()
                }
              }
            });
          }, 500);
        }
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
