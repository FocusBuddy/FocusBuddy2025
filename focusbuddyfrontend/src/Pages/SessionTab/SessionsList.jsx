import DashboardInnerNav from "../../Components/navbar/DashboardInnerNav";
import { useContext, useEffect, useState } from "react";
import { myContext } from "../../utils/PrivateRoutes";
import moment from "moment";
import { MdEdit } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { LuLampDesk } from "react-icons/lu";
import { FaPersonWalking } from "react-icons/fa6";
import { IoShuffle } from "react-icons/io5";
import { IoMdMicOff } from "react-icons/io";
import { FaStar } from "react-icons/fa6";
import EditEventModal from "../Dashboard/DashboardComponents/Calender/EditEventModal";
import SuccessToast from "../../Components/UI/toast-components/SuccessToast";

export default function SessionsList() {
  const [activeTab, setActiveTab] = useState("app");
  const [allUpcomingSessions, setAllUpcomingSessions] = useState([]);
  const [allPastSessions, setAllPastSessions] = useState([]);
  const [openModal,setOpenModal] = useState(false);
  const [sessionToEdit,setSessionToEdit]  = useState([]);
  const {appointments,filteredEvents,setFilteredEvents,showDeleteMsg,setIsSuccess,isSuccess,showEditMsg,setShowEditMsg,} = useContext(myContext);
  const { userProfile } = useContext(myContext);
  // console.log(filteredEvents,userProfile)

  const isFavorite = (session) => {
    return userProfile.favorites.some(fav => fav.name === session.matchedPersonFullName);
  };
  

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const filtered = appointments
                      .filter((session) => session.fullName === userProfile.displayName)
                      .sort((a, b) => new Date(a.start) - new Date(b.start)); // Sort by start date
    setAllUpcomingSessions(filtered);

  }, [appointments, showDeleteMsg,showEditMsg]);


  useEffect(() => {
    if (activeTab === "message") {
      const fetchData = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_PRO_URL}/api/events/getpastevents?thisPerson=${userProfile.displayName}`,{
            method: 'GET'
          });
          const data = await response.json();
          // console.log(data); // Handle the fetched data as required
          setAllPastSessions(data.events);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [activeTab]);


  const handleEditClick = (sessionID) => {
    // console.log(sessionID);
    setOpenModal(true);
    setSessionToEdit(allUpcomingSessions.filter((events) => events.myID === sessionID))
    // console.log(allUpcomingSessions.filter((events) => events.myID === sessionID))
  }

  const handleEventCancel = async(sessionID) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_PRO_URL}/api/events/deletesession`,{
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({eventId: sessionID})
    })
    const data = await response.json();
    // console.log(data);
    if(data.updatedEvent.length > 0){
      // console.log('ops')
      setFilteredEvents(
        filteredEvents.filter((appointment) => ((appointment.myID !== data.updatedEvent.updatedEvent.myID) && (appointment.myID !== sessionID) ))
      )
      // setAllUpcomingSessions(allUpcomingSessions.filter((session) => (session.myID !== sessionID)));
    }else{
      // console.log('opsasdas')
      setFilteredEvents(
        filteredEvents.filter((appointment) => (appointment.myID !== sessionID) )
      )
      // setAllUpcomingSessions(allUpcomingSessions.filter((session) => (session.myID !== sessionID)));
    }
    setIsSuccess(true);
  }
  
  
  // console.log(allUpcomingSessions);
  
  if (showEditMsg) {
    setTimeout(() => {
      setShowEditMsg(false);
    }, 2000);
  }
  if (isSuccess) {
    setTimeout(() => {
      setIsSuccess(false);
    }, 2000);
  }


  return (
    <div className="min-h-screen">
      <DashboardInnerNav />
      <div className="mt-6 lg:mt-10 relative px-6 lg:px-0">
        <ul
          className="md:container mx-auto text-[14px] xl:text-lg relative flex flex-wrap p-1 list-none"
          data-tabs="tabs"
          role="list"
        >
          <li className="z-30 w-[40%] lg:w-[10%] text-center">
            <a
               className={`flex items-center bg-darkbrown justify-center w-full px-0 py-2 transition-all ease-in-out cursor-pointer ${
                activeTab === "app"
                  ? "activetab bg-darkbrown  text-white"
                  : "bg-white  text-textcolor"
              }`}
              data-tab-target=""
              role="tab"
              aria-selected={activeTab === "app"}
              aria-controls="app"
              onClick={() => handleTabClick("app")}
            >
              <span className="ml-1">Upcoming</span>
            </a>
          </li>
          <li className=" w-[40%] lg:w-[10%] text-center">
            <a
              className={`flex items-center bg-darkbrown justify-center w-full px-0 py-2 transition-all ease-in-out cursor-pointer ${
                activeTab === "message"
                  ? "activetab bg-darkbrown  text-white"
                  : "bg-white  text-textcolor"
              }`}
              data-tab-target=""
              role="tab"
              aria-selected={activeTab === "message"}
              aria-controls="message"
              onClick={() => handleTabClick("message")}
            >
              <span className="ml-1">Past Week</span>
            </a>
          </li>
        </ul>
        <div data-tab-content="" className="md:container mx-auto pt-10">
          <div
            className={`${
              activeTab === "app" ? "flex flex-col lg:flex-row lg:flex-wrap gap-10 opacity-100" : "hidden opacity-0"
            }`}
            id="app"
            role="tabpanel"
          >
            {
              allUpcomingSessions.length === 0 &&
              <div className="mt-10 w-full lg:w-[20%] bg-bordercolor py-4 rounded-md">
            <p className="text-md xl:text-lg font-medium text-textcolor text-center">No Upcoming Sessions</p>
          </div>
            }

            {allUpcomingSessions.map((sessions) => (
              <div key={sessions.myID} className="w-full lg:w-[20%]">
                  <p className="text-md xl:text-lg text-formgray">
                    {moment(sessions.start).format("MMMM Do YYYY, HH:mm a")}
                  </p>
                  <div className="flex flex-col px-4 py-2 mt-2 bg-greenbg text-white text-sm rounded-md">
                    <div className="flex justify-between font-semibold tracking-wide">
                      <p>{moment(sessions.start).format("MMMM Do")}</p>
                      <div className="flex gap-2 items-center">
                        <p>{sessions.duration.slice(0, 6)}</p>
                        <div className="flex text-lg">
                          {sessions.quiteModeOn ? <IoMdMicOff /> : null}
                          {sessions.taskType === "deskEvent" ? (
                            <LuLampDesk />
                          ) : sessions.taskType === "movingEvent" ? (
                            <FaPersonWalking />
                          ) : (
                            <IoShuffle />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 items-center mt-3">
                      <div className="relative">
                        <img
                          className="w-8 h-8 rounded-3xl"
                          src={
                            userProfile.givenName +
                              " " +
                              (userProfile.familyName
                                ? userProfile.familyName[0]
                                : " ") ===
                            sessions.name
                              ? sessions.matchedPersonProfilePic
                              : sessions.profilePic
                          } //profilepic of person with whom i got match
                          alt="profile pic"
                          loading="lazy"
                        />
                        {isFavorite(sessions) && (
                        <div
                          className="absolute -right-1 -bottom-1 p-0.5 bg-white rounded-full"
                          style={{ zIndex: 2002 }}
                        >
                          <FaStar className="text-[13px] text-greenbg" />
                        </div>
                      )}
                      </div>
                      <div>
                        <p className="text-[13px]">
                          {moment(sessions.start).format("hh:mm a")}
                        </p>
                        <span className="text-[14px] capitalize">
                          {userProfile.givenName +
                            " " +
                            (userProfile.familyName
                              ? userProfile.familyName[0]
                              : " ") ===
                          sessions.name
                            ? sessions.matchedPersonName
                            : sessions.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 justify-end">
                        <button
                          type="button"
                          className="p-1.5 text-sm rounded-full bg-white text-textcolor border-2 border-bordercolor hover:bg-gray-200"
                          onClick={() => handleEditClick(sessions.myID)}
                          // onClick={() => {console.log([sessions])}}
                        >
                          <MdEdit />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 text-sm rounded-full bg-white text-textcolor border-2 border-bordercolor hover:bg-gray-200"
                          onClick={() => handleEventCancel(sessions.myID)}
                        >
                          <IoMdClose />
                        </button>
                    </div>

                    {openModal ? (
                    <EditEventModal
                      openEditModal={openModal}
                      setOpenEditModal={setOpenModal}
                      eventToEdit={sessionToEdit}
                    />
                  ) : null}
                  </div>
              </div>
            ))}
          </div>
          <div
            className={`${
              activeTab === "message" ? "flex flex-col lg:flex-row lg:flex-wrap gap-10 opacity-100" : "hidden opacity-0"
            }`}
            id="message"
            role="tabpanel"
          >
            {
              allPastSessions.length === 0 &&
              <div className="mt-10 w-full lg:w-[20%] bg-bordercolor py-4 rounded-md">
            <p className="text-md xl:text-lg font-medium text-textcolor text-center">No sessions from past week</p>
          </div>
            }
            
            {allPastSessions.map((sessions) => (
              <div key={sessions.myID} className="w-full lg:w-[20%]">
                  <p className="text-md xl:text-lg text-formgray">
                    {moment(sessions.start).format("MMMM Do YYYY, HH:mm a")}
                  </p>
                  <div className="flex flex-col px-4 pt-4 pb-6 mt-2 bg-greenbg text-white text-sm rounded-md">
                    <div className="flex justify-between font-semibold tracking-wide">
                      <p>{moment(sessions.start).format("MMMM Do")}</p>
                      <div className="flex gap-2 items-center">
                        <p>{sessions.duration.slice(0, 6)}</p>
                        <div className="flex text-lg">
                          {sessions.quiteModeOn ? <IoMdMicOff /> : null}
                          {sessions.taskType === "deskEvent" ? (
                            <LuLampDesk />
                          ) : sessions.taskType === "movingEvent" ? (
                            <FaPersonWalking />
                          ) : (
                            <IoShuffle />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3 items-center">
                      <div className="relative">
                        <img
                          className="w-8 h-8 rounded-3xl"
                          src={
                            userProfile.givenName +
                              " " +
                              (userProfile.familyName
                                ? userProfile.familyName[0]
                                : " ") ===
                            sessions.name
                              ? sessions.matchedPersonProfilePic
                              : sessions.profilePic
                          } //profilepic of person with whom i got match
                          alt="profile pic"
                          loading="lazy"
                        />
                        {isFavorite(sessions) && (
                        <div
                          className="absolute -right-1 -bottom-1 p-0.5 bg-white rounded-full"
                          style={{ zIndex: 2002 }}
                        >
                          <FaStar className="text-[13px] text-greenbg" />
                        </div>
                      )}
                      </div>
                      <div>
                        <p className="text-[13px]">
                          {moment(sessions.start).format("hh:mm a")}
                        </p>
                        <span className="text-[14px] capitalize">
                          {userProfile.givenName +
                            " " +
                            (userProfile.familyName
                              ? userProfile.familyName[0]
                              : " ") ===
                          sessions.name
                            ? sessions.matchedPersonName
                            : sessions.name}
                        </span>
                      </div>
                    </div>
                  </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showEditMsg ? <SuccessToast text={'Session Edited.'}/> : null}
      {isSuccess ? <SuccessToast text={'Session Cancelled.'}/> : null}

    </div>
  );
}
