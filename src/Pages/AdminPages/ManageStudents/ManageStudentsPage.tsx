import { Modal } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
// import { deleteStudent, editStudent, viewStudent } from '../../../api/services/SpringServer/AdminServices/StudentService'
import { SPRING_SERVER_BASE_URL } from '../../../api/services/SpringServer/spring'
import Header from '../../../Components/header'
import useAxiosPrivate from '../../../Hooks/useAxiosPrivate'
import { getStudentsArray, studentDetails } from '../../InterfacesAndTypes'
// import studentsData from '../../students.json'

const ManageStudentsPage = () => {
    const role = useSelector((state:any)=>state.auth.role)
    const [selectedChurch,setSelectedChurch] = useState("DEFAULT");
    const [selectedClass,setSelectedClass] = useState("DEFAULT")
    const [studentsList,setStudentsList] = useState<studentDetails[]>();
    const [studentModalOpened,setStudentModalOpened]=useState(false);
    const [student,setStudent] = useState({
      first_name:"",
      surname:"",
      mobile:"",
      church:"",
      class:"DEFAULT"
    });
    const [selectedStudentId,setSelectedStudentId]=useState("")
    // const students = studentsData.students;
    const viewStudentDetails=(e:any,id:string)=>{
      e.preventDefault();
      setSelectedStudentId(id);
      
      setStudentModalOpened(true);
  }

    const [invalidFirstName,setInvalidFirstName] = useState(false);
    const [invalidSurname,setInvalidSurname] = useState(false);
    const [invalidMobile,setInvalidMobile] = useState(false);
    const [invalidChurch,setInvalidChurch] = useState(false);
    const [invalidClassName,setInvalidClassName] = useState(false);

    const HandleEditChange = (e:any) =>{
      const {name,value} = e.target;
      setInvalidFirstName(false);
      setInvalidSurname(false);
      setInvalidMobile(false);
      setInvalidChurch(false);
      setInvalidClassName(false);
      setStudent({
          ...student,
          [name]:value
      })
  }

    let classData = null;
    const beershebaClasses = ["Begineer","Primary-Boys","Primary-Girls","Juniour-Boys","Juniour-Girls","Intermediate-Boys","Intermediate-Girls","Senior-Boys","Senior-Girls"];
    if (selectedChurch==="Beersheba"){
      classData = beershebaClasses
    }

    const axiosPrivate = useAxiosPrivate()
    // runs and updates the teacherArray when church and class selected
    useEffect(()=>{
      if(selectedClass!=="DEFAULT"&&selectedChurch!=="DEFAULT"){
          axiosPrivate.get<getStudentsArray>(`${SPRING_SERVER_BASE_URL}/viewStudent?church=${selectedChurch}&class=${selectedClass}`).then(res=>{
            console.log(res.data)
            setStudentsList(res.data.students)
          })
      }else{
        setStudentsList([])
      }
    },[selectedClass,selectedChurch,axiosPrivate])
    
    useEffect(()=>{
      const s = studentsList?.filter(student=>student.uniqueID === selectedStudentId)[0]
      if(s!==undefined){
        setStudent({
          first_name:s?.first_name,
          surname:s?.surname,
          mobile:s?.mobile,
          church:selectedChurch,
          class:selectedClass
        })
      }
      
  },[selectedChurch,selectedClass,selectedStudentId,studentsList])

  const [fieldDisabled,setFieldDisabled] = useState(true);
  const EditStudentHandler = (e:any) =>{
    e.preventDefault();
    setFieldDisabled((o)=>!o)
  }

  const SubmitEditStudentHandler = (e:any) =>{
    e.preventDefault();
    const studentObject:studentDetails = {
      uniqueID:selectedStudentId,
      first_name:student.first_name,
      surname:student.surname,
      mobile:student.mobile,
      church:student.church,
      class:student.class
    }
    // console.log(studentObject);
    axiosPrivate.put(`${SPRING_SERVER_BASE_URL}/editStudent`,studentObject).then(()=>{
      setStudentModalOpened(false)
      const updatedList = studentsList?.map(item=>{
        if(item.uniqueID===selectedStudentId){
          return {...item,first_name:student.first_name,
            surname:student.surname,
            mobile:student.mobile,
            church:student.church,
            class:student.class}
        }
        return item
      })
      console.log(updatedList);
      setStudentsList(updatedList);
      setFieldDisabled(true);
    })

    // editStudent(studentObject).then(res=>{
    //   console.log(res);
    // })
    
  }

  const DeleteStudentHandler = (e:any) =>{
    e.preventDefault();
    // console.log(selectedStudentId)
    axiosPrivate.delete(`${SPRING_SERVER_BASE_URL}/deleteStudent?uniqueID=${selectedStudentId}`).then(()=>{
      setStudentModalOpened(false)
    })
    // deleteStudent(selectedStudentId).then(res=>{
    //   console.log(res)
    // })
  }

  return (
    <>
    {
        role==="admin" ? 
        
        <div className='h-screen p-0 flex flex-col gap-5'>  
            <Header 
            userIcon={true}
            headerTitle={"Manage Students"}/>
            <main className="relative  flex flex-col gap-4">
              <div className='flex justify-center'>
                <div className='bg-white shadow-2xl px-8  py-5 mx-3  rounded-2xl grid gap-3 font-serif w-[20.2rem]'>
                  <form className=' '>
                      <div className='flex justify-end'>
                        <Link to="/addstudent"><button className='text-sm font-sans bg-slate-300 px-2 my-2 border-black border'>+Add</button></Link>
                      </div>
                      <div className=' text-sm flex '>
                        <select value={selectedChurch} onChange={(e:any)=>setSelectedChurch(e.target.value)} className='py-1 w-32 mr-1 font-sans'>
                          <option value="DEFAULT" disabled>select church</option>
                          <option value="Beersheba">BEERSHEBA</option>
                          <option value="House_Of_Beatitudes">HOUSE OF BEATITUDES</option>
                          <option value="Eliem">ELIEM</option>
                          <option value="Bethel">BETHEL</option>
                          <option value="Bethani">BETHANI</option>
                          <option value="New_Jerusalem">NEW JERUSALEM</option>
                          <option value="Rehaboth">REHABOTH</option>
                        </select>
                        <select className='py-1 w-32 ml-1 font-sans' value={selectedClass} onChange={(e)=>setSelectedClass(e.target.value)}>
                          <option value="DEFAULT" disabled>select class</option>
                          {
                            classData?.map(c=>(
                              <option key={c} value={c}>{c.replace(/_+/g, ' ')}</option>
                            ))
                          }
                        </select>
                      </div>
                    </form>
                    < Modal
                        opened={studentModalOpened}
                        onClose={() => {
                          setStudentModalOpened(false)
                          setFieldDisabled(true)
                        }}
                        title="Student Details" 
                    >
                        
                        <div className='grid gap-4'>
                            <div className='flex justify-between text-sm'>
                                <label className=" font-bold">First Name :</label>
                                <div>
                                    <input name="first_name" type="text" className="border-2 px-1 border-gray-500 rounded-sm  font-sans w-[10rem] disabled:bg-gray-300" defaultValue={student?.first_name} onChange={(e)=>HandleEditChange(e)} disabled={fieldDisabled} />
                                    { invalidFirstName ?<p className='text-xs mx-2 text-red-600 font-sans'>Please enter firstname</p> : null}
                                </div>
                            </div>
                            
                            <div className='flex justify-between text-sm'>
                                
                                <label className=" font-bold"> Surname :</label>
                                <div>
                                    <input name="surname" type="text" className="border-2 px-1 border-gray-500 rounded-sm  font-sans w-[10rem] disabled:bg-gray-300" defaultValue={student?.surname} onChange={(e)=>HandleEditChange(e)} disabled={fieldDisabled}/>
                                    { invalidSurname ?<p className='text-xs mx-2 text-red-600 font-sans'>Please enter Surname</p> : null}
                                </div>
                            </div>
                            
                            <div className='flex justify-between text-sm'>
                                
                                <label className=" font-bold">Mobile :</label>
                                <div>
                                    <input name="mobile" type="text" className="border-2 px-1 border-gray-500 rounded-sm  font-sans w-[10rem] disabled:bg-gray-300" defaultValue={student?.mobile} onChange={(e)=>HandleEditChange(e)} disabled={fieldDisabled} />
                                    { invalidMobile ?<p className='text-xs mx-2 text-red-600 font-sans'>Please enter Mobile</p> : null}
                                </div>
                            </div>
                            
                            <div className='flex justify-between text-sm'>
                                
                                <label className=" font-bold">Church :</label>
                                <div>
                                    <select name="church" className="w-[10rem] p-1 rounded-sm bg-gray-200 text-gray-700 border border-gray-200 font-sans " defaultValue={student?.church} onChange={(e)=>HandleEditChange(e)} disabled={fieldDisabled}>
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
                                    <select name="selectedClass" className="w-[10rem] p-1  rounded-sm bg-gray-200 text-gray-700 border border-gray-200 font-sans" defaultValue={student?.class} onChange={(e)=>HandleEditChange(e)} disabled={fieldDisabled} >
                                        <option value="DEFAULT" disabled>select class</option>
                                        {classData?.map(c=>(
                                            <option key={c} value={c}>{c.replace(/_+/g, ' ')}</option>
                                        ))}
                                
                                    </select>
                                    { invalidClassName ?<p className='text-xs mx-2 text-red-600 font-sans'>Please enter Class</p> : null}
                                </div>
                            </div>
                            <div className='flex justify-between'>
                                {fieldDisabled ?<button className=" bg-cyan-500 hover:bg-cyan-700 text-white font-sans font-semibold py-1 px-2 rounded" type="button" onClick={(e)=>EditStudentHandler(e)} >Edit</button>:null}
                                {fieldDisabled ?null:<button className=" bg-yellow-500 hover:bg-yellow-700 text-white font-sans font-semibold py-1 px-2 rounded" type="button" onClick={(e)=>EditStudentHandler(e)} >cancel</button>}
                                {fieldDisabled ? null : <button className="bg-blue-500 hover:bg-blue-700 text-white font-sans font-semibold py-1 px-2 rounded " type="button" onClick={(e)=>SubmitEditStudentHandler(e)} >Submit</button>}
                            </div>
                            <div className='flex justify-end'>
                                {fieldDisabled ? null : <button className=" bg-red-500 hover:bg-red-700 text-white font-sans font-semibold py-1 px-2 rounded " type="button" onClick={(e)=>DeleteStudentHandler(e)}  >Remove</button>}
                            </div>
                            <div className='clearfix'></div>
                        </div>
                    </Modal>
                    <ul className='grid gap-3'>
                      {studentsList?.map(s=>(
                        <li key={s.uniqueID}>
                          <div className='flex justify-between'>
                              <p className=''>{s.first_name+" "+s.surname}</p>
                              <button className='text-sm bg-blue-300 hover:bg-blue-400 rounded  px-2 font-sans' onClick={(e)=>viewStudentDetails(e,s.uniqueID)}>view details</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
            </main>
        </div> 
        : null
    }
    </>
  )
}

export default ManageStudentsPage