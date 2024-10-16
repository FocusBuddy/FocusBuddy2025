import { useEffect, useState, useContext } from "react";
import { myContext } from "../../utils/PrivateRoutes";
import DashboardInnerNav from "../../Components/navbar/DashboardInnerNav";
import { Tooltip } from "flowbite-react";
import { LuLampDesk } from "react-icons/lu";
import { FaPersonWalking } from "react-icons/fa6";
import { IoShuffle } from "react-icons/io5";
import { BsInfoCircle } from "react-icons/bs";
import { IoMdMicOff } from "react-icons/io";
import { AiOutlineCheck } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
// import moment from "moment";
import SuccessToast from "../../Components/UI/toast-components/SuccessToast";
import ErrorTextToast from "../../Components/UI/toast-components/ErrorTextToast";

export default function AllFavoritesAvailability() {
  const {
    appointments,
    userProfile,
    activeEventTab,
    quiteMode,
    handleTabSetting,
    handleToggleChange,
  } = useContext(myContext);
  const [fail, setFail] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeDurationTab, setActiveDurationTab] = useState("30m");
  const [activeSessionIndex, setActiveSessionIndex] = useState(null);
const navigate = useNavigate();
 
  const handleTabClick = (tab) => {
    setActiveDurationTab(tab);
  };

  console.log("quitemode", quiteMode);

  const tabSelected = {
    backgroundColor: "#008080",
    border: "2px solid #008080",
    color: "white",
  };

  const tabNotSelected = {
    backgroundColor: "white",
    border: "2px solid #008080",
    color: "#008080",
  };

  // console.log(all_favorites_events_30, userProfile);

  const handleLockSession = async (session) => {
    console.log("session", session);
    const eventID = crypto.randomUUID();
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
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_PRO_URL}/api/events/locksession`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lockWith: newEvent }),
        }
      );
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setActiveSessionIndex(null);
        // setSessionLocked(true);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          navigate('/dashboard');
        }, 500);
      } else {
        setFail(true);
        setTimeout(() => {
          setFail(false);
        }, 500);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <DashboardInnerNav />
      <div className="flex max-w-screen-md min-h-screen mx-auto pt-10">
        <div className="relative w-[10%] z-20">
          <div className="fixed space-y-4">
            <div className="flex cursor-pointer justify-center">
              <Tooltip
                content="Select your task type and quite mode"
                className="text-center w-[200px]"
              >
                <p className="text-xl text-formgray ">
                  <BsInfoCircle />
                </p>
              </Tooltip>
            </div>
            <Tooltip
              placement="left"
              className="w-[200px]"
              content="Ideal for writing, emailing, coding, and other tasks."
            >
              <div
                className="w-fit p-3 text-md xl:text-xl text-textcolor hover:text-white hover:bg-greenbg cursor-pointer bg-white border-2 border-greenbg"
                style={
                  activeEventTab === "deskEvent" ? tabSelected : tabNotSelected
                }
                onClick={() => handleTabSetting("deskEvent")}
              >
                <LuLampDesk />
              </div>
            </Tooltip>
            <Tooltip
              placement="left"
              className="w-[200px]"
              content="Perfect for workouts, household chores, and other active tasks."
            >
              <div
                className="w-fit p-3 text-md xl:text-xl text-textcolor hover:text-white hover:bg-greenbg cursor-pointer bg-white border-2 border-greenbg"
                style={
                  activeEventTab === "movingEvent"
                    ? tabSelected
                    : tabNotSelected
                }
                onClick={() => handleTabSetting("movingEvent")}
              >
                <IoShuffle />
              </div>
            </Tooltip>
            <Tooltip
              placement="left"
              className="w-[200px] "
              content="When you're multitasking or still making decisions."
            >
              <div
                className="w-fit p-3 text-md xl:text-xl text-textcolor hover:text-white hover:bg-greenbg cursor-pointer bg-white border-2 border-greenbg"
                style={
                  activeEventTab === "anythingEvent"
                    ? tabSelected
                    : tabNotSelected
                }
                onClick={() => handleTabSetting("anythingEvent")}
              >
                <FaPersonWalking />
              </div>
            </Tooltip>

            <Tooltip
              placement="left"
              className="w-[200px] z-20"
              content="Great for situations where you are in a quiet space (think offices and libraries) "
            >
              <div
                className="w-fit p-3 text-md xl:text-xl text-textcolor hover:text-white hover:bg-greenbg cursor-pointer bg-white border-2 border-greenbg"
                style={quiteMode ? tabSelected : tabNotSelected}
                onClick={handleToggleChange}
              >
                <IoMdMicOff />
              </div>
            </Tooltip>
          </div>
        </div>
        <div className="w-full z-10">
          <div className="flex bg-greenbg  py-6 rounded-t-md">
            <div className=" flex items-center gap-4 basis-1/2 px-10">
              <h1 className="text-3xl text-white">All Favorites</h1>
            </div>
            <div className="basis-1/2"></div> {/* Reload buttin*/}
          </div>
          <div className="bg-white p-10 h-screen">
            <div className="flex justify-center mt-10">
            {userProfile.favorites.length === 0 && (
            <div className="bg-bordercolor py-4 w-full rounded-md">
              <p className="text-md xl:text-lg font-medium text-textcolor text-center">
                No Favorites
              </p>
            </div>
          )}
            {
            userProfile.favorites.map((fav) => (
                          <div className="mb-10 space-y-3 w-[50%] text-center">
                            <h1 className="text-md xl:text-lg text-formgray">
                              {fav.name}
                            </h1>
                            {appointments.filter(
                              (sessions) =>
                                sessions.fullName === fav.name &&
                                sessions.matchedPersonFullName !==
                                  userProfile.displayName &&
                                sessions.duration === "50 minutes"
                            ).length === 0 ? (
                              <h1 className="text-md text-textcolor bg-bordercolor p-4 rounded-md">
                                No sessions
                              </h1>
                            ) : (
                              appointments
                                .filter(
                                  (sessions) =>
                                    sessions.fullName === fav.name &&
                                    sessions.matchedPersonFullName !==
                                      userProfile.displayName &&
                                    sessions.duration === "50 minutes"
                                )
                                .map((items) => (
                                  <div
                                    key={items.myID}
                                    onClick={() =>
                                      setActiveSessionIndex(items.myID)
                                    }
                                  >
                                    {activeSessionIndex === items.myID ? (
                                      <div className="flex justify-center gap-2 mt-4 border-2 border-greenbg bg-greenbg  cursor-pointer text-center p-4 rounded-md shadow-md">
                                        <p className="text-white text-md my-auto font-medium">
                                          Confirm for{" "}
                                          {moment(items.start).format(
                                            "hh:mm A"
                                          )}{" "}
                                          ?
                                        </p>
                                        <button
                                          onClick={() =>
                                            handleLockSession(items)
                                          }
                                          className="text-md bg-white p-2 text-textcolor rounded-md hover:bg-bordercolor"
                                        >
                                          <AiOutlineCheck />
                                        </button>

                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveSessionIndex(null);
                                          }}
                                          className="text-md bg-white p-2 text-textcolor rounded-md hover:bg-bordercolor"
                                        >
                                          <AiOutlineClose />
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-between gap-3 group border-2 border-greenbg hover:bg-greenbg cursor-pointer p-4 rounded-md shadow-md ">
                                        <h1 className="text-md text-textcolor group-hover:text-white">
                                          {" "}
                                          {moment(items.start).format(
                                            "ddd, MMMM DD, HH:mm a"
                                          )}{" "}
                                        </h1>

                                        <span className="group-hover:text-white text-lg text-greenbg">
                                          {items.quiteModeOn ? (
                                            <IoMdMicOff />
                                          ) : null}
                                          {items.taskType === "deskEvent" ? (
                                            <LuLampDesk />
                                          ) : items.taskType ===
                                            "movingEvent" ? (
                                            <FaPersonWalking />
                                          ) : (
                                            <IoShuffle />
                                          )}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                ))
                            )}
                          </div>
                        ))
                      }
              {/* <AvailabilityTabs
                activeDurationTab={activeDurationTab}
                handleTabClick={handleTabClick}
                handleToggleChange={handleToggleChange}
              />
              <div data-tab-content="" className="md:container mx-auto pt-10">
                {["30m", "50m", "70m"].map((items) => (
                  <div
                    className={`${
                      activeDurationTab === items
                        ? "flex flex-col justify-center items-center gap-3 opacity-100"
                        : "hidden opacity-0"
                    }`}
                    id={items}
                    role="tabpanel"
                  >
                    {items === "30m"
                      ? userProfile.favorites.map((fav) => (
                          <div className="mb-10 space-y-3 w-[50%] text-center">
                            <h1 className="text-md xl:text-lg text-formgray">
                              {fav.name}
                            </h1>
                            {appointments.filter(
                              (sessions) =>
                                sessions.fullName === fav.name &&
                                sessions.matchedPersonFullName !==
                                  userProfile.displayName &&
                                sessions.duration === "30 minutes"
                            ).length === 0 ? (
                              <h1 className="text-md text-textcolor bg-bordercolor p-4 rounded-md">
                                No sessions
                              </h1>
                            ) : (
                              appointments
                                .filter(
                                  (sessions) =>
                                    sessions.fullName === fav.name &&
                                    sessions.matchedPersonFullName !==
                                      userProfile.displayName &&
                                    sessions.duration === "30 minutes"
                                )
                                .map((items) => (
                                  <div
                                    key={items.myID}
                                    onClick={() =>
                                      setActiveSessionIndex(items.myID)
                                    }
                                  >
                                    {activeSessionIndex === items.myID ? (
                                      <div className="flex justify-center gap-2 mt-4 border-2 border-greenbg bg-greenbg  cursor-pointer text-center p-4 rounded-md shadow-md">
                                        <p className="text-white text-md my-auto font-medium">
                                          Confirm for{" "}
                                          {moment(items.start).format(
                                            "hh:mm A"
                                          )}{" "}
                                          ?
                                        </p>
                                        <button
                                          onClick={() =>
                                            handleLockSession(items)
                                          }
                                          className="text-md bg-white p-2 text-textcolor rounded-md hover:bg-bordercolor"
                                        >
                                          <AiOutlineCheck />
                                        </button>

                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveSessionIndex(null);
                                          }}
                                          className="text-md bg-white p-2 text-textcolor rounded-md hover:bg-bordercolor"
                                        >
                                          <AiOutlineClose />
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-between gap-3 group border-2 border-greenbg hover:bg-greenbg cursor-pointer p-4 rounded-md shadow-md ">
                                        <h1 className="text-md text-textcolor group-hover:text-white">
                                          {" "}
                                          {moment(items.start).format(
                                            "ddd, MMMM DD, HH:mm a"
                                          )}{" "}
                                        </h1>

                                        <span className="group-hover:text-white text-lg text-greenbg">
                                          {items.quiteModeOn ? (
                                            <IoMdMicOff />
                                          ) : null}
                                          {items.taskType === "deskEvent" ? (
                                            <LuLampDesk />
                                          ) : items.taskType ===
                                            "movingEvent" ? (
                                            <FaPersonWalking />
                                          ) : (
                                            <IoShuffle />
                                          )}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                ))
                            )}
                          </div>
                        ))
                      : items === "50m"
                      ? userProfile.favorites.map((fav) => (
                          <div className="mb-10 space-y-3 w-[50%] text-center">
                            <h1 className="text-md xl:text-lg text-formgray">
                              {fav.name}
                            </h1>
                            {appointments.filter(
                              (sessions) =>
                                sessions.fullName === fav.name &&
                                sessions.matchedPersonFullName !==
                                  userProfile.displayName &&
                                sessions.duration === "50 minutes"
                            ).length === 0 ? (
                              <h1 className="text-md text-textcolor bg-bordercolor p-4 rounded-md">
                                No sessions
                              </h1>
                            ) : (
                              appointments
                                .filter(
                                  (sessions) =>
                                    sessions.fullName === fav.name &&
                                    sessions.matchedPersonFullName !==
                                      userProfile.displayName &&
                                    sessions.duration === "50 minutes"
                                )
                                .map((items) => (
                                  <div
                                    key={items.myID}
                                    onClick={() =>
                                      setActiveSessionIndex(items.myID)
                                    }
                                  >
                                    {activeSessionIndex === items.myID ? (
                                      <div className="flex justify-center gap-2 mt-4 border-2 border-greenbg bg-greenbg  cursor-pointer text-center p-4 rounded-md shadow-md">
                                        <p className="text-white text-md my-auto font-medium">
                                          Confirm for{" "}
                                          {moment(items.start).format(
                                            "hh:mm A"
                                          )}{" "}
                                          ?
                                        </p>
                                        <button
                                          onClick={() =>
                                            handleLockSession(items)
                                          }
                                          className="text-md bg-white p-2 text-textcolor rounded-md hover:bg-bordercolor"
                                        >
                                          <AiOutlineCheck />
                                        </button>

                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveSessionIndex(null);
                                          }}
                                          className="text-md bg-white p-2 text-textcolor rounded-md hover:bg-bordercolor"
                                        >
                                          <AiOutlineClose />
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-between gap-3 group border-2 border-greenbg hover:bg-greenbg cursor-pointer p-4 rounded-md shadow-md ">
                                        <h1 className="text-md text-textcolor group-hover:text-white">
                                          {" "}
                                          {moment(items.start).format(
                                            "ddd, MMMM DD, HH:mm a"
                                          )}{" "}
                                        </h1>

                                        <span className="group-hover:text-white text-lg text-greenbg">
                                          {items.quiteModeOn ? (
                                            <IoMdMicOff />
                                          ) : null}
                                          {items.taskType === "deskEvent" ? (
                                            <LuLampDesk />
                                          ) : items.taskType ===
                                            "movingEvent" ? (
                                            <FaPersonWalking />
                                          ) : (
                                            <IoShuffle />
                                          )}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                ))
                            )}
                          </div>
                        ))
                      : userProfile.favorites.map((fav) => (
                          <div className="mb-10 space-y-3 w-[50%] text-center">
                            <h1 className="text-md xl:text-lg text-formgray">
                              {fav.name}
                            </h1>
                            {appointments.filter(
                              (sessions) =>
                                sessions.fullName === fav.name &&
                                sessions.matchedPersonFullName !==
                                  userProfile.displayName &&
                                sessions.duration === "70 minutes"
                            ).length === 0 ? (
                              <h1 className="text-md text-textcolor bg-bordercolor p-4 rounded-md">
                                No sessions
                              </h1>
                            ) : (
                              appointments
                                .filter(
                                  (sessions) =>
                                    sessions.fullName === fav.name &&
                                    sessions.matchedPersonFullName !==
                                      userProfile.displayName &&
                                    sessions.duration === "70 minutes"
                                )
                                .map((items) => (
                                  <div
                                    key={items.myID}
                                    onClick={() =>
                                      setActiveSessionIndex(items.myID)
                                    }
                                  >
                                    {activeSessionIndex === items.myID ? (
                                      <div className="flex justify-center gap-2 mt-4 border-2 border-greenbg bg-greenbg  cursor-pointer text-center p-4 rounded-md shadow-md">
                                        <p className="text-white text-md my-auto font-medium">
                                          Confirm for{" "}
                                          {moment(items.start).format(
                                            "hh:mm A"
                                          )}{" "}
                                          ?
                                        </p>
                                        <button
                                          onClick={() =>
                                            handleLockSession(items)
                                          }
                                          className="text-md bg-white p-2 text-textcolor rounded-md hover:bg-bordercolor"
                                        >
                                          <AiOutlineCheck />
                                        </button>

                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveSessionIndex(null);
                                          }}
                                          className="text-md bg-white p-2 text-textcolor rounded-md hover:bg-bordercolor"
                                        >
                                          <AiOutlineClose />
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-between gap-3 group border-2 border-greenbg hover:bg-greenbg cursor-pointer p-4 rounded-md shadow-md ">
                                        <h1 className="text-md text-textcolor group-hover:text-white">
                                          {" "}
                                          {moment(items.start).format(
                                            "ddd, MMMM DD, HH:mm a"
                                          )}{" "}
                                        </h1>

                                        <span className="group-hover:text-white text-lg text-greenbg">
                                          {items.quiteModeOn ? (
                                            <IoMdMicOff />
                                          ) : null}
                                          {items.taskType === "deskEvent" ? (
                                            <LuLampDesk />
                                          ) : items.taskType ===
                                            "movingEvent" ? (
                                            <FaPersonWalking />
                                          ) : (
                                            <IoShuffle />
                                          )}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                ))
                            )}
                          </div>
                        ))}
                  </div>
                ))}
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {fail ? <ErrorTextToast text={"Something went wrong."} /> : null}
{success ? <SuccessToast text={"Session locked."} /> : null}
    </>
  );
}
