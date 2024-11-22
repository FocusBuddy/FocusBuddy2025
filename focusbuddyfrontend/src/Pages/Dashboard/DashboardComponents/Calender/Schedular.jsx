// import { appointments } from "../../../data/data";
import React,{ useMemo, useState, useEffect, useContext, useRef } from "react";
import {
  Calendar as BigCalender,
  momentLocalizer,
  Views,
} from "react-big-calendar";
import moment from "moment";
import EventComponent from "./EventComponent";
import ErrorToast from "../../../../Components/UI/toast-components/ErrorToast";
import SuccessToast from "../../../../Components/UI/toast-components/SuccessToast";
import { myContext } from "../../../../utils/PrivateRoutes";
import postEvents from "../../../../utils/postEvents/postEvents";
import ErrorTextToast from '../../../../Components/UI/toast-components/ErrorTextToast';
import io from 'socket.io-client';

const socket = io(`${import.meta.env.VITE_BACKEND_PRO_URL}`);
const localizer = momentLocalizer(moment);


const Schedular = () => {
  // console.log(userProfile);
  const {
    userProfile,
    appointments,  
    activeEventTab,
    setActiveEventTab,
    activePartnerTab,
    setActivePartnerTab,
    filteredEvents,
    quiteMode,setQuiteMode,
    setFilteredEvents,
    showEditMsg,setShowEditMsg,
    isThereError,
    setIsThereError,
    isSuccess,
    setIsSuccess,
    showDeleteMsg,setShowDeleteMsg,
    showConfirmation,
    eventIdToDelete,
  } = useContext(myContext);

  const [view, setView] = useState("week");
  console.log(view);
  const [weekView, setWeekView] = useState(true);
  const [active, setActive] = useState("50 minutes");
  const [activeDate, setActiveDate] = useState(new Date());
  const [isThereTextError, setIsThereTextError] =useState(false);
  const [waiting, setWaiting] = useState(false);


  useEffect(() => {
    const updateView = () => {
      if (window.screen.width < 768) {
        setView('day');
      } else {
        setView('week');
      }
    };

    updateView(); // Set initial view
    window.addEventListener('resize', updateView); // Update view on resize

    socket.on('SessionCreated', (data) => {
      console.log(data);
      setFilteredEvents(
        data.filter(
          (appointment) => (
            (appointment.duration === "50 minutes") && 
            (appointment.taskType === 'deskEvent') &&
            (appointment.matchedPersonName === 'Matching...') || 
            (appointment.matchedPersonName === (userProfile.givenName + " " + (userProfile.familyName ? userProfile.familyName[0] : " ")) || appointment.name === (userProfile.givenName + " " + (userProfile.familyName ? userProfile.familyName[0] : " ")))
          )
        )
      );
    })
    

    return () => {
      window.removeEventListener('resize', updateView);
      socket.off('SessionCreated');
    }
  }, []);


  const activeFalseCSS = {
    backgroundColor: "white",
    border: "1px solid #DDDDDD",
    color: "#008080",
  };

  const activeTrueCSS = {
    backgroundColor: "#008080",
    border: "1px solid #DDDDDD",
    color: "white",
  };

function handleTabChange(tab){
  if (view === "week") {
    setView("day");
  } else if (view === "day") {
    setView("week");
  }
  setWeekView(!weekView);
}
  

  function handleDateChange(tab) {

    setFilteredEvents(
      appointments.filter((appointment) => (
        appointment.duration === active && 
        (appointment.matchedPersonName === 'Matching...') || 
        (appointment.matchedPersonName === (userProfile.givenName + " " + (userProfile.familyName ? userProfile.familyName[0] : " ")) || appointment.name === (userProfile.givenName + " " + (userProfile.familyName ? userProfile.familyName[0] : " ")))
      ))
    );

    if (view === "day") {
      if (tab === "back") {
        setActiveDate(moment(activeDate).subtract(1, "d").toDate());
      } else if (tab === "next") {
        setActiveDate(moment(activeDate).add(1, "d").toDate());
      } else if (tab === "today") {
        setActiveDate(moment().toDate());
      }
    } else if (view === "week") {
      if (tab === "back") {
        setActiveDate(moment(activeDate).subtract(1, "w").toDate());
      } else if (tab === "next") {
        setActiveDate(moment(activeDate).add(1, "w").toDate());
      } else if (tab === "today") {
        setActiveDate(moment().toDate());
      }
    }
  }

  const eventStyleGetter = (event, start, end, isSelected) => {
    // console.log(event._id,userProfile.givenName + ' ' + userProfile.familyName[0]);
    const style = {
      padding: "5px 10px",
      backgroundColor: "#ffffff",
      border: "2px solid #008080",
      // border: "2px solid #583531",
      color : '#583531'
    };

    if ( (event.name !== (userProfile.givenName + ' ' + (userProfile.familyName ? userProfile.familyName[0] : ' '))) && event.matchedPersonName === 'Matching...' ) {
      style.maxHeight = "1.40%";
      style.border = "none";
      style.backgroundColor = "transparent";
    }

    if((userProfile.givenName + ' ' + (userProfile.familyName ? userProfile.familyName[0] : ' ')) === event.name){
      style.zIndex = 2000;
    }

    if (showConfirmation) {
      if (event.myID === eventIdToDelete) {
        style.backgroundColor = "#DE3535";
        style.padding = "10px 0px 0px 0px";
        style.zIndex = 2003
      }
    }

    return {
      style: style,
    };
  };

  // console.log('afsdfsdsd',  activeDate?.startOf("week").format("MMMM DD"));

  const dateText = useMemo(() => {
    if (view === Views.DAY) return moment(activeDate).format("MMMM DD");
    if (view === Views.WEEK) {
      const from = moment(activeDate)?.startOf("week");
      const to = moment(activeDate)?.endOf("week");
      return `${from.format("MMMM DD")} to ${to.format("MMMM DD")}`;
    }
  }, [view, activeDate]);

  console.log(filteredEvents);
  function handleSelectSlot({ start, end }) {

    setActiveEventTab('deskEvent');
    setActivePartnerTab('anyonePartner');
    setQuiteMode(false);
    const eventID = crypto.randomUUID()
// console.log(start,typeof end)
    const newEvent = {
      myID: eventID,
      duration: active,
      start: start,
      end: moment(end - (10 * 60000)).toDate(),
      // end: end,
      matchedPersonName: 'Matching...',
      matchedPersonFullName: 'Matching...',
      matchedPersonProfilePic: `${import.meta.env.VITE_BACKEND_PRO_URL}/uploads/search.jpg`,
      matchedPersonProfileLink: '',
      name: userProfile.givenName + ' ' + userProfile.familyName[0],
      fullName: userProfile.givenName + ' ' + userProfile.familyName,
      profilePic: userProfile.profilePic,
      profileLink: userProfile.userProfileLink,
      taskType: activeEventTab,
      partner: activePartnerTab,
      quiteModeOn: quiteMode,
      callID: crypto.randomUUID(),
      callJoin: 0,
      // callLeave: 0,
      // totalCallDuration:0,
      otherPersonMissedCall: false
    };

    const addEvent = async () => {
      const response = await postEvents(newEvent);
      console.log(response);
      if(response.message === 'success'){
        if(response.updatedEvent || response.firstUserChange){
          console.log('1')
          setFilteredEvents([...filteredEvents, response.updatedEvent]);
        }else if(response.firstUserChange){
          console.log('2')
          setFilteredEvents([...filteredEvents , response.firstUserChange]);
        }else{
          console.log('3')
          setFilteredEvents([...filteredEvents, newEvent]);
        }
        setIsSuccess(true);
          setIsThereError(false);
          setWaiting(false);
      }else if(response.message === 'notallowed'){
        setIsSuccess(false);
        setWaiting(false);
        setIsThereTextError(true);
      } 
    }

     if ((end - start) / 1000 < 3600) {
      setIsThereError(true);
      setWaiting(false);
    } else {
      setWaiting(true);
      addEvent();
    }


  }

  const handleSelecting = ({ event,start, end }) => {
    
    // const startDate = new Date(Date.parse(start))
    // const endDate = new Date(Date.parse(end))
    const durationInMinutes = moment(end).diff(start, "minutes");
    if (
      moment(start).isBefore(moment(), "day") ||
      moment(start).isBefore(moment(), "minute")
    ) {
      return false;
    }

    if (durationInMinutes > 60) {
      // setSlotInRange(false);
      return false;
    } else {
      return true;
    }

  };

  if (isThereError) {
    setTimeout(() => {
      setIsThereError(false);
    }, 2000);
  }

  if (isThereTextError) {
    setTimeout(() => {
      setIsThereTextError(false);
    }, 2000);
  }

  if (isSuccess) {
    setTimeout(() => {
      setIsSuccess(false);
    }, 2000);
  }

  if (showDeleteMsg) {
    setTimeout(() => {
      setShowDeleteMsg(false);
    }, 2000);
  }
 
  if (showEditMsg) {
    setTimeout(() => {
      setShowEditMsg(false);
    }, 2000);
  }

  return (
    <>
      {isThereTextError ? <ErrorTextToast text={"Session is already booked for that timeslot."}/> : null}
      {isThereError ? <ErrorToast active={"60 minutes"} /> : null}
      {isSuccess ? <SuccessToast text={'Session Booked.'}/> : null}
      {showDeleteMsg ? <SuccessToast text={'Session Cancelled.'}/> : null}
      {showEditMsg ? <SuccessToast text={'Session Edited.'}/> : null}
      {waiting ? <SuccessToast text={'Please wait...'}/> : null}
      <div className="flex flex-row justify-center">

        <div className="flex justify-start w-fit xl:w-[33.33%] text-start text-sm lg:text-lg mb-4">
          <button
            style={active === "today" ? activeTrueCSS : activeFalseCSS}
            className="px-5 py-1.5 hidden lg:flex"
            onClick={() => handleDateChange("today")}
          >
            Today
          </button>
          <button
    style={active === "back" ? activeTrueCSS : activeFalseCSS}
    className="px-2 md:px-5 py-1.5"
    onClick={() => handleDateChange("back")}
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="rgb(0, 128, 128)" /* Teal color */
        className="w-6 h-6"
    >
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
        />
    </svg>
</button>

        <button
    style={active === "next" ? activeTrueCSS : activeFalseCSS}
    className="px-2 md:px-5 py-1.5"
    onClick={() => handleDateChange("next")}
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="rgb(0, 128, 128)" /* Teal color */
        className="w-6 h-6"
    >
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
        />
    </svg>
</button>

        </div>

        <div className="w-fit px-4 lg:w-[30%] xl:w-[33.33%] flex items-center justify-center py-1 mb-4 text-center bg-white shadow">
          <p className="text-sm lg:text-lg text-greenbg">{dateText}</p>
        </div>

        <div className="flex justify-end w-fit xl:w-[33.33%] text-end mb-4">
          <button
            className="hidden lg:block px-5 py-1.5 text-sm lg:text-lg  border bg-white border-bordercolor text-greenbg "
            onClick={() => handleTabChange("week")}
          >
            {weekView ? "Day" : "Week"}
          </button>
{/*           <button
            style={active === "30 minutes" ? activeTrueCSS : activeFalseCSS}
            className="px-2 md:px-5 py-1.5 text-sm lg:text-lg"
            onClick={() => handleTabChange("30 minutes")}
          >
            30min
          </button> */}
          <button
            className="bg-greenbg text-white px-2 md:px-5 py-1.5 text-sm lg:text-lg pointer-events-none"
            // onClick={() => handleTabChange("50 minutes")}
          >
            50min
          </button>
{/*           <button
            style={active === "70 minutes" ? activeTrueCSS : activeFalseCSS}
            className="px-2 md:px-5 py-1.5 text-sm lg:text-lg"
            onClick={() => handleTabChange("70 minutes")}
          >
            70min
          </button> */}
        </div>
      </div>
      <BigCalender
        localizer={localizer}
        events={filteredEvents}
        selectable
        onSelectSlot={(slotInfo) => handleSelectSlot(slotInfo)}
        onSelecting={handleSelecting}
        eventPropGetter={eventStyleGetter}
        startAccessor={(event) => {return new Date(event.start)}}
        endAccessor={(event) => {return new Date(event.end)}}
        view={view}
        onView={(view) => setView(view)}
        date={activeDate}
        onNavigate={(activeDate) => setActiveDate(activeDate)}
        timeslots={1}
        step={30}
        toolbar={false}
        components={{
          event: (event) => (
            <EventComponent event={event} />
            // console.log(event)
          ), // Specify custom event component
        }}
        style={{ height: "530px", backgroundColor: "white", color: "#333333" }}
      ></BigCalender>
    </>
  );
};

export default Schedular;
