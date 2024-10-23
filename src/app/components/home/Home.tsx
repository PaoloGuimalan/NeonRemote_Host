/* eslint-disable react/no-array-index-key */
/* eslint-disable prefer-destructuring */
/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-const */
/* eslint-disable one-var */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoIosArrowDropdownCircle, IoIosArrowDropupCircle, IoMdArrowUp, IoMdLogOut, IoMdPower } from 'react-icons/io';
import { LuPackage } from 'react-icons/lu';
import { FiLoader } from 'react-icons/fi';
import { BiSolidErrorAlt } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import NeonPOSSVG from '../../../assets/NeonPOS_BG.svg';
import { CloseSSENotifications, SSENotificationsTRequest } from '../../helpers/http/sse';
import { IPart, ITransmissionLogs, SettingsInterface } from '../../helpers/variables/interfaces';
import {
  GetFilesListResponseNeonRemote,
  RelayPartsFileTransferRequest,
  RelayPreFileTransferRequest
} from '../../helpers/http/requests';
import { dispatchnewalert } from '../../helpers/utils/alertdispatching';
import { SET_SETTINGS, SET_TRANSMISSION_LOGS } from '../../redux/types/types';
import { settingsstate } from '../../redux/types/states';

function Home() {
  const settings: SettingsInterface = useSelector((state: any) => state.settings);
  const transmissionlogs: ITransmissionLogs[] = useSelector((state: any) => state.transmissionlogs);

  const [isConnected, setisConnected] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const InitializeSSEConnectionProcess = () => {
    SSENotificationsTRequest(settings, setisConnected, dispatch);
    dispatch({
      type: SET_TRANSMISSION_LOGS,
      payload: {
        newlog: {
          type: 'info',
          message: 'Connecting to server ...',
          timestamp: Date.now()
        }
      }
    });
  };

  const CloseSSEConnectionProcess = () => {
    CloseSSENotifications();
    setisConnected(false);
    dispatch({
      type: SET_TRANSMISSION_LOGS,
      payload: {
        newlog: {
          type: 'download',
          message: 'Disconnected to server',
          timestamp: Date.now()
        }
      }
    });
  };

  // useEffect(() => {
  //   setInterval(() => {
  //     console.log(IsSSEOpen());
  //   }, 2000);
  // }, []);

  // const dataURLtoFile = (url: string, filename: string, mimeType: string) => {
  //   if (mimeType) {
  //     const file = new File([url], filename, { type: mimeType });
  //     return Promise.resolve(file);
  //   }
  //   return fetch(url)
  //     .then((res) => res.arrayBuffer())
  //     .then((buf) => new File([buf], filename, { type: mimeType }));
  // };

  const blobToBase64 = (blob: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise((resolve) => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  };

  const handleChunkFile = async (file: File) => {
    const parts: IPart[] = [];
    const CHUNK_SIZE = 2 * 1024 * 1024; // 10MB chunks
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    // let currentChunk = 0;

    try {
      // const urls = await Promise.all(presigned_url);

      // const chunkUploadPromises = [];

      for (let i = 0; i < totalChunks; i++) {
        const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
        parts.push({ PartNumber: i, chunk });
      }

      // setchunckParts(parts);
    } catch (ex: any) {
      throw new Error(ex);
    }

    return { totalChunks, parts };
  };

  useEffect(() => {
    // InitializeSSEConnectionProcess();

    return () => {
      // CloseSSEConnectionProcess();
    };
  }, []);

  const UploadChunk = (currentChunkIndex: number, totalChunks: number, mpchunk: any[], finalrelaypayload: any) => {
    const chunkItem = mpchunk[currentChunkIndex];
    blobToBase64(chunkItem.chunk).then((res) => {
      RelayPartsFileTransferRequest({
        token: JSON.stringify(finalrelaypayload),
        part: { PartNumber: chunkItem.PartNumber, chunk: res }
      })
        .then(() => {
          if (currentChunkIndex !== totalChunks - 1 && currentChunkIndex < totalChunks - 1) {
            dispatch({
              type: SET_TRANSMISSION_LOGS,
              payload: {
                newlog: {
                  type: 'upload',
                  message: `Chunk part ${chunkItem.PartNumber} relayed`,
                  timestamp: Date.now()
                }
              }
            });
            setTimeout(() => {
              UploadChunk(currentChunkIndex + 1, totalChunks, mpchunk, finalrelaypayload);
            }, 1000);
          }

          console.log({
            token: JSON.stringify(finalrelaypayload),
            part: { PartNumber: chunkItem.PartNumber, chunk: res }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  useEffect(() => {
    if (settings) {
      window.Main.on('get-directories-output', (event: string) => {
        const parseddirs = JSON.parse(event);
        const finalpayload = {
          deviceID: settings.deviceID,
          toID: settings.userID,
          ...parseddirs
        };
        GetFilesListResponseNeonRemote({
          token: JSON.stringify(finalpayload)
        });

        dispatch({
          type: SET_TRANSMISSION_LOGS,
          payload: {
            newlog: {
              type: 'upload',
              message: `Response from path request to ${settings.userID}`,
              timestamp: Date.now()
            }
          }
        });
      });

      window.Main.on('relay-feed-file', async (event: any) => {
        const getFile = await fetch(`file://${event.path}`);
        const getFileBlob = await getFile.blob();
        const relayedBlob = new File([getFileBlob], event.filename);

        dispatch({
          type: SET_TRANSMISSION_LOGS,
          payload: {
            newlog: {
              type: 'info',
              message: `Chunking file - ${event.filename}`,
              timestamp: Date.now()
            }
          }
        });

        handleChunkFile(relayedBlob)
          .then((chunks: any) => {
            // console.log(event, chunks);
            setTimeout(() => {
              dispatch({
                type: SET_TRANSMISSION_LOGS,
                payload: {
                  newlog: {
                    type: 'packing',
                    message: `${event.filename} chunked with total of ${chunks.totalChunks} part/s`,
                    timestamp: Date.now()
                  }
                }
              });
            }, 200);
            const finalpayload = {
              deviceID: settings.deviceID,
              toID: settings.userID,
              file: {
                totalChunks: chunks.totalChunks,
                parts: [],
                ...event
              }
            };
            setTimeout(() => {
              dispatch({
                type: SET_TRANSMISSION_LOGS,
                payload: {
                  newlog: {
                    type: 'upload',
                    message: `Relaying file metadata to ${settings.userID}`,
                    timestamp: Date.now()
                  }
                }
              });
            }, 200);
            RelayPreFileTransferRequest({ token: JSON.stringify(finalpayload) });
            const finalrelaypayload = {
              deviceID: settings.deviceID,
              toID: settings.userID,
              file: {
                totalChunks: chunks.totalChunks,
                ...event
              }
            };
            setTimeout(() => {
              dispatch({
                type: SET_TRANSMISSION_LOGS,
                payload: {
                  newlog: {
                    type: 'info',
                    message: `Transfering chunks`,
                    timestamp: Date.now()
                  }
                }
              });
            }, 200);
            setTimeout(() => {
              const chunkArray = chunks.parts;
              UploadChunk(0, chunks.totalChunks, chunkArray, finalrelaypayload);
            }, 2000);
          })
          .catch((err) => {
            dispatchnewalert(dispatch, 'error', err.message);
          });
      });
    }
  }, [settings]);

  const LogOutHost = () => {
    localStorage.removeItem('usersetup');
    dispatch({
      type: SET_SETTINGS,
      payload: {
        settings: settingsstate
      }
    });
    navigate('/setup');
  };

  return (
    <div
      style={{
        background: `url(${NeonPOSSVG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
        backgroundRepeat: 'no-repeat'
      }}
      className="w-full h-full flex flex-col items-center p-[10px] gap-[7px]"
    >
      <div className="bg-[#e6e6e6] flex flex-row w-full p-[10px] border-gray-300 border-[1px] rounded-[4px] min-h-[90px]">
        <div className="flex flex-col w-full">
          <div className="w-full flex flex-row justify-between items-center pb-[2px]">
            <span className="text-[14px] text-black font-Inter font-semibold">Neon Host</span>
            {isConnected ? (
              <span className="text-[12px] font-Inter text-green-500 font-semibold">Connected</span>
            ) : (
              <span className="text-[12px] font-Inter text-red-500 font-semibold">Disconnected</span>
            )}
          </div>
          <div className="flex flex-row w-full">
            <div className="flex flex-1 flex-col">
              <span className="text-[14px] font-Inter text-[#3d3d3d]">{settings.deviceID}</span>
              <span className="text-[14px] font-Inter text-[#3d3d3d]">{settings.userID}</span>
            </div>
            <div className="flex flex-1 flex-row justify-end gap-[5px]">
              {isConnected ? (
                <button
                  onClick={CloseSSEConnectionProcess}
                  className="bg-[#777777] flex items-center justify-center rounded-[45px] h-full w-[45px] "
                >
                  <IoMdPower size={20} className="text-red-500" />
                </button>
              ) : (
                <button
                  onClick={InitializeSSEConnectionProcess}
                  className="bg-[#777777] flex items-center justify-center rounded-[45px] h-full w-[45px] "
                >
                  <IoMdPower size={20} className="text-green-500" />
                </button>
              )}
              <button
                onClick={LogOutHost}
                className="bg-[#777777] flex items-center justify-center rounded-[45px] h-full w-[45px] "
              >
                <IoMdLogOut size={20} className="text-red-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#e6e6e6] w-full p-[10px] border-gray-300 border-[1px] rounded-[4px] flex flex-col flex-1 gap-[7px] max-h-[calc(100%-100px)]">
        <div className="w-full h-[25px]">
          <span className="text-[14px] text-black font-Inter font-semibold">Transmission Logs</span>
        </div>
        <div className="w-full flex flex-col flex-1 bg-black rounded-[4px] overflow-y-scroll">
          {transmissionlogs.map((logs: ITransmissionLogs, i: number) => {
            return (
              <div
                key={i}
                className="w-full flex flex-row border-b-[1px] border-white p-[10px] min-h-[60px] h-fit pt-[5px] pb-[5px] items-center gap-[5px]"
              >
                <div className="flex flex-col justify-center items-center min-w-[50px]">
                  {logs.type === 'upload' && <IoIosArrowDropupCircle size={20} className="text-green-500" />}
                  {logs.type === 'packing' && <LuPackage size={20} className="text-orange-200" />}
                  {logs.type === 'download' && <IoIosArrowDropdownCircle size={20} className="text-orange-500" />}
                  {logs.type === 'info' && <FiLoader size={20} className="text-blue-400" />}
                  {logs.type === 'error' && <BiSolidErrorAlt size={20} className="text-blue-400" />}
                </div>
                <div className="flex flex-col flex-1 justify-center">
                  <span className="text-white text-[12px] font-Inter break-all">{logs.message}</span>
                </div>
                <div className="flex flex-col flex-1 max-w-[60px] justify-center">
                  <span className="text-white text-[12px] font-Inter">
                    {new Date(logs.timestamp).toTimeString().slice(3, 9)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;
