import { useEffect, useState } from 'react'
import Header from '../../Components/header'
import userImage from '../../assets/images/user.png'
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';
import { SPRING_SERVER_BASE_URL } from '../../api/services/SpringServer/spring';
import { useSelector } from 'react-redux';
// import teacherData from '../teacher.json'
interface userData{
  teacher_name:string,
  church:string,
  assigned_class:string,
  mobile:string
}

export default function TeacherProfile() {
  const [teacherData, setTeacherData] = useState<userData>();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const user:string = useSelector((state:any)=>state.auth.user)

  useEffect(()=>{
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
        try {
            const response = await axiosPrivate.get(`${SPRING_SERVER_BASE_URL}/getTeacherData?username=${user}`);
            // console.log(response);
            isMounted && setTeacherData(response.data);
        } catch (err) {
            // console.error(err);
            navigate('/', { state: { from: location }, replace: true });
        }
    }

    getUsers();

    return () => {
        isMounted = false;
        controller.abort();
    }
  },[axiosPrivate,location,navigate,user])
  return (
    <div className='h-screen p-0 flex flex-col gap-5'>
            <Header 
            userIcon={false}
            headerTitle={"Profile"}/>
            <main className="relative  flex flex-col gap-4">
              <div className='flex flex-col justify-center py-2'>
                <div className='flex justify-center '>
                  <img src={userImage} className=" w-[88px]" alt="userImage.png"/>
                  </div>
                  <div className='py-3 flex justify-center'>
                      <h3 className=' text-xl font-bold '>{user}</h3>
                  </div>
              </div>
              <div className="flex justify-center">
                    <div className="container shadow-2xl rounded-2xl bg-white w-[20.2rem] p-4 px-5 flex flex-col gap-2">
                        <div className="">
                            <h1 className=" text-lg font-bold">General</h1>
                        </div>
                        <div className='flex flex-col gap-4'>
                          <div className='flex flex-col gap-1'>
                            <h1 className="text-sm">Full Name</h1>
                            <p className='text-xs font-extralight'>{teacherData?.teacher_name}</p>
                          </div>
                          <div className='flex flex-col gap-1'>
                            <h1 className=" text-sm">Church</h1>
                            <p className='text-xs font-extralight'>{teacherData?.church}</p>
                          </div>
                          <div className='flex flex-col gap-1'>
                            <h1 className="text-sm">Class/Section</h1>
                            <p className='text-xs font-extralight'>{teacherData?.assigned_class}</p>
                          </div>
                          <div className='flex flex-col gap-1'>
                            <h1 className="text-sm">Phone Number</h1>
                            <p className='text-xs font-extralight'>{teacherData?.mobile}</p>
                          </div>
                          
                        </div>
                        
                    </div>
                </div>

            </main>
        </div>
  )
}
