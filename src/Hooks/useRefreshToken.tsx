import axios from '../api/services/authService';
import { updateAccessToken } from '../redux/authSlice';
import { useDispatch } from 'react-redux';

const useRefreshToken = () => {
    const dispatch = useDispatch();
    // const refreshToken = useSelector((state:any)=>state.auth.refreshToken)
    const refresh = async () => {
        const response = await axios.get('/refresh');
        dispatch(updateAccessToken({accessToken:response.data.accessToken}))
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;