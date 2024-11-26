import moment from "moment";
import { LuLampDesk } from "react-icons/lu";
import { FaPersonWalking } from "react-icons/fa6";
import { IoShuffle } from "react-icons/io5";
import { IoMdMicOff } from "react-icons/io";
import { useState, useRef, useEffect, useContext } from "react";
import { myContext } from "../../../utils/PrivateRoutes";
import { AiOutlineCheck } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import SuccessToast from "../toast-components/SuccessToast";
import ErrorTextToast from "../toast-components/ErrorTextToast";
import { useNavigate } from "react-router-dom";

export default function AvailabilitySessions({ favEvents, activeEventTab, quiteMode }) {

  const { userProfile} = useContext(myContext);
  console.log(userProfile);
  const [activeSessionIndex, setActiveSessionIndex] = useState(null);
  const [sessionLocked, setSessionLocked]  = useState(false);
  const [fail, setFail] = useState(false);
  const [success, setSuccess] = useState(false);
const navigate = useNavigate();


    let filtered_events = favEvents.filter((fav) => {
      const startTime = moment(fav.start).toDate().getTime();
      const ten_min_before = moment(startTime).subtract(10, "minutes").toDate().getTime();
      return (
        fav.matchedPersonFullName !== userProfile.displayName &&
        !(Date.now() >= ten_min_before && Date.now() < startTime)
      );
    });

  const handleLockSession = async (session) => {
    console.log("session", session);
    const eventID = crypto.randomUUID()
    const newEvent = {
      myID: eventID,
      duration: session.duration,
      start: session.start,
      end: session.end,
      matchedPersonName: session.name,
      matchedPersonFullName: session.fullName,
      matchedPersonProfilePic: session.profilePic,
      matchedPersonProfileLink: session.profileLink,
      name: userProfile.givenName + ' ' + userProfile.familyName[0],
      fullName: userProfile.givenName + ' ' + userProfile.familyName,
      profilePic: userProfile.profilePic,
      profileLink: userProfile.userProfileLink,
      taskType: activeEventTab,
      partner: "favoritePartner",
      quiteModeOn: quiteMode,
      callID: crypto.randomUUID(),
      callJoin: 0,
      // callLeave: 0,
      // totalCallDuration:0,
      otherPersonMissedCall: false
    };
    try{
      const response = await fetch(`${import.meta.env.VITE_BACKEND_PRO_URL}/api/events/locksession`,{
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({lockWith:newEvent})
      })
      const data = await response.json();
      console.log(data);
      if(response.ok){
        setActiveSessionIndex(null);
        setSessionLocked(true);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          navigate('/dashboard');
        }, 500);
      }else{
        setFail(true);
        setTimeout(() => {
          setFail(false);
        }, 500);
      }
    }catch(err){
      console.log(err);
    }
  };

  console.log(favEvents);
  return (
    <>
    {
 filtered_events.length === 0 ? (
    <p
      // key={item}
      className="mt-16 font-medium text-formgray text-md xl:text-lg"
    >
      No session available at the moment
    </p>
  ) : (
   filtered_events.map((session, index) => (
      <div
        // ref={sessionBox}
        onClick={() => setActiveSessionIndex(index)}
        className="my-2 w-[50%]"
        key={index}
      >
        <p className="font-medium text-center text-formgray text-md xl:text-lg">
          {moment(session.start).format("dddd, MMMM DD")}
        </p>
        {activeSessionIndex === index ? (
          <div
            
            className="flex justify-center gap-2 mt-4 border-2 border-greenbg bg-greenbg  cursor-pointer text-center p-4 rounded-md shadow-md"
          >
            <p className="text-white text-md my-auto font-medium">Confirm for {moment(session.start).format("hh:mm A")} ?</p>
            <button onClick={() => handleLockSession(session)} className="text-md bg-white p-2 text-textcolor rounded-md hover:bg-bordercolor"><AiOutlineCheck/></button>
            
            <button  
            onClick={(e) => {
              e.stopPropagation();
              setActiveSessionIndex(null)}}
            className="text-md bg-white p-2 text-textcolor rounded-md hover:bg-bordercolor"><AiOutlineClose/></button>
          </div>
        ) : (
          <>
            <div className="group flex justify-between items-center mt-4 border-2 border-greenbg hover:bg-greenbg cursor-pointer p-4 rounded-md shadow-md">
              <p className="group-hover:text-white text-greenbg font-bold text-md xl:text-lg">
                {moment(session.start).format("hh:mm A")}
              </p>
              <div className="flex gap-1 text-greenbg group-hover:text-white text-md xl:text-xl ">
                {session.quiteModeOn ? <IoMdMicOff /> : null}
                {session.taskType === "deskEvent" ? (
                  <LuLampDesk />
                ) : session.taskType === "movingEvent" ? (
                  <FaPersonWalking />
                ) : (
                  <IoShuffle />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    ))
  )
}


{fail ? <ErrorTextToast text={"Something went wrong."} /> : null}
{success ? <SuccessToast text={"Session locked."} /> : null}
  </>
  );
}
