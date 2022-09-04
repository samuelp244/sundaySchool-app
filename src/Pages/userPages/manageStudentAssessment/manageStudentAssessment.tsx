import { Modal } from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { SPRING_SERVER_BASE_URL } from '../../../api/services/SpringServer/spring';
// import { editAssessment, viewAssessmentMarks } from '../../../api/services/SpringServer/UserService/AssessmentsService';

import Header from '../../../Components/header';
import useAxiosPrivate from '../../../Hooks/useAxiosPrivate';
import useCurrData from '../../../Hooks/useCurrData';
// import { initiateArray, updateArray } from '../../../redux/classAssessment';

import { AssessmentInputs, FinalAssessment } from "../../InterfacesAndTypes"

const ManageStudentAssessment = () => {

    const role = useSelector((state:any)=>state.auth.role)
    const user:string = useSelector((state:any)=>state.auth.user)
    
    const [studentsAssessmentArray,setStudentAssessmentArray] = useState<FinalAssessment[]>();
    const [student,setStudent] = useState<FinalAssessment>();
    
    const [selectedStudentId,setSelectedStudentId] = useState("");

    const [studentAssessmentModalOpened,setStudentAssessmentModalOpened] = useState(false);
    const [fieldDisabled,setFieldDisabled]= useState(true);

    const axiosPrivate = useAxiosPrivate();
    const currDate = useCurrData() 

    const [assessmentValues] = useState<AssessmentInputs>({
        attendance:useRef<HTMLSelectElement | null>(null),
        songs_4:useRef<HTMLSelectElement | null>(null),
        worship_message:useRef<HTMLSelectElement | null>(null),
        table_message:useRef<HTMLSelectElement | null>(null),
        behaviour:useRef<HTMLSelectElement | null>(null),
        memory_verses:useRef<HTMLSelectElement | null>(null),
        total_marks:useRef<HTMLInputElement | null>(null),
        remarks:useRef<HTMLTextAreaElement | null>(null),
    })

    useEffect(()=>{
        axiosPrivate.get(`${SPRING_SERVER_BASE_URL}/viewAssessmentMarks?username=${user}&date=${currDate}`).then(res=>{
            setStudentAssessmentArray(res.data.studentsMarks);
        })
        // viewAssessmentMarks(user,currDate).then(res=>{
        //     setStudentAssessmentArray(res.data.studentsMarks);
        // })
    },[axiosPrivate,user,currDate])
    
    useEffect(()=>{
        const s = studentsAssessmentArray?.filter(student=>student.uniqueID === selectedStudentId)[0]
        setStudent(s);
    },[selectedStudentId,studentsAssessmentArray])


    const HandleChange=(e:any)=>{
        // const target = e.target;

        let Attendance_marks:number = 0;
        let songs_marks:number = 0;
        let worship_message_marks:number = 0;
        let table_message_marks:number = 0;
        let behaviour_marks:number = 0;
        let memory_verses_marks:number = 0;
        let total:string = "0";
        let remarks:string="";

        // if(student!==undefined) total = student.total.toString();
        if(assessmentValues.attendance.current!==null) Attendance_marks = (isNaN(parseInt(assessmentValues.attendance.current.value,10))? 0:parseInt(assessmentValues.attendance.current.value,10));
        if(Attendance_marks===0){
            if(assessmentValues.songs_4.current!==null) assessmentValues.songs_4.current.value = "0"
            if(assessmentValues.worship_message.current!==null) assessmentValues.worship_message.current.value = "0"
            if(assessmentValues.table_message.current!==null) assessmentValues.table_message.current.value = "0"
            if(assessmentValues.behaviour.current!==null) assessmentValues.behaviour.current.value = "0"
            if(assessmentValues.memory_verses.current!==null) assessmentValues.memory_verses.current.value = "0"
            if(assessmentValues.total_marks.current!==null) assessmentValues.total_marks.current.value = "0"
            if(assessmentValues.remarks.current!==null) assessmentValues.remarks.current.value = ""
        }else{
            if(assessmentValues.songs_4.current!==null) songs_marks = (isNaN(parseInt(assessmentValues.songs_4.current.value,10))? 0:parseInt(assessmentValues.songs_4.current.value,10));
            if(assessmentValues.worship_message.current!==null) worship_message_marks = (isNaN(parseInt(assessmentValues.worship_message.current.value,10))? 0: parseInt(assessmentValues.worship_message.current.value,10));
            if(assessmentValues.table_message.current!==null) table_message_marks = (isNaN(parseInt(assessmentValues.table_message.current.value,10))? 0:parseInt(assessmentValues.table_message.current.value,10));
            if(assessmentValues.behaviour.current!==null) behaviour_marks = (isNaN(parseInt(assessmentValues.behaviour.current.value,10))? 0:parseInt(assessmentValues.behaviour.current.value,10));
            if(assessmentValues.memory_verses.current!==null) memory_verses_marks = (isNaN(parseInt(assessmentValues.memory_verses.current.value,10))? 0:parseInt(assessmentValues.memory_verses.current.value,10));

            if(assessmentValues.total_marks.current!==null){
                assessmentValues.total_marks.current.value = (Attendance_marks+songs_marks+worship_message_marks+table_message_marks+behaviour_marks+memory_verses_marks).toString();
                total = assessmentValues.total_marks.current.value
                // setTotal(total)
            } 
            if(assessmentValues.remarks.current!==null) remarks = assessmentValues.remarks.current.value;
        }
        
        if(student!==undefined){
            const updatedAssessmentValues:FinalAssessment = {
                "church": student?.church,
                "class":student?.class,
                "date": student?.date,
                "uniqueID": student?.uniqueID,
                "first_name": student?.first_name,
                "surname": student?.surname,
                "attendance": Attendance_marks.toString(),
                "songs_4": songs_marks.toString(),
                "worship_message": worship_message_marks.toString(),
                "table_message": table_message_marks.toString(),
                "behaviour": behaviour_marks.toString(),
                "memory_verses": memory_verses_marks.toString(),
                "total": total.toString(),
                "remarks": remarks
            }
            setStudent({...student,...updatedAssessmentValues});
        }
    }

    const viewStudentMarks = (e:any,id:string) =>{
        e.preventDefault();
        setSelectedStudentId(id);
        setStudentAssessmentModalOpened(true)
    }

    const EditStudentHandler = (e:any) =>{
        e.preventDefault();
        setFieldDisabled((o)=>!o)
    }

    const saveAssessment=(e:any)=>{
        e.preventDefault();
        // assessmentArray = state.assessmentArray.map(obj=> action.payload.find(o=>o.uniqueID === obj.uniqueID)|| obj);
        setStudentAssessmentArray(newStudentsAssessmentArray=>newStudentsAssessmentArray?.map(
            obj=>obj.uniqueID === student?.uniqueID ? Object.assign(obj,student):obj))
        setStudentAssessmentModalOpened(false)
    }

    
    const submitEditedClassAssessments = (e:any)=>{
        e.preventDefault();
        if(studentsAssessmentArray!==undefined){
            const updatedAssessmentsObject = {
                studentsMarks:studentsAssessmentArray,
                username:user
            }
            // console.log(updatedAssessmentsObject)
            axiosPrivate.put(`${SPRING_SERVER_BASE_URL}/editAssessmentMarks`,updatedAssessmentsObject).then(res=>{
                console.log(res)
                setFieldDisabled(true)
            })
        }
    }


    return (
        <>
        {role==="user" ? 
        <div className='h-screen p-0 flex flex-col gap-5'>
            <Header 
            userIcon={true}
            headerTitle={""}/>
            <main className="relative  flex flex-col gap-4">
                <div className='flex justify-center'>
                    <div className='bg-white shadow-2xl px-8  py-5 mx-3  rounded-2xl grid gap-3 font-serif w-[20.2rem]'>
                    {studentsAssessmentArray?.length!==0? 
                   <div className='grid gap-4'>
                        { studentsAssessmentArray?.map(s=>(
                            
                            <div className='flex justify-between' key={s.uniqueID}>
                                <p className=''>{s.first_name+" "+s.surname}</p>
                                <button className='text-sm bg-blue-300 hover:bg-blue-400 rounded  px-2 font-sans' onClick={(e)=>viewStudentMarks(e,s.uniqueID)}>view marks</button>
                            </div>
                            
                        ))}
                        <div className="flex justify-between">
                            <Link to="/dashboard"><button className="bg-gray-500 hover:bg-gray-700 text-white font-sans font-semibold py-1 px-2 rounded" type="button">Back</button></Link>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-sans font-semibold py-1 px-2 rounded" type="button" onClick={(e)=>submitEditedClassAssessments(e)} >submit</button>
                        </div>
                   </div>:

                    <div className="">
                        <div className='flex justify-center'>
                            <p className=" pt-2 text-gray-500 text-sm font-sans font-semibold">Nothing to show here</p>
                        </div>
                    </div> 
                      }
                    </div>
                </div>
            </main>
            < Modal
                opened={studentAssessmentModalOpened}
                onClose={() => {
                    setStudentAssessmentModalOpened(false)
                    setFieldDisabled(true)
                    setSelectedStudentId("")
                }}
                title="Teacher Details" 
            >
            <div className='grid gap-4'>
                <div className="">
                    <div className="flex justify-center ">
                        <p className="pr-1 font-bold ">Student Name : </p><p className="px-1 ml-3"> {student?.first_name+" "+student?.surname}</p>   
                    </div>
                </div>
                <div className="flex text-sm " >
                    <label htmlFor="attendance" className="font-bold pr-1">Attendance :</label>
                    <select className="ml-7 px-3 pl-5 rounded-sm bg-gray-200 text-gray-700 border border-gray-200" ref={assessmentValues.attendance} name="attendance" defaultValue={student?.attendance} onChange={HandleChange} disabled={fieldDisabled}>
                        <option value="2">Present</option>
                        <option value="0">Absent</option>
                        
                    </select>
                </div>
                <div className="grid gap-1" >
                    <div className="flex justify-between text-sm">
                    <label htmlFor="songs" className="pr-2 font-bold">4 Songs: </label>
                     <select className="ml-3 pl-1   rounded-sm bg-gray-200 text-gray-700 border border-gray-200 font-sans" ref={assessmentValues.songs_4} name="songs_4" defaultValue={student?.songs_4} onChange={HandleChange} disabled={fieldDisabled}>
                        <option value="DEFAULT" disabled>select marks</option>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        
                    </select>
                    </div>
                    <div className=" font-sans text-xs font-extralight">1 mark</div>
                </div>   

                <div className="grid gap-1" >
                    <div className="flex justify-between text-sm">
                        <label htmlFor="worship_message" className="pr-2 font-bold">Worship Message</label>
                        <select ref={assessmentValues.worship_message} name="worship_message" defaultValue={student?.worship_message} onChange={HandleChange} className="ml-2 pl-1 rounded-sm bg-gray-200 text-gray-700 border border-gray-200 font-sans" disabled={fieldDisabled}>
                            <option value="DEFAULT" disabled>select marks</option>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                    <div className=" font-sans text-xs font-extralight">5 Marks</div>
                </div>  

                <div className="grid gap-1" >
                    <div className="flex justify-between text-sm">
                        <label htmlFor="table_message" className="pr-2 font-bold">Table Message</label>
                        <select ref={assessmentValues.table_message} name="table_message" defaultValue={student?.table_message} onChange={HandleChange} className="ml-3 pl-1  rounded-sm bg-gray-200 text-gray-700 border border-gray-200 font-sans" disabled={fieldDisabled}>
                            <option value="DEFAULT" disabled>select marks</option>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                    <div className=" font-sans text-xs font-extralight">5 Marks</div>
                </div>  

               <div className="grid gap-1" >
                    <div className="flex justify-between text-sm">
                    <label htmlFor="behaviour" className="pr-2 font-bold">Behaviour</label>
                    <select ref={assessmentValues.behaviour} name="behaviour" defaultValue={student?.behaviour} onChange={HandleChange} className="ml-3 pl-1  rounded-sm bg-gray-200 text-gray-700 border border-gray-200 font-sans" disabled={fieldDisabled}>
                        <option value="DEFAULT" disabled>select marks</option>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                    </div>
                    <div className=" font-sans text-xs font-extralight">3 Marks</div>
                </div>  

                <div className="grid gap-1" >
                    <div className="flex justify-between text-sm">
                    <label htmlFor="memory_verses" className="pr-2 font-bold">Memory Verses</label>
                    <select ref={assessmentValues.memory_verses} name="memory_verses" defaultValue={student?.memory_verses} onChange={HandleChange} className="ml-3 pl-1  rounded-sm bg-gray-200 text-gray-700 border border-gray-200 font-sans" disabled={fieldDisabled}>
                        <option value="DEFAULT" disabled>select marks</option>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                    </select>
                    </div>
                    <div className=" font-sans text-xs font-extralight">14 Marks</div>
                </div>  

                <div className="grid gap-1" >
                    <div className="flex justify-between text-sm">
                    <label htmlFor="total_marks" className="pr-2 font-bold">Total Marks:</label>
                    {/* <input ref={assessmentValues.total_marks} name="total_marks" defaultValue={initialValue.total_marks} type="text" onChange={HandleChange} className=" w-40 pl-6   rounded-sm bg-gray-200 text-black font-bold border border-gray-200 font-sans disabled:text-black" disabled/> */}
                        {assessmentValues.total_marks.current!==null?
                        <p ref={assessmentValues.total_marks}  defaultValue={student?.total}  onChange={HandleChange} className=" w-32 pl-6  font-bold "> {assessmentValues.total_marks.current.value}</p>
                        :
                        <p ref={assessmentValues.total_marks}  defaultValue={student?.total}  onChange={HandleChange} className=" w-32 pl-6  font-bold ">{student?.total}</p>
                        }
                        
                    </div>
                    <div className=" font-sans text-xs font-extralight">30 Marks</div>
                </div>

                <div className="grid gap-2 grid-cols-1" >
                    
                    <label htmlFor="remarks" className="pr-2 font-bold  text-sm">Remarks</label>
                    <textarea ref={assessmentValues.remarks} className="border-2 border-gray-500 rounded-md h-20 font-sans" defaultValue={student?.remarks} onChange={HandleChange} id="remarks" disabled={fieldDisabled}></textarea>
                    
                </div>

                    
                <div className='flex justify-between'>
                    {fieldDisabled ?<button className=" bg-cyan-500 hover:bg-cyan-700 text-white font-sans font-semibold py-1 px-2 rounded" type="button" onClick={(e)=>EditStudentHandler(e)} >Edit</button>:null}
                    {fieldDisabled ?null:<button className=" bg-yellow-500 hover:bg-yellow-700 text-white font-sans font-semibold py-1 px-2 rounded" type="button" onClick={(e)=>EditStudentHandler(e)} >cancel</button>}
                    {fieldDisabled ?null:<button className="bg-blue-500 hover:bg-blue-700 text-white font-sans font-semibold py-1 px-2 rounded" type="button" onClick={(e)=>saveAssessment(e)} >save</button>}
                    </div>
                </div>
            </Modal>
        </div>
        :null}
        </>
    );
    
}

export default ManageStudentAssessment