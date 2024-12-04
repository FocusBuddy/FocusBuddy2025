import { IoCheckbox, IoDocumentSharp } from "react-icons/io5";
import { useEffect, useState, useContext } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { MdComputer } from "react-icons/md";
import { GiPartyPopper } from "react-icons/gi";
import { Link } from "react-router-dom";
import { TfiNewWindow } from "react-icons/tfi";
import BookSession from "../../Components/UI/BookSession/BookSession";
import { myContext } from "../../utils/PrivateRoutes";
import moment from "moment";
import postEvents from "../../utils/postEvents/postEvents";
import { FaArrowRight } from "react-icons/fa6";

export default function WelcomeCheckList({
  // setWelcomeCheckListModal,
  // setOpenChecklistAutomatically,
  // welcomeCheckListModal,
  handleClose,
  setBookingDone,
  finalDone,}) {
  const [activeTab, setActiveTab] = useState("works");
  
  const [eventDate, setEventDate] = useState(moment().format("YYYY-MM-DD"));
  const [eventTime, setEventTime] = useState("12:00am");
  // const [eventLength, setEventLength] = useState("50 minutes");
  const [repeatType,setRepeatType] = useState("Do not repeat")
  const [endTimes,setEndTimes] = useState("")

  const {
    userProfile,
    setUserProfile,
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
    setIsSuccess
    } = useContext(myContext);


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
    // if (tabSetting === "deskEvent") {
    //   setActiveEventTab("deskEvent");
    // } else if (tabSetting === "movingEvent") {
    //   setActiveEventTab("movingEvent");
    // } else if (tabSetting === "anythingEvent") {
    //   setActiveEventTab("anythingEvent");
    // } else 
    if (tabSetting === "anyonePartner") {
      setActivePartnerTab("anyonePartner");
    } else if (tabSetting === "favoritePartner") {
      setActivePartnerTab("favoritePartner");
    }
  }

  const handleToggleChange = () => {
    setQuiteMode(!quiteMode)
  }

  const checklistGotIt = async (whatDone) => {
    // Optimistic UI update
    const updatedChecklistState = { ...userProfile.welcomeChecklistState, [whatDone]: true };
    setUserProfile({ ...userProfile, welcomeChecklistState: updatedChecklistState });
  
    // Navigate to the next tab
    switch (whatDone) {
      case "works":
        setActiveTab("guidelines");
        break;
      case "guidelines":
        setActiveTab("booking");
        break;
      case "booking":
        setActiveTab("final");
        break;
      default:
        setActiveTab("works");
        break;
    }
  
    // Send update to backend
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_PRO_URL}/api/user/welcomecheckliststate`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ whatdone: whatDone, whichuser: userProfile.email }),
        }
      );
      const data = await response.json();
  
      if (!response.ok) {
        console.error("Error updating checklist state:", data);
      }
    } catch (err) {
      console.error("Error while updating welcome checklist state:", err);
    }
  };
  
  
  // const checklistGotIt = async (whatDone) => {
  //   switch(whatDone){
  //     case 'works': setActiveTab("guidelines")
  //                   break;
  //     case 'guidelines': setActiveTab("booking")
  //                   break;
  //     case 'booking': setActiveTab("final")
  //                   break;
  //         default: setActiveTab("works");
  //                 break;
  //   }

  //   try{
  //     if(userProfile.welcomeChecklistState[whatDone] === false){
  //       const response = await fetch(`${import.meta.env.VITE_BACKEND_PRO_URL}/api/user/welcomecheckliststate`,{
  //         method: 'PUT',
  //         headers: {
  //           "Content-Type": "application/json"
  //         },
  //         body: JSON.stringify({whatdone:whatDone,whichuser:userProfile.email})
  //       });
  //       const data = await response.json();
  //       console.log(data);
  //       if(response.ok){
  //         setUserProfile(data.updatedProfile);
  //       }else{
  //         setUserProfile(userProfile)
  //       }
  //     }
      
  //   }catch(err){
  //     console.log(err);
  //     throw new Error("Error while updating welcome checklist state")
  //   }
  // }


  function handleModalSubmit(e) {
    e.preventDefault();
    setActiveTab("final");
    checklistGotIt("booking");
    console.log(
      eventDate,
      // eventLength,
      eventTime,
      // activeEventTab,
      activePartnerTab,
      quiteMode
    );
    // console.log(eventTime.slice(0,2));
    // const startDateTime = moment(
    //   `${eventDate} ${eventTime}`,
    //   "MMMM Do YYYY hh:mma"
    // ).toDate();

    // const endDateTime = moment(startDateTime)
    //   .add("50 minutes".slice(0, 2), "minutes")
    //   .toDate();
    const startDateTime = moment(
      `${eventDate} ${eventTime}`,
      "YYYY-MM-DD h:mma"
    ).toDate();

    const endDateTime = moment(startDateTime)
      .add(50, "minutes")
      .toDate();

     console.log(startDateTime,endDateTime); 
    const eventID = crypto.randomUUID()

    // console.log(startDateTime,endDateTime)
    const newEvent = {
      myID: eventID,
      duration: "50minutes",
      start: startDateTime.toISOString(),
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
    const addEvent = async () => {
      const response = await postEvents(newEvent);
      console.log(response);
      if(response.message === 'success'){
        if(response.updatedEvent || response.firstUserChange){
          setFilteredEvents([...filteredEvents, response.updatedEvent.updatedEvent]);
        }else if(response.firstUserChange){
          setFilteredEvents([...filteredEvents , response.firstUserChange.firstUserChange]);
        }else{
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
    addEvent();
    setIsSuccess(true);
  }

  


  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div
        style={{ zIndex: 10000 }}
        className={
          "flex  bg-[#00000047] fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full" 
        }
        // style={zoomLoaded ? {display: 'flex'} : {display: 'none'}}
      >
        <div className="relative w-full max-w-2xl max-h-full overflow-y-auto">
          <div className="relative bg-white rounded-lg shadow">
            <div className="bg-greenbg p-5 rounded-t-lg">
              <div className="flex gap-2">
                <p className="text-white font-medium text-md xl:text-xl">
                  WELCOME CHECKLIST
                </p>
                <div className="flex gap-1">
                  <ul
                    className="md:container mx-auto text-md xl:text-lg relative flex items-center list-none"
                    data-tabs="tabs"
                    role="list"
                  >
                    <li className="z-30 w-full text-center">
                      <a
                        className={`z-30 flex items-center justify-center w-full transition-all ease-in-out cursor-pointer bg-inherit ${
                          userProfile.welcomeChecklistState.works ? "text-textcolor" : "text-white"
                        }`}
                        data-tab-target=""
                        role="tab"
                        aria-selected={activeTab === "works"}
                        aria-controls="works"
                        onClick={() => handleTabClick("works")}
                      >
                        <span className="ml-1">
                          <IoCheckbox className="hover:-translate-y-1 transition-all duration-200 ease-in-out cursor-pointer text-lg md:text-2xl" />
                        </span>
                      </a>
                    </li>
                    <li className="z-30 w-full text-center">
                      <a
                        className={`z-30 flex items-center justify-center w-full px-0 transition-all ease-in-out cursor-pointer ${
                          userProfile.welcomeChecklistState.guidelines ? "text-textcolor" : "text-white"
                        }`}
                        data-tab-target=""
                        role="tab"
                        aria-selected={activeTab === "guidelines"}
                        aria-controls="guidelines"
                        onClick={() => handleTabClick("guidelines")}
                      >
                        <span className="ml-1">
                          <IoCheckbox className="hover:-translate-y-1 transition-all duration-200 ease-in-out cursor-pointer text-lg md:text-2xl" />
                        </span>
                      </a>
                    </li>
                    <li className="z-30 w-full text-center">
                      <a
                        className={`z-30 flex items-center justify-center w-full px-0 transition-all ease-in-out cursor-pointer ${
                          userProfile.welcomeChecklistState.booking ? "text-textcolor" : "text-white"
                        }`}
                        data-tab-target=""
                        role="tab"
                        aria-selected={activeTab === "booking"}
                        aria-controls="booking"
                        onClick={() => handleTabClick("booking")}
                      >
                        <span className="ml-1">
                          <IoCheckbox className="hover:-translate-y-1 transition-all duration-200 ease-in-out cursor-pointer text-lg md:text-2xl" />
                        </span>
                      </a>
                    </li>
                    <li className="z-30 w-full text-center">
                      <a
                        className={`z-30 flex items-center justify-center w-full px-0 transition-all ease-in-out cursor-pointer ${
                          finalDone ? "text-textcolor" : "text-white"
                        }`}
                        data-tab-target=""
                        role="tab"
                        aria-selected={activeTab === "final"}
                        aria-controls="final"
                        onClick={() => handleTabClick("final")}
                      >
                        <span className="ml-1">
                          <IoCheckbox className="hover:-translate-y-1 transition-all duration-200 ease-in-out cursor-pointer text-lg md:text-2xl" />
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleClose}
                 
                  className="closeWelcomeCheckList z-50 absolute top-3 right-4 text-white bg-textcolor hover:bg-darkbrown rounded-md w-8 h-8 md:w-10 md:h-10 ms-auto inline-flex justify-center items-center"
                  >
                  <svg
                    
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-6 md:px-10 pb-10">
              <div data-tab-content="" className="md:container mx-auto">
                  <div className="mt-6 rounded-b">
                <div
                  className={`${
                    activeTab === "works"
                      ? "flex flex-col opacity-100"
                      : "hidden opacity-0"
                  }`}
                  id="works"
                  role="tabpanel"
                >
                  <h1 className="w-full text-greenbg font-medium text-2xl md:text-3xl text-center">
                    How it works
                  </h1>
                  <div className="space-y-4">
                    <div className="mt-8 border-2 border-lightbg text-formgray rounded-md p-5">
                      <div className="flex items-center gap-2 text-textcolor">
                        <FaCalendarAlt />{" "}
                        <p className="font-medium text-lg">Book a session</p>
                      </div>
                      <p className="mt-2 text-md">
                        Choose a 50 minute session; sessions
                        are available 24/7
                      </p>
                    </div>
                    <div className="border-2 border-lightbg text-formgray rounded-md p-5">
                      <div className="flex items-center  gap-2 text-textcolor">
                        <MdComputer />{" "}
                        <p className="font-medium text-lg">Join Session</p>
                      </div>
                      <p className="mt-2 text-md">
                        Greet your partner and share your goals (for example:
                        "watching a seminar" or "booking a flight")
                      </p>
                      <p className="text-md my-2">
                        Write your goals in the chat for added accountability
                      </p>
                      <p className="text-md">
                        Focus on your goals and make progress
                      </p>
                    </div>
                    <div className="border-2 border-lightbg text-formgray rounded-md p-5">
                      <div className="flex items-center  gap-2 text-textcolor">
                        <GiPartyPopper className="text-lg" />{" "}
                        <p className="font-medium text-lg">
                          Celebrate your progress!
                        </p>
                      </div>
                      <p className="mt-2 text-md">
                        Tell your partner how you did and celebrate your
                        progress!
                      </p>
                    </div>
                  </div>
                    <button
                      className="flex justify-center items-center gap-4 mt-10 w-full bg-textcolor py-3 text-md hover:bg-darkbrown text-white rounded-md transition-all duration-200 ease-in-out"
                      // onClick={() => {
                      //   setActiveTab("guidelines");
                      //   setWorksDone(true);
                      // }}
                      onClick={() => checklistGotIt("works")}
                    >
                      Got it! <FaArrowRight/>
                    </button>
                  </div>
                </div>
                <div
                  className={`${
                    activeTab === "guidelines"
                      ? " opacity-100"
                      : "hidden opacity-0"
                  }`}
                  id="guidelines"
                  role="tabpanel"
                >
                  <h1 className="w-full text-greenbg font-medium text-2xl md:text-3xl text-center">
                    Review Community Guidelines
                  </h1>
                  <div className="mt-6 mb-4 border-2 border-lightbg text-formgray rounded-md p-5">
                    <p className="font-medium text-lg text-greenbg">Okay</p>
                    <ul className="text-md list-disc mt-2 ms-5 space-y-2">
                      <li>
                        Chat at the start to share your plan and at the end to
                        share how it went
                      </li>
                      <li>
                        Please stay on camera; if you need a short break, let
                        your partner know through the chat.
                      </li>
                      <li>Please dress as if you are in a shared workspace.</li>
                      <li>Engage with kindness and respect</li>
                    </ul>
                  </div>
                  <div className=" border-2 border-[#de353578] text-formgray rounded-md p-5">
                    <p className="font-medium text-lg text-errorred">
                      Not Okay
                    </p>
                    <ul className="text-md list-disc mt-2 ms-5 space-y-2">
                      <li>Harmful, sexual, or hateful actions or comments</li>
                      <li>Flirting or prying personal details</li>
                      <li>Promoting or selling any products or services.</li>
                      <li>
                        Recording or screenshotting your partner without their
                        consent
                      </li>
                    </ul>
                  </div>
                  <div className="my-8 rounded-b">
                    <button
                      className="flex justify-center items-center gap-4 w-full bg-textcolor py-3 text-md hover:bg-darkbrown text-white rounded-md transition-all duration-200 ease-in-out"
                      // onClick={() => {
                      //   setActiveTab("booking");
                      //   setGuidelinesDone(true);
                      // }}
                      onClick={() => checklistGotIt("guidelines")}
                    >
                      Got it! <FaArrowRight/>
                    </button>
                  </div>
                  <div className="flex justify-center items-center gap-2 text-center">
                    <Link
                      to={"/community"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-md xl:text-lg text-textcolor underline font-medium underline-offset-8 hover:text-greenbg"
                    >
                      View full guidelines
                    </Link>
                    <TfiNewWindow className="text-textcolor text-xl"/>
                  </div>
                </div>

                <div
                  className={`${
                    activeTab === "booking"
                      ? " px-0 md:px-16 opacity-100"
                      : "hidden opacity-0"
                  }`}
                  id="booking"
                  role="tabpanel"
                >
                  <h1 className="mb-10 w-full text-greenbg font-medium text-2xl md:text-3xl text-center">
                    Book a session
                  </h1>
                  <BookSession 
                  tabSelected={tabSelected}
                  tabNotSelected={tabNotSelected}
                  handleTabSetting={handleTabSetting}
                  eventDate={eventDate} 
                  setEventDate={setEventDate}
                  eventTime={eventTime}
                  setEventTime={setEventTime}
                  // eventLength={eventLength}
                  // setEventLength={setEventLength}
                  handleToggleChange={handleToggleChange}
                  handleModalSubmit={handleModalSubmit}
                  setActiveTab={setActiveTab} 
                  setBookingDone={setBookingDone}
                  repeatType={repeatType}
          setRepeatType={setRepeatType}
          endTimes={endTimes}
          setEndTimes={setEndTimes}/>
                  {/* <div className="my-8 rounded-b">
                    <button
                      className="w-full bg-textcolor py-3 md:py-4 text-md hover:bg-darkbrown text-white rounded-md transition-all duration-500 ease-in-out"
                    >
                      Got it!
                    </button>
                  </div> */}
                </div>

                <div
                  className={`${
                    activeTab === "final"
                      ? "px-6 md:px-10 opacity-100"
                      : "hidden opacity-0"
                  }`}
                  id="final"
                  role="tabpanel"
                >
                  <h1 className="w-full text-greenbg font-medium text-2xl md:text-3xl text-center">
                  Get ready for your first session!
                  </h1>
                  <div className="mt-10">
                    <p className="text-md text-formgray">Sometimes booking can be the hardest part. Now let's get ready for your session:</p>
                    <ul className="ms-4 my-4 text-md text-formgray list-disc space-y-2">
                      <li>Test your audio/video in a test session</li>
                      <li>Drink a nice tall glass of water!</li>
                      <li>Join the session up to 10 minutes before the starting time</li>
                    </ul>
                    <p className="text-md text-formgray">Finish the session to complete your Welcome Checklist!</p>
                  </div>
                  <div className="my-8 rounded-b">
                    <button
                      className="closeWelcomeCheckList mt-4 w-full bg-textcolor py-3 text-md hover:bg-darkbrown text-white rounded-md transition-all duration-200 ease-in-out"
                      onClick={handleClose}
                    >
                      Got it!
                    </button>
                  </div>
                </div>

                
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
