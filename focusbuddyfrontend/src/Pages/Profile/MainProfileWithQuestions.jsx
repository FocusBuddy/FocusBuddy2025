import { myContext } from "../../utils/PrivateRoutes";
import { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { Tooltip } from "flowbite-react";
import SuccessToast from "../../Components/UI/toast-components/SuccessToast";
import ErrorTextToast from "../../Components/UI/toast-components/ErrorTextToast";
import DashboardInnerNav from "../../Components/navbar/DashboardInnerNav";

let USERNAME;

const extractName = (str) => {
  const parts = str.split("-");
  parts.pop(); // Remove the last element which is the number
  return parts.join(" "); // Join the remaining parts with a space
};

export default function MainProfileWithQuestions() {
  const { userProfile, setUserProfile, setProfile, profile } =
    useContext(myContext);
  console.log(userProfile);
  const [otherUserProfile, setOtherUserProfile] = useState(null);
  console.log(otherUserProfile);
  // console.log(userProfile.favorites.some(user => user.name === USERNAME));
  const [noQuesAns, setNoQuesAns] = useState(false);
  const { name } = useParams();
  console.log(name);
  const [favClick, setFavClick] = useState(() => {
    USERNAME = extractName(name);
    return userProfile.favorites.some((user) => user.name === USERNAME);
  });
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);

  useEffect(() => {
    const getUserProfile = async () => {
      const url = `${import.meta.env.VITE_BACKEND_PRO_URL}/api/user/search?profileLink=${import.meta.env.VITE_FRONTEND_PRO_URL}/user/${name}`;
      try {
        const response = await fetch(url, {
          method: "GET",
        });

        const data = await response.json();
        console.log(data);
        setNoQuesAns(
          Object.values(data.user.userProfileQuestions).every(
            (value) => value === ""
          )
        );
        setOtherUserProfile(data.user);
      } catch (err) {
        console.log(err);
        throw new Error("Error in getting user profile.");
      }
    };

    getUserProfile();
  }, []);

  const handleFavIconClick = async () => {
    USERNAME = await extractName(name);
    console.log("USERNAME", USERNAME);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_PRO_URL}/api/user/` +
          (favClick ? "removefavorites" : "addfavorites"),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userProfile.email, name: USERNAME }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update favorites");
      }

      const data = await response.json();
      setUserProfile(data.user); // Update profile state with modified favorites
      setFavClick(!favClick); // Toggle favClick state after successful update
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

  console.log("favClick", favClick);

  return (
    <>
      <DashboardInnerNav />
      {otherUserProfile ? (
        <div className="py-10 md:px-6  max-w-screen-lg min-h-screen mx-auto">
          <div className="flex flex-col md:flex-row">
            <div className="flex flex-col w-full md:w-[40%] p-10 bg-greenbg rounded-t-lg md:rounded-s-lg shadow-2xl">
              <div className="relative">
                <img
                  className=" w-32 md:w-36 h-32 md:h-36 object-cover border-4 border-white rounded-full mx-auto"
                  src={otherUserProfile.profilePic}
                  alt="user photo"
                />
                {userProfile.email ===
                otherUserProfile.email ? null : userProfile.favorites.some(
                    (user) => user.name === otherUserProfile.displayName
                  ) ? (
                  <div className="absolute bottom-0 right-20 p-4 bg-white rounded-full">
                    <FaStar className="text-3xl text-greenbg" />
                  </div>
                ) : null}
              </div>

              <h1 className="capitalize text-2xl text-white font-medium text-center mt-6 mb-4">
                {otherUserProfile.displayName}
              </h1>
              <h1 className="text-white text-lg text-center my-1">
                {otherUserProfile.totalSessionsAttended} Sessions
              </h1>
              {/* <h1 className="flex items-center justify-center gap-2 my-1 text-white text-lg text-center">
                <FaMapMarkerAlt />
                {otherUserProfile.userLocation.region}/
                {otherUserProfile.userLocation.country}
              </h1> */}
              <h1 className="text-white text-lg text-center my-1">
                Member since:{" "}
                {moment(otherUserProfile.memberSince)
                  .utc()
                  .format("MMMM Do, YYYY")}
              </h1>
              {userProfile.email ===
              otherUserProfile.email ? null : userProfile.favorites.some(
                  (fav) => fav.name === otherUserProfile.displayName
                ) ? (
                otherUserProfile.availabilityStatus === "No one" ? (
                  <div className="mx-auto">
                    <Tooltip content="They're currently not sharing their availability">
                      <button
                        disabled
                        type="submit"
                        className="mt-4 cursor-not-allowed bg-bordercolor py-3 px-10 text-md text-formgray rounded-md border border-formgray"
                      >
                        See Availability
                      </button>
                    </Tooltip>
                  </div>
                ) : (
                  <Link
                    to={`/user/${otherUserProfile.displayName}-${otherUserProfile.familyName}/availability`}
                    type="submit"
                    className="mt-4 mx-auto w-[53%] bg-textcolor py-3 text-md px-3.5 text-white text-center rounded-md"
                  >
                    See Availability
                  </Link>
                )
              ) : null}
            </div>
            <div className="relative w-full md:w-[60%] bg-white p-6 md:p-10 rounded-b-lg md:rounded-e-lg">
              <div className="flex absolute right-5 top-5">
                <div>
                  <Tooltip
                    content={
                      favClick ? "Remove from favorites" : "Add to favorites"
                    }
                    className="w-44 text-center"
                  >
                    {userProfile.email === otherUserProfile.email ? null : (
                      <FaStar
                        className="text-2xl cursor-pointer"
                        onClick={handleFavIconClick}
                        style={
                          favClick ? { color: "#008080" } : { color: "#6B7280" }
                        }
                      />
                    )}
                  </Tooltip>
                </div>
                <div></div>
              </div>
              <div>
                {noQuesAns ? (
                  <h1 className="text-textcolor text-md xl:text-lg">
                    No profile questions answered.
                    </h1>
                ) : null}
                <h1 className="mb-4 md:mb-6 text-2xl text-greenbg font-medium">
                  {(otherUserProfile.userProfileQuestions["today-q1"] !== "" ||
                    otherUserProfile.userProfileQuestions["today-q2"] !== "" ||
                    otherUserProfile.userProfileQuestions["today-q3"] !== "" ||
                    otherUserProfile.userProfileQuestions["today-q4"] !== "") &&
                    "Today (Why I'm Here)"}
                </h1>
                {otherUserProfile.userProfileQuestions["today-q1"] ? (
                  <>
                    <p className="text-md xl:text-lg text-textcolor font-medium mb-2">
                      My most important project today:
                    </p>
                    <p className="text-md xl:text-lg text-formgray mb-4 md:mb-6">
                      {otherUserProfile.userProfileQuestions["today-q1"]}
                    </p>
                  </>
                ) : null}
                {otherUserProfile.userProfileQuestions["today-q2"] ? (
                  <>
                    <p className="text-md xl:text-lg text-textcolor font-medium mb-2">
                      My goal for my next session is:
                    </p>
                    <p className="text-md xl:text-lg text-formgray mb-4 md:mb-6">
                      {otherUserProfile.userProfileQuestions["today-q2"]}
                    </p>
                  </>
                ) : null}
                {otherUserProfile.userProfileQuestions["today-q3"] ? (
                  <>
                    <p className="text-md xl:text-lg text-textcolor font-medium mb-2">
                      Where I am working:
                    </p>
                    <p className="text-md xl:text-lg text-formgray mb-4 md:mb-6">
                      {otherUserProfile.userProfileQuestions["today-q3"]}
                    </p>
                  </>
                ) : null}
                {otherUserProfile.userProfileQuestions["today-q4"] ? (
                  <>
                    <p className="text-md xl:text-lg text-textcolor font-medium mb-2">
                      Music I'm listening to:
                    </p>
                    <p className="text-md xl:text-lg text-formgray mb-4 md:mb-6">
                      {otherUserProfile.userProfileQuestions["today-q4"]}
                    </p>
                  </>
                ) : null}
              </div>

              <div className="my-10">
                <h1 className="mb-4 md:mb-6 text-2xl text-greenbg font-medium">
                  {(otherUserProfile.userProfileQuestions["profile-q1"] !==
                    "" ||
                    otherUserProfile.userProfileQuestions["profile-q2"] !==
                      "" ||
                    otherUserProfile.userProfileQuestions["profile-q3"] !==
                      "" ||
                    otherUserProfile.userProfileQuestions["profile-q4"] !==
                      "" ||
                    otherUserProfile.userProfileQuestions["profile-q5"] !==
                      "" ||
                    otherUserProfile.userProfileQuestions["profile-q6"] !==
                      "") &&
                    "Profile (Who I AM)"}
                </h1>

                {otherUserProfile.userProfileQuestions["profile-q1"] ? (
                  <>
                    <p className="text-md xl:text-lg text-textcolor font-medium mb-2">
                      My headline or tagline:
                    </p>
                    <p className="text-md xl:text-lg text-formgray mb-4 md:mb-6">
                      {otherUserProfile.userProfileQuestions["profile-q1"]}
                    </p>
                  </>
                ) : null}
                {otherUserProfile.userProfileQuestions["profile-q2"] ? (
                  <>
                    <p className="text-md xl:text-lg text-textcolor font-medium mb-2">
                      Book I'm currently reading:
                    </p>
                    <p className="text-md xl:text-lg text-formgray mb-4 md:mb-6">
                      {otherUserProfile.userProfileQuestions["profile-q2"]}
                    </p>
                  </>
                ) : null}
                {otherUserProfile.userProfileQuestions["profile-q3"] ? (
                  <>
                    <p className="text-md xl:text-lg text-textcolor font-medium mb-2">
                      Book I want to read next:
                    </p>
                    <p className="text-md xl:text-lg text-formgray mb-4 md:mb-6">
                      {otherUserProfile.userProfileQuestions["profile-q3"]}
                    </p>
                  </>
                ) : null}
                {otherUserProfile.userProfileQuestions["profile-q4"] ? (
                  <>
                    <p className="text-md xl:text-lg text-textcolor font-medium mb-2">
                      Book that's had the biggest impact on my life:
                    </p>
                    <p className="text-md xl:text-lg text-formgray mb-4 md:mb-6">
                      {otherUserProfile.userProfileQuestions["profile-q4"]}
                    </p>
                  </>
                ) : null}
                {otherUserProfile.userProfileQuestions["profile-q5"] ? (
                  <>
                    <p className="text-md xl:text-lg text-textcolor font-medium mb-2">
                      Influencers with biggest impact on my life:
                    </p>
                    <p className="text-md xl:text-lg text-formgray mb-4 md:mb-6">
                      {otherUserProfile.userProfileQuestions["profile-q5"]}
                    </p>
                  </>
                ) : null}
                {otherUserProfile.userProfileQuestions["profile-q6"] ? (
                  <>
                    <p className="text-md xl:text-lg text-textcolor font-medium mb-2">
                      Favorite podcast:
                    </p>
                    <p className="text-md xl:text-lg text-formgray mb-4 md:mb-6">
                      {otherUserProfile.userProfileQuestions["profile-q6"]}
                    </p>
                  </>
                ) : null}
              </div>

              <div>
                <h1 className="mb-4 md:mb-6 text-2xl text-greenbg font-medium">
                  {(otherUserProfile.userProfileQuestions["hiw-q1"] !== "" ||
                    otherUserProfile.userProfileQuestions["hiw-q2"] !== "" ||
                    otherUserProfile.userProfileQuestions["hiw-q3"] !== "" ||
                    otherUserProfile.userProfileQuestions["hiw-q4"] !== "" ||
                    otherUserProfile.userProfileQuestions["hiw-q5"] !== "") &&
                    "How I Work"}
                </h1>
                {otherUserProfile.userProfileQuestions["hiw-q1"] ? (
                  <>
                    <p className="text-md xl:text-lg text-textcolor font-medium mb-2">
                      My most productive time of day is:
                    </p>
                    <p className="text-md xl:text-lg text-formgray mb-4 md:mb-6">
                      {otherUserProfile.userProfileQuestions["hiw-q1"]}
                    </p>
                  </>
                ) : null}
                {otherUserProfile.userProfileQuestions["hiw-q2"] ? (
                  <>
                    <p className="text-md xl:text-lg text-textcolor font-medium mb-2">
                      My least productive time of day is:
                    </p>
                    <p className="text-md xl:text-lg text-formgray mb-4 md:mb-6">
                      {otherUserProfile.userProfileQuestions["hiw-q2"]}
                    </p>
                  </>
                ) : null}
                {otherUserProfile.userProfileQuestions["hiw-q3"] ? (
                  <>
                    <p className="text-md xl:text-lg text-textcolor font-medium mb-2">
                      The task or type of work I dislike most:
                    </p>
                    <p className="text-md xl:text-lg text-formgray mb-4 md:mb-6">
                      {otherUserProfile.userProfileQuestions["hiw-q3"]}
                    </p>
                  </>
                ) : null}
                {otherUserProfile.userProfileQuestions["hiw-q4"] ? (
                  <>
                    <p className="text-md xl:text-lg text-textcolor font-medium mb-2">
                      Productivity app I couldn't live without:
                    </p>
                    <p className="text-md xl:text-lg text-formgray mb-4 md:mb-6">
                      {otherUserProfile.userProfileQuestions["hiw-q4"]}
                    </p>
                  </>
                ) : null}
                {otherUserProfile.userProfileQuestions["hiw-q5"] ? (
                  <>
                    <p className="text-md xl:text-lg text-textcolor font-medium mb-2">
                      "Favorite" method of procrastination:
                    </p>
                    <p className="text-md xl:text-lg text-formgray mb-4 md:mb-6">
                      {otherUserProfile.userProfileQuestions["hiw-q5"]}
                    </p>
                  </>
                ) : null}
              </div>

              <div className="mt-10">
                <h1 className="mb-4 md:mb-6 text-2xl text-greenbg font-medium">
                  {(otherUserProfile.userProfileQuestions["focusbuddy-q1"] !==
                    "" ||
                    otherUserProfile.userProfileQuestions["focusbuddy-q2"] !==
                      "" ||
                    otherUserProfile.userProfileQuestions["focusbuddy-q3"] !==
                      "" ||
                    otherUserProfile.userProfileQuestions["focusbuddy-q4"] !==
                      "" ||
                    otherUserProfile.userProfileQuestions["focusbuddy-q5"] !==
                      "") &&
                    "How I Get The Most From FocusBuddy"}
                </h1>
                {otherUserProfile.userProfileQuestions["focusbuddy-q1"] ? (
                  <>
                    <p className="text-md xl:text-lg text-textcolor font-medium mb-2">
                      My best sessions have this in common:
                    </p>
                    <p className="text-md xl:text-lg text-formgray mb-4 md:mb-6">
                      {otherUserProfile.userProfileQuestions["focusbuddy-q1"]}
                    </p>
                  </>
                ) : null}
                {otherUserProfile.userProfileQuestions["focusbuddy-q2"] ? (
                  <>
                    <p className="text-md xl:text-lg text-textcolor font-medium mb-2">
                      I love it when my FocusBuddy partner does this:
                    </p>
                    <p className="text-md xl:text-lg text-formgray mb-4 md:mb-6">
                      {otherUserProfile.userProfileQuestions["focusbuddy-q2"]}
                    </p>
                  </>
                ) : null}
                {otherUserProfile.userProfileQuestions["focusbuddy-q3"] ? (
                  <>
                    <p className="text-md xl:text-lg text-textcolor font-medium mb-2">
                      My biggest pet peeve is when my FocusBuddy partner does
                      this:
                    </p>
                    <p className="text-md xl:text-lg text-formgray mb-4 md:mb-6">
                      {otherUserProfile.userProfileQuestions["focusbuddy-q3"]}
                    </p>
                  </>
                ) : null}
                {otherUserProfile.userProfileQuestions["focusbuddy-q4"] ? (
                  <>
                    <p className="text-md xl:text-lg text-textcolor font-medium mb-2">
                      If I could add or change one thing about FocusBuddy, it
                      would be:
                    </p>
                    <p className="text-md xl:text-lg text-formgray mb-4 md:mb-6">
                      {otherUserProfile.userProfileQuestions["focusbuddy-q4"]}
                    </p>
                  </>
                ) : null}
                {otherUserProfile.userProfileQuestions["focusbuddy-q5"] ? (
                  <>
                    <p className="text-md xl:text-lg text-textcolor font-medium mb-2">
                      What are the top 1-2 tasks you use FocusBuddy for most
                      often:
                    </p>
                    <p className="text-md xl:text-lg text-formgray mb-4 md:mb-6">
                      {otherUserProfile.userProfileQuestions["focusbuddy-q5"]}
                    </p>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {fail ? <ErrorTextToast text={"Removed from favorites."} /> : null}
      {success ? <SuccessToast text={"Added to favorites."} /> : null}
    </>
  );
}
