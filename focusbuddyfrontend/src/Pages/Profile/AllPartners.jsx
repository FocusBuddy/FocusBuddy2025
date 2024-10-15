import { useContext, useEffect, useState } from "react";
import DashboardInnerNav from "../../Components/navbar/DashboardInnerNav";
import { myContext } from "../../utils/PrivateRoutes";
import { Link } from "react-router-dom";
import { initFlowbite } from "flowbite";
import ReportModal from "../../Components/UI/ReportModal/ReportModal";
import { FaStar } from "react-icons/fa";
import { Tooltip } from "flowbite-react";
import ErrorTextToast from "../../Components/UI/toast-components/ErrorTextToast";
import SuccessToast from "../../Components/UI/toast-components/SuccessToast";
import { FaLink } from "react-icons/fa6";
import { MdReportProblem } from "react-icons/md";

export default function AllPartners() {
  const { appointments, userProfile,setUserProfile, profile, setProfile } =
    useContext(myContext);
  const [dropdown, setDropdown] = useState();
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  const [favClick, setFavClick] = useState(() => {
    const initialFavClick = {};
    userProfile.favorites.forEach((fav) => {
      initialFavClick[fav.name] = true;
    });
    return initialFavClick;
  });
  console.log(favClick);
  const [reportModal, setReportModal] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const [reportSelect, setReportSelect] = useState("");
  const [reportText, setReportText] = useState("");
  const [sending, setSending] = useState(false);
  const [allPastSessions, setAllPastSessions] = useState([]);
  const [reportWho,setReportWho] = useState('');
  console.log(appointments);

  useEffect(() => {
    initFlowbite();
  }, []);


  const handleFavIconClick = async (name) => {
    console.log(name);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_PRO_URL}/api/user/` +
          (favClick[name] ? "removefavorites" : "addfavorites"),
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
      console.log(data)
      setProfile(data.user); // Update profile state with modified favorites
      setFavClick((prev) => ({ ...prev, [name]: !prev[name] }));  // Toggle favClick state after successful update
      if (favClick[name]) {
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

  const handleReport = async (name) => {
    setReportModal(true);
    setReportWho(name);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_PRO_URL
          }/api/events/getpastevents?thisPerson=${userProfile.displayName}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        console.log(data); // Handle the fetched data as required
        const uniqueSessions = data.events.filter((session, index, self) =>
          index === self.findIndex((s) => s.matchedPersonFullName === session.matchedPersonFullName)
        );
        const finalEvents = uniqueSessions.filter((session) => session.matchedPersonFullName !== 'Matching...');
        console.log("uniqueSessions",uniqueSessions);
        console.log("uniqueSessions",finalEvents);

        setAllPastSessions(finalEvents);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (reportSuccess) {
    setTimeout(() => {
      setReportSuccess(false);
    }, 1000);
  }

  return (
    <>
      <DashboardInnerNav />

      <div className="max-w-screen-md min-h-screen mx-auto pt-16">
        <div className="bg-greenbg text-4xl text-center py-6 rounded-t-md text-white ">
          All Partners
        </div>
        <div className="bg-white p-10">
          {allPastSessions.length === 0 && (
            <div className="bg-bordercolor py-4 rounded-md">
              <p className="text-md xl:text-lg font-medium text-textcolor text-center">
                No past sessions
              </p>
            </div>
          )}
          {allPastSessions.map((allpartner) => (
            <div key={allpartner.matchedPersonFullName}>
              <div className="mt-6 flex">
                <div className=" flex gap-4 basis-1/2">
                  <div className="relative">
                    <img
                      className="w-14 h-14 border-2 border-greenbg rounded-full"
                      src={allpartner.matchPersonProfilePic}
                      alt="profile pic"
                      loading="lazy"
                    />
                    {favClick[allpartner.matchedPersonFullName] ? (
                      <div
                        className="absolute -bottom-0.5 -right-0.5 p-1 bg-greenbg rounded-full"
                        style={{ zIndex: 2002 }}
                      >
                        <FaStar className="text-[18px] text-white" />
                      </div>
                    ) : null}
                  </div>

                  <div className="flex items-center">
                    <h2 className="text-xl">{allpartner.matchedPersonName}</h2>
                  </div>
                </div>
                <div className="flex relative gap-6 basis-1/2 justify-end items-center">
                  <Tooltip content={
                      favClick[allpartner.matchedPersonFullName] ? "Remove from favorites" : "Add to favorites"
                    } className="w-44 text-center">
                      <FaStar
                        className="text-2xl cursor-pointer"
                        onClick={() => handleFavIconClick(allpartner.matchedPersonFullName)}
                        style={
                          favClick[allpartner.matchedPersonFullName] ? { color: "#008080" } : { color: "#6B7280" }
                        }
                      />
                  </Tooltip>
                  <div>
                    <Tooltip  className="w-44 text-center" content={"View profile"}>

                     <Link to={allpartner.matchedPersonProfileLink} target="_blank"><FaLink className="text-2xl cursor-pointer text-[#6B7280]"/></Link>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip  className="w-44 text-center" content={"Report user"}>

                     <Link onClick={() => handleReport(allpartner.matchedPersonName)}><MdReportProblem className="text-2xl cursor-pointer text-[#6B7280]"/></Link>
                    </Tooltip>
                  </div>
                </div>
              </div>

              {reportModal ? (
                <ReportModal
                  setReportModal={setReportModal}
                  name={reportWho}
                  email={allpartner.matchedPersonFullName}
                  setReportSelect={setReportSelect}
                  setReportText={setReportText}
                  sending={sending}
                  setSending={setSending}
                  reportSelect={reportSelect}
                  reportText={reportText}
                />
              ) : null}
            </div>
          ))}
        </div>
        {fail ? <ErrorTextToast text={"Removed from favorite."} /> : null}
        {success ? <SuccessToast text={"Added to favorite"} /> : null}
      </div>
    </>
  );
}
