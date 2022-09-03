import { Modal } from '@mantine/core'
import {useState,useEffect} from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { axiosPrivate } from '../../../api/services/authService'
import { SPRING_SERVER_BASE_URL } from '../../../api/services/SpringServer/spring'
// import { deleteTeacher, editTeacher, viewTeacher } from '../../../api/services/SpringServer/AdminServices/TeacherService'
import Header from '../../../Components/header'
import { teacherDetails } from '../../InterfacesAndTypes'
// import teachersData from '../../teacher.json'

const ManageTeachersPage = () => {
    const role = useSelector((state:any)=>state.auth.role)
    const [selectedChurch,setSelectedChurch] = useState("DEFAULT");
    const [teacherModalOpened,setTeacherModalOpened]=useState(false);
    const [fieldDisabled,setFieldDisabled] = useState(true);
    const [teachersList,setTeachersList] = useState<teacherDetails[]>();
    const [teacher,setTeacher] = useState({
      teacher_name : "",
      mobile : "",
      church:"",
      assigned_class:""
    })
    const [selectedTeacherId,setSelectedTeacherId]=useState("");
    // const teachers = teachersData.teachers;
    // const church = teachersData.church
    const [invalidFullName,setInvalidFullName] = useState(false);
    const [invalidMobile,setInvalidMobile] = useState(false);
    const [invalidChurch,setInvalidChurch] = useState(false);
    const [invalidClassName,setInvalidClassName] = useState(false);

    let classData = null;
    const beershebaClasses = ["Begineer","Primary-Boys","Primary-Girls","Juniour-Boys","Juniour-Girls","Intermediate-Boys","Intermediate-Girls","Senior-Boys","Senior-Girls"];
    if (selectedChurch==="Beersheba"){
      classData = beershebaClasses
    }
    const viewTeacherDetails = (e:any,id:string) =>{
      e.preventDefault();
      setSelectedTeacherId(id);

      setTeacherModalOpened(true)
    }

    const HandleEditChange = (e:any) =>{
      const {name,value} = e.target;
      setInvalidFullName(false);
      setInvalidMobile(false);
      setInvalidChurch(false);
      setInvalidClassName(false);
      setTeacher({
          ...teacher,
          [name]:value
      })
  }


  const EditTeacherHandler = (e:any) =>{
    e.preventDefault();
    setFieldDisabled(o=>!o)
  }


  const SubmitEditTeacherHandler = (e:any) =>{
    e.preventDefault();
    const teacherObject = {
      username : selectedTeacherId,
      teacher_name:teacher.teacher_name,
      mobile:teacher.mobile,
      church:teacher.church,
      assigned_class:teacher.assigned_class
    }
    axiosPrivate.put(`${SPRING_SERVER_BASE_URL}/editTeacher`,teacherObject).then(()=>{
      setTeacherModalOpened(false)
    })
    // editTeacher(teacherObject).then(res=>{
    //   console.log(res)
    //   setTeacherModalOpened(false)
    // })
  }


  const DeleteTeacherHandler = (e:any) =>{
    e.preventDefault();
    // console.log(selectedTeacherId)
    axiosPrivate.delete(`${SPRING_SERVER_BASE_URL}/deleteTeacher?username=${selectedTeacherId}`)
    // deleteTeacher(selectedTeacherId).then(res=>{
    //   console.log(res)
    // })
  }


  useEffect(()=>{
    if(selectedChurch!=="DEFAULT"){
      axiosPrivate.get(`${SPRING_SERVER_BASE_URL}/viewTeacher?church=${selectedChurch}`).then(res=>{
        setTeachersList(res.data.teachers)
      })
      // viewTeacher(selectedChurch).then(res=>{
      //   setTeachersList(res.data.teachers)
      // })
    }else{
      setTeachersList([])
    }
  },[selectedChurch])

  useEffect(()=>{
    if(selectedChurch!=="DEFAULT"){
      axiosPrivate.get(`${SPRING_SERVER_BASE_URL}/viewTeacher?church=${selectedChurch}`).then(res=>{
        setTeachersList(res.data.teachers)
      })
    }
    
    if(!teacherModalOpened) setFieldDisabled(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[teacherModalOpened])

  useEffect(()=>{
    const t = teachersList?.filter(teacher=>teacher.username === selectedTeacherId)[0]
    if(t!==undefined){
      setTeacher({
        teacher_name : t?.teacher_name,
        mobile : t?.mobile,
        church:selectedChurch,
        assigned_class:t?.assigned_class
      })
    }
},[teachersList,selectedTeacherId,selectedChurch])

  return (
    <>
    {
        role==="admin" ? 
        <div className='h-screen p-0 flex flex-col gap-5'>
            <Header 
            userIcon={true}
            headerTitle={"Manage Teachers"}/>
            <main className="relative  flex flex-col gap-4">
              <div className='flex justify-center'>
                <div className='bg-white shadow-2xl px-8  py-5 mx-3  rounded-2xl grid gap-3 font-serif w-[20.2rem]'>
                  <form className=' '>
                      <div className='flex justify-end'>
                          <Link to="/addteacher"><button className='text-sm font-sans bg-slate-300 px-2 my-2 border-black border'>+Add</button></Link>
                      </div>
                      <div className=' text-xs flex '>
                        <select value={selectedChurch} onChange={(e:any)=>setSelectedChurch(e.target.value)} className='py-1 mx-auto'>
                          <option value="DEFAULT" disabled>select church</option>
                          <option value="Beersheba">BEERSHEBA</option>
                          <option value="House_Of_Beatitudes">HOUSE OF BEATITUDES</option>
                          <option value="Eliem">ELIEM</option>
                          <option value="Bethel">BETHEL</option>
                          <option value="Bethani">BETHANI</option>
                          <option value="New_Jerusalem">NEW JERUSALEM</option>
                          <option value="Rehaboth">REHABOTH</option>
                        </select>
                        
                      </div>
                    </form>
                    < Modal
                        opened={teacherModalOpened}
                        onClose={() => {
                          setTeacherModalOpened(false)
                          setFieldDisabled(true)
                        }}
                        title="Teacher Details" 
                    >
                        
                        <div className='grid gap-4'>
                            <div className='flex justify-between text-sm'>
                                <label className=" font-bold">Full Name :</label>
                                <div>
                                    <input name="teacher_name" type="text" className="border-2 border-gray-500 rounded-md  font-sans w-[10rem] disabled:bg-gray-300" defaultValue={teacher?.teacher_name} onChange={(e)=>HandleEditChange(e)} disabled={fieldDisabled}/>
                                    { invalidFullName ?<p className='text-xs mx-2 text-red-600 font-sans'>Please enter FullName</p> : null}
                                </div>
                            </div>
                            
                            <div className='flex justify-between text-sm'>
                                
                                <label className=" font-bold">Mobile :</label>
                                <div>
                                    <input name="mobile" type="text" className="border-2 border-gray-500 rounded-md  font-sans w-[10rem] disabled:bg-gray-300" defaultValue={teacher?.mobile} onChange={(e)=>HandleEditChange(e)} disabled={fieldDisabled} />
                                    { invalidMobile ?<p className='text-xs mx-2 text-red-600 font-sans'>Please enter Mobile</p> : null}
                                </div>
                            </div>
                            
                            <div className='flex justify-between text-sm'>
                                
                                <label className=" font-bold">Church :</label>
                                <div>
                                    <select name="church" className="w-[10rem] p-1 rounded-sm bg-gray-200 text-gray-700 border border-gray-200 font-sans" defaultValue={teacher?.church} onChange={(e)=>HandleEditChange(e)} disabled={fieldDisabled}>
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
                                    <select name="assigned_class" className="w-[10rem] p-1 rounded-sm bg-gray-200 text-gray-700 border border-gray-200 font-sans" defaultValue={teacher?.assigned_class} onChange={(e)=>HandleEditChange(e)} disabled={fieldDisabled} >
                                        <option value="DEFAULT" disabled>select class</option>
                                        {classData?.map(c=>(
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                
                                    </select>
                                    { invalidClassName ?<p className='text-xs mx-2 text-red-600 font-sans'>Please enter Class</p> : null}
                                </div>
                            </div>
                            <div className='flex justify-between'>
                                {fieldDisabled?<button className=" bg-cyan-500 hover:bg-cyan-700 text-white font-sans font-semibold py-1 px-2 rounded" type="button" onClick={(e)=>EditTeacherHandler(e)} >Edit</button>:null}
                                {fieldDisabled?null:<button className=" bg-yellow-500 hover:bg-yellow-700 text-white font-sans font-semibold py-1 px-2 rounded" type="button" onClick={(e)=>EditTeacherHandler(e)} >Cancel</button>}
                                {fieldDisabled?null:<button className="bg-blue-500 hover:bg-blue-700 text-white font-sans font-semibold py-1 px-2 rounded  disabled:opacity-50" type="button" onClick={(e)=>SubmitEditTeacherHandler(e)} >Submit</button>}
                            </div>
                            <div className='flex justify-end'>
                                {fieldDisabled?null:<button className=" bg-red-500 hover:bg-red-700 text-white font-sans font-semibold py-1 px-2 rounded disabled:opacity-50" type="button" onClick={(e)=>DeleteTeacherHandler(e)}>Remove</button>}
                            </div>
                            <div className='clearfix'></div>
                        </div>
                    </Modal>
                    <ul className='grid gap-3'>
                      {teachersList?.map(t=>(
                        <li key={t.username}>
                          <div className='flex justify-between'>
                              <p className=''>{t.teacher_name}</p>
                              <button className='text-sm bg-blue-300 hover:bg-blue-400 rounded  px-2 font-sans' onClick={(e)=>viewTeacherDetails(e,t.username)}>view details</button>
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

export default ManageTeachersPage