import React from "react";
import { studentCardProps } from "../../InterfacesAndTypes";

const StudentCard = (props:studentCardProps)=>{
    return (
        <div className="  py-2 grid gap-2 ">
            <div className="inline-flex justify-start text-sm ">
                <p className="pr-1 font-bold ">Student Name:</p><p className="px-1 ml-3">{props.student_name}</p>
            </div>
            
            <div className="container">
                <div className="flex text-sm " >
                    <label htmlFor="attendance" className="font-bold pr-1">Attendance :</label>
                    <select className="ml-7 px-3 pl-5 rounded-sm bg-gray-200 text-gray-700 border border-gray-200" name="attendance" defaultValue={props.attendance} onChange={(e)=>props.handleChange(e,props.id)} >
                        <option value="2">Present</option>
                        <option value="0">Absent</option>
                        
                    </select>
                </div>
            </div>
            
            <div className="flex justify-end">
                <button className=" bg-cyan-500 hover:bg-cyan-700 text-white text-sm font-sans font-semibold py-1 px-2 rounded disabled:bg-cyan-700"  disabled={props.buttonDisabled} onClick={()=>props.toAssessmentPage(props.id)}>Assign marks</button>
            </div>
        </div>
    );
}

export default StudentCard;