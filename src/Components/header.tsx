import React,{useState} from 'react'
import { Burger } from '@mantine/core';
import {CgProfile} from 'react-icons/cg'
import userImage from '../assets/images/user.png'

import { Box, Drawer } from '@mui/material'
import { Link } from 'react-router-dom';
import { headerProps } from '../Pages/InterfacesAndTypes';
// import { AuthContext } from '../Hooks/auth';
import { useDispatch, useSelector } from 'react-redux';
import useMediaQuery from '../Hooks/useMediaQuery';
import { logOut } from '../redux/authSlice';
import { deleteArray } from '../redux/classAssessment';
import axios from "../api/services/authService"

export default function Header(props:headerProps) {
    const [navbarOpened, setNavbarOpened] = useState(false);
    const title = navbarOpened ? 'Close navigation' : 'Open navigation';
    // const navigate = useNavigate();
    const dispatch = useDispatch()
    // const { logout } = useContext(AuthContext);
    const role = useSelector((state:any)=>state.auth.role);
    const logoutHandler = (e:any) =>{
        e.preventDefault()
        // navigate("/login");
        dispatch(logOut())
        dispatch(deleteArray())
        // localStorage.removeItem('redux')
        axios.get('/logout').then(res=>{
            console.log(res);
        })
    }
    const username = useSelector((state:any)=>state.auth.user)

    const xs = useMediaQuery("(min-width: 540px)");
  return (
        <>
            <header className="flex justify-between   sticky shadow-2xl p-1 bg-white ">
                <div className="p-2">
                    <Burger
                        opened={navbarOpened}
                        onClick={() => setNavbarOpened((o:boolean) => !o)}
                        title={title}
                    />
                    
                </div>
                
                    <div className="p-2 text-xl font-semibold m-auto">
                        <h1>{props.headerTitle}</h1>
                    </div>
                {   props.userIcon && role==='user' ? 
                    <Link to="/profile" className="p-2">
                        <CgProfile 
                        style={{fontSize:"2rem"}}/>
                    </Link>
                    
                    :<div className="p-2">
                        <CgProfile 
                        style={{fontSize:"2rem",color:"white"}}/>
                    </div>
                }
                
                
            </header>
            <Drawer
                anchor={xs? 'left':'top'}
                open={navbarOpened}
                onClose={() => setNavbarOpened((o:boolean) => !o)}
                >
                <Box width={xs?'300px':'100wh'} height='100vh' textAlign='center'>
                    <div className='flex flex-col p-1'>
                        <div className='flex justify-start'>
                            <div className='p-2'>
                                <Burger
                                    opened={navbarOpened}
                                    onClick={() => setNavbarOpened((o:boolean) => !o)}
                                    title={title}
                                />
                            </div>
                        </div>
                        <div className='flex justify-center'>
                            <main className=' flex flex-col text-start gap-8'>
                                <div className='flex'>
                                    <img src={userImage} className=" w-14" alt="userImage.png"/>
                                    <div className='px-4'>
                                        <h3 className=' text-2xl font-bold '>{username}</h3>
                                        {role==='user'?<Link to="/profile" className=' font-light'>View profile</Link>
                                        :null}
                                        
                                    </div>
                                </div>
                                <div className='flex flex-col text-lg gap-5'>
                                    <div>
                                        <Link to="/dashboard"><p>Dashboard</p></Link>
                                    </div>

                                    { role==="user" ?
                                    <>
                                        <div>
                                            <Link to="/students"><p>My Students</p></Link>
                                        </div>
                                        <div>
                                            <Link to="/manageStudentAssessment"><p>Manage Assessment</p></Link> 
                                        </div>  
                                    </>:null}

                                    { role==="admin" ?
                                    <>
                                        <div>
                                            <Link to="/managestudents"><p>Manage Students</p></Link>
                                        </div>
                                        <div>
                                            <Link to="/manageteachers"><p>Manage Teachers</p></Link>
                                        </div>
                                        <div>
                                            <Link to="/students"><p>Manage Student Assessments</p></Link>
                                        </div> 
                                    </>   
                                    : null}
                                    <div>
                                        <a href="/#" onClick={(e)=>{logoutHandler(e)}}><p>Logout</p></a>
                                        
                                    </div>
                                </div>
                            </main>
                        </div>
                    </div>
                    
                </Box>
            </Drawer>
        </>
  )
}