import { useState } from "react";
import SuccessToast from "../toast-components/SuccessToast";

export default function EditFavoritesModal({
  userProfile,setUserProfile,setOpenFavoritesEditModal
}) {
  const [availability,setAvailability] = useState("No one");
  const [success,setSuccess] = useState(false);


  const handleAvailabilityChange = (value) => {
    setAvailability(value);
  };

  const handleAvailabilitySave = async (e) => {
    e.preventDefault();
    try{
      const response = await fetch(`${import.meta.env.VITE_BACKEND_PRO_URL}/api/user/setting_change_availability`,{
        method: 'PUT',
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({email: userProfile.email,availability})
      });
      const data = await response.json();
      console.log(data);
      if(response.ok){
        setUserProfile(data.updatedUser);
        setSuccess(true);
        setTimeout(() => {
          setOpenFavoritesEditModal(false);
          setSuccess(false);
        }, 700);
      }
    }catch(err){
      console.log(err);
      throw new Error('Error while updating name.')
    }
  }

  return (
    <div className="pt-12 px-6 md:p-20">
              <h1 className="text-3xl font-medium text-greenbg text-center">
                Availability
              </h1>
              <p className="text-center mt-3 text-md xl:text-lg text-formgray ">
                Who can see sessions on my ‘See availability’ page and book
                sessions with me:
              </p>
              <form onSubmit={handleAvailabilitySave} className="mt-6 space-y-6">
                <div className="flex">
                  <div className="flex items-center h-5">
                    <input
                      id="everyone-radio"
                      aria-describedby="everyone-radio-text"
                      type="radio"
                      value="Everyone"
                      className="mt-4 w-6 h-6 text-textcolor bg-gray-100 border-gray-300 focus:ring-textcolor"
                      checked={availability === "Everyone"}
                      onChange={() => handleAvailabilityChange("Everyone")}
                    />
                  </div>
                  <div className="ms-4 text-md">
                    <label
                      htmlFor="everyone-radio"
                      className="text-md xl:text-lg text-greenbg "
                    >
                      Everyone
                    </label>
                    {availability === "Everyone" && (
                      <p
                        id="everyone-radio-text"
                        className="text-md font-normal text-gray-500 "
                      >
                        All FocusBuddy members can book sessions with you.
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex">
                  <div className="flex items-center h-5">
                    <input
                      id="favorites-radio"
                      aria-describedby="favorites-radio-text"
                      type="radio"
                      value="Favorites only"
                      className="mt-4 w-6 h-6 text-textcolor bg-gray-100 border-gray-300 focus:ring-textcolor"
                      checked={availability === "Favorites only"}
                      onChange={() => handleAvailabilityChange("Favorites only")}
                    />
                  </div>
                  <div className="ms-4 text-md">
                    <label
                      htmlFor="favorites-radio"
                      className="text-md xl:text-lg text-greenbg "
                    >
                      Favorites only
                    </label>
                    {availability === "Favorites only" && (
                      <p
                        id="favorites-radio-text"
                        className="text-md font-normal text-gray-500 "
                      >
                        Only people you have Favorited can book sessions with
                        you and be preferentially matched with you.
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex">
                  <div className="flex items-center h-5">
                    <input
                      id="noone-radio"
                      aria-describedby="noone-radio-text"
                      type="radio"
                      value="No one"
                      className="mt-4 w-6 h-6 text-textcolor bg-gray-100 border-gray-300 focus:ring-textcolor"
                      checked={availability === "No one"}
                      onChange={() => handleAvailabilityChange("No one")}
                    />
                  </div>
                  <div className="ms-4 text-md">
                    <label
                      htmlFor="noone-radio"
                      className="text-md xl:text-lg text-greenbg "
                    >
                      No one
                    </label>
                    {availability === "No one" && (
                      <p
                        id="noone-radio-text"
                        className="text-md font-normal text-gray-500 "
                      >
                        No one can book locked-in sessions with you.
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-10 pt-5 border-t border-gray-200 rounded-b">
                  {
                    availability === userProfile.availabilityStatus?
                    <button
                    disabled
                    type="submit"
                    className="w-full cursor-not-allowed bg-bordercolor py-3 text-md xl:text-lg px-3.5 text-formgray rounded-md border border-formgray"
                  >
                    Save Availability
                  </button>
                  :
                  <button
                    type="submit"
                    className="w-full bg-textcolor py-3 text-md xl:text-lg px-3.5 hover:bg-darkbrown text-white rounded-md transition-all duration-500 ease-in-out"
                  >
                    Save Availability
                  </button>
                  }
                  
                </div>
              </form>
      { success ?  <SuccessToast text={'Availability preference updated.'}/> : null }

    </div>
  );
}
