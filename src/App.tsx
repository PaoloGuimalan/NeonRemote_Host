/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PrivateRoutes from './app/routes/PrivateRoutes';
import Splash from './app/reusables/Splash';
import { AlertsItem, SettingsInterface } from './app/helpers/variables/interfaces';
import Alert from './app/reusables/widgets/Alert';
import { SET_SETTINGS } from './app/redux/types/types';
import { settingsstate } from './app/redux/types/states';
import PublicRoutes from './app/routes/PublicRoutes';
import { dispatchnewalert } from './app/helpers/utils/alertdispatching';

function App() {
  const alerts: AlertsItem[] = useSelector((state: any) => state.alerts);
  const settings: SettingsInterface = useSelector((state: any) => state.settings);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSplashed, setisSplashed] = useState<boolean>(false);

  const scrollDivAlerts = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollDivAlerts.current) {
      const scrollHeight = scrollDivAlerts.current.scrollHeight;
      const clientHeight = scrollDivAlerts.current.clientHeight;
      const maxScrollTop = scrollHeight - clientHeight;
      scrollDivAlerts.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }, [alerts, scrollDivAlerts]);

  useEffect(() => {
    window.Main.on('get-directories-error', (event: string) => {
      dispatchnewalert(dispatch, 'error', event);
    });
  }, []);

  useEffect(() => {
    const usersetup = localStorage.getItem('usersetup');

    if (usersetup) {
      dispatch({
        type: SET_SETTINGS,
        payload: {
          settings: JSON.parse(usersetup)
        }
      });
    } else {
      dispatch({
        type: SET_SETTINGS,
        payload: {
          settings: settingsstate
        }
      });
      navigate('/setup');
    }

    setTimeout(() => {
      setisSplashed(true);
    }, 2000);
  }, []);

  const renderRoutes = () => {
    if (settings.connectionToken === '' && settings.deviceID === '' && settings.userID === '') {
      return <PublicRoutes />;
    }

    return <PrivateRoutes />;
  };

  return (
    <div className="flex flex-col h-screen w-full">
      <div id="div_alerts_container" ref={scrollDivAlerts}>
        {alerts.map((al: any, i: number) => {
          return <Alert key={i} al={al} />;
        })}
      </div>
      {isSplashed ? renderRoutes() : <Splash />}
    </div>
  );
}

export default App;
