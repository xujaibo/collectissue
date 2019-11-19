import { config } from "../config/config";
import { promisic } from "./util";

export class Http {
    static async request({ url, data, method = 'GET' }) {
        const res = await promisic(wx.request)({
            url: `${config.apiBaseUrl}${url}`,
            data,
            method // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        })
        return res.data
    }
}