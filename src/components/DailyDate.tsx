"use client";
import {useEffect,useState} from "react";
export default function DailyDate(){const[date,setDate]=useState("UTC calendar");useEffect(()=>setDate(new Date().toISOString().slice(0,10)),[]);return <>{date} UTC</>}
