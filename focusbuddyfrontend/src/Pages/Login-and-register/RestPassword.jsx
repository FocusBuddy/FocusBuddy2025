import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import ErrorTextToast from "../../Components/UI/toast-components/ErrorTextToast";

export default function ResetPassword() {
  const [resetEmail, setResetEmail] = useState("");
  const [linkSend, setLinkSend] = useState(false);
  const [sending, setSending] = useState(false);
  const [error,setError] = useState(false);
  const navigate = useNavigate();


  
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_PRO_URL}/api/user/reset-password-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: resetEmail }),
        }
      );
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setSending(false);
        setLinkSend(true);
      }else if(response.status === 404){
        setError(true);
          setTimeout(() => {
            setError(false);
              navigate('/signup');
          }, 500); 
      }
    } catch (err) {
      console.log(err);
      throw new Error("Error in Resetting your password.");
    }
  };

  return (
    <>
      <div className="min-w-screen min-h-screen flex flex-col lg:flex-row">
        <div className=" z-10 py-10 px-10 md:px-20 text-center absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-white w-full md:w-[60%] xl:max-w-2xl shadow-2xl rounded-lg">
          <h1 className="text-3xl text-greenbg">Reset Your Password</h1>
          <p className="mt-6 mb-8 text-formgray text-md xl:text-lg">
            {
              linkSend ? "Password reset link send on provided email address." 
              : 
              "Enter the email address that you use for your FocusBuddy account and we'll send you a password reset link."
            }
            
          </p>
          {linkSend ? (
            <Link to={"/login"}>
              <button
                type="button"
                className="mt-4 w-full bg-textcolor p-3.5 hover:bg-darkbrown text-md xl:text-lg text-white rounded-lg"
              >
                Back to Sign in
              </button>
            </Link>
          ) : null}
          <form
            className={linkSend ? "hidden" : "block"}
            onSubmit={handleResetPasswordSubmit}
          >
            <div className="relative">
              <input
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                type="email"
                id="email_floating_outlined"
                className="block p-4 pt-3 w-full text-textcolor bg-white rounded-lg border-1 border-textcolor appearance-none focus:outline-none focus:ring-0 focus:border-textcolor peer"
                placeholder=" "
              />
              <label
                htmlFor="email_floating_outlined"
                className="absolute text-md xl:text-lg text-textcolor duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white ps-4 peer-focus:px-2 peer-focus:text-textcolor peer-focus:dark:text-textcolor peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Email
              </label>
            </div>
            <button
              type="submit"
              className="mt-6 w-full bg-textcolor p-3.5 hover:bg-darkbrown text-md xl:text-lg text-white rounded-lg"
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
                  Sending link
                </div>
              ) : (
                "Send reset link"
              )}
            </button>
          </form>
        </div>
        <div className="w-full lg:w-1/2 bg-greenbg relative p-6">
          <Link to={"/"}>
            <button
              type="button"
              className="bg-textcolor px-4 py-2.5 rounded-md text-md xl:text-lg text-white"
            >
              Home
            </button>
          </Link>
        </div>
        <div className="w-full lg:w-1/2 py-20 lg:py-28 px-6"></div>
      </div>
      {error ? <ErrorTextToast text={'No user with that email.'}/> : null}
    </>
  );
}
