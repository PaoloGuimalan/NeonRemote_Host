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
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NeonPOSSVG from '../../../assets/NeonPOS_BG.svg';
import { CloseSSENotifications, SSENotificationsTRequest } from '../../helpers/http/sse';
import { IPart, SettingsInterface } from '../../helpers/variables/interfaces';
import {
  GetFilesListResponseNeonRemote,
  RelayPartsFileTransferRequest,
  RelayPreFileTransferRequest
} from '../../helpers/http/requests';
import { dispatchnewalert } from '../../helpers/utils/alertdispatching';

function Home() {
  const settings: SettingsInterface = useSelector((state: any) => state.settings);

  const InitializeSSEConnectionProcess = () => {
    SSENotificationsTRequest(settings);
  };

  const CloseSSEConnectionProcess = () => {
    CloseSSENotifications();
  };

  const dispatch = useDispatch();

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
    InitializeSSEConnectionProcess();

    return () => {
      CloseSSEConnectionProcess();
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
      });

      window.Main.on('relay-feed-file', async (event: any) => {
        const getFile = await fetch(`file://${event.path}`);
        const getFileBlob = await getFile.blob();
        const relayedBlob = new File([getFileBlob], event.filename);

        handleChunkFile(relayedBlob)
          .then((chunks: any) => {
            console.log(event, chunks);
            const finalpayload = {
              deviceID: settings.deviceID,
              toID: settings.userID,
              file: {
                totalChunks: chunks.totalChunks,
                parts: [],
                ...event
              }
            };
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

  return (
    <div
      style={{
        background: `url(${NeonPOSSVG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
        backgroundRepeat: 'no-repeat'
      }}
      className="w-full h-full flex flex-col items-center"
    >
      <p>Hello</p>
    </div>
  );
}

export default Home;
