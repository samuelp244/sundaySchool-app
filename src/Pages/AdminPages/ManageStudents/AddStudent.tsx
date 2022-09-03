import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
// import { addStudent } from '../../../api/services/SpringServer/AdminServices/StudentService'
import { SPRING_SERVER_BASE_URL } from '../../../api/services/SpringServer/spring'

import Header from '../../../Components/header'
import useAxiosPrivate from '../../../Hooks/useAxiosPrivate'

const AddStudent = () => {
    const role = useSelector((state:any)=>state.auth.role);
    // const axiosPrivate = useAxiosPrivate();
    const [StudentDetails,setStudentDetails] = useState({
        studentFirstName:"",
        studentSurname:"",
        studentMobile:"",
        church:"DEFAULT",
        selectedClass:"DEFAULT"
    })
    const [invalidFirstName,setInvalidFirstName] = useState(false);
    const [invalidSurname,setInvalidSurname] = useState(false);
    const [invalidMobile,setInvalidMobile] = useState(false);
    const [invalidChurch,setInvalidChurch] = useState(false);
    const [invalidClassName,setInvalidClassName] = useState(false);

    let classData = null;
    const beershebaClasses = ["Begineer","Primary-Boys","Primary-Girls","Juniour-Boys","Juniour-Girls","Intermediate-Boys","Intermediate-Girls","Senior-Boys","Senior-Girls"];
    if (StudentDetails.church==="Beersheba"){
      classData = beershebaClasses
    }
    const axiosPrivate = useAxiosPrivate()
    const AddStudentHandler = (e:any) =>{
        e.preventDefault();
        if(StudentDetails.studentFirstName==="") setInvalidFirstName(true);
        if(StudentDetails.studentSurname==="") setInvalidSurname(true);
        if(StudentDetails.studentMobile==="") setInvalidMobile(true);
        if(StudentDetails.church==="DEFAULT") setInvalidChurch(true);
        if(StudentDetails.selectedClass==="DEFAULT") setInvalidClassName(true);
        const studentObject = {
            first_name:StudentDetails.studentFirstName,
            surname:StudentDetails.studentSurname,
            mobile:StudentDetails.studentMobile,
            church:StudentDetails.church,
            class:StudentDetails.selectedClass
          }
        // console.log(studentObject)
        axiosPrivate.post(`${SPRING_SERVER_BASE_URL}/addStudent`,studentObject).then(res=>{
            console.log(res)
        })

    }
    const HandleChange = (e:any) =>{
        
        setInvalidFirstName(false);
        setInvalidSurname(false);
        setInvalidMobile(false);
        setInvalidChurch(false);
        setInvalidClassName(false);

        const {name,value} = e.target;
        setStudentDetails({
            ...StudentDetails,
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
            headerTitle={"Add Student"}/>
            <main className="relative  flex flex-col gap-4">
                <div className='flex justify-center'>
                    <form className='flex flex-col gap-6 bg-white shadow-2xl px-8  py-5 mx-3  rounded-2xl font-serif w-[20.2rem]'>
                        
                        <div className='flex justify-between text-sm'>
                            <label className=" font-bold">First Name :</label>
                            <div>
                                <input name="studentFirstName" type="text" className="border-2 border-gray-500 rounded-md  font-sans w-[10rem]" defaultValue={StudentDetails.studentFirstName} onChange={(e)=>HandleChange(e)}/>
                                { invalidFirstName ?<p className='text-xs mx-2 text-red-600 font-sans'>Please enter firstname</p> : null}
                            </div>
                        </div>
                        
                        <div className='flex justify-between text-sm'>
                            
                            <label className=" font-bold"> Surname :</label>
                            <div>
                                <input name="studentSurname" type="text" className="border-2 border-gray-500 rounded-md  font-sans w-[10rem]" defaultValue={StudentDetails.studentSurname} onChange={(e)=>HandleChange(e)}/>
                                { invalidSurname ?<p className='text-xs mx-2 text-red-600 font-sans'>Please enter Surname</p> : null}
                            </div>
                        </div>
                        
                        <div className='flex justify-between text-sm'>
                            
                            <label className=" font-bold">Mobile :</label>
                            <div>
                                <input name="studentMobile" type="text" className="border-2 border-gray-500 rounded-md  font-sans w-[10rem]" defaultValue={StudentDetails.studentMobile} onChange={(e)=>HandleChange(e)} />
                                { invalidMobile ?<p className='text-xs mx-2 text-red-600 font-sans'>Please enter Mobile</p> : null}
                            </div>
                        </div>
                        
                        <div className='flex justify-between text-sm'>
                            
                            <label className=" font-bold">Church :</label>
                            <div>
                                <select name="church" className="w-[10rem] p-1 rounded-sm bg-gray-200 text-gray-700 border border-gray-200 font-sans" defaultValue={StudentDetails.church} onChange={(e)=>HandleChange(e)}>
                                    <option value="DEFAULT" disabled>select church</option>
                                    <option value="Beersheba">BEERSHEBA</option>
                                    <option value="House_Of_Beatitudes">HOUSE OF BEATITUDES</option>
                                    <option value="Eliem">ELIEM</option>
                                    <option value="Bethel">BETHEL</option>
                                    <option value="Bethani">BETHANI</option>
                                    <option value="New_Jerusalem">NEW JERUSALEM</option>
                                    <option value="Rehaboth">REHABOTH</option>
                            
                                </select>
                                { invalidChurch ?<p className='text-xs mx-2 text-red-600 font-sans'>Please enter Church</p> : null}
                            </div>
                        </div>
                        
                        <div className='flex justify-between text-sm'>
                            
                            <label className=" font-bold">Class :</label>
                            <div>
                                <select name="selectedClass" className="w-[10rem] p-1 rounded-sm bg-gray-200 text-gray-700 border border-gray-200 font-sans" defaultValue={StudentDetails.selectedClass} onChange={(e)=>HandleChange(e)} >
                                    <option value="DEFAULT" disabled>select class</option>
                                    {classData?.map(c=>(
                                        <option key={c} value={c}>{c.replace(/_+/g, ' ')}</option>
                                    ))}
                            
                                </select>
                                { invalidClassName ?<p className='text-xs mx-2 text-red-600 font-sans'>Please enter Class</p> : null}
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <Link to="/managestudents"><button className="bg-gray-500 hover:bg-gray-700 text-white font-sans font-semibold py-1 px-2 rounded" type="button">Back</button></Link>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-sans font-semibold py-1 px-2 rounded" type="button" onClick={(e)=>AddStudentHandler(e)} >add</button>
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

export default AddStudent