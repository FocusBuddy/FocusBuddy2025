import { useState } from "react";
import SuccessToast from "../../../Components/UI/toast-components/SuccessToast";

export default function EditNameModal({
  userProfile,setUserProfile,setOpenNameEditModal
}) {
  const [firstName, setFirstName] = useState(userProfile.givenName);
  const [lastName, setLastName] = useState(userProfile.familyName);
  const [success,setSuccess] = useState(false);


  const handleEditNameSubmit = async (e) => {
    e.preventDefault();
    console.log(firstName, lastName);
    const showName = firstName + ' ' + lastName;
    const previousFullName = userProfile.displayName;
    try{
      const response = await fetch(`${import.meta.env.VITE_BACKEND_PRO_URL}/api/user/setting_change_name`,{
        method: 'PUT',
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({email: userProfile.email,firstName,lastName,showName,previousFullName})
      });
      const data = await response.json();
      console.log(data);
      if(response.ok){
        setUserProfile(data.updatedUser);
        setSuccess(true);
        setTimeout(() => {
          setOpenNameEditModal(false);
          setSuccess(false);
        }, 700);
      }
    }catch(err){
      console.log(err);
      throw new Error('Error while updating name.')
    }
  };


  return (
    <div className="pt-12 md:p-20">
              <h1 className="text-3xl font-medium text-greenbg text-center">
                What is your name?
              </h1>
              <p className="mt-3 stext-md xl:text-lg text-formgray text-center">
                Let other users know what to call you.
              </p>
              <form className="mt-8 space-y-6" onSubmit={handleEditNameSubmit}>
                  <div className="relative">
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      type="text"
                      required
                      id="fname_floating_outlined"
                      className="block p-4 pt-4 w-full text-textcolor bg-white rounded-lg border-1 border-textcolor appearance-none focus:outline-none focus:ring-0 focus:border-textcolor peer"
                      placeholder=" "
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
                    />
                    <label
                      htmlFor="lname_floating_outlined"
                      className="absolute text-md xl:text-lg text-textcolor duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white ps-4 peer-focus:px-2 peer-focus:text-textcolor peer-focus:dark:text-textcolor peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                    >
                      Last Name
                    </label>
                  </div>
                <div className="mt-10 pt-5 border-t border-gray-200 rounded-b">
                  {
                    firstName === userProfile.givenName && lastName === userProfile.familyName
                    ?
                    <button
                    disabled
                    type="submit"
                    className="w-full cursor-not-allowed bg-bordercolor py-3 text-md xl:text-lg px-3.5 text-formgray rounded-md border border-formgray"
                  >
                    Save name
                  </button>
                  :
                 
                  <button
                    type="submit"
                    className="w-full bg-textcolor py-3 text-lg px-3.5 hover:bg-darkbrown text-white rounded-md transition-all duration-500 ease-in-out"
                  >
                    Save name
                  </button>
                   
                  }
                </div>
              </form>
              { success ?  <SuccessToast text={'Name updated.'}/> : null }

    </div>
  );
}
