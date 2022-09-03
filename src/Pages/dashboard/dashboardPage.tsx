import React,{useEffect, useState} from "react"
import { Calendar } from '@mantine/dates';

import DashboardItems from "./dashboardItems";
import Header from "../../Components/header";
// import axios from "axios";
// import { useSelector } from "react-redux";


export default function DashboardPage(){

    const [assessmentDate,setAssessmentDate] = useState<Date|null>(new Date())
    const [currmonthDate,setCurrMonthDate] = useState("")
    
    const [today,setToday] = useState("Today,")
    
    // console.log(assessmentDate)
    // console.log(todayDate?.toDateString()?.slice(0,15))
    // console.log(useSelector((state:any)=>state.auth.token))
    useEffect(()=>{
        const month = ["Jan","Feb","Mar","April","May","June","July","Aug","Sep","Oct","Nov","Dec"];    
        const todayDate = new Date();
        if(assessmentDate?.toDateString()?.slice(0,15)===todayDate?.toDateString()?.slice(0,15)){
            setToday("Today,")
        }else{
            setToday("")
        }
        if(assessmentDate!== null) setCurrMonthDate(assessmentDate?.getDate()+" "+month[assessmentDate.getMonth()])
    },[assessmentDate])

    return (
        <div className="  h-screen p-0 flex flex-col gap-5 bg-slate-500">
            <Header 
            userIcon= {true}
            headerTitle={"Sunday School"}/>
            
            <main className="relative  flex flex-col gap-4 ">
                <div className="flex justify-center">
                    <div className="container shadow-2xl rounded-2xl bg-white w-11/12 xs:w-[21rem] ">
                        <div className=" p-3 py-4 flex justify-center">
                            <Calendar 
                            value={assessmentDate} 
                            onChange={setAssessmentDate}
                            styles={() => ({
                                // calendarBase:{color:'white',backgroundColor:'white'}
                            })} />
                        </div>
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="container shadow-2xl rounded-2xl bg-white w-11/12 xs:w-[21rem]">
                        <div className="inline-flex p-2 px-3">
                            <p className=" font-semibold">{today}</p><p className="px-1 font-light">{currmonthDate}</p>
                        </div>
                        <div className="container">
                            
                            <DashboardItems 
                            date = {assessmentDate}/>
                        </div>
                    </div>
                </div>
            </main>
            
        </div>
    );
}