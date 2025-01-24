import { Tooltip } from "flowbite-react";
import { Datepicker, Select, Label, Modal } from "flowbite-react";
import moment from "moment";
import { FaPlus } from "react-icons/fa";
import { useState , useContext } from "react";
import { myContext } from "../../../../utils/PrivateRoutes";
import postEvents from "../../../../utils/postEvents/postEvents";
import BookSession from "../../../../Components/UI/BookSession/BookSession";

export default function BookSessionModal() {
  const {
    userProfile,
    filteredEvents,
    setFilteredEvents,
    // activeEventTab,
    activePartnerTab,
    quiteMode,setQuiteMode,
    setActivePartnerTab,
    // setActiveEventTab,
    setIsThereError,
    setIsThereTextError,
    setWaiting,
    setIsSuccess} = useContext(myContext);
  const [openModal, setOpenModal] = useState(false);
  const [eventDate, setEventDate] = useState(moment().format("YYYY-MM-DD"));
  const [eventTime, setEventTime] = useState("12:00am");

  
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
   
    if (tabSetting === "anyonePartner") {
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
      eventTime,
      activePartnerTab,
      quiteMode,
    );

    setEventTime('12:00am');
    setActivePartnerTab('anyonePartner');
    setQuiteMode(false);

  
    // if (repeatType !== 'Do not repeat') {
    //   getRecurringTime();
    // } else {
    
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
        // taskType: activeEventTab,
        partner: activePartnerTab,
        quiteModeOn: quiteMode,
        callID: crypto.randomUUID(),
      callJoin: 0,
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


    // }
  }
  return (
    <>
      <button
        type="button"
        className="w-[90%] flex justify-center items-center gap-2 py-3 px-10 xl:px-8 lg:text-lg text-white font-semibold bg-greenbg shadow-[0px_2px_25px_-5px_rgba(66,45,42,0.80)]"
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
          />
        </Modal.Body>
      </Modal>
      {/* <Tooltip id="my-tooltip" /> */}
    </>
  );
}
