import { useContext, useEffect, useState } from "react";
import DashboardInnerNav from "../../Components/navbar/DashboardInnerNav";
import { useParams } from "react-router-dom";
import { myContext } from "../../utils/PrivateRoutes";
import { FaStar } from "react-icons/fa6";
import { LuLampDesk } from "react-icons/lu";
import { FaPersonWalking } from "react-icons/fa6";
import { IoShuffle } from "react-icons/io5";
import { BsInfoCircle } from "react-icons/bs";
import { Tooltip } from "flowbite-react";
import { IoMdMicOff } from "react-icons/io";
import AvailabilitySessions from "../../Components/UI/AvailabilitySessions/AvailabilitySessions";

export default function AvailabilityCheck() {
  const { name } = useParams();
  const {
    userProfile,
    appointments,
    // activeEventTab,
    quiteMode,
    setQuiteMode,
    // setActiveEventTab,
    handleTabSetting,
    handleToggleChange,
  } = useContext(myContext);
  // console.log(activeEventTab);
  // console.log(userProfile);
  const [favImg, setFavImg] = useState();
  const [favEvents, setFavEvents] = useState([]);

  // console.log(activeEventTab);
  const handleTabClick = (tab) => {
    setActiveDurationTab(tab);
  };

  // const handleToggleChange = () => {
  //   setQuiteMode(!quiteMode)
  // }

  // console.log("quitemode", quiteMode);

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


  useEffect(() => {
    setFavEvents(
      appointments.filter(
        (session) => session.fullName === name.split("-").join(" ")
      )
    );
    // console.log(allsessions);

    let filteredUser = userProfile.favorites.filter(
      (fav) => fav.name === name.split("-").join(" ")
    );
    // console.log(filteredUser);
    setFavImg(filteredUser[0].link);
  }, []);


  return (
    <>
      <DashboardInnerNav />
      <div className="flex max-w-screen-md min-h-screen mx-auto pt-10">
        <div className="relative w-[10%] z-20">
          <div className="fixed space-y-4">
            {/* <div className="flex cursor-pointer justify-center">
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
            </Tooltip> */}

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
              <div className="relative">
                <img
                  className="w-16 h-16"
                  src={favImg}
                  alt="user profile photo"
                  loading="lazy"
                />
                <div
                  className="absolute bottom-1 right-1 p-1 bg-white rounded-full"
                  style={{ zIndex: 2002 }}
                >
                  <FaStar className="text-[13px] text-greenbg" />
                </div>
              </div>

              <h1 className="text-3xl text-white">
                {name.split("-").join(" ")}
              </h1>
            </div>
            <div className="basis-1/2"></div> {/* Reload buttin*/}
          </div>
          <div className="bg-white p-10 h-screen">
            <div className="flex justify-center mt-10">
            <AvailabilitySessions
                    favEvents={favEvents}
                    // activeEventTab={activeEventTab}
                    quiteMode={quiteMode}
                  />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
