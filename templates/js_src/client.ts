import PromiseClientBrowser from 'jayson/promise/lib/client/browser';
import Axios from 'axios';

const executeRequest = async (request) => (
  (await Axios.post('http://localhost:3033/', request)).data
);

const client = new PromiseClientBrowser(executeRequest, {});

export default client;