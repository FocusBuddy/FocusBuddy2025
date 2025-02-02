import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import SuccessToast from "../../Components/UI/toast-components/SuccessToast";


export default function ConfirmPassword() {
    const [showError, setShowError] = useState(false);
    const [password , setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [success,setSuccess] = useState(false);
    const {id,token} = useParams();
    const navigate = useNavigate();


    const handleConfirmPassword = (e) =>{
        e.preventDefault();
        if(password !== confirmPassword){
            setShowError(true);
        }else{
            setShowError(false);
            const newPassword = async () => {
                try{
                    const response = await fetch(`${import.meta.env.VITE_BACKEND_PRO_URL}/api/user/confirm-password`,{
                        method: 'PUT',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({paramId: id,token: token,newPassword: password})
                    })
                    const data = await response.json();
                    // console.log(data);
                    if(response.ok){
                        setSuccess(true);
                        setTimeout(() => {
                            setSuccess(false);
                            navigate('/login');
                        }, 500); 
                    }
                }catch(err){
                    console.log(err);
                    throw new Error('Error while resetting new password.');
                }
            }
            newPassword();
        }
    }

   
  return (
    <>
      <div className="min-w-screen min-h-screen flex flex-col lg:flex-row">
        <div className="mt-6 md:mt-10 z-10 px-10 md:px-20 py-10  text-center absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-white w-full md:w-[60%] lg:w-[70%] xl:w-[40%] shadow-2xl rounded-lg">
          <h1 className="text-3xl mb-10 text-greenbg">Reset Your Password</h1>
          <form onSubmit={handleConfirmPassword}>
            <div className="relative my-2">
              <input
                required
                value={password}
                pattern=".{6,}"
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                id="password_floating_outlined"
                className="block p-4 pt-3 w-full text-textcolor bg-white rounded-lg border-1 border-textcolor appearance-none focus:outline-none focus:ring-0 focus:border-textcolor peer"
                placeholder=" "
              />
              <label
                htmlFor="password_floating_outlined"
                className="absolute text-md xl:text-lg text-textcolor duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white ps-4 peer-focus:px-2 peer-focus:text-textcolor peer-focus:dark:text-textcolor peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Password
              </label>
              <div className="z-30 absolute text-textcolor inset-y-0 end-0 flex items-center pe-4">
                {showPassword ? (
                  <FiEye onClick={() => setShowPassword(false)} />
                ) : (
                  <FiEyeOff
                    className="z-30"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
            </div>
            <p className={"ms-2 text-md xl:text-lg text-start"} style={password.length < 6 ? {color: '#DE3535'} : {color: '#3a943e'}}>At least 6 characters</p>
            
            <div className="relative my-6">
              <input
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={showConfirmPassword ? "text" : "password"}
                id="confirm_password_floating_outlined"
                className="block p-4 pt-3 w-full text-textcolor bg-white rounded-lg border-1 border-textcolor appearance-none focus:outline-none focus:ring-0 focus:border-textcolor peer"
                placeholder=" "
                pattern="^\S*$" // Regex to disallow spaces
                title="Password cannot contain spaces."
              />
              <label
                htmlFor="confirm_password_floating_outlined"
                className="absolute text-md xl:text-lg text-textcolor duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white ps-4 peer-focus:px-2 peer-focus:text-textcolor peer-focus:dark:text-textcolor peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Confirm Password
              </label>
              <div className="z-30 absolute text-textcolor inset-y-0 end-0 flex items-center pe-4">
                {showPassword ? (
                  <FiEye onClick={() => setShowConfirmPassword(false)} />
                ) : (
                  <FiEyeOff
                    className="z-30"
                    onClick={() => setShowConfirmPassword(true)}
                  />
                )}
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 w-full bg-textcolor p-3.5 hover:bg-darkbrown text-md xl:text-lg text-white rounded-lg"
            >Reset password</button>
          </form>
          {showError ? <p className={"mt-4 text-md xl:text-lg text-errorred text-center"}>Password don't match</p> : null}
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
      {success ? <SuccessToast text={'Password changed successfully!.'}/> : null }
    </>
  );
}
