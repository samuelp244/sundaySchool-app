import axios from 'axios';
import { SPRING_SERVER_BASE_URL } from './SpringServer/spring';
// const BASE_URL = ;

export default axios.create({
    baseURL: SPRING_SERVER_BASE_URL,

});

export const axiosPrivate = axios.create({
    baseURL: SPRING_SERVER_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});