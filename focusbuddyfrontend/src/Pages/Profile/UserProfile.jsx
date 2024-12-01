import { Link, NavLink } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import moment from "moment";
import { useState, useRef, useEffect, useContext } from "react";
import { myContext } from "../../utils/PrivateRoutes";
import SuccessToast from "../../Components/UI/toast-components/SuccessToast";
import uploadProfilePic from "../../utils/uploadProfilePic/uploadProfilePic";
import { FaLink } from "react-icons/fa6";
import DashboardInnerNav from "../../Components/navbar/DashboardInnerNav";
import AddLocationModal from "../../Components/UI/AddLocationModal/AddLocationModal";

export default function UserProfile() {
  const { userProfile, setUserProfile, updatedImg, setUpdatedImg } = useContext(myContext);
  console.log(userProfile);
  const [selectedFile, setSelectedFile] = useState(null);
  const [upload, setUpload] = useState(false);
  const [name, setName] = useState("");
  const [picUpdated, setPicUpdated] = useState(false);
  const fileInputRef = useRef();
  const [openAddLocationModal, setOpenAddLocationModal] = useState(false);

  useEffect(() => {
    const url = userProfile.userProfileLink;
    const prefix = "/user/";
    const startIndex = url.indexOf(prefix);

    if (startIndex !== -1) {
      const userPath = url.substring(startIndex + prefix.length);
      console.log(userPath); // Output: "rupesh-chincholkar"
      setName(userPath);
    } else {
      console.log("No user path found in the URL");
    }
  }, []);


  function handleButtonClick() {
    fileInputRef.current.click();
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      // setUpload(true);
      setSelectedFile(event.target.files[0]);
      uploadPic(file);
    }
  }

  const uploadPic = async (file) => {
    setUpload(true);
    const formData = new FormData();
    formData.append("googleID", userProfile.googleId);
    formData.append("profilePhoto", file);
    try {
      const response = await uploadProfilePic(
        `${import.meta.env.VITE_BACKEND_PRO_URL}/api/user/uploadProfilePic`,
        "PUT",
        formData
      );
      console.log(response);
      setUpdatedImg(response.data.profilePic);
    setPicUpdated(true);

    } catch (err) {
      console.log(err);
    }
  };
  // console.log(userProfile);
  if (picUpdated) {
    setTimeout(() => {
      setPicUpdated(false);
    }, 2000);
  }

  return (
    <>
      {/* <DashboardNavbar updatedImg={updatedImg}/> */}
      <DashboardInnerNav />
      <div className="max-w-screen-lg min-h-screen mx-auto">
        <div className="min-h-24 md:max-w-[70%] md:mx-auto lg:max-w-full py-10 lg:pt-10 px-6 flex flex-wrap justify-center">
          <div className="flex flex-col w-full lg:w-1/3 p-10 bg-white rounded-t-lg lg:rounded-s-lg shadow-2xl">
            <img
              className="w-32 h-32 lg:w-40 lg:h-40 object-cover border-4 border-textcolor rounded-full mx-auto"
              src={updatedImg}
              alt="user photo"
            />
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            {upload ? (
              <button
                type="button"
                className="mt-4 flex gap-2 items-center justify-center py-3 bg-textcolor rounded-md  text-white hover:bg-darkbrown"
                onClick={handleButtonClick}
              >
                <MdEdit />
                Didn't like, change again
              </button>
            ) : (
              <button
                type="button"
                className="mt-4 flex gap-2 text-sm xl:text-lg items-center justify-center py-3 px-6 rounded-md bg-textcolor text-white hover:bg-darkbrown"
                onClick={handleButtonClick}
              >
                <MdEdit />
                Edit profile picture
              </button>
            )}
            {/* { upload ? <button className="mt-8 flex gap-2 items-center justify-center p-2 bg-textcolor text-white hover:bg-darkbrown" onClick={handleUpload}><FaCheck/>Confirm upload</button> :<button className="mt-8 flex gap-2 items-center justify-center p-2 bg-textcolor text-white hover:bg-darkbrown" onClick={handleButtonClick}><MdEdit/>Edit profile picture</button>} */}
          </div>
          <div className="w-full lg:w-1/2 bg-greenbg text-white  py-10 px-4 md:ps-10 rounded-b-lg lg:rounded-e-lg shadow-xl">
            <h1 className="text-3xl lg:text-4xl font-medium mb-6 capitalize">
              {userProfile.givenName +
                " " +
                (userProfile.familyName ? userProfile.familyName : " ")}
            </h1>
            <h3 className="mb-2 mt-4 flex gap-2 items-center text-sm md:text-md xl:text-lg">
              <MdEmail />
              {userProfile.email}
            </h3>
            <p className="my-2 flex gap-2 items-center text-sm md:text-md xl:text-lg">
              <FaMapMarkerAlt />
              {
                userProfile.userLocation.district === null 
                ?

                <button onClick={() => setOpenAddLocationModal(true)} className="text-md lg:text-lg underline underline-offset-4">Click here to add location</button>

                :
                userProfile.userLocation.district + " " + "/" +  " " + userProfile.userLocation.state
              }
            </p>
            <Link
              to={`/user/${name}`}
              className="text-md underline underline-offset-4 text-sm md:text-md xl:text-lg flex gap-2 items-center"
            >
              <FaLink />
              {userProfile.userProfileLink}
            </Link>
            <p className="my-2 text-sm md:text-md xl:text-lg">
              <span>Member sinces: </span>
              {moment(userProfile.memberSince).utc().format("MMMM Do, YYYY")}
            </p>
          </div>
          <div className="w-full lg:w-[83%] flex py-3 rounded-md mt-6">
            <div className="text-textcolor basis-1/2 flex flex-col justify-center items-center text-center">
              <h1 className="text-3xl md:text-4xl font-medium mb-2">{userProfile.totalSessionsAttended}</h1>
              <p className="text-sm md:text-md xl:text-lg text-formgray">Sessions</p>
            </div>
            <div className="flex basis-1/2 justify-center text-center">
              <div className=" md:p-4 w-fit rounded-md">
                <h1 className="text-3xl md:text-4xl font-medium mb-0 md:mb-2" 
                style={
                  ['100%', '90%', '80%'].includes(userProfile.attendanceScore) ? {color:'#4CAF50'} :
                  ['70%', '60%', '50%'].includes(userProfile.attendanceScore) ? {color:'#ff7f00'} :
                  ['40%', '30%', '20%'].includes(userProfile.attendanceScore) ? {color:'#ffca00'} :
                  ['10%', '0%'].includes(userProfile.attendanceScore) ? {color:'#ff0000'} : {color: '#422d2a'}

                }>
                  {userProfile.attendanceScore}
                </h1>
                <p className="text-formgray p-2 text-sm md:text-md xl:text-lg">
                  Attendance Scores
                </p>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[83%] space-y-3  flex flex-col md:flex-row px-4 mt-6 text-sm md:text-md xl:text-lg">
            <div className="basis-full md:w-[70%] flex items-end justify-center md:justify-start">
              <Link
                to={"/profile/edit"}
                className="flex items-center justify-center md:justify-start gap-2 text-textcolor hover:text-greenbg font-medium"
              >
                Click here to complete your profile! <MdEdit />
              </Link>
            </div>
            <div className="basis-full md:w-[30%] ">
              <Link
                to={"/profile/settings"}
                className="flex text-center md:text-end justify-center md:justify-end items-center gap-2 text-textcolor hover:text-greenbg font-medium"
              >
                Settings <MdEdit />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Modal
                id="AddLocationModal"
                className="settingsModal"
                show={openAddLocationModal}
                style={{ zIndex: 10000 }}
                size="2xl"
                onClose={() => setOpenAddLocationModal(false)}
                popup
              >
                <Modal.Header />
                <Modal.Body id="AddLocationModalBody">
                  <AddLocationModal
                    setOpenAddLocationModal={setOpenAddLocationModal}
                    userProfile={userProfile}
                    setUserProfile={setUserProfile}
                  />
                </Modal.Body>
              </Modal>
      {picUpdated ? <SuccessToast text={"Profile picture updated."} /> : null}
    </>
  );
}
