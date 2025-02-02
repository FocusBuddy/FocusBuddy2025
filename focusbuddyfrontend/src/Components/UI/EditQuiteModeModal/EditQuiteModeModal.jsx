import { useState } from "react";
import SuccessToast from "../../../Components/UI/toast-components/SuccessToast";


export default function EditQuiteModeModal({ userProfile,setUserProfile, setOpenQuiteModeEditModal }) {
  const [selectedValue, setSelectedValue] = useState("matchwithquite");
  const [success,setSuccess] = useState(false);


  const handleRadioChange = (value) => {
    setSelectedValue(value);
  };


  const handleQuiteModeSave = async (e) => {
    e.preventDefault();
    // console.log(selectedValue)
    try{
      const response = await fetch(`${import.meta.env.VITE_BACKEND_PRO_URL}/api/user/setting_change_quitemode_preference`,{
        method: 'PUT',
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({email: userProfile.email,quiteModeState:selectedValue})
      });
      const data = await response.json();
      // console.log(data);
      if(response.ok){
        setUserProfile(data.updatedUser);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setOpenQuiteModeEditModal(false);
        }, 700);
      }
    }catch(err){
      console.log(err);
      throw new Error('Error while updating name.')
    }
  }

  return (
    <div className="pt-12 md:p-20">
      <h1 className="text-3xl font-medium text-greenbg text-center">
        Quiet Mode Preference
      </h1>
      <p className="mt-3 text-center text-md xl:text-lg text-formgray ">
        Use Quiet Mode when you don’t have a mic or can’t talk (think libraries
        and shared spaces).
      </p>
      <p className="mt-6 mb-3 text-center text-md xl:text-lg text-formgray ">
        Choose your Quiet Mode matching preference:
      </p>
      <form onSubmit={handleQuiteModeSave} className="mt-6 space-y-6">
        <div className="flex">
          <div className="flex items-center h-5">
            <input
              id="matchwithquite-radio"
              aria-describedby="matchwithquite-radio-text"
              type="radio"
              value="Match with quite"
              className="mt-4 w-4 h-4 md:w-6 md:h-6 text-textcolor bg-gray-100 border-gray-300 focus:ring-textcolor"
              checked={selectedValue === "matchwithquite"}
              onChange={() => handleRadioChange("matchwithquite")}
            />
          </div>
          <div className="ms-4 text-md">
            <label
              htmlFor="matchwithquite-radio"
              className="text-md xl:text-lg text-greenbg "
            >
              I’m okay being matched with someone in Quiet Mode even if I’m not
              in Quiet Mode
            </label>
          </div>
        </div>
        <div className="flex">
          <div className="flex items-center h-5">
            <input
              id="donotmatchwithquite-radio"
              aria-describedby="donotmatchwithquite-radio-text"
              type="radio"
              value="Don't match with quite"
              className="mt-4 w-4 h-4 md:w-6 md:h-6 text-textcolor bg-gray-100 border-gray-300 focus:ring-textcolor"
              checked={selectedValue === "donotmatchwithquite"}
              onChange={() => handleRadioChange("donotmatchwithquite")}
            />
          </div>
          <div className="ms-4 text-md">
            <label
              htmlFor="donotmatchwithquite-radio"
              className="text-md xl:text-lg text-greenbg "
            >
              Don’t match me with someone in Quiet Mode unless I’m also in Quiet
              Mode
            </label>
          </div>
        </div>
        <div className="mt-10 pt-5 border-t border-gray-200 rounded-b">
        {
                    ((selectedValue === 'matchwithquite' && userProfile.quiteModeMatchAllowed === true) || (selectedValue === 'nomatchwithquite' && userProfile.quiteModeMatchAllowed === false) )
                    ?
                    <button
                    disabled
                    type="submit"
                    className="w-full cursor-not-allowed bg-bordercolor py-3 text-md xl:text-lg px-3.5 text-formgray rounded-md border border-formgray"
                  >
                    Save preference
                  </button>
                  :
                  <button
                  type="submit"
                  className="w-full bg-textcolor py-3 text-md xl:text-lg px-3.5 hover:bg-darkbrown text-white rounded-md transition-all duration-500 ease-in-out"
                >
                  Save Preference
                </button>
                  }
         
        </div>
      </form>
     { success ?  <SuccessToast text={'Quite mode preference updated.'}/> : null }

    </div>
  );
}
