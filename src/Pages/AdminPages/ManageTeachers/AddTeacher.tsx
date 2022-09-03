import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// import { addTeacher } from '../../../api/services/SpringServer/AdminServices/TeacherService';
import { SPRING_SERVER_BASE_URL } from '../../../api/services/SpringServer/spring';

import Header from '../../../Components/header';
import useAxiosPrivate from '../../../Hooks/useAxiosPrivate';

const AddTeacher = () => {
    const role = useSelector((state:any)=>state.auth.role)
    const [TeacherDetails,setTeacherDetails] = useState({
        teacherFullName:"",
        teacherMobile:"",
        church:"DEFAULT",
        selectedClass:"DEFAULT"
    })
    const [invalidFullName,setInvalidFullName] = useState(false);
    const [invalidMobile,setInvalidMobile] = useState(false);
    const [invalidChurch,setInvalidChurch] = useState(false);
    const [invalidClassName,setInvalidClassName] = useState(false);


    let classData = null;
    const beershebaClasses = ["BEGINNER","PRIMARY_BOYS","PRIMARY_GIRLS","JUNIOUR_BOYS","JUNIOUR_GIRLS","INTERMEDIATE_BOYS","INTERMEDIATE_GIRLS","SENIOR_BOYS","SENIOR_GIRLS"];
    if (TeacherDetails.church==="BEERSHEBA"){
      classData = beershebaClasses
    }
    const axiosPrivate = useAxiosPrivate();
    const AddTeacherHandler = (e:any) =>{
        e.preventDefault();
        if(TeacherDetails.teacherFullName==="") setInvalidFullName(true);
        if(TeacherDetails.teacherMobile==="") setInvalidMobile(true);
        if(TeacherDetails.church==="DEFAULT") setInvalidChurch(true);
        if(TeacherDetails.selectedClass==="DEFAULT") setInvalidClassName(true);
        const teacherObject = {
            teacher_name:TeacherDetails.teacherFullName,
            mobile:TeacherDetails.teacherMobile,
            church:TeacherDetails.church,
            assigned_class:TeacherDetails.selectedClass
          }
        axiosPrivate.post(`${SPRING_SERVER_BASE_URL}/addTeacher`,teacherObject)
        // addTeacher(teacherObject).then(res=>{
        //     console.log(res)
        // })
    }
    const HandleChange = (e:any) =>{
        const {name,value} = e.target;
        setInvalidFullName(false);
        setInvalidMobile(false);
        setInvalidChurch(false);
        setInvalidClassName(false);
        setTeacherDetails({
            ...TeacherDetails,
            [name]:value
        })
    }
  return (
    <>
       { 
       role==="admin" ? 
       <div className='h-screen p-0 flex flex-col gap-5'>
            <Header 
            userIcon={false}
            headerTitle={"Add Teacher"}/>
            <main className="relative  flex flex-col gap-4">
                <div className='flex justify-center'>
                    <form className='flex flex-col gap-6 bg-white shadow-2xl px-8  py-5 mx-3  rounded-2xl font-serif w-[20.2rem]'>
                        
                        <div className='flex justify-between text-sm'>
                            <label className=" font-bold">Full Name :</label>
                            <div>
                                <input name="teacherFullName" type="text" className="border-2 border-gray-500 rounded-md  font-sans w-[10rem]" defaultValue={TeacherDetails.teacherFullName} onChange={(e)=>HandleChange(e)}/>
                                { invalidFullName ?<p className='text-xs mx-2 text-red-600 font-sans'>Please enter FullName</p> : null}
                            </div>
                        </div>
                        
                        <div className='flex justify-between text-sm'>
                            
                            <label className=" font-bold">Mobile :</label>
                            <div>
                                <input name="teacherMobile" type="text" className="border-2 border-gray-500 rounded-md  font-sans w-[10rem]" defaultValue={TeacherDetails.teacherMobile} onChange={(e)=>HandleChange(e)} />
                                { invalidMobile ?<p className='text-xs mx-2 text-red-600 font-sans'>Please enter Mobile</p> : null}
                            </div>
                        </div>
                        
                        <div className='flex justify-between text-sm'>
                            
                            <label className=" font-bold">Church :</label>
                            <div>
                                <select name="church" className="w-[10rem] p-1 rounded-sm bg-gray-200 text-gray-700 border border-gray-200 font-sans" defaultValue={TeacherDetails.church} onChange={(e)=>HandleChange(e)}>
                                    <option value="DEFAULT" disabled>select church</option>
                                    <option value="BEERSHEBA">BEERSHEBA</option>
                                    <option value="HOUSE_OF_BEATITUDES">HOUSE OF BEATITUDES</option>
                                    <option value="ELIEM">ELIEM</option>
                                    <option value="BETHEL">BETHEL</option>
                                    <option value="BETHANI">BETHANI</option>
                                    <option value="NEW_JERUSALEM">NEW JERUSALEM</option>
                                    <option value="REHABOTH">REHABOTH</option>
                            
                                </select>
                                { invalidChurch ?<p className='text-xs mx-2 text-red-600 font-sans'>Please enter Church</p> : null}
                            </div>
                        </div>
                        
                        <div className='flex justify-between text-sm'>
                            
                            <label className=" font-bold">Assign class :</label>
                            <div>
                                <select name="selectedClass" className="w-[10rem] p-1 rounded-sm bg-gray-200 text-gray-700 border border-gray-200 font-sans" defaultValue={TeacherDetails.selectedClass} onChange={(e)=>HandleChange(e)} >
                                    <option value="DEFAULT" disabled>select class</option>
                                    {classData?.map(c=>(
                                        <option key={c} value={c}>{c.replace(/_+/g, ' ')}</option>
                                    ))}
                            
                                </select>
                                { invalidClassName ?<p className='text-xs mx-2 text-red-600 font-sans'>Please enter Class</p> : null}
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <Link to="/manageteachers"><button className="bg-gray-500 hover:bg-gray-700 text-white font-sans font-semibold py-1 px-2 rounded" type="button">Back</button></Link>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-sans font-semibold py-1 px-2 rounded" type="button" onClick={(e)=>AddTeacherHandler(e)} >add</button>
                        </div>
                        <div className="clearfix"></div>
                    </form>
                </div>
            </main>
        </div>
        : null}
    </>
  )
}

export default AddTeacher