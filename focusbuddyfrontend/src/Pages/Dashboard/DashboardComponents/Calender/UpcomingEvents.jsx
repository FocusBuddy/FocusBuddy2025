import moment from "moment";
import { MdEdit } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { GoArrowRight } from "react-icons/go";
import { LuLampDesk } from "react-icons/lu";
import { FaPersonWalking } from "react-icons/fa6";
import { IoShuffle } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState, useCallback } from "react";
import { myContext } from "../../../../utils/PrivateRoutes";
import Countdown from "react-countdown";
import EditEventModal from "./EditEventModal";
import { IoMdMicOff } from "react-icons/io";
import { FaStar } from "react-icons/fa6";
import { Tooltip } from "flowbite-react";

export default function UpcomingEvents({
  availableEvents,
  handleConfirm,
  onGoing,
  setOnGoing,
}) {
  const {
    filteredEvents,
    appointments,
    openUpEditModal,
    setOpenUpEditModal,
    userProfile, showJoin, setShowJoin, startEvent, setStartEvent
  } = useContext(myContext);
  const [isInFav1, setIsInFav1] = useState(false);

  const target_time = moment(availableEvents[0].start).toDate().getTime();
  const end_time = moment(availableEvents[0].end).toDate().getTime();
  // const target_time = 1717743240000;
  const diff = end_time - new Date().getTime();
  const ten_min_before = moment(target_time)
    .subtract(10, "minutes")
    .toDate()
    .getTime();
  const event_id = availableEvents[0].myID;

  useEffect(() => {
    const checkFavorite = () => {
      const isFavorite = userProfile.favorites.some(
        (fav) => fav.name === availableEvents[0].matchedPersonFullName
      );
      setIsInFav1(isFavorite);
    };
    if(availableEvents){
      checkFavorite();
    }
  }, [
    availableEvents[0].name,
    userProfile.favorites,
    appointments,
  ]);

  // console.log('isInFav',isInFav)

  useEffect(() => {
    const checkBeforeTime = () => {
      const now = new Date().getTime();
      // console.log("before");
      // console.log("before", now, ten_min_before);
      if (now >= ten_min_before) {
        console.log("10 min left");
        setShowJoin(true);
        clearInterval(beforeIntervalId);
      } else {
        setShowJoin(false);
      }
    };

    const beforeIntervalId = setInterval(checkBeforeTime, 1000); // 60000ms = 1 minute

    //timer for current = start
    const checkStartTime = () => {
      // console.log("start");
      const now = new Date().getTime();
      // console.log('interval',now,target_time);
      if (now >= target_time) {
        console.log("time equal");
        setStartEvent(true);
        setOnGoing(true);
        clearInterval(startIntervalId);
      } else {
        setStartEvent(false);
      }
    };

    const startIntervalId = setInterval(checkStartTime, 1000); // Check every second

    // Clear the interval when the component unmounts
    return () => {
      clearInterval(beforeIntervalId);
      clearInterval(startIntervalId);
    }; // Cleanup interval on component unmount
  }, [availableEvents]);

  // console.log(Date.now());

 

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      setStartEvent(false);
      setOnGoing(false);
      return (
        <div className="text-xs flex items-center bg-[#DE3535] px-2 py-1">
          <p>Finised</p>
        </div>
      );
    } else {
      return (
        <div className="text-[13px] flex gap-1 items-center">
          ends in:
          <div className="flex items-center bg-[#DE3535] px-2 py-1">
            <span>
              {minutes < 10 ? "0" : null}
              {minutes}:{seconds < 10 ? "0" : null}
              {seconds}
            </span>
          </div>
        </div>
      );
    }
  };
  // console.log('join',showJoin, 'event',startEvent);
  return (
    <div className="flex flex-col px-4 py-2 mt-4 bg-greenbg text-white text-sm rounded-md">
      <div className="flex justify-between font-semibold tracking-wide">
        <p>{moment(availableEvents[0].start).format("MMMM Do")}</p>
        <div className="flex gap-2 items-center">
          <p>{availableEvents[0].duration.slice(0, 6)}</p>
          <div className="flex text-lg">
            {availableEvents[0].quiteModeOn ? <IoMdMicOff /> : null}
            {availableEvents[0].taskType === "deskEvent" ? (
              <LuLampDesk />
            ) : availableEvents[0].taskType === "movingEvent" ? (
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
                (userProfile.familyName ? userProfile.familyName[0] : " ") ===
              availableEvents[0].name
                ? availableEvents[0].matchedPersonProfilePic
                : availableEvents[0].profilePic
            } //profilepic of person with whom i got match
            alt=""
          />
          {
            isInFav1 ? 
          <div
            className="absolute -right-1 -bottom-1 p-0.5 bg-white rounded-full"
            style={{ zIndex: 2002 }}
          >
            <FaStar className="text-[13px] text-greenbg" />
          </div>
          :null
          } 
        </div>
        <div>
          <p className="text-[13px]">
            {moment(availableEvents[0].start).format("hh:mm a")}
          </p>
          <span className="text-[14px] capitalize">
            {userProfile.givenName +
              " " +
              (userProfile.familyName ? userProfile.familyName[0] : " ") ===
            availableEvents[0].name
              ? availableEvents[0].matchedPersonName
              : availableEvents[0].name}
          </span>
        </div>
      </div>

      <div style={{zIndex:3002}} id="joinbuttontooltip" className="flex mt-4 justify-between">
        {/* <Tooltip className={`max-w-[16rem] text-center ${showJoin ? 'hidden': 'block'}`} content="You can join your session 10 minutes before it starts">
        <button type="button" className="flex items-center gap-1 px-1 md:px-2 font-semibold bg-white text-textcolor border-2 border-bordercolor hover:bg-gray-200">
        <Link
          to={`/sessions/${availableEvents[0].callID}`}
          // to={`/videoSDK`}
          state={{ availableEvents }}
          // target="_blank"
          className="flex items-center gap-1 "
          // className="flex items-center gap-1 px-2 font-semibold bg-white text-textcolor border-2 border-bordercolor hover:bg-gray-200"
          // style={showJoin ? null : { pointerEvents: "none" }}
        >
          <GoArrowRight /> Join
        </Link>
        </button>
           </Tooltip> */}
        <Tooltip className={`max-w-[16rem] text-center ${showJoin ? 'hidden': 'block'}`} content="You can join your session 10 minutes before it starts">
        <button type="button" className="flex items-center gap-1 px-1 font-semibold bg-white text-textcolor border-2 border-bordercolor hover:bg-gray-200">
        <Link
          to={`/sessions/${availableEvents[0].callID}`}
          // to={`/videoSDK`}
          state={{ availableEvents }}
          // target="_blank"
          className="flex items-center gap-1 "
          // className="flex items-center gap-1 px-2 font-semibold bg-white text-textcolor border-2 border-bordercolor hover:bg-gray-200"
          style={showJoin ? null : { pointerEvents: "none" }}
        >
          <GoArrowRight /> Join
        </Link>
        </button>
           </Tooltip>
        <div className="flex gap-2 items-center">
          <span>
            {showJoin === true && startEvent === false ? (
              <div className="text-xs flex gap-2 items-center">
                start at:{" "}
                <div className="flex items-center bg-[#DE3535] px-2 py-2">
                  <span>
                    {moment(availableEvents[0].start).format("HH:mm a")}
                  </span>
                </div>
              </div>
            ) : showJoin === true && startEvent === true ? null : null}
          </span>
          {startEvent ? (
            <Countdown date={Date.now() + diff} renderer={renderer} />
          ) : null}
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="p-1.5 text-sm rounded-full bg-white text-textcolor border-2 border-bordercolor hover:bg-gray-200"
            // style={showJoin ? { pointerEvents: "none" } : null}
            onClick={() => setOpenUpEditModal(true)}
          >
            <MdEdit />
          </button>
          <button
            type="button"
            className="p-1.5 text-sm rounded-full bg-white text-textcolor border-2 border-bordercolor hover:bg-gray-200"
            onClick={() => handleConfirm(availableEvents[0].myID)}
            // style={showJoin ? { pointerEvents: "none" } : null}
          >
            <IoMdClose />
          </button>
        </div>
      </div>

      {openUpEditModal ? (
        <EditEventModal
          openEditModal={openUpEditModal}
          setOpenEditModal={setOpenUpEditModal}
          eventToEdit={availableEvents}
        />
      ) : null}
    </div>
  );
}
