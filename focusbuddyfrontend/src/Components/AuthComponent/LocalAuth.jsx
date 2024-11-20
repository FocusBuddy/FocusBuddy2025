import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";


export default function LocalAuth({text ,email, setEmail, password, setPassword,showPassword,setShowPassword}) {
    
  return (
    <>
      <div className="relative">
        <input
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          id="email_floating_outlined"
          className="block p-4 pt-4 w-full text-textcolor bg-white rounded-lg border-1 border-textcolor appearance-none focus:outline-none focus:ring-0 focus:border-textcolor peer"
          placeholder=" "
        />
        <label
          htmlFor="email_floating_outlined"
          className="absolute text-md xl:text-lg text-textcolor duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white ps-4 peer-focus:px-2 peer-focus:text-textcolor peer-focus:dark:text-textcolor peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
        >
          Email
        </label>
      </div>

      <div className="relative my-6">
        <input
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? "text" : "password"}
          id="password_floating_outlined"
          className="block p-4 pt-4 w-full text-textcolor bg-white rounded-lg border-1 border-textcolor appearance-none focus:outline-none focus:ring-0 focus:border-textcolor peer"
          placeholder=" "
           pattern="^\S*$" // Regex to disallow spaces
           title="Password cannot contain spaces."
        />
        <label
          htmlFor="password_floating_outlined"
          className="absolute text-md xl:text-lg text-textcolor duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white ps-4 peer-focus:px-2 peer-focus:text-textcolor peer-focus:dark:text-textcolor peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
        >
          Password
        </label>
        <div className="z-30 absolute text-textcolor inset-y-0 end-0 flex items-center pe-4">
          {showPassword ? <FiEye onClick={() => setShowPassword(false)}/> : <FiEyeOff className="z-30"  onClick={() => setShowPassword(true)}/>}
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-greenbg p-3.5 text-md xl:text-lg text-white rounded-lg -translate-y-0 hover:-translate-y-2 transition-all duration-500 ease-in-out"
      >
        {text} with email
      </button>
    </>
  );
}
