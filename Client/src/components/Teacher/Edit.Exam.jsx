import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import axios from 'axios';
import { Basic_URL } from '../../utils/constants';
const EditExam = () => {
    const teacherId = useSelector((store) => store.teacher._id);
    const [exam, setExam] = useState([]);
    const fetchExamList = async () => {
       try{ const examlist = await axios.get(`${Basic_URL}teacher/${teacherId}/examlist`, { withCredentials: true });
        setExam(examlist.data.data);}
        catch(err){
            console.error("Failed to fetched exam list:",err);
            
        }
    }

    useEffect(() => {
        fetchExamList();
    }, []);

    const formatDateToIST = (utcDate) => {
        const date = new Date(utcDate);
        const options = {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
    
        return date.toLocaleString('en-GB', options).replace(',', ', ');
    };
    

    const handleDelete=async({id})=>{
        console.log(id);
        const res=await axios.post(Basic_URL+"teacher/exam/delete",{id:id},{withCredentials:true});
    }


    const Card = ({ key,title, onClick, date, marks,createdAt }) => (
        <div className="cursor-pointer bg-gray-800 shadow-lg rounded-2xl p-6 flex justify-between  w-full max-w-5xl hover:scale-105 transition-all duration-300 border border-gray-300 ">
            <div>
                <h3 className="text-2xl font-semibold text-gray-50 mt-4">{title[0]}</h3>
                {title?.length > 1 && <h3 className="text-lg text-gray-100 mt-2">{"Subject: " + title[1]}</h3>}
                <p className="text-gray-300 text-lg font-medium mt-2">
                    {"Marks: " + marks}
                </p>
                <p className="text-gray-300 text-lg font-medium mt-2">
                    {"Exam Date: " + date}
                </p>

            </div>
            <div>
                <div  className='  flex justify-end'>
                <p className=" text-white font-semibold px-4 py-2 mt-4 rounded-lg " >
                {"Created At: " +formatDateToIST(createdAt)}
                </p>
                </div>
                <div className='  flex justify-end'>
                <button className="bg-blue-500 text-white font-semibold px-4 py-2 mt-4 rounded-lg ">
                    Edit
                </button>
                <button className="bg-red-500 ml-3 text-white font-semibold px-4 py-2 mt-4 rounded-lg "onClick={onClick} >
                    Delete
                </button>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            
            {(exam?.length==0) && (
                <h1 className='text-2xl font-bold mt-5  text-center text-red-500'>You have not  created any exam </h1>
            )}
            {(exam.length!==0) && (
                <div className="flex flex-wrap justify-center gap-8 w-full mt-12 max-w-6xl">
                    <h1 className='text-2xl font-bold mt-5 ml-20 text-white'>The list of exams you have created</h1>
                    {exam?.map((exam) => (
                        <Card
                            key={exam._id}
                            title={[exam.examName, exam.subjectName]}
                            date={exam.startTime}
                            marks={exam.totalMarks}
                            createdAt={exam.createdAt}
                            onClick={()=>{handleDelete({id:exam._id})}}

                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default EditExam
