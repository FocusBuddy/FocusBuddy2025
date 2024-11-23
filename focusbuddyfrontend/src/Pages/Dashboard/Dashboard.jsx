import "../../App.css";
import Schedular from "../Dashboard/DashboardComponents/Calender/Schedular";
import DashboardHeader from "../Dashboard/DashboardComponents/Header/DashboardHeader";
import DashboardColumns from "../Dashboard/DashboardComponents/Columns/DashboardColumns";
import { useContext, useEffect, useState } from "react";
import { myContext } from "../../utils/PrivateRoutes";
import { MdMissedVideoCall } from "react-icons/md";
import io from 'socket.io-client';
import MissedMeetingModal from "../../Components/UI/MissedMeetingModal/MissdMeetingModal";
import MessageToUsers from "../../Components/UI/MessageToUsers/MessageToUsers";


const socket = io(`${import.meta.env.VITE_BACKEND_PRO_URL}`);


function Dashboard() {
  const {userProfile,setUserProfile, missedEvent} = useContext(myContext);
  
  const [openModal, setOpenModal] = useState(false);
  const [openMissedMeetingModal,setOpenMissedMeetingModal] = useState(true);
  
  useEffect(() => {
    // console.log('dashboard',userProfile, missedEvent);
    socket.on('sessionMissedNotify', (data)=>{
      // console.log(data);
      if(data.missedMeeting){
        setUserProfile(data);
      }
    })
    socket.on('updateSessionAttendance', (data)=>{
      console.log(data);
      // if(data.missedMeeting){
      //   setUserProfile(data);
      // }
    })

    return () => {
      socket.off('sessionMissedNotify');
      socket.off('updateSessionAttendance');
    }
  },[]);

  const handleModalClose = () =>{
    const updateStatus = async () =>{
      const response = await fetch(`${import.meta.env.VITE_BACKEND_PRO_URL}/api/user/updatemissmeetingstatus`,{
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({updateThis:userProfile.email})
      });
      const data = await response.json();
      console.log(data);
      setUserProfile(data.updatedUser);
    }
    updateStatus();
  }

  return (
    <>
      <div className="main-dashboard mt-4 pb-10 ">
        <DashboardHeader/>
        <DashboardColumns/>
        {
        userProfile.email === "rupeshchincholkar14@gmail.com" ||
        userProfile.email === "varalakshmi.v1199@gmail.com" ||
        userProfile.email === "anuradhaanuyy@gmail.com" ||
        userProfile.email === "thoratganesh775@gmail.com" ||
        userProfile.email === "snnawaz72@gmail.com" ||
        userProfile.email === "aspirantabhimanyu82@gmail.com" ||
        userProfile.email === "anuroop.m3@gmail.com" ||
        userProfile.email === "vamsivijay007@gmail.com" 
        ? 
        <MessageToUsers/> : null}
        <div className="mt-10">
          <Schedular/>
        </div>
      </div>

      { userProfile.attendanceScore === "30%" && userProfile.userSawAttendanceFallModal === false ? <MissedMeetingModal openMissedMeetingModal={openMissedMeetingModal} setOpenMissedMeetingModal={setOpenMissedMeetingModal}
      userProfile={userProfile} setUserProfile={setUserProfile}/> : null}

      <div
      style={{ zIndex: 10000 }}
        className={userProfile.missedMeeting ? "flex  bg-[#00000047] fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full" : "hidden"}
        // style={zoomLoaded ? {display: 'flex'} : {display: 'none'}}
     >
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          <div className="relative bg-white rounded-lg shadow">
            <div className="p-4 md:p-10">
              <MdMissedVideoCall className="mb-2 text-5xl md:text-7xl text-textcolor mx-auto"/>
                <p className="text-xl md:text-2xl mb-3 leading-9 text-greenbg text-center">"Oops, you missed your session! </p> 
                <p className="text-md lg:text-lg leading-8 xl:text-xl xl:leading-9 text-formgray text-center">
                Don't worry! We get it, life gets in the way sometimes. If the event is still going on, you can still join the session.
                <br/>Alternatively, Feel free to book the next available time slot."
                </p>
            </div>
            <div className="p-4 md:p-5 border-t border-gray-200 rounded-b">
            <button id="modalButton" onClick={handleModalClose} className="w-full bg-textcolor py-4 text-lg px-3.5 hover:bg-darkbrown text-white rounded-md transition-all duration-500 ease-in-out" >Close</button>
            </div>
          </div>
        </div>
      </div> 
    </>
  );
}

export default Dashboard;
