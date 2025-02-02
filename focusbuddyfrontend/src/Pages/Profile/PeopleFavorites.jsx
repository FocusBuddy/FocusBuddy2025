import { FaStar } from "react-icons/fa";
import DashboardInnerNav from "../../Components/navbar/DashboardInnerNav";
import { myContext } from "../../utils/PrivateRoutes";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "flowbite-react";
import SuccessToast from "../../Components/UI/toast-components/SuccessToast";
import ErrorTextToast from "../../Components/UI/toast-components/ErrorTextToast";
import ReportModal from "../../Components/UI/ReportModal/ReportModal";
import {initFlowbite} from 'flowbite'


export default function PeopleFavorites() {
  const { userProfile, profile, setProfile } = useContext(myContext);
  // console.log(userProfile);
  const [favClick, setFavClick] = useState(() => {
    const initialFavClick = {};
    userProfile.favorites.forEach((fav) => {
      initialFavClick[fav.email] = true;
    });
    return initialFavClick;
  });
  // const [dropdown, setDropdown] = useState({});
  const [success, setSuccess] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [reportSelect, setReportSelect] = useState("");
  const [reportText, setReportText] = useState("");
  const [sending, setSending] = useState(false);


  useEffect(() => {
    initFlowbite();
  },[]);
  // const toggleDropdown = (id) => {
  //   setDropdown((prev) => ({
  //     ...prev,
  //     [id]: !prev[id],
  //   }));
  // };

  const handleFavIconClick = async (name, email) => {
    // console.log(name, email);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_PRO_URL}/api/user/removefavorites`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userProfile.email, name: name }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update favorites");
      }

      const data = await response.json();
      // console.log(data);
      setProfile(data.user); // Update profile state with modified favorites
      setFavClick((prev) => ({ ...prev, [email]: !prev[email] })); // Toggle favClick state after successful update
      if (favClick) {
        setFail(true);
        setTimeout(() => {
          setFail(false);
        }, 500);
      } else {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 500);
      }
    } catch (err) {
      console.error(err);
      throw new Error("Error in favorites.");
      // Handle error (e.g., show error message to the user)
    }
  };

  // const handleReportModalSave = async (e, email,name) => {
  //   setSending(true);
  //   e.preventDefault();
  //     const reportResponse = await sendReport(reportSelect,reportText,userProfile.email,email,name);
  //     if (reportResponse === 200) {
  //       setSending(false);
  //       setReportSuccess(true);
  //       setReportModal(false);
  //       setReportSelect("");
  //       setReportText("");
  //     } else if (reportResponse === 400) {
  //       setReportModal(false);
  //       throw new Error("Seems like one of field was empty.");
  //     }else{
  //       throw new Error("Error occur while reporting user.");
  //     }
  // };

  if (reportSuccess) {
    setTimeout(() => {
      setReportSuccess(false);
    }, 1000);
  }

  // console.log(favClick);
  return (
    <>
      <DashboardInnerNav />
      <div className="max-w-screen-md min-h-screen mx-auto pt-10 md:pt-16">
        <div className="bg-greenbg text-3xl lg:text-4xl text-center py-6 rounded-t-md text-white ">
          Favorites
        </div>
        <div className="bg-white p-6 lg:p-10">
          {userProfile.favorites.length === 0 &&
          <div className="bg-bordercolor py-4 rounded-md">
            <p className="text-md xl:text-lg font-medium text-textcolor text-center">No Favorites</p>
          </div>

        }
          {userProfile.favorites.map((fav) => (
            <div key={fav.email}>
              <div className="mt-6 flex">
                <div className=" flex gap-4 basis-1/2">
                  <div className="relative">
                    <img
                      className="w-14 h-14 border-2 border-greenbg rounded-full"
                      src={fav.link}
                      alt="profile pic"
                      loading="lazy"
                    />
                    {favClick[fav.email] ? (
                      <div
                        className="absolute -bottom-0.5 -right-0.5 p-1 bg-greenbg rounded-full"
                        style={{ zIndex: 2002 }}
                      >
                        <FaStar className="text-[18px] text-white" />
                      </div>
                    ) : null}
                  </div>

                  <div className="flex items-center">
                    <h2 className="text-lg lg:text-xl">{fav.name}</h2>
                  </div>
                </div>
                <div className="flex relative gap-2 basis-1/2 justify-end items-center">
                  <Tooltip content={"Remove from favorites"} className="w-44">
                    <FaStar
                      className="text-2xl lg:text-3xl cursor-pointer"
                      onClick={() => handleFavIconClick(fav.name, fav.email)}
                      style={
                        favClick[fav.email]
                          ? { color: "#008080" }
                          : { color: "#6B7280" }
                      }
                    />
                  </Tooltip>

                  <button
                    id={fav.email} 
                    data-dropdown-toggle={fav.email+'dropdown'}
                    data-dropdown-trigger="hover"
                    // onClick={() => toggleDropdown(fav.email)}
                    className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none  focus:ring-gray-50 "
                    type="button"
                  >
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 4 15"
                    >
                      <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                    </svg>
                  </button>

                  <div
                    id={fav.email+'dropdown'}
                    className={
                      //  "z-10 absolute top-0 right-10 lg:-right-44 bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
                        "z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
                    }
                  >
                    <ul
                    aria-labelledby={fav.email}
                      className="py-2 text-xm xl:text-lg space-y-2 text-formgray"
                    >
                      {
                        fav.availability === 'No one' ? 
                        <li className="bg-bordercolor">
                          <Tooltip content="They're currently not sharing their availability">
                        <Link
                        disabled
                          className="flex items-center  gap-2 px-4 py-2 opacity-60 cursor-not-allowed"
                        >
                          See availability
                        </Link>
                        </Tooltip>
                      </li>
                      : 
                      <li>
                        <Link
                          to={`/user/${(fav.name).split(' ').join('-')}/availability`}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-greenbg hover:text-white"
                        >
                          See availability
                        </Link>
                      </li>
                      }
                      
                      <li>
                        <Link
                          to={fav.plink}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-greenbg hover:text-white"
                        >
                          View profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={() => setReportModal(true)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-greenbg hover:text-white"
                        >
                          Report
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              { reportModal ? <ReportModal setReportModal={setReportModal} name={fav.name} email={fav.email} setReportSelect={setReportSelect} setReportText={setReportText} sending={sending} setSending={setSending} reportSelect={reportSelect} reportText={reportText}/> : null}

              {/* <div
                className={
                  reportModal
                    ? "flex  bg-[#00000047] fixed top-0 right-0 left-0 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
                    : "hidden"
                }
                style={{ zIndex: 10000 }}
                // style={zoomLoaded ? {display: 'flex'} : {display: 'none'}}
              >
                <div className="relative p-4 w-full max-w-2xl max-h-full">
                  <div className="relative bg-white rounded-lg shadow">
                    <button
                      type="button"
                      className="absolute top-5 right-5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                      onClick={() => setReportModal(false)}
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
                    <div className="p-4 md:p-10">
                      <h1 className="text-4xl font-medium text-greenbg ">
                        Report{" "}
                        <span className="capitalize text-textcolor">{fav.name}</span>
                      </h1>
                      <div className="mt-8 text-formgray text-md xl:text-lg space-y-3">
                        <p>
                          Thank you for helping us keep Focusmate safe and
                          productive!
                        </p>
                        <p>
                          We will review your report and take action within 48
                          hours. Your report is completely confidential.
                        </p>
                        <p>
                          Select the option that best describes how violated our
                          Community Guidelines.
                        </p>
                      </div>
                      <form
                        className="mt-6 w-full mx-auto space-y-6"
                        onSubmit={(e) => handleReportModalSave(e, fav.email,fav.name)}
                      >
                        <select
                          id="countries"
                          className="bg-gray-50 border border-formgray text-gray-900 text-md xl:text-lg rounded-lg focus:ring-greenbg focus:border-greenbg block w-full p-2.5 "
                          required
                          value={reportSelect}
                          onChange={(e) => setReportSelect(e.target.value)}
                        >
                          <option value={""} disabled>
                            Please choose a reason
                          </option>
                          <option value="Fake Profile">Fake Profile</option>
                          <option value="Offensice Profile">
                            Offensive Profile
                          </option>
                          <option value="Misconduct/Other">
                            Misconduct/Other
                          </option>
                        </select>

                        <textarea
                          id="message"
                          rows="4"
                          className="block p-2.5 w-full text-md xl:text-lg text-gray-900 bg-gray-50 rounded-lg border border-formgray focus:ring-greenbg focus:border-greenbg"
                          placeholder="Please describe your concern..."
                          value={reportText}
                          onChange={(e) => setReportText(e.target.value)}
                          required
                        ></textarea>

                        <div className="p-4 md:p-5 border-t border-gray-200 rounded-b">
                          <button
                            id="modalButton"
                            type="submit"
                            className="w-full bg-textcolor py-4 text-lg px-3.5 hover:bg-darkbrown text-white rounded-md transition-all duration-500 ease-in-out"
                          >
                            {sending ? (
                              <div className="flex justify-center gap-2 items-center">
                                <svg
                                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                Sending report
                              </div>
                            ) : (
                              "Report"
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          ))}
        </div>
      </div>

      {fail ? <ErrorTextToast text={"Removed from favorites."} /> : null}
      {success ? <SuccessToast text={"Added to favorites."} /> : null}
      {reportSuccess ? <SuccessToast text={"Report request saved!."} /> : null}

    </>
  );
}
