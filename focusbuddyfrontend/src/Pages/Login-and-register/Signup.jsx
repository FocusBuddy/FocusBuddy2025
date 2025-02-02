import { Link, Outlet, useNavigate } from "react-router-dom";
import BrownButtonOnBlue from "../../Components/UI/BrownButtonOnBlue/BrownButtonOnBlue";
import LocalAuth from "../../Components/AuthComponent/LocalAuth";
import GoogleAuth from "../../Components/AuthComponent/GoogleAuth";
import { useState } from "react";
import ErrorTextToast from '../../Components/UI/toast-components/ErrorTextToast';


function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg,setErrorMsg] = useState('');
  const [showMessage,setShowMessage] = useState(false);
  const [loading,setLoading] = useState(false);
  const [showSignupProfile,setShowSignupProfile] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(email, password);
    setEmail("");
    setPassword("");
    setLoading(true);
      try{
        const response = await fetch(`${import.meta.env.VITE_BACKEND_PRO_URL}/auth/local/checkregister`,{
          method: 'POST',
          headers: {
            "Content-Type":"application/json"
          },
          body: JSON.stringify({email:email,password:password})
        })
        const data = await response.json();
        if(response.ok){
          setShowSignupProfile(true);
          setLoading(false);
          navigate('/signup/profile', {state: {email,password}});
          // console.log(data.message);
        }else if(response.status === 400){
          setShowMessage(true);
          setErrorMsg(data.message)
        }
      }catch(err){
        console.log(err);
        throw new Error('Either Username or Password is not acceptable.')
      }
  };

  if (showMessage) {
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  }

  return (
    <>
      {showSignupProfile ? (
        <Outlet/>
      ) : (
        <div className="min-w-screen min-h-screen flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 bg-greenbg relative p-10">
            <Link to={"/"} className='absolute right-5 top-4 lg:left-10 lg:top-10'>
              <BrownButtonOnBlue
                text={"Home"}
              />
            </Link>
            <p className="text-white text-3xl lg:text-6xl xl:text-7xl absolute top-6 left-5 lg:top-[40%] lg:inset-x-0 text-end lg:text-center font-medium">
              FocusBuddy
            </p>
          </div>

          <div className="w-full lg:w-1/2 py-20 lg:py-28 px-6">
            <h1 className="text-3xl font-semibold text-greenbg text-center mb-10">
              Let's get you Signed up!
            </h1>

            <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
              <LocalAuth
                text={"Sign up"}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                loading={loading}
                setShowPassword={setShowPassword}
              />
            </form>

            <p className="text-center text-md xl:text-lg my-6">or</p>

            <GoogleAuth />
            <p className="text-center text-md xl:text-lg my-6  text-textcolor">
              Already have an account?{" "}
              <Link to={"/login"} className="font-medium">
                Sign in
              </Link>
            </p>
            {/* </div> */}
          </div>
          {showMessage ? <ErrorTextToast text={errorMsg}/> : null }
        </div>
       )} 
    </>
  );
}

export default Signup;
