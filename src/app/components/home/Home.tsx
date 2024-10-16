/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import NeonPOSSVG from '../../../assets/NeonPOS_BG.svg';
import { CloseSSENotifications, SSENotificationsTRequest } from '../../helpers/http/sse';
import { SettingsInterface } from '../../helpers/variables/interfaces';
import { GetFilesListResponseNeonRemote } from '../../helpers/http/requests';

function Home() {
  const settings: SettingsInterface = useSelector((state: any) => state.settings);

  const InitializeSSEConnectionProcess = () => {
    SSENotificationsTRequest(settings);
  };

  const CloseSSEConnectionProcess = () => {
    CloseSSENotifications();
  };

  useEffect(() => {
    InitializeSSEConnectionProcess();

    return () => {
      CloseSSEConnectionProcess();
    };
  }, []);

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
