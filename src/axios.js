import axios from 'axios'
import router from "./router/index";
import {Auth} from "./stores/Auth";

axios.defaults.baseURL = process.env.backend_url;
axios.defaults.withCredentials = false;
axios.defaults.headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/json',
    "Access-Control-Allow-Origin": "*",

}

axios.interceptors.response.use(
    response => response,
    err => {
        if (err?.response?.status === 401) {
            Auth().logout();
            router.push({ name: 'login' });
        }
       
        return Promise.reject(err);
    }
);
