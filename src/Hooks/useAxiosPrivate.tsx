import { axiosPrivate } from "../api/services/authService";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { useSelector } from "react-redux";
import { AxiosRequestConfig } from "axios";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const accessToken = useSelector((state:any)=>state.auth.token);
    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            (config:AxiosRequestConfig):AxiosRequestConfig => {
                if (!config.headers!['Authorization']) {
                    config.headers!['Authorization'] = `Bearer ${accessToken}`;
                }
                return config;
            }, (error) => {
                Promise.reject(error)
            }
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                // console.log(error);
                const prevRequest = error?.config;
                if (error?.response?.status === 500 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [accessToken,refresh])

    return axiosPrivate;
}

export default useAxiosPrivate;