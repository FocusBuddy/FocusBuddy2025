import {Link , useNavigate} from 'react-router-dom';
import BrownButtonOnBlue from "../../Components/UI/BrownButtonOnBlue/BrownButtonOnBlue";
import LocalAuth from "../../Components/AuthComponent/LocalAuth";
import GoogleAuth from "../../Components/AuthComponent/GoogleAuth";
import { useState } from "react";
import ErrorTextToast from '../../Components/UI/toast-components/ErrorTextToast';


function Login() {
  const [email , setEmail] = useState('');
  const [password , setPassword] = useState('');
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmail("");
    setPassword("");
    setLoading(true);
    // console.log(email,password);
    try{
      const response = await fetch(`${import.meta.env.VITE_BACKEND_PRO_URL}/auth/local/login`,{
        method: 'POST',
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({email:email,password:password}),
        credentials: 'include' 
      })
      const data = await response.json();
      // console.log(data);
      if(response.ok){
        setLoading(false);
        navigate('/dashboard');
      }else if(response.status === 400){
        setIsError(true);
        setErrorMsg('Either email or password is wrong.')
      }else if(response.status === 403){
        navigate('/account-cancelled',{ state: { profile: data.user } });
      }
    }catch(err){
      console.log(err);
      throw new Error('Error while login.')
    }
  }


  if (isError) {
    setTimeout(() => {
      setIsError(false);
    }, 2000);
  }

  return (
    <div className="min-w-screen min-h-screen flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 bg-greenbg relative p-10">
        <Link to={'/'} className='absolute right-5 top-4 lg:left-10 lg:top-10'>
          <BrownButtonOnBlue text={'Home'}/>
        </Link>
        <p className="text-white text-3xl lg:text-6xl xl:text-7xl absolute top-6 left-5 lg:top-[40%] lg:inset-x-0 text-end lg:text-center font-medium">FocusBuddy</p>
      </div>
      
      <div className="w-full lg:w-1/2 py-20 lg:py-28 px-6">
        <h1 className="text-3xl font-semibold text-greenbg text-center mb-10">
          Let's get you Sign in!
        </h1>

        <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
          <LocalAuth 
          text={'Sign in'} 
          email={email} 
          setEmail={setEmail} 
          password={password} 
          setPassword={setPassword}
          showPassword={showPassword}
          loading={loading}
          setShowPassword={setShowPassword}/>
        </form>

        <p className='text-center text-md xl:text-lg my-6 font-medium text-textcolor' ><Link to={'/login/reset-password-request'}>Forgot password ?</Link></p>

        <p className="text-center text-md xl:text-lg my-6">or</p>

          <GoogleAuth/>

        <p className='text-center text-md xl:text-lg my-6  text-textcolor'>Don't have an account? <Link to={'/signup'} className='font-medium'>Sign up</Link></p>
         {/* </div> */}
      </div>

      {isError ? <ErrorTextToast text={errorMsg}/> : null}
    </div>
  );
}

export default Login;
