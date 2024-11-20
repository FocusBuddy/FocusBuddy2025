import { Link, useLocation, useNavigate } from "react-router-dom";
import BrownButtonOnBlue from "../../Components/UI/BrownButtonOnBlue/BrownButtonOnBlue";
import { useState, useRef } from "react";
import uploadProfilePic from "../../utils/uploadProfilePic/uploadProfilePic";
import SuccessToast from "../../Components/UI/toast-components/SuccessToast";

export default function SignupProfile() {
  const location = useLocation();
  const { email, password } = location.state || {};
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [agree, setAgree] = useState(false);
  const [selectedFile, setSelectedFile] = useState(
    `${import.meta.env.VITE_BACKEND_PRO_URL}/uploads/defaultImages.png`
  );
  const [uploaded, setUploaded] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const [nameIsJustSpace, setNameIsJustSpace] = useState(false);
  const [oldPic, setOldPic] = useState(
    `${import.meta.env.VITE_BACKEND_PRO_URL}/uploads/defaultImages.png`
  );

  function handleButtonClick() {
    fileInputRef.current.click();
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      setUploaded(true);
      setSelectedFile(event.target.files[0]);
      upload(file);
    }
    // console.log(event.target.files[0]);
  }

  const upload = async (file) => {
    // console.log('file',file)
    const formData = new FormData();
    formData.append("profilePhoto", file);
    formData.append("oldPic", oldPic);
    try {
      const response = await uploadProfilePic(
        `${import.meta.env.VITE_BACKEND_PRO_URL}/auth/local/register`,
        "POST",
        formData
      );
      console.log(response);
      setSelectedFile(response.profilePic);
      setOldPic(response.profilePic);
    } catch (err) {
      console.log(err);
    }
    // try {
    //   const response = await fetch(
    //     `${import.meta.env.VITE_BACKEND_PRO_URL}/auth/local/register`,
    //     {
    //       method: "POST",
    //       body: formData,
    //     }
    //   );
    //   const data = await response.json();
    //   console.log(data);
    //   setSelectedFile(data.profilePic);
    //   setOldPic(data.profilePic);
    //   // console.log(selectedFile);
    // } catch (err) {
    //   console.log(err);
    //   throw new Error("An error occurred while signup!.");
    // }
  };

  const handleCompleteSignupSubmit = async (e) => {
    e.preventDefault();
    setFirstName("");
    setLastName("");
    setAgree(false);
    setLoading(true);
    console.log(email, password, selectedFile, agree, firstName, lastName);

    try {
      const userDetails = {
        email,
        password,
        profilePic: selectedFile,
        firstname: firstName,
        lastname: lastName,
      };

      if (firstName.trim().length === 0 || lastName.trim().length === 0) {
        setNameIsJustSpace(true);
      } else {
      

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_PRO_URL}/auth/local/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userDetails),
        }
      );
      const data = await response.json();
      console.log(data);
      setSelectedFile(data.profilePic);
      if (response.ok) {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          navigate("/login");
        }, 500);
      }
    }
    } catch (err) {
      console.log(err);
      throw new Error("An error occurred while signup!.");
    }

    // navigate('/login');
  };

  return (
    <div className="relative min-w-screen min-h-screen flex">
      <div className="mt-28 lg:mt-0 z-10 p-10 absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-white w-full md:w-full lg:w-[70%] xl:w-[45%] shadow-2xl rounded-lg">
        <h1 className=" mb-8 text-3xl text-center text-greenbg">
          Almost done ....
        </h1>
        <form
          className="max-w-md mx-auto"
          onSubmit={handleCompleteSignupSubmit}
        >
          <div className="flex flex-col justify-center items-center">
            <img
              className="w-20 h-20 rounded-full shadow-lg"
              src={selectedFile}
              alt="profile pic"
            />
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            {uploaded ? (
              <button
                type="button"
                className="mt-4 flex gap-2 items-center justify-center p-3 rounded-md bg-textcolor text-white hover:bg-darkbrown"
                onClick={handleButtonClick}
              >
                Change picture
              </button>
            ) : (
              <button
                type="button"
                className="mt-4 flex gap-2 items-center justify-center py-3 px-6 rounded-md bg-textcolor text-white hover:bg-darkbrown"
                onClick={handleButtonClick}
              >
                Add a picture
              </button>
            )}
          </div>

          <div className="mt-10 flex gap-4 justify-center">
            <div className="relative">
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
                required
                id="fname_floating_outlined"
                className="block p-4 pt-4 w-full text-textcolor bg-white rounded-lg border-1 border-textcolor appearance-none focus:outline-none focus:ring-0 focus:border-textcolor peer"
                placeholder=" "
                pattern=".*\S.*" // Ensures the input contains at least one non-space character
                title="First Name cannot be empty or just spaces."
              />
              <label
                htmlFor="fname_floating_outlined"
                className="absolute text-md xl:text-lg text-textcolor duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white ps-4 peer-focus:px-2 peer-focus:text-textcolor peer-focus:dark:text-textcolor peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                First Name
              </label>
            </div>

            <div className="relative">
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                type="text"
                required
                id="lname_floating_outlined"
                className="block p-4 pt-4 w-full text-textcolor bg-white rounded-lg border-1 border-textcolor appearance-none focus:outline-none focus:ring-0 focus:border-textcolor peer"
                placeholder=" "
                pattern=".*\S.*" // Ensures the input contains at least one non-space character
                title="Last Name cannot be empty or just spaces."
              />
              <label
                htmlFor="lname_floating_outlined"
                className="absolute text-md xl:text-lg text-textcolor duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white ps-4 peer-focus:px-2 peer-focus:text-textcolor peer-focus:dark:text-textcolor peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Last Name
              </label>
            </div>
          </div>
          <div>
            <div className="flex items-center mt-6 mb-2 text-textcolor">
              <input
                id="agreement-checkbox"
                type="checkbox"
                required
                checked={agree}
                onChange={() => setAgree(!agree)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="agreement-checkbox" className="ms-2">
                I confirm that:
              </label>
            </div>
            <ul className="ms-10 list-disc text-textcolor">
              <li>I am atleast 17 years old</li>
              <li>
                I accept and agree to FocusBuddy's Terms and Privacy Policy
              </li>
            </ul>
          </div>
          <button
            type="submit"
            className="w-full my-6 bg-greenbg py-3.5 px-10 hover:bg-darkgreen text-md xl:text-lg text-white rounded-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center">
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
                <p>please wait...</p>
              </div>
            ) : (
              "Complete sign up"
            )}
          </button>
        </form>
        {nameIsJustSpace && <p className="text-center text-red-700">Firstname or Lastname cannot be empty or just space.</p>}
        <p className="text-center text-textcolor">
          Making account for {email}.{" "}
          <Link to={"/signup"} className="hover:text-greenbg">
            Not right?
          </Link>
        </p>
      </div>
      <div className="w-1/2 bg-greenbg relative p-10">
        <Link to={"/"} className="absolute -right-8 top-8 lg:left-10 lg:top-10">
          <BrownButtonOnBlue text={"Home"} />
        </Link>
      </div>

      <div className="w-1/2 py-32"></div>

      {success ? <SuccessToast text={"Account Created."} /> : null}
    </div>
  );
}
