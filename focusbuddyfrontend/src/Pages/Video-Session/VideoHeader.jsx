import { FaStar } from "react-icons/fa";
import { MdMissedVideoCall } from "react-icons/md";
import { MdLiveHelp } from "react-icons/md";
import { Tooltip } from "flowbite-react";
import { useState, useEffect, useContext, useRef } from "react";
import { myContext } from "../../utils/PrivateRoutes";
import ErrorTextToast from "../../Components/UI/toast-components/ErrorTextToast";
import SuccessToast from "../../Components/UI/toast-components/SuccessToast";
import { Link } from "react-router-dom";
import sendReport from "../../utils/SendRport/sendReport";
import { useCallStateHooks } from "@stream-io/video-react-sdk";
import moment from "moment";
import { MdTimer } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { initFlowbite } from "flowbite";

export default function VideoHeader({ availableEvents, call }) {
  // console.log(availableEvents[0])
  const [isInFav2, setIsInFav2] = useState(false);
  const navigate = useNavigate();
  const { appointments, userProfile, setUserProfile } = useContext(myContext);
  const [dropdown, setDropdown] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportSelect, setReportSelect] = useState("");
  const [reportText, setReportText] = useState("");
  const [sending, setSending] = useState(false);
  const [matchedUser, setMatchedUser] = useState([]);
  const [matchedUserEvent, setMatchedUserEvent] = useState([]);
  const [callSession, setCallSession] = useState(null);
  const didAlert = useRef(false);
  const [showAlert, setShowAlert] = useState(false);
  const apiCallMade = useRef(false);
  const [otherMissedStatus, setOtherMissedStatus] = useState(
    availableEvents[0].otherPersonMissedCall
  );
  const [participants, setParticipants] = useState(null);

  useEffect(() => {
    initFlowbite();
  }, []);

  const useSessionTimer = () => {
    const { useCallSession, useParticipantCount } = useCallStateHooks();
    const session = useCallSession();
    const participants = useParticipantCount();
    const [remainingMs, setRemainingMs] = useState(Number.NaN);
    // console.log(Date.now(),new Date(availableEvents[0].start).getTime());

    useEffect(() => {
      setCallSession(session); // Moved setCallSession here to avoid setting state during render
    }, [session]);

    useEffect(() => {
      setParticipants(participants);
    }, [participants]);

    //session.start_at time at which user join the call
    useEffect(() => {
      let handle;
      if (!session?.started_at) return;
      // const call_start = new Date(session.started_at).getTime();
      const call_start = new Date(availableEvents[0].start).getTime();
      // console.log(call_start);

      // const call_end = call_start.add(3180, "seconds");
      // const call_end = call_start + 3180 * 1000;
      const call_end = call_start + 3000000;
      // const call_end = call_start + 120000;
      // console.log(call_end);
      // const timerEndAt = new Date(session.timer_ends_at);
      // const timerEndAt = new Date(call_end.toISOString());
      // console.log("call_end",timerEndAt);
      if (Date.now() > call_start) {
        handle = setInterval(() => {
          const now = new Date();
          const remainingMs = +call_end - +now;
          setRemainingMs(remainingMs);
        }, 500);
      }
      return () => clearInterval(handle);
    }, [session]);

    return remainingMs;
  };

  // console.log("PARTICIPANT", participants);
  const useSessionTimerAlert = (remainingMs, threshold, onAlert) => {
    // console.log(remainingMs,threshold);
    useEffect(() => {
      if (!didAlert.current && remainingMs < threshold) {
        onAlert();
        didAlert.current = true;
      }
    }, [onAlert, remainingMs, threshold]);
  };

  const handleShowAlert = () => {
    if (participants < 2) {
      console.log("Show alert");
      setShowAlert(true);
    }

    if (
      apiCallMade.current === false &&
      otherMissedStatus === false &&
      participants < 2
    ) {
      apiCallMade.current = true; // Ensure API call is made only once
      console.log("notify");
      missedCall(); // Make the API call
    }
  };

  const missedCall = async () => {
    try {
      console.log("API call made");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_PRO_URL}/api/user/missedsession`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionDetails: callSession,
            meetInfo: availableEvents[0],
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      setOtherMissedStatus(data.missedStatus);
    } catch (error) {
      console.error("Error while handling missed session:", error);
    }
  };

  const SessionTimer = () => {
    const remainingMs = useSessionTimer();
    // console.log("remainingMs",remainingMs, Date.now());

    useSessionTimerAlert(remainingMs, 300 * 1000, handleShowAlert);
    // useSessionTimerAlert(remainingMs, 90 * 1000, handleShowAlert);
    // useSessionTimerAlert(remainingMs, 60 * 1000, storeCallID);

    useEffect(() => {
      if (remainingMs <= 0) {
        endCall();
      }
    }, [remainingMs]);

    const endCall = async () => {
      await call.endCall();
      // storeCallID();
      // moveEventToPast()
      navigate("/session-ended");
    };

    const end = Date.now() + remainingMs;
    // console.log(end, Date.now());
    const duration = moment.duration(end - Date.now());
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    return (
      <>
        <div className="session-timer">
          {Date.now() < new Date(availableEvents[0].start).getTime() ? (
            <p>{moment(availableEvents[0].start).format("hh:mm a")}</p>
          ) : (
            <p>
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </p>
          )}
        </div>
        <div
          id="VideoMessageModal"
          className={
            showAlert
              ? "flex  fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
              : "none"
          }
          style={showAlert ? { display: "flex" } : { display: "none" }}
        >
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow">
              <div className="p-4 md:p-10">
                <MdMissedVideoCall className="mb-4 text-7xl text-textcolor mx-auto" />
                <p className="text-2xl leading-9 text-center text-greenbg">
                  "Looks like your partner missed the meeting. No problem!{" "}
                </p>
                <p className="text-lg leading-8 xl:text-xl xl:leading-9 text-formgray text-center">
                  You can still utilize this time effectively. Feel free to
                  continue with your tasks. If necessary, you can always
                  schedule another meeting at your convenience. <br />
                  Keep up the great work!"
                </p>
              </div>
              <div className="p-4 md:p-5 border-t border-gray-200 rounded-b">
                <button
                  id="modalButton"
                  className="w-full bg-textcolor py-4 text-lg px-3.5 hover:bg-darkbrown text-white rounded-md transition-all duration-500 ease-in-out"
                  onClick={() => setShowAlert(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* {showAlert && (
          <div className="session-timer-alert">
            Less than 5 minutes remaining
            <button
              type="button"
              onClick={() => {
                setShowAlert(false);
                localStorage.setItem("alertDismissed", "true");
              }}
            >
              Dismiss
            </button>
          </div>
        )} */}
      </>
    );
  };

  useEffect(() => {
    const fetchOtherUserEvent = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_PRO_URL
          }/api/events/getMatchedUserEvent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              callid: availableEvents[0].callID,
              matchedUserName: availableEvents[0].matchedPersonFullName,
            }),
          }
        );
        const data = await response.json();
        console.log(data);
        setMatchedUserEvent(data.event);
      } catch (err) {
        console.log(err);
        throw new Error("Error while fetching matched user details.");
      }
    };
    fetchOtherUserEvent();
  }, []);

  useEffect(() => {
    const fetchMatchUserDetails = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_PRO_URL
          }/api/user/getUserDetails?name=${
            availableEvents[0].matchedPersonFullName
          }`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        console.log(data);
        setMatchedUser(data.user);
      } catch (err) {
        console.log(err);
        throw new Error("Error while fetching matched user details.");
      }
    };
    fetchMatchUserDetails();
  }, []);

  useEffect(() => {
    const checkFavorite = () => {
      const isFavorite = userProfile.favorites.some(
        (fav) => fav.name === availableEvents[0].matchedPersonFullName
      );
      setIsInFav2(isFavorite);
    };
    if (availableEvents) {
      checkFavorite();
    }
  }, [availableEvents[0].name, userProfile.favorites, appointments]);

  const handleReportModalSave = async (e) => {
    setSending(true);
    e.preventDefault();
    const reportResponse = await sendReport(
      reportSelect,
      reportText,
      userProfile.email,
      null,
      availableEvents[0].matchedPersonFullName
    );
    if (reportResponse === 201) {
      setSending(false);
      setReportSuccess(true);
      setReportModal(false);
      setReportSelect("");
      setReportText("");
    } else if (reportResponse === 400) {
      setReportModal(false);
      throw new Error("Seems like one of field was empty.");
    } else {
      throw new Error("Error occur while reporting user.");
    }
  };

  if (reportSuccess) {
    setTimeout(() => {
      setReportSuccess(false);
    }, 1000);
  }

  const handleFavIconClick = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_PRO_URL}/api/user/` +
          (isInFav2 ? "removefavorites" : "addfavorites"),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userProfile.email,
            name: availableEvents[0].matchedPersonFullName,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update favorites");
      }

      const data = await response.json();
      setUserProfile(data.user); // Update profile state with modified favorites
      setIsInFav2(!isInFav2); // Toggle favClick state after successful update
      if (isInFav2) {
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
  console.log(matchedUser);

  return (
    <div className={'flex flex-col md:flex-row items-center justify-between gap-2 md:h-[5.4rem] w-full mb-4 md:mb-8 py-6 md:py-2 px-4 md:px-10 bg-[#19232D]'}>
      <div
        style={{ zIndex: 3000 }}
        className='flex gap-4 bg-white p-3 rounded-md'
      >
        {availableEvents[0].matchedPersonFullName !== "Matching..." && (
          <img
            className="w-9 h-9 rounded-full"
            src={availableEvents[0].matchedPersonProfilePic}
            alt=""
          />
        )}
        <div
          className={`flex ${
            availableEvents[0].matchedPersonFullName === "Matching..."
              ? "gap-2 px-2 md:gap-6 md:px-4 md:py-2"
              : "gap-2"
          } items-center text-[14px] lg:text-md xl:text-lg capitalize text-greenbg m-0`}
        >
          {availableEvents[0].matchedPersonFullName === "Matching..." ? (
            <>
              <span className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                  width={25}
                  height={25}
                  viewBox="0 0 256 256"
                  xmlSpace="preserve"
                >
                  <defs></defs>
                  <g
                    style={{
                      stroke: "none",
                      strokeWidth: 0,
                      strokeDasharray: "none",
                      strokeLinecap: "butt",
                      strokeLinejoin: "miter",
                      strokeMiterlimit: 10,
                      fill: "none",
                      fillRule: "nonzero",
                      opacity: 1,
                    }}
                    transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
                  >
                    <circle
                      cx={45}
                      cy={45}
                      r={43}
                      style={{
                        stroke: "none",
                        strokeWidth: 1,
                        strokeDasharray: "none",
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        fill: "rgb(239,193,0)",
                        fillRule: "nonzero",
                        opacity: 1,
                      }}
                      transform="  matrix(1 0 0 1 0 0) "
                    />
                    <path
                      d="M 45 90 C 20.187 90 0 69.813 0 45 C 0 20.187 20.187 0 45 0 c 24.813 0 45 20.187 45 45 C 90 69.813 69.813 90 45 90 z M 45 4 C 22.393 4 4 22.393 4 45 s 18.393 41 41 41 s 41 -18.393 41 -41 S 67.607 4 45 4 z"
                      style={{
                        stroke: "none",
                        strokeWidth: 1,
                        strokeDasharray: "none",
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        fill: "rgb(0,0,0)",
                        fillRule: "nonzero",
                        opacity: 1,
                      }}
                      transform=" matrix(1 0 0 1 0 0) "
                      strokeLinecap="round"
                    />
                    <path
                      d="M 57.433 70.102 H 32.567 c -1.104 0 -2 -0.896 -2 -2 s 0.896 -2 2 -2 h 24.865 c 1.104 0 2 0.896 2 2 S 58.537 70.102 57.433 70.102 z"
                      style={{
                        stroke: "none",
                        strokeWidth: 1,
                        strokeDasharray: "none",
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        fill: "rgb(0,0,0)",
                        fillRule: "nonzero",
                        opacity: 1,
                      }}
                      transform=" matrix(1 0 0 1 0 0) "
                      strokeLinecap="round"
                    />
                    <path
                      d="M 19 33.406 c 1.469 -0.623 2.741 -1.01 3.875 -1.463 c 1.136 -0.439 2.106 -0.9 3.011 -1.44 c 0.897 -0.553 1.757 -1.194 2.674 -1.994 c 0.929 -0.792 1.866 -1.735 3.107 -2.741 c 0.331 1.558 0.101 3.104 -0.531 4.546 c -0.636 1.432 -1.75 2.751 -3.185 3.614 c -1.436 0.862 -3.12 1.231 -4.683 1.125 C 21.697 34.938 20.225 34.421 19 33.406 z"
                      style={{
                        stroke: "none",
                        strokeWidth: 1,
                        strokeDasharray: "none",
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        fill: "rgb(0,0,0)",
                        fillRule: "nonzero",
                        opacity: 1,
                      }}
                      transform=" matrix(1 0 0 1 0 0) "
                      strokeLinecap="round"
                    />
                    <path
                      d="M 71 33.406 c -1.225 1.015 -2.697 1.532 -4.267 1.647 c -1.563 0.106 -3.248 -0.263 -4.683 -1.125 c -1.436 -0.863 -2.549 -2.181 -3.185 -3.614 c -0.632 -1.442 -0.862 -2.987 -0.531 -4.546 c 1.241 1.006 2.178 1.949 3.107 2.741 c 0.918 0.8 1.777 1.441 2.674 1.994 c 0.905 0.54 1.875 1.001 3.011 1.44 C 68.259 32.397 69.531 32.783 71 33.406 z"
                      style={{
                        stroke: "none",
                        strokeWidth: 1,
                        strokeDasharray: "none",
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        fill: "rgb(0,0,0)",
                        fillRule: "nonzero",
                        opacity: 1,
                      }}
                      transform=" matrix(1 0 0 1 0 0) "
                      strokeLinecap="round"
                    />
                    <circle
                      cx="30.133"
                      cy="44.323"
                      r="4.633"
                      style={{
                        stroke: "none",
                        strokeWidth: 1,
                        strokeDasharray: "none",
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        fill: "rgb(0,0,0)",
                        fillRule: "nonzero",
                        opacity: 1,
                      }}
                      transform="  matrix(1 0 0 1 0 0) "
                    />
                    <circle
                      cx="59.863"
                      cy="44.323"
                      r="4.633"
                      style={{
                        stroke: "none",
                        strokeWidth: 1,
                        strokeDasharray: "none",
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        fill: "rgb(0,0,0)",
                        fillRule: "nonzero",
                        opacity: 1,
                      }}
                      transform="  matrix(1 0 0 1 0 0) "
                    />
                  </g>
                </svg>
                Matched with no one
              </span>
              <span className="text-greenbg font-normal mx-1">|</span>
            </>
          ) : (
            <>
              {availableEvents[0].matchedPersonName}
              <span className="text-greenbg font-normal mx-1">|</span>
              <Tooltip
                content={
                  isInFav2 ? "Remove from favorites" : "Add to favorites"
                }
                className="w-46 text-center"
              >
                <FaStar
                  id="FaStartFavoriteIcon"
                  onClick={handleFavIconClick}
                  className="text-md md:text-xl  cursor-pointer"
                  style={
                    isInFav2 ? { color: "#008080" } : { color: "#6b72805c" }
                  }
                />
              </Tooltip>
              <span className="text-greenbg font-normal mx-1">|</span>{" "}
              {matchedUser[0]?.totalSessionsAttended}
              <span className="text-greenbg font-normal mx-1">|</span>
            </>
          )}

          <div
            id="videodropdownbutton"
            data-dropdown-toggle="videodropdown"
            className="flex font-medium items-center gap-2 cursor-pointer"
            type="button"
            // onClick={() => setDropdown(!dropdown)}
          >
            <span className="sr-only">Open user menu</span>
            <MdLiveHelp className="text-md md:text-xl cursor-pointer" /> Help
          </div>
          <div
            id="videodropdown"
            // className={
            //   dropdown
            //     ? "inline z-10 absolute top-20 bg-white divide-y divide-gray-100 rounded-md shadow w-50"
            //     : "hidden"
            // }
            className="z-10 hidden bg-white divide-y divide-gray-100 rounded-md shadow-lg w-50"
          >
            <ul
              className="py-2 text-xm xl:text-lg space-y-2 text-formgray"
              aria-labelledby="videodropdownbutton"
            >
              <li>
                <Link
                  to={"/community"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex  no-underline items-center gap-2 px-4 py-2 text-formgray hover:bg-greenbg hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    version="1.1"
                    width={30}
                    height={30}
                    viewBox="0 0 256 256"
                    xmlSpace="preserve"
                  >
                    <defs></defs>
                    <g
                      style={{
                        stroke: "none",
                        strokeWidth: 0,
                        strokeDasharray: "none",
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        fill: "none",
                        fillRule: "nonzero",
                        opacity: 1,
                      }}
                      transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
                    >
                      <rect
                        x="6.77"
                        y="16.48"
                        rx={0}
                        ry={0}
                        width="77.37"
                        height="49.46"
                        style={{
                          stroke: "none",
                          strokeWidth: 1,
                          strokeDasharray: "none",
                          strokeLinecap: "butt",
                          strokeLinejoin: "miter",
                          strokeMiterlimit: 10,
                          fill: "rgb(152,192,229)",
                          fillRule: "nonzero",
                          opacity: 1,
                        }}
                        transform=" matrix(1 0 0 1 0 0) "
                      />
                      <path
                        d="M 85.623 18.117 c 0 -1.852 -1.501 -3.353 -3.353 -3.353 H 7.73 c -1.852 0 -3.353 1.501 -3.353 3.353 v 49.247 h 81.246 V 18.117 z M 82.541 64.282 H 7.459 V 18.117 c 0 -0.149 0.121 -0.27 0.27 -0.27 H 82.27 c 0.149 0 0.27 0.121 0.27 0.27 V 64.282 z"
                        style={{
                          stroke: "none",
                          strokeWidth: 1,
                          strokeDasharray: "none",
                          strokeLinecap: "butt",
                          strokeLinejoin: "miter",
                          strokeMiterlimit: 10,
                          fill: "rgb(49,68,88)",
                          fillRule: "nonzero",
                          opacity: 1,
                        }}
                        transform=" matrix(1 0 0 1 0 0) "
                        strokeLinecap="round"
                      />
                      <path
                        d="M 86.586 70.107 C 86.586 70.107 86.586 70.107 86.586 70.107 l -83.172 0 c 0 0 0 0 0 0 H 0 c 0 2.828 2.3 5.128 5.128 5.128 h 79.744 c 2.828 0 5.128 -2.301 5.128 -5.128 H 86.586 z"
                        style={{
                          stroke: "none",
                          strokeWidth: 1,
                          strokeDasharray: "none",
                          strokeLinecap: "butt",
                          strokeLinejoin: "miter",
                          strokeMiterlimit: 10,
                          fill: "rgb(49,68,88)",
                          fillRule: "nonzero",
                          opacity: 1,
                        }}
                        transform=" matrix(1 0 0 1 0 0) "
                        strokeLinecap="round"
                      />
                    </g>
                  </svg>
                  Review Session Guidelines
                </Link>
              </li>
              {availableEvents[0].matchedPersonFullName ===
              "Matching..." ? null : (
                <li>
                  <div
                    onClick={() => setReportModal(true)}
                    className="flex cursor-pointer items-center gap-2 px-4  py-2 hover:bg-greenbg hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      version="1.1"
                      width={30}
                      height={30}
                      viewBox="0 0 256 256"
                      xmlSpace="preserve"
                    >
                      <defs></defs>
                      <g
                        style={{
                          stroke: "none",
                          strokeWidth: 0,
                          strokeDasharray: "none",
                          strokeLinecap: "butt",
                          strokeLinejoin: "miter",
                          strokeMiterlimit: 10,
                          fill: "none",
                          fillRule: "nonzero",
                          opacity: 1,
                        }}
                        transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
                      >
                        <path
                          d="M 50.619 30.076 C 39.471 32.628 27.781 42.6 27.781 54.522 l 3.371 18.432 h 38.934 V 54.522 C 70.086 42.6 61.766 32.628 50.619 30.076 z"
                          style={{
                            stroke: "none",
                            strokeWidth: 1,
                            strokeDasharray: "none",
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 10,
                            fill: "rgb(251,66,57)",
                            fillRule: "nonzero",
                            opacity: 1,
                          }}
                          transform=" matrix(1 0 0 1 0 0) "
                          strokeLinecap="round"
                        />
                        <path
                          d="M 50.619 30.076 c -1.807 -0.414 -3.686 -0.64 -5.619 -0.64 c -13.854 0 -25.086 11.231 -25.086 25.086 v 18.432 h 11.237 V 54.522 C 31.152 42.6 39.471 32.628 50.619 30.076 z"
                          style={{
                            stroke: "none",
                            strokeWidth: 1,
                            strokeDasharray: "none",
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 10,
                            fill: "rgb(226,23,23)",
                            fillRule: "nonzero",
                            opacity: 1,
                          }}
                          transform=" matrix(1 0 0 1 0 0) "
                          strokeLinecap="round"
                        />
                        <path
                          d="M 73.61 72.954 H 28.824 v 13.916 h 48.618 V 76.786 C 77.442 74.669 75.727 72.954 73.61 72.954 z"
                          style={{
                            stroke: "none",
                            strokeWidth: 1,
                            strokeDasharray: "none",
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 10,
                            fill: "rgb(202,237,255)",
                            fillRule: "nonzero",
                            opacity: 1,
                          }}
                          transform=" matrix(1 0 0 1 0 0) "
                          strokeLinecap="round"
                        />
                        <path
                          d="M 31.072 78.637 v -5.683 H 16.39 c -2.116 0 -3.832 1.716 -3.832 3.832 v 8.382 c 0 2.116 1.716 3.832 3.832 3.832 h 57.22 c 2.116 0 3.832 -1.716 3.832 -3.832 v -0.546 H 37.057 C 33.752 84.622 31.072 81.942 31.072 78.637 z"
                          style={{
                            stroke: "none",
                            strokeWidth: 1,
                            strokeDasharray: "none",
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 10,
                            fill: "rgb(118,194,224)",
                            fillRule: "nonzero",
                            opacity: 1,
                          }}
                          transform=" matrix(1 0 0 1 0 0) "
                          strokeLinecap="round"
                        />
                        <path
                          d="M 70.086 73.954 H 19.915 c -0.552 0 -1 -0.447 -1 -1 V 54.521 c 0 -14.384 11.702 -26.085 26.085 -26.085 s 26.086 11.702 26.086 26.085 v 18.433 C 71.086 73.507 70.639 73.954 70.086 73.954 z M 20.915 71.954 h 48.171 V 54.521 c 0 -13.281 -10.805 -24.085 -24.086 -24.085 c -13.281 0 -24.085 10.805 -24.085 24.085 V 71.954 z"
                          style={{
                            stroke: "none",
                            strokeWidth: 1,
                            strokeDasharray: "none",
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 10,
                            fill: "rgb(0,0,0)",
                            fillRule: "nonzero",
                            opacity: 1,
                          }}
                          transform=" matrix(1 0 0 1 0 0) "
                          strokeLinecap="round"
                        />
                        <path
                          d="M 73.61 90 H 16.39 c -2.665 0 -4.833 -2.168 -4.833 -4.832 v -8.382 c 0 -2.664 2.168 -4.832 4.833 -4.832 h 57.22 c 2.664 0 4.832 2.168 4.832 4.832 v 8.382 C 78.442 87.832 76.274 90 73.61 90 z M 16.39 73.954 c -1.562 0 -2.833 1.271 -2.833 2.832 v 8.382 c 0 1.562 1.271 2.832 2.833 2.832 h 57.22 c 1.562 0 2.832 -1.271 2.832 -2.832 v -8.382 c 0 -1.562 -1.271 -2.832 -2.832 -2.832 H 16.39 z"
                          style={{
                            stroke: "none",
                            strokeWidth: 1,
                            strokeDasharray: "none",
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 10,
                            fill: "rgb(0,0,0)",
                            fillRule: "nonzero",
                            opacity: 1,
                          }}
                          transform=" matrix(1 0 0 1 0 0) "
                          strokeLinecap="round"
                        />
                        <path
                          d="M 45 16.246 c -0.552 0 -1 -0.448 -1 -1 V 1 c 0 -0.552 0.448 -1 1 -1 s 1 0.448 1 1 v 14.246 C 46 15.798 45.552 16.246 45 16.246 z"
                          style={{
                            stroke: "none",
                            strokeWidth: 1,
                            strokeDasharray: "none",
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 10,
                            fill: "rgb(0,0,0)",
                            fillRule: "nonzero",
                            opacity: 1,
                          }}
                          transform=" matrix(1 0 0 1 0 0) "
                          strokeLinecap="round"
                        />
                        <path
                          d="M 20.111 26.555 c -0.256 0 -0.512 -0.098 -0.707 -0.293 L 9.331 16.189 c -0.391 -0.391 -0.391 -1.023 0 -1.414 s 1.023 -0.391 1.414 0 l 10.073 10.073 c 0.391 0.391 0.391 1.023 0 1.414 C 20.623 26.458 20.367 26.555 20.111 26.555 z"
                          style={{
                            stroke: "none",
                            strokeWidth: 1,
                            strokeDasharray: "none",
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 10,
                            fill: "rgb(0,0,0)",
                            fillRule: "nonzero",
                            opacity: 1,
                          }}
                          transform=" matrix(1 0 0 1 0 0) "
                          strokeLinecap="round"
                        />
                        <path
                          d="M 69.889 26.555 c -0.256 0 -0.512 -0.098 -0.707 -0.293 c -0.391 -0.391 -0.391 -1.023 0 -1.414 l 10.073 -10.073 c 0.391 -0.391 1.023 -0.391 1.414 0 s 0.391 1.023 0 1.414 L 70.596 26.262 C 70.4 26.458 70.145 26.555 69.889 26.555 z"
                          style={{
                            stroke: "none",
                            strokeWidth: 1,
                            strokeDasharray: "none",
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 10,
                            fill: "rgb(0,0,0)",
                            fillRule: "nonzero",
                            opacity: 1,
                          }}
                          transform=" matrix(1 0 0 1 0 0) "
                          strokeLinecap="round"
                        />
                        <path
                          d="M 45 51.515 L 45 51.515 c -3.297 0 -5.969 2.673 -5.969 5.969 v 15.47 h 11.939 v -15.47 C 50.969 54.187 48.297 51.515 45 51.515 z"
                          style={{
                            stroke: "none",
                            strokeWidth: 1,
                            strokeDasharray: "none",
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 10,
                            fill: "rgb(254,192,7)",
                            fillRule: "nonzero",
                            opacity: 1,
                          }}
                          transform=" matrix(1 0 0 1 0 0) "
                          strokeLinecap="round"
                        />
                        <path
                          d="M 50.97 73.954 H 39.031 c -0.552 0 -1 -0.447 -1 -1 v -15.47 c 0 -3.843 3.126 -6.97 6.969 -6.97 s 6.97 3.127 6.97 6.97 v 15.47 C 51.97 73.507 51.522 73.954 50.97 73.954 z M 40.031 71.954 h 9.939 v -14.47 c 0 -2.74 -2.229 -4.97 -4.97 -4.97 s -4.969 2.229 -4.969 4.97 V 71.954 z"
                          style={{
                            stroke: "none",
                            strokeWidth: 1,
                            strokeDasharray: "none",
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 10,
                            fill: "rgb(0,0,0)",
                            fillRule: "nonzero",
                            opacity: 1,
                          }}
                          transform=" matrix(1 0 0 1 0 0) "
                          strokeLinecap="round"
                        />
                      </g>
                    </svg>
                    Report {availableEvents[0].matchedPersonFullName}
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div
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
            <div className="p-6 md:p-10">
              <h1 className="text-3xl md:text-4xl font-medium text-greenbg ">
                Report{" "}
                <span className="capitalize text-textcolor">
                  {availableEvents[0].matchedPersonName}
                </span>
              </h1>
              <div className="mt-8 text-formgray text-md xl:text-lg space-y-3">
                <p>
                  Thank you for helping us keep FocusBuddy safe and productive!
                </p>
                <p>
                  We will review your report and take action within 48 hours.
                  Your report is completely confidential.
                </p>
                <p>
                  Select the option that best describes how violated our
                  Community Guidelines.
                </p>
              </div>
              <form
                className="mt-6 w-full mx-auto space-y-6"
                onSubmit={handleReportModalSave}
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
                  <option value="Offensice Profile">Offensive Profile</option>
                  <option value="Misconduct/Other">Misconduct/Other</option>
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
                    className="w-full bg-textcolor py-3 text-md xl:text-lg px-3 hover:bg-darkbrown text-white rounded-md transition-all duration-500 ease-in-out"
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
      </div>

      <div
        id="session-timer"
        className='flex gap-2 px-10 bg-white py-4 rounded-md text-md xl:text-lg text-greenbg'
        // className={`${
        //   window.screen.width < 676
        //     ? "static w-full flex items-center justify-center py-3"
        //     : "fixed top-3 right-10"
        // } flex gap-2 px-10 bg-white py-4 rounded-md text-md xl:text-lg text-greenbg`}
      >
        <MdTimer className="my-auto text-xl md:text-3xl" />{" "}
        {Date.now() < new Date(availableEvents[0].start).getTime()
          ? "Starts at:"
          : "Ends in:"}
        <SessionTimer />
      </div>

      {fail ? <ErrorTextToast text={"Removed from favorites."} /> : null}
      {success ? <SuccessToast text={"Added to favorites."} /> : null}
      {reportSuccess ? <SuccessToast text={"Report request saved!."} /> : null}
    </div>
  );
}
