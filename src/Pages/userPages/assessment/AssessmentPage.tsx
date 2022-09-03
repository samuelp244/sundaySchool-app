import { useSelector } from 'react-redux';
import Header from '../../../Components/header';
import Assessment from './Assesment';

export default function AssessmentPage(){
    const role = useSelector((state:any)=>state.auth.role)

    return (
        <>
        {role==="user" ? 
            <div className='h-screen p-0 flex flex-col gap-5'>
                <Header 
                userIcon={false}
                headerTitle={""}/>
                <main className="relative  flex flex-col gap-4">
                    <Assessment />
                </main>
            </div>
        :null}
        </>
    );
}