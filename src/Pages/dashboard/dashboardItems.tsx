import React,{useEffect, useState} from "react";
import { initiateArray } from "../../redux/classAssessment"
import { useDispatch, useSelector } from "react-redux";
import {useNavigate} from "react-router-dom"
// import studentsData from '../students.json'
import 'react-calendar/dist/Calendar.css';
import { dashboardProps, studentDetails } from "../InterfacesAndTypes";
import {IoLocationOutline} from 'react-icons/io5';

import useCurrData from "../../Hooks/useCurrData";
// import { getStudentsDataforAssessment } from "../../api/services/SpringServer/UserService/AssessmentsService";
// import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import { SPRING_SERVER_BASE_URL } from "../../api/services/SpringServer/spring";
import axios from "axios";
// import { userData } from "../profilePage/teacherProfile";


// import teacherData from '../teacher.json'

export default function DashboardItems(props:dashboardProps){
    const date = props.date;
    const [showAttendence, setShowAttendence] = useState(false);
    const currDate = useCurrData();
    
    
    useEffect(()=>{
        const today = new Date()
        if(date?.toDateString()?.slice(0,3)==="Sun"&&date.getDate()>=today.getDate()&&date?.getMonth()>=today.getMonth()){
            setShowAttendence(true);
        }else{
            setShowAttendence(false)
        }
    },[date])
    
    const [studentsArray,setStudentsArray] = useState<studentDetails[]>();
    const [church_name,setChurch_name] = useState("");
    const [class_name,setClass_name] = useState("");

    const assessmentArray = studentsArray?.map(s=>({
        "church" : church_name,
        "class": class_name,
        "date" : currDate,
        "uniqueID":s.uniqueID,
        "first_name" : s.first_name,
        "surname":s.surname,
       "attendance" : "0",
        "songs_4" : "0",
        "worship_message" : "0",
        "table_message" : "0",
        "behaviour" : "0",
        "memory_verses" : "0",
        "total" : "0",
        "remarks" : "",
    }))

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const toStudentList = (e:any) =>{
        e.preventDefault();
        dispatch(initiateArray(assessmentArray));
        navigate("/assessment-studentlist")
    }
    const role = useSelector((state:any)=>state.auth.role)
    const user:string = useSelector((state:any)=>state.auth.user)
    // const axiosPrivate = useAxiosPrivate()

    useEffect(()=>{
        role==='user' && axios.get(`${SPRING_SERVER_BASE_URL}/getStudentsForAssessment?username=${user}`).then(res=>{
            // console.log(res)
            if(res.data.studentsMarks.length===0) setShowAttendence(false)
            setStudentsArray(res.data.studentsMarks);
            setChurch_name(res.data.studentsMarks[0]?.church);
            setClass_name(res.data.studentsMarks[0]?.class);
        })
    },[user,role,date])

   

    // useEffect(()=>{
    //     getStudentsDataforAssessment(user).then(res=>{
    //         setStudentsArray(res.data.studentsMarks);
    //         setChurch_name(res.data.studentsMarks[0].church);
    //         setClass_name(res.data.studentsMarks[0].class);
    //     })
    // },[user])
    return (
        <div className=" grid grid-cols-1 mb-2">
            
            <div className=" flex justify-center mt-2 mb-7">
                
                {showAttendence && role==="user"? 
                <a href="/#" className="  flex flex-col justify-between w-11/12 h-20 " onClick={(e)=>toStudentList(e)}>
                    <div className="bg-blue-200 rounded-2xl shadow-lg">
                        <div className="text-xs p-3 px-4 flex justify-between">
                            <p className="  ">{class_name}</p>
                        <div className="flex"><IoLocationOutline style={{fontSize:"0.9rem"}}/> <p className="px-1">{church_name}</p></div>
                        </div>
                        <div>
                            <p className=" p-4 px-8 font-semibold ">Take class Assessment</p>
                        </div>
                    </div>
                </a>
                :
                    <div className="">
                        <div>
                            <p className=" pt-2 px-8 font-extralight text-sm">Nothing to show here</p>
                        </div>
                    </div> 
                }
            </div>
        </div>
    );
}