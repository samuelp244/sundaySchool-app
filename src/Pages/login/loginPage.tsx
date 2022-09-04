import React, { ChangeEvent, useState } from 'react';
import { decodeToken } from "react-jwt";
import { setCredentials } from '../../redux/authSlice';
import axios from '../../api/services/authService';

import { useNavigate } from 'react-router-dom';
import { token } from '../InterfacesAndTypes';
import { useDispatch } from 'react-redux';

const LoginPage=()=>{
    const [inputValues,setInputValues] = useState({
        username:"",
        password:""
    });
    const [usernameInvalid,setUsernameInvalid] = useState(false);
    const [passwordInvalid,setPasswordInvalid] = useState(false);
    const [errorMessage,setErrorMessage] = useState("");

    let decodedToken:token|null;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    

    const HandleLogin= async(e:any)=>{
        e.preventDefault();
        if(inputValues.username==="") setUsernameInvalid(true);
        if(inputValues.password==="") setPasswordInvalid(true);
        
        if(inputValues.username!=="" && inputValues.password!==""){
            const loginObject={
                username:inputValues.username,
                password:inputValues.password
            }
            // console.log(loginObject)
            await axios.post("/login",loginObject).then(res=>{
                // console.log(res)
                // console.log(res.data.accessToken)
                // console.log(typeof(res.data.accessToken))
                if(res.statusText==="OK"){
                    // console.log(res.data)
                    if(res.data.accessToken){
                        decodedToken = decodeToken(res.data.accessToken)
                        dispatch(setCredentials({
                            user:decodedToken?.username,
                            accessToken:res.data.accessToken,
                            // refreshToken:res.data.refreshToken,
                            isLoggedIn:true,
                            userRole:decodedToken?.role
                        }))
                        // localStorage.setItem('token', res.data.accessToken)
                        // if(decodedToken?.role==="user"){
                        //     navigate("/dashboard",{
                        //         state:{
                        //             username:decodedToken?.username
                        //         }
                        //     })
                        // }else if(decodedToken?.role==="admin"){
                        //     navigate("/admindashboard",{
                        //         state:{
                        //             username:decodedToken?.username
                        //         }
                        //     })
                        // } 
                        navigate("/dashboard");
                        }else{
                            setInputValues({
                                username:"",
                                password:""
                            })
                            setErrorMessage(res.data.message)
                        }
                }else{
                    console.log(res)
                }
                
            })


        }
    }

    const HandleChange = (e:ChangeEvent<HTMLInputElement>)=>{
        const {name,value} = e.target;
        setUsernameInvalid(false);
        setPasswordInvalid(false);
        setInputValues({
            ...inputValues,
            [name]:value
        })
        
    }
    
  return (
    <div className='flex justify-center h-screen items-center'>
        <form className='flex flex-col font-mono rounded-2xl shadow-2xl gap-9 p-7'>
            <div className='flex justify-center py-1'>
                <h1 className=' text-3xl  font-bold'>LOGIN</h1>
            </div>
            <div className='flex py-1'>
                <label className='text-lg'>USERNAME: </label>
                <div>
                <input 
                className='border-2 border-slate-400 rounded-md mx-2 px-1'
                type="text"
                name="username"
                value={inputValues.username}
                onChange={(e)=>HandleChange(e)}/>
                { usernameInvalid ?<p className='text-xs mx-2 text-red-600'>Please enter username</p> : null}
                </div>
            </div>
            <div className='flex py-1'>
                <label className='text-lg'>PASSWORD: </label>
                <div>
                <input 
                className='border-2 border-slate-400 rounded-md mx-2 px-1'
                name="password"
                type="password"
                value={inputValues.password}
                onChange={(e)=>HandleChange(e)}/>
                { passwordInvalid ?<p className='text-xs mx-2 text-red-600'>Please enter password</p> : null}
                </div>
            </div>
            <div>{errorMessage}</div>
            <div className='flex justify-end'>
                <button className=' bg-blue-200 hover:bg-blue-400 rounded-md px-3 py-1'
                onClick={(e)=>HandleLogin(e)}
                >login</button>
                
            </div>
        </form>
    </div>
  )
}
export default LoginPage;