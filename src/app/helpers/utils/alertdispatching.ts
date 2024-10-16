/* eslint-disable @typescript-eslint/no-explicit-any */
import { SET_CLEAR_ALERTS, SET_MUTATE_ALERTS } from '../../redux/types/types';

const dispatchnewalert = (dispatch: any, type: 'success' | 'info' | 'warning' | 'error', content: string) => {
  dispatch({
    type: SET_MUTATE_ALERTS,
    payload: {
      alerts: {
        type,
        content
      }
    }
  });
};

const dispatchclearalerts = (dispatch: any) => {
  dispatch({
    type: SET_CLEAR_ALERTS,
    payload: {
      alerts: []
    }
  });
};

export { dispatchnewalert, dispatchclearalerts };
