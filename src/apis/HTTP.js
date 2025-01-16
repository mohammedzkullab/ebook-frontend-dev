import axios from "axios";
import {Auth} from "@/stores/Auth";

class HTTP {

    source = '';
    token = null;
    query = {};

    action(url) {
        this.source = url;

        return this;
    }

    withToken(token = null)
    {
        this.token = token

        if (! token) {
            this.token = JSON.parse(Auth()?.user)?.token
        }

        axios.interceptors.request.use(config => {
            config.headers.authorization = `Bearer ${this.token}`;
            return config;
        })

        return this;
    }

    async get(config = null) {
        return await axios.get(this.source, { params: this.query, ...config });
    }

    async paginate(page = null) {
        this.query.page = page
        return await axios.get(this.source, {params: this.query})
    }

    async post(data, config = null) {
        return await axios.post(this.source, data, config)
    }

    async delete(config = null) {
        return await axios.delete(this.source, config)
    }

    async put(data, config = null) {
        return await axios.put(this.source, data, config)
    }

    sortBy(column) {
        this.query.order_by = column

        return this
    }

    search(message) {
        this.query.search = message

        return this
    }

    searchObject(message) {
        this.query.object = message
        return this
    }
  
      withQuery(queryParams = {}) {
        this.query = { ...this.query, ...queryParams };
        return this;
    }
}
export default new HTTP
