import axios from 'axios'
import React, { useEffect } from 'react'
import { Basic_URL } from '../../utils/constants'
import { useLocation } from 'react-router-dom'

const Editexampaper = () => {
  const location=useLocation();
  const id=location.state;
   
  const fetchExam=async ()=>{
    const getExam=await axios.get(Basic_URL+"teacher/exam/"+id,{withCredentials:true});
    console.log(getExam.data.data);
    
  }
  useEffect(()=>{
    fetchExam();
  },[]);
  return (
    <div>
      edit exam
    </div>
  )
}

export default Editexampaper
