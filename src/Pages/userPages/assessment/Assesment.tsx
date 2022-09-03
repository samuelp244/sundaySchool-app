import React, { useState, useRef, useEffect } from "react";
import {updateArray } from "../../../redux/classAssessment"
import { useDispatch, useSelector } from "react-redux";
import { Link,useLocation, useNavigate } from "react-router-dom";
import { FinalAssessment,AssessmentInputs,LocationState } from "../../InterfacesAndTypes"

// export interface AssessmentStudentListProps{
//     backPageUrl:string
// }
const Assessment = ()=>{
    
    const location = useLocation() as unknown as LocationState;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [total,setTotal]= useState("2");

    let student_id = "";
    if(location.state) student_id = location.state.student_id; 
    
    // console.log(student_id)

    const assessmentArray:[FinalAssessment] = useSelector((state:any)=>state.assessment.assessmentArray)
    const [studentAssessment,setStudentAssessment] = useState<FinalAssessment>(assessmentArray.filter(student=>student.uniqueID===student_id)[0]);
    const [isEmpty,setIsEmpty] = useState(true); // component at default has nothing to show

    const initialValue = {
        songs_4:studentAssessment?.songs_4,
        worship_message:studentAssessment?.worship_message,
        table_message:studentAssessment?.table_message,
        behaviour:studentAssessment?.behaviour,
        memory_verses:studentAssessment?.memory_verses,
        total_marks:studentAssessment?.total,
        remarks:studentAssessment?.remarks
    }
    
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
    
    const [assessmentSavedAlert,setStudentAssessmentSaved] = useState(false)
    // console.log(studentAssessment)
    useEffect(()=>{
        if(studentAssessment===undefined||student_id=== ""){
            navigate('/');
        }else{
            setIsEmpty(false)
        }
    },[studentAssessment,student_id,navigate])
    // console.log(studentAssessment)
    useEffect(()=>{
        if(parseInt(initialValue.total_marks)!==0){
            setTotal(initialValue.total_marks)
        }
    },[initialValue.total_marks])
    
    const HandleChange=(e:any)=>{
        setStudentAssessmentSaved(false);
        
        let Attendance_marks:number = 2;
        let songs_marks:number = 0;
        let worship_message_marks:number = 0;
        let table_message_marks:number = 0;
        let behaviour_marks:number = 0;
        let memory_verses_marks:number = 0;
        let total:string = initialValue.total_marks.toString();
        let remarks:string="";
        
        if(assessmentValues.songs_4.current!==null) songs_marks = (isNaN(parseInt(assessmentValues.songs_4.current.value,10))? 0:parseInt(assessmentValues.songs_4.current.value,10));
        if(assessmentValues.worship_message.current!==null) worship_message_marks = (isNaN(parseInt(assessmentValues.worship_message.current.value,10))? 0: parseInt(assessmentValues.worship_message.current.value,10));
        if(assessmentValues.table_message.current!==null) table_message_marks = (isNaN(parseInt(assessmentValues.table_message.current.value,10))? 0:parseInt(assessmentValues.table_message.current.value,10));
        if(assessmentValues.behaviour.current!==null) behaviour_marks = (isNaN(parseInt(assessmentValues.behaviour.current.value,10))? 0:parseInt(assessmentValues.behaviour.current.value,10));
        if(assessmentValues.memory_verses.current!==null) memory_verses_marks = (isNaN(parseInt(assessmentValues.memory_verses.current.value,10))? 0:parseInt(assessmentValues.memory_verses.current.value,10));

        if(assessmentValues.total_marks.current!==null){
            assessmentValues.total_marks.current.value = (Attendance_marks+songs_marks+worship_message_marks+table_message_marks+behaviour_marks+memory_verses_marks).toString();
            total = assessmentValues.total_marks.current.value
        } 
        if(assessmentValues.remarks.current!==null) remarks = assessmentValues.remarks.current.value;
        setTotal(total)
        

        const updatedAssessmentValues:FinalAssessment = {
            "church": studentAssessment?.church,
            "class":studentAssessment?.class,
            "date": studentAssessment?.date,
            "uniqueID": studentAssessment?.uniqueID,
            "first_name": studentAssessment?.first_name,
            "surname": studentAssessment?.surname,
            "attendance": "2",
            "songs_4": songs_marks.toString(),
            "worship_message": worship_message_marks.toString(),
            "table_message": table_message_marks.toString(),
            "behaviour": behaviour_marks.toString(),
            "memory_verses": memory_verses_marks.toString(),
            "total": total,
            "remarks": remarks
        }
        setStudentAssessment({...studentAssessment,...updatedAssessmentValues});
        // console.log(studentAssessment)
    }

    
    const saveAssessment=(e:any)=>{
        e.preventDefault();
        // console.log([studentAssessment])
        dispatch(updateArray([studentAssessment]))
        setStudentAssessmentSaved(true);
        
    }
  
    return (
        <div className=" h-screen  ">
        {isEmpty ? null : 
            <div className="flex justify-center">

            <form className="flex flex-col gap-6 bg-white shadow-2xl px-5 py-5 mx-3  rounded-2xl font-serif w-[20.2rem]">
                <div className="">
                    <div className="flex justify-center ">
                        <p className="pr-1 font-bold ">Student Name : </p><p className="px-1 ml-3"> {studentAssessment?.first_name+" "+studentAssessment?.surname}</p>   
                    </div>
                </div>
                <div className="grid gap-1" >
                    <div className="flex justify-between text-sm">
                    <label htmlFor="songs" className="pr-2 font-bold">4 Songs: </label>
                     <select className="ml-3 pl-1   rounded-sm bg-gray-200 text-gray-700 border border-gray-200 font-sans" ref={assessmentValues.songs_4} name="songs_4" defaultValue={initialValue.songs_4} onChange={HandleChange} >
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
                        <select ref={assessmentValues.worship_message} name="worship_message" defaultValue={initialValue.worship_message} onChange={HandleChange} className="ml-2 pl-1 rounded-sm bg-gray-200 text-gray-700 border border-gray-200 font-sans">
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
                        <select ref={assessmentValues.table_message} name="table_message" defaultValue={initialValue.table_message} onChange={HandleChange} className="ml-3 pl-1  rounded-sm bg-gray-200 text-gray-700 border border-gray-200 font-sans">
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
                    <select ref={assessmentValues.behaviour} name="behaviour" defaultValue={initialValue.behaviour} onChange={HandleChange} className="ml-3 pl-1  rounded-sm bg-gray-200 text-gray-700 border border-gray-200 font-sans">
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
                    <select ref={assessmentValues.memory_verses} name="memory_verses" defaultValue={initialValue.memory_verses} onChange={HandleChange} className="ml-3 pl-1  rounded-sm bg-gray-200 text-gray-700 border border-gray-200 font-sans">
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
                        <p ref={assessmentValues.total_marks}  defaultValue={initialValue.total_marks}  onChange={HandleChange} className=" w-32 pl-6  font-bold "> {total}</p>
                    </div>
                    <div className=" font-sans text-xs font-extralight">30 Marks</div>
                </div>

                <div className="grid gap-2 grid-cols-1" >
                    
                    <label htmlFor="remarks" className="pr-2 font-bold  text-sm">Remarks</label>
                    <textarea ref={assessmentValues.remarks} className="border-2 border-gray-500 rounded-md h-20 font-sans" defaultValue={initialValue.remarks} onChange={HandleChange} id="remarks" ></textarea>
                    
                </div>
                {assessmentSavedAlert?
                <p>{studentAssessment.first_name}'s assessment saved!</p>:null}
                

                <div className="flex justify-between">
                    <Link to="/assessment-studentlist"><button className="bg-gray-500 hover:bg-gray-700 text-white font-sans font-semibold py-1 px-2 rounded" type="button">Back</button></Link>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-sans font-semibold py-1 px-2 rounded" type="button" onClick={(e)=>saveAssessment(e)} >save</button>
                </div>
                <div className="clearfix"></div>
            </form>
       
           
            
            
        </div>}
        </div>
    );
}

export default Assessment;