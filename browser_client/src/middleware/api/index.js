import fetchMiddleware from '../fetch';
import * as callbacks from './callbacks';
import * as models from './models';


export const Models = models;


export const Callbacks = callbacks;


const { beforeFetch, onFetchFail, onNetworkError } = Callbacks;
export default fetchMiddleware({ beforeFetch, onFetchFail, onNetworkError });
