import { Tooltip } from "flowbite-react";
import { Datepicker, Select, Label, Modal } from "flowbite-react";
import moment from "moment";
import { FaPlus } from "react-icons/fa";
import { useState , useContext } from "react";
import { myContext } from "../../../../utils/PrivateRoutes";
import postEvents from "../../../../utils/postEvents/postEvents";
import BookSession from "../../../../Components/UI/BookSession/BookSession";
import recurringEvents from "../../../../utils/recurringEvents/recurringEvents";

export default function BookSessionModal() {
  const {
    userProfile,
    filteredEvents,
    setFilteredEvents,
    activeEventTab,
    activePartnerTab,
    quiteMode,setQuiteMode,
    setActivePartnerTab,
    setActiveEventTab,
    setIsThereError,
    setIsThereTextError,
    setWaiting,
    setIsSuccess} = useContext(myContext);
  const [openModal, setOpenModal] = useState(false);
  const [eventDate, setEventDate] = useState(moment().format("YYYY-MM-DD"));
  const [eventTime, setEventTime] = useState("12:00am");
  // const [eventLength, setEventLength] = useState("30 minutes");
  const [repeatType,setRepeatType] = useState("Do not repeat")
  const [endTimes,setEndTimes] = useState("");
  const [recurringEventStartTimes,setRecurringEventStartTimes] = useState([]);
  const [bulkEvents,setBulkEvents] = useState([]);

  
  function onCloseModal() {
    setOpenModal(false);
  }

  const tabSelected = {
    backgroundColor: "#008080",
    border: "1px solid #008080",
    color: "white",
  };

  const tabNotSelected = {
    backgroundColor: "white",
    border: "1px solid #008080",
    color: "#008080",
  };

  function handleTabSetting(tabSetting) {
    if (tabSetting === "deskEvent") {
      setActiveEventTab("deskEvent");
    } else if (tabSetting === "movingEvent") {
      setActiveEventTab("movingEvent");
    } else if (tabSetting === "anythingEvent") {
      setActiveEventTab("anythingEvent");
    } else if (tabSetting === "anyonePartner") {
      setActivePartnerTab("anyonePartner");
    } else if (tabSetting === "favoritePartner") {
      setActivePartnerTab("favoritePartner");
    }
  }


  const handleToggleChange = () => {
    setQuiteMode(!quiteMode)
  }

  function handleModalSubmit(e) {
    e.preventDefault();
    console.log(
      eventDate,
      // eventLength,
      eventTime,
      activeEventTab,
      activePartnerTab,
      quiteMode,
      repeatType, endTimes
    );

    // setEventLength("30 minutes");
    setEventTime('12:00am');
    setActiveEventTab('deskEvent');
    setActivePartnerTab('anyonePartner');
    setQuiteMode(false);
    setRepeatType("Do not repeat");

    const getRecurringTime = async () => {
      const events = [];
      const recurringTime = await recurringEvents(eventDate, eventTime, repeatType, endTimes);
      
      recurringTime.forEach((date) => {
        const start = moment(date).toDate();
        const end = moment(start)
        .add(50, "minutes")
        .toDate();

        const newEvent = {
          myID: crypto.randomUUID(),
          start,
          end
        }
        setBulkEvents(bulkEvents.push(newEvent))
      })
      // setBulkEvents(events)
      console.log(bulkEvents);
      // recurringEventsArray

  

      // console.log(recurringTimes[0]);
      // console.log(moment(recurringTimes[0]).toDate())
      const newEvent = {
        // myID: eventID,
        duration: "50 minutes",
        // start: start.toISOString(),
        recurringEventsArray: bulkEvents,
        // end: endDateTime.toISOString(),
        matchedPersonName: 'Matching...',
        matchedPersonFullName: 'Matching...',
        matchedPersonProfileLink: '',
        matchedPersonProfilePic: `https://res.cloudinary.com/dnbiuntjt/image/upload/v1732370053/search_rydjkq.jpg`,
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

      const response = await fetch(`${import.meta.env.VITE_BACKEND_PRO_URL}/api/events/recurring_events`,{
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body:  JSON.stringify(newEvent)
      });
      const data = await response.json();
      console.log(data);
      if(response.ok){
            setOpenModal(false);
          setIsSuccess(true);
          setFilteredEvents([...filteredEvents, ...data.updatedEvent])
            setIsThereError(false);
            setWaiting(false);
            if(data.updatedEvent || data.firstUserChange){
              console.log('1')
              setFilteredEvents([...filteredEvents, data.updatedEvent]);
            }else if(data.firstUserChange){
              console.log('2')
              setFilteredEvents([...filteredEvents , data.firstUserChange]);
            }else{
              console.log('3')
              setFilteredEvents([...filteredEvents, newEvent]);
            }
      }
      setOpenModal(false);
          setIsSuccess(false);
          // setWaiting(false);
          // setIsThereTextError(true);

    };
  
    if (repeatType !== 'Do not repeat') {
      getRecurringTime();
    } else {
    
      const startDateTime = moment(
        `${eventDate} ${eventTime}`,
        "YYYY-MM-DD h:mma"
      ).toDate();
  
      const endDateTime = moment(startDateTime)
        .add(50, "minutes")
        .toDate();
  
      console.log(startDateTime, endDateTime);
      const eventID = crypto.randomUUID();
  

      // console.log(recurringTimes[0]);
      // console.log(moment(recurringTimes[0]).toDate())
      const newEvent = {
        myID: eventID,
        duration: "50 minutes",
        start: startDateTime.toISOString(),
        // recurringEventsArray: [],
        end: endDateTime.toISOString(),
        matchedPersonName: 'Matching...',
        matchedPersonFullName: 'Matching...',
        matchedPersonProfileLink: '',
        matchedPersonProfilePic: `https://res.cloudinary.com/dnbiuntjt/image/upload/v1732370053/search_rydjkq.jpg`,
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
  
      console.log(newEvent);
      const addEvent = async () => {
        const response = await postEvents(newEvent);
        console.log(response);
        if(response.message === 'success'){
          if(response.updatedEvent || response.firstUserChange){
            setFilteredEvents([...filteredEvents, response.updatedEvent]);
          }else if(response.firstUserChange){
            setFilteredEvents([...filteredEvents , response.firstUserChange]);
          }else{
            setFilteredEvents([...filteredEvents, newEvent]);
          }
          setOpenModal(false);
          setIsSuccess(true);
            setIsThereError(false);
            setWaiting(false);
        }else if(response.message === 'notallowed'){
          setOpenModal(false);
          setIsSuccess(false);
          setWaiting(false);
          setIsThereTextError(true);
        } 
      }
      addEvent();
      setIsSuccess(true);


    }
  }
  return (
    <>
      <button
        type="button"
        className="flex justify-center items-center gap-2 py-3 px-10 xl:px-8 lg:text-md  text-white bg-greenbg"
        onClick={() => setOpenModal(true)}
      >
        <FaPlus />
        Book a Session
      </button>
      <Modal show={openModal} style={{zIndex:10000}} size="xl" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body id="modalbody">
          <h3 className="text-3xl font-bold mb-10 text-center text-greenbg">
            Book a Session
          </h3>
          <BookSession
          tabSelected={tabSelected}
          tabNotSelected={tabNotSelected}
          handleTabSetting={handleTabSetting}
          eventDate={eventDate} 
          setEventDate={setEventDate}
          eventTime={eventTime}
          setEventTime={setEventTime}
          handleToggleChange={handleToggleChange}
          handleModalSubmit={handleModalSubmit}
          repeatType={repeatType}
          setRepeatType={setRepeatType}
          endTimes={endTimes}
          setEndTimes={setEndTimes}/>
        </Modal.Body>
      </Modal>
      {/* <Tooltip id="my-tooltip" /> */}
    </>
  );
}
