import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";


export default function LocalAuth({text ,email, setEmail, password, setPassword,showPassword,setShowPassword,loading}) {
    
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
        {
          loading ? 
          (<div className="flex items-center justify-center">
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
        </div>)
          : 
          (
            `${text} with email`
          )
        }
      </button>
    </>
  );
}
