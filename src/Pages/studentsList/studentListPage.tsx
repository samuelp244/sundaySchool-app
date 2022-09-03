import React,{useEffect, useState} from 'react'
import { Link } from 'react-router-dom';
import Header from '../../Components/header'
// import studentsData from '../students.json'
import { Modal} from '@mantine/core';
import { studentDetails } from '../InterfacesAndTypes';

import { useSelector } from 'react-redux';
import { SPRING_SERVER_BASE_URL } from '../../api/services/SpringServer/spring';
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';
// import { getStudentsDataforAssessment } from '../../api/services/SpringServer/UserService/AssessmentsService';

export default function StudentListPage() {
    const [studentsArray,setStudentsArray] = useState<studentDetails[]>();
    const [studentModalOpened,setStudentModalOpened]=useState(false);
    const [selectedStudentId,setSelectedStudentId]=useState("")
    const [student,setStudent] = useState<studentDetails>();
    const user:string = useSelector((state:any)=>state.auth.user)
    const [church_name,setChurch_name] = useState("");
    const [class_name,setClass_name] = useState("");


    const axiosPrivate = useAxiosPrivate();

    const viewStudentDetails=(e:any,id:string)=>{
        e.preventDefault();
        setSelectedStudentId(id);
        
        setStudentModalOpened(true);
    }

    useEffect(()=>{
        setStudent(studentsArray?.filter(student=>student.uniqueID === selectedStudentId)[0])
    },[studentsArray,selectedStudentId])
    
    useEffect(()=>{
        // getStudentsDataforAssessment(user).then(res=>{
        //     setStudentsArray(res.data.studentsMarks);
        //     setChurch_name(res.data.studentsMarks[0].church);
        //     setClass_name(res.data.studentsMarks[0].class);
        // })
        axiosPrivate.get(`${SPRING_SERVER_BASE_URL}/getStudentsForAssessment?username=${user}`).then(res=>{
            setStudentsArray(res.data.studentsMarks);
            setChurch_name(res.data.studentsMarks[0].church);
            setClass_name(res.data.studentsMarks[0].class);
        })
    },[axiosPrivate,user])
  return (
    <div className='h-screen p-0 flex flex-col gap-5'>
            < Modal
                opened={studentModalOpened}
                onClose={() => setStudentModalOpened(false)}
                title="Student Details" 
            >
                <div className='flex flex-col text-lg'>
                    
                    <div className='flex'>
                        <p className='font-semibold'>Student Name:</p><p className='font-light px-2'>{student?.first_name+" "+student?.surname}</p>
                    </div>
                    <div className='flex'>
                        <p className='font-semibold'>Mobile:</p><p className='font-light px-2'>{student?.mobile}</p>
                    </div>
                </div>
            </Modal>
            <Header 
            userIcon={true}
            headerTitle={"Students"}/>

            <main className="relative  flex flex-col gap-4">
                <div className='flex justify-center'>
                    <div className='bg-white shadow-2xl px-8 py-3 pt-5 mx-3  rounded-2xl grid gap-5 font-serif w-[21rem]'>
                        <div className="flex justify-center ">
                            <h1 className="  text-xl">{church_name+" "+class_name}</h1>
                        </div>
                        <ul className=' flex flex-col gap-3'>
                            {studentsArray?.map(s=>(
                                <li key={s.uniqueID}>
                                    <div className='flex justify-between'>
                                        <p className=''>{s.first_name+" "+s.surname}</p>
                                        <button className='text-sm bg-blue-300 hover:bg-blue-400 rounded  px-2' onClick={(e)=>viewStudentDetails(e,s.uniqueID)}>view details</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-start">
                            <Link to="/"><button className=" bg-gray-500 hover:bg-gray-700 text-white font-sans font-semibold py-1 px-2 rounded" type="button">Back</button></Link>
                            
                        </div>
                
                        <div className="clearfix"></div>
                    </div>
                </div>
            </main>
        </div>
  )
}
