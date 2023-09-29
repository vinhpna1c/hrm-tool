import moment from "moment";
import { env } from "../models/config";
import Employee from "../models/Employee";
import API from "./api"
import TimeKeeping from "../models/TimeKeeping";

const api = API.getInstance();

const basicAdminAuth = {
    username: env.ADMIN_USERNAME,
    password: env.ADMIN_PASSWORD,
};

const getAllEmployee = async () => {
    const res: Employee[] = [];
    const respond = await api.get('/V1/AllEmployee', { auth: basicAdminAuth });
    if (respond.status === 200) {
        const employeeList: Employee[] = JSON.parse(respond.data).Information;
        return employeeList;
    }
    return res;
}

const getAllCheckInByDate = async (params?: {
    date?: Date,
}) => {
    const date: Date = params?.date ?? new Date();
    const OnDate = moment(date).format('YYYYMMDD')

    const res: TimeKeeping[] = [];
    const respond = await api.get('/V1/AllTimeKeeping', { auth: basicAdminAuth, params: { OnDate } },);
    if (respond.status === 200) {
        const timeKeepingList: TimeKeeping[] = JSON.parse(respond.data).TimeKeepingOnDate;
        return timeKeepingList;
    }
    return res;
}

export type TkAuth = {
    username: string;
    password: string;
}

const checkIn = async (auth: TkAuth) => {
    const respond = await api.post('/V1/EmployeeCheckIn', {}, { auth: auth });
    return respond.status === 200;
}

const checkOut = async (data: TkAuth, body: { Number: string }) => {
    const respond = await api.post('/V1/EmployeeCheckOut', JSON.stringify({ Number: body.Number }), { auth: data });
    return respond.status === 200;
}

export {
    getAllEmployee,
    getAllCheckInByDate,
    checkIn,
    checkOut,
}