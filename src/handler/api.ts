import { Axios } from "axios"

const BASE_URL = 'http://103.157.218.115/HRM/hs/HRM'
class API {
    private static api: Axios | null = null;
    private constructor() {

    }
    public static getInstance(): Axios {
        if (API.api == null) {
            API.api = new Axios({ baseURL: BASE_URL });
            return API.api;
        }
        else {
            return API.api;
        }

    }
}

export default API;