import { LuLampDesk } from "react-icons/lu";
import { FaPersonWalking } from "react-icons/fa6";
import { IoShuffle } from "react-icons/io5";
import { BsInfoCircle } from "react-icons/bs";
import BookSessionModal from "../Columns/BookSessionModal";
import { Tooltip } from "flowbite-react";
import { IoStar } from "react-icons/io5";
import { FaGlobeAmericas } from "react-icons/fa";
import { useContext, useState, useEffect, useMemo } from "react";
import AvailableSessions from "../Calender/AvailableSessions";
import { myContext } from "../../../../utils/PrivateRoutes";
import SettingModal from "../Calender/SettingModal";
import {Link} from 'react-router-dom'

function DashboardColumns() {

  const {
    userProfile,
    showDeleteMsg,
    columns,
    filteredEvents,
    setActivePartnerTab,
    activePartnerTab,
    handleTabSetting,
    handleToggleChange,
  } = useContext(myContext);
  const [sessionAvailable, setSessionAvailable] = useState(false);
  const [availableEvents, setAvailableEvents] = useState(null);
  const [onGoing, setOnGoing] = useState(false);
  const [openSettingModal,setOpenSettingModal] = useState(false);

  const findUpcomingEvent = async () => {
    const username =
      userProfile.givenName +
      " " +
      (userProfile.familyName ? userProfile.familyName[0] : " ");
    // console.log(username);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_PRO_URL}/api/events/findupcomingevent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: username }),
        }
      );
      const data = await response.json();
      // console.log(data);
      if (response.ok) {
        if (data.upcomingEvent.length > 0) {
          setSessionAvailable(true);
          setAvailableEvents(data.upcomingEvent);
        } else {
          setSessionAvailable(false);
        }
      }
    } catch (err) {
      console.log(err);
      throw new Error("Error in upcoming events");
    }
  };

  const handleSettingModal = () => {
    setOpenSettingModal(true);
  }

  useEffect(() => {
    // console.log('column')

    findUpcomingEvent();
  }, [filteredEvents, showDeleteMsg]);

  const onMountTrans = {
    transition: "all 0.5s ease-in-out",
  };

  const onUnmountTrans = {
    display: "none",
    transition: "all 0.5s ease-in-out",
  };

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


  return (
    <div
      className="min-h-6 flex flex-col gap-4 lg:flex-row lg:flex-wrap xl:flex-nowrap xl:flex-row lg:gap-4 mt-4 p-1 overflow-y-hidden"
      style={columns ? onMountTrans : onUnmountTrans}
    >
      <div className="w-full lg:w-[49%] xl:w-[25%] md:mx-auto lg:mx-0 text-center p-6 bg-white rounded-lg flex flex-col justify-center items-center shadow">
        <BookSessionModal />
        <Link to={'/profile/favorites/availability'} className=" mt-4 text-textcolor hover:text-greenbg ">
          See Favorites Availability
        </Link>
      </div>
      <div className="w-full lg:w-[49%] xl:w-[25%] flex flex-col justify-between gap-4 md:mx-auto lg:mx-0 p-6 bg-white rounded-lg shadow">
        <div className="flex justify-between">
          <span className="text-textcolor">
            {onGoing ? "ONGOING" : "UPCOMING"}
          </span>{" "}
          <Link to={'/sessions-list'} className="text-textcolor hover:text-greenbg">
            View All
          </Link>
        </div>
        <div>
          {sessionAvailable ? (
            <AvailableSessions
              findUpcomingEvent={findUpcomingEvent}
              availableEvents={availableEvents}
              setSessionAvailable={setSessionAvailable}
              onGoing={onGoing}
              setOnGoing={setOnGoing}
            />
          ) : (
            <p className=" mt-6 px-3 py-3 text-center text-darkbrown bg-[#e9e7e7] ">
              No upcoming sessions
            </p>
          )}
        </div>
      </div>
      <div className="w-full xl:w-[50%] flex flex-col gap-4 justify-between md:mx-auto p-6 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center gap-2 text-textcolor">
          <div className="flex items-center gap-2">
          <p className="column-text">SESSION SETTING</p>
          <BsInfoCircle
          className="cursor-pointer"
            data-tooltip-id="my-tooltip"
            data-tooltip-content="setting information"
            onClick={handleSettingModal}
          />
          </div>
          
           <label className="inline-flex gap-2 md:gap-3 items-center cursor-pointer">
                  <span className="column-text ms-0 md:ms-3  text-black font-normal">
                    Quiet Mode
                  </span>
                  <input onChange={handleToggleChange} type="checkbox" value="" className="sr-only peer" />
                  <div className="relative w-10 h-6 md:w-12 md:h-7 bg-gray-200 border-2 border-greenbg peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 md:after:h-5 md:after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-greenbg"></div>
                </label>
        </div>

        <div className="flex  gap-6 lg:gap-2 xl:gap-4 justify-between">
            {/* <div className="mt-2 flex flex-col w-full lg:w-[52%] gap-2  formTabs">
              <p className="text-center text-textcolor">MY TASK</p>
              <div className="mt-1 flex gap-2">
                <div className="w-[33.33%]">
                  <Tooltip content="Ideal for writing, emailing, coding, and other tasks.">
                    <button
                      className="column-text w-full flex gap-2 justify-center px-2 py-3"
                      style={
                        activeEventTab === "deskEvent"
                          ? tabSelected
                          : tabNotSelected
                      }
                      onClick={() => handleTabSetting("deskEvent")}
                    >
                      <LuLampDesk

                        style={{ fontSize: "18px", marginBottom: "5px" }}
                      />
                      Desk
                    </button>
                  </Tooltip>
                </div>
                <div className="w-[33.33%]">
                  <Tooltip content="Perfect for workouts, household chores, and other active tasks.">
                    <button
                      className="column-text w-full flex gap-2 justify-center px-2 py-3"
                      style={
                        activeEventTab === "movingEvent"
                          ? tabSelected
                          : tabNotSelected
                      }
                      onClick={() => handleTabSetting("movingEvent")}
                    >
                      <FaPersonWalking

                        style={{ fontSize: "18px", marginBottom: "5px" }}
                      />
                      Moving
                    </button>
                  </Tooltip>
                </div>
                <div className="w-[33.33%]">
                  <Tooltip content="When you're multitasking or still making decisions.">
                    <button
                      className="column-text w-full flex gap-1 justify-center px-2 py-3"
                      style={
                        activeEventTab === "anythingEvent"
                          ? tabSelected
                          : tabNotSelected
                      }
                      onClick={() => handleTabSetting("anythingEvent")}
                    >
                      <IoShuffle

                        style={{ fontSize: "18px", marginBottom: "5px" }}
                      />
                      Anything
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div> */}

          <div className="mt-2 w-full flex flex-col xl:flex-row gap-2 formTabs">
            <p className="my-auto text-center text-textcolor">PARTNER:</p>
            <div className="w-full mt-1 flex gap-2">
              <div className="w-[55%] md:w-[50%]">
                <Tooltip content="Matches you with your Favorite partners whenever they are available">
                  <button
                    className="column-text w-full flex gap-2 justify-center bg-greenbg px-2 py-3"
                    style={
                      activePartnerTab === "favoritePartner"
                        ? tabSelected
                        : tabNotSelected
                    }
                    onClick={() => handleTabSetting("favoritePartner")}
                  >
                    <IoStar 
                    style={{ fontSize: "18px", marginBottom: "5px" }} />
                    Prefer Favorites
                  </button>
                </Tooltip>
              </div>
              <div className="w-[45%] md:w-[50%]">
                <Tooltip content="Matches you with the first available person">
                  <button
                    className="column-text w-full flex gap-2 justify-center px-2 py-3"
                    style={
                      activePartnerTab === "anyonePartner"
                        ? tabSelected
                        : tabNotSelected
                    }
                    onClick={() => handleTabSetting("anyonePartner")}
                  >
                    <FaGlobeAmericas
                      style={{ fontSize: "18px", marginBottom: "5px" }}
                    />
                    Anyone
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
      {openSettingModal ? <SettingModal openSettingModal={openSettingModal} setOpenSettingModal={setOpenSettingModal}/> : null}
    </div>
  );
}

export default DashboardColumns;
