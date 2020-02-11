import { createStore } from 'redux';
import reducer from './configure-reducers';

export const store = createStore(reducer);
