export interface AssessmentInputs{
    attendance:React.MutableRefObject<HTMLSelectElement | null>;
    songs_4:React.MutableRefObject<HTMLSelectElement | null>;
    worship_message:React.MutableRefObject<HTMLSelectElement | null>;
    table_message:React.MutableRefObject<HTMLSelectElement | null>;
    behaviour:React.MutableRefObject<HTMLSelectElement | null>;
    memory_verses:React.MutableRefObject<HTMLSelectElement | null>;
    total_marks:React.MutableRefObject<HTMLInputElement | null>;
    remarks:React.MutableRefObject<HTMLTextAreaElement | null>;
}

export interface FinalAssessment{
    church:string,
    class:string,
    date:string,
    uniqueID:string,
    first_name:string,
    surname:string,
    attendance:string,
    songs_4:string,
    worship_message:string,
    table_message:string,
    behaviour:string,
    memory_verses:string,
    total:string,
    remarks:string
}

export interface AssessmentsObject{
    studentsMarks:FinalAssessment[]
}

export interface updatedAssessmentsObject{
    studentsMarks:FinalAssessment[],
    username:string
}

export interface StudentsDataObject{
    studentsMarks:studentDetails[],
}






export type LocationState = {
    state:{
        student_id: string;
    };
  }

export interface dashboardProps{
    date:Date|null
}

export interface studentCardProps{
    id:string,
    student_name:string,
    attendance:string,
    buttonDisabled:boolean,
    handleChange:(e:any,id:string)=> void;
    toAssessmentPage:(id:string)=> void
}

export interface headerProps{
    userIcon:boolean,
    headerTitle:string
}

export interface studentDetails{
    uniqueID:string,
    first_name:string,
    surname:string,
    church:string,
    class:string,
    mobile:string
}
export interface studentObject{
    first_name:string,
    surname:string,
    mobile:string,
    church:string,
    class:string
}
export interface teacherDetails{
    username : string,
    teacher_name : string,
    mobile : string,
    church:string,
    assigned_class:string
}
export interface teacherObject{
    teacher_name : string,
    mobile : string,
    church : string,
    assigned_class:string
}

export interface token{
    iat: number,
    role: string,
    username: string
}
export interface getStudentsArray{
    "students":studentDetails[]
}

export interface getTeachersArray{
    "teachers":teacherDetails[]
}