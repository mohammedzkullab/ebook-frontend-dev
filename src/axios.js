import axios from 'axios'
import router from "./router/index";
import {Auth} from "./stores/Auth";

axios.defaults.baseURL = process.env.backend_url;

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