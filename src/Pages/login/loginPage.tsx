import React, { ChangeEvent, useState } from 'react';
// import { decodeToken } from "react-jwt";
import { setCredentials } from '../../redux/authSlice';
import { axiosPrivate } from '../../api/services/authService';

import { useNavigate } from 'react-router-dom';
// import { token } from '../InterfacesAndTypes';
import { useDispatch } from 'react-redux';
import logo from '../../assets/images/Logo.png'
const LoginPage=()=>{
    const [inputValues,setInputValues] = useState({
        username:"",
        password:""
    });
    const [usernameInvalid,setUsernameInvalid] = useState(false);
    const [passwordInvalid,setPasswordInvalid] = useState(false);
    const [errorMessage,setErrorMessage] = useState("");

    // let decodedToken:token|null;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    

    const HandleLogin= async(e:any)=>{
        e.preventDefault();
        if(inputValues.username==="") setUsernameInvalid(true);
        if(inputValues.password==="") setPasswordInvalid(true);
        
        if(inputValues.username!=="" && inputValues.password!==""){
            const loginObject={
                username:inputValues.username,
                password:inputValues.password,
                // role:"admin"
            }
            // console.log(loginObject)
            try{
                await axiosPrivate.post("/login",loginObject).then(res=>{
                    console.log(res)
                    // console.log(res.data.accessToken)
                    // console.log(typeof(res.data.accessToken))
                    if(res.status===200){
                        // console.log(res.data)
                        if(res.data.username){
                            // decodedToken = decodeToken(res.data.accessToken)
                            dispatch(setCredentials({
                                user:res.data?.username,
                                // accessToken:res.data.accessToken,
                                // refreshToken:res.data.refreshToken,
                                isLoggedIn:true,
                                userRole:res.data?.role
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
            }catch(err){
                console.log(err)
            }
            


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
        <form className='flex flex-col font-serif rounded-2xl shadow-2xl gap-5 p-7'>
            <div  className='grid gap-3 justify-center poppings'>
                <div className='flex justify-center'><img src={logo} alt='logo.png' className=' w-32 text-center'></img></div>
                
                <p className='text-center text-xl font-medium'>Sign in to Sunday School</p>
                <p className='text-center text-sm'>Teacher/Admin Login</p>
            </div>
            {/* <div className='flex justify-center py-1'>
                <h1 className=' text-3xl  font-bold'>LOGIN</h1>
            </div> */}
            <div className='flex py-1 poppins'>
                <label className=' font-medium'>Username: </label>
                <div>
                <input 
                className='border-2 border-slate-400 rounded-md mx-2 px-1 font-light'
                type="text"
                name="username"
                value={inputValues.username}
                onChange={(e)=>HandleChange(e)}/>
                { usernameInvalid ?<p className='text-xs mx-2 text-red-600 '>Please enter username</p> : null}
                </div>
            </div>
            <div className='flex py-1 poppins'>
                <label className='font-medium'>Password: </label>
                <div>
                <input 
                className='border-2 border-slate-400 rounded-md mx-2 px-1 font-light'
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