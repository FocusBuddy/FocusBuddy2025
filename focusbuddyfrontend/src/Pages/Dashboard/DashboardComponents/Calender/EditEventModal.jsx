import { Tooltip, Label } from "flowbite-react";
import { LuLampDesk } from "react-icons/lu";
import { FaPersonWalking } from "react-icons/fa6";
import { IoShuffle } from "react-icons/io5";
import { useContext } from "react";
import { IoStar } from "react-icons/io5";
import { FaGlobeAmericas } from "react-icons/fa";
import moment from "moment";
import { myContext } from "../../../../utils/PrivateRoutes";

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

export default function EditEventModal({
  openEditModal,
  setOpenEditModal,
  eventToEdit,
}) {
  const {
    // activeEventTab,
    setShowEditMsg,
    activePartnerTab,
    quiteMode,setQuiteMode,
    setActivePartnerTab,
    // setActiveEventTab,
  } = useContext(myContext);

  // console.log('eventtoedit',eventToEdit);

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

  // console.log('editeventmodal-',quiteMode);

  const handleToggleChange = () => {
    // console.log('togglechange')
    setQuiteMode(!quiteMode)
  }


  const handleEditModalClose = () => {
    setOpenEditModal(false);
  };
  
  const handleEditModalSave = (e) => {
    e.preventDefault();
    setOpenEditModal(false);
    const editEvent = async () => {
      try{
        const response = await fetch(`${import.meta.env.VITE_BACKEND_PRO_URL}/api/events/editsession`,{
          method: 'PUT',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({eventid:eventToEdit[0].myID, partner: activePartnerTab, quite: quiteMode})
        })
        const data = await response.json();
        // console.log(data);
        setShowEditMsg(true);
      }catch(err){
        console.log(err);
        throw new Error('Error while editing session');
      }
    }
    editEvent();

    // setActiveEventTab('deskEvent');
    setActivePartnerTab('anyonePartner');
    setQuiteMode(false);
  };

  return (
    <>
      <div
      style={{ zIndex: 10000 }}
        className={
          openEditModal
            ? "flex bg-[#00000047]  fixed top-0 right-0 left-0 z-[1000] justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full"
            : "none"
        }
      >
        <div className="relative p-4 w-full max-w-xl max-h-full">
          <div className="relative bg-white rounded-lg shadow pt-20 pb-24 px-6 lg:px-12">
            <button type="button" className="absolute top-5 right-5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            onClick={handleEditModalClose}
            >
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>

            </button>
            <h3 className="text-2xl md:text-3xl font-bold mb-10 text-center text-greenbg">
              Editing session
            </h3>

            <div className="flex gap-2">
              <div className="w-[37%] md:w-[33.33%]">
                <p className=" text-black font-normal">Date</p>
                <h2 className="text-[13px] text-greenbg border border-fromgray mt-2 p-2">
                  {moment(eventToEdit[0].start).format("MMM Do, YYYY")}
                </h2>
              </div>
              <div className="w-[30%] md:w-[33.33%]">
                <p className=" text-black font-normal">Time</p>
                <h2 className="text-[13px] text-greenbg border border-fromgray mt-2 p-2">
                  {moment(eventToEdit[0].start).format("hh:mm a")}
                </h2>
              </div>
              <div className="w-[30%] md:w-[33.33%]">
                <p className=" text-black font-normal">Duration</p>
                <h2 className="text-[13px] text-greenbg border border-fromgray mt-2 p-2">
                  {eventToEdit[0].duration}
                </h2>
              </div>
            </div>
            {/* <div className="my-6 w-full">
              <div className="mb-1 block">
                <Label
                  htmlFor="taskType"
                  value="My Task"
                  className=" font-normal"
                />
              </div>
              <div className="flex gap-2 formTabs">
                <div className="w-[33.33%]">
                  <Tooltip content="For writing, emails, coding and more.">
                    <button
                      type="button"
                      className="w-full flex justify-center gap-2 bg-[#F9FAFB] text-[13px] border-2 border-greenbg py-2 px-8 text-formgray"
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
                  <Tooltip content="For workouts, chores and active tasks.">
                    <button
                      type="button"
                      className="w-full flex justify-center gap-2 bg-[#F9FAFB] text-[13px] border-2 border-greenbg py-2 px-6 text-formgray"
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
                  <Tooltip content="When you are juggling various tasks or still deciding.">
                    <button
                      type="button"
                      className="w-full flex justify-center gap-2 bg-[#F9FAFB] text-[13px] border-2 border-greenbg py-2 px-6 text-center text-formgray"
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

            <div className="w-full flex gap-2">
              <div className="w-[78%] flex flex-col">
                <div className="mb-1 block">
                  <Label
                    htmlFor="partnerType"
                    value="Partner"
                    className="text-md font-normal"
                  />
                </div>

                <div className="flex flex-col lg:flex-row gap-2 formTabs">
                  <div className="w-full lg:w-[55%]">
                    <Tooltip content="Matches you with your Favorite partners whenever they are available">
                      <button
                        type="button"
                        className="w-full flex justify-center gap-2 text-[13px] border-2 border-greenbg py-2 px-4 text-formgray"
                        style={
                          activePartnerTab === "favoritePartner"
                            ? tabSelected
                            : tabNotSelected
                        }
                        onClick={() => handleTabSetting("favoritePartner")}
                      >
                        <IoStar
                          style={{ fontSize: "18px", marginBottom: "5px" }}
                        />
                        Prefer Favorites
                      </button>
                    </Tooltip>
                  </div>
                  <div className="w-full lg:w-[45%]">
                    <Tooltip content="Matches you with the first available person">
                      <button
                        type="button"
                        className="w-full flex justify-center gap-2 text-[13px] border-2 border-greenbg py-2 px-6  text-formgray"
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

              <div className="w-[22%] flex flex-col gap-2">
                <label className="inline-flex flex-col gap-3 items-center cursor-pointer">
                  <span className="ms-3 text-sm text-black font-normal">
                    Quiet Mode
                  </span>
                  <input onChange={handleToggleChange} type="checkbox" value="" className="sr-only peer" checked={quiteMode}/>
                  <div className="relative w-12 h-7 bg-gray-200 border-2 border-greenbg peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-greenbg"></div>
                </label>
              </div>
            </div>

            <div className="mt-10">
              <button
                type="submit"
                className="w-full bg-textcolor py-4  px-3.5 hover:bg-darkbrown text-white text-[15px] lg:text-lg transition-all duration-500 ease-in-out"
                onClick={handleEditModalSave}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
