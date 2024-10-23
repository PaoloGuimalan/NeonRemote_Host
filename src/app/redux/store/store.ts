import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setalerts, setauthentication, setsettings, settransmissionlogs } from '../actions/actions';

const combiner = combineReducers({
  authentication: setauthentication,
  alerts: setalerts,
  settings: setsettings,
  transmissionlogs: settransmissionlogs
});

const store = configureStore({
  reducer: combiner
});

export default store;
