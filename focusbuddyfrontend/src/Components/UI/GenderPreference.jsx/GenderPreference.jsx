import { useState } from "react";
import SuccessToast from "../toast-components/SuccessToast";



export default function GenderPreference({
  userProfile,
  setUserProfile,
  setOpenGenderPreferenceModal,
  setOpenGenderEditModal,
}) {
  const handleSetGender = () => {
    setOpenGenderPreferenceModal(false);
    setOpenGenderEditModal(true);
  };

  const [preference, setPreference] = useState(false);
  const [matchWith,setMatchWith] = useState("everyone");
  const [noMatchWith,setNoMatchWith] = useState("everyone");
  const [success,setSuccess] = useState(false);


  const handleMatchWith = (value) => {
    setMatchWith(value);
  };
  const handleNoMatchWith = (value) => {
    setNoMatchWith(value);
  };

  const handleGenderPreferenceSave = async (e) => {
    e.preventDefault();
    try{
      const response = await fetch(`${import.meta.env.VITE_BACKEND_PRO_URL}/api/user/setting_change_gender_preference`,{
        method: 'PUT',
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({email: userProfile.email,matchWith,noMatchWith})
      });
      const data = await response.json();
      // console.log(data);
      if(response.ok){
        setUserProfile(data.updatedUser);
        setSuccess(true);
        setTimeout(() => {
          setOpenGenderEditModal(false);
          setSuccess(false);
        }, 700);
      }
    }catch(err){
      console.log(err);
      throw new Error('Error while updating name.')
    }
  }

  return (
    <div className="pt-12 md:px-20 md:py-10">
      <h1 className="text-3xl font-medium text-greenbg text-center">
        Gender Preference
      </h1>
      {userProfile.userGender[0] === "Prefer not to say" ? (
        <>
          <p className="mt-3 text-md xl:text-lg text-formgray text-center">
            To set a gender preference, you'll need to set your gender.
          </p>
          <p className="mt-6 text-md xl:text-lg text-formgray text-center">
            Your gender determines your matching options.
          </p>
          <div className="mt-10 pt-5 border-t border-gray-200 rounded-b">
            <button
              type="button"
              onClick={handleSetGender}
              className="w-full bg-textcolor py-3 text-lg px-3.5 hover:bg-darkbrown text-white rounded-md transition-all duration-500 ease-in-out"
            >
              Save Gender(s)
            </button>
          </div>
          <p className="mt-6 text-center text-md text-formgray">
            FocusBuddy supports transgender inclusion and gender diversity.
          </p>
        </>
      ) : (userProfile.userGender.length < 2 && (userProfile.userGender[0] === 'Man' || userProfile.userGender[0] === 'Woman')) ? (
        <div>
          <p className="mt-4 mb-8 text-md xl:text-lg text-center text-formgray">Your gender determines your matching options.<span className="text-greenbg">({userProfile.userGender.join()})</span></p>
          <p className="mt-6 text-md xl:text-lg text-formgray">Match me with:</p>
          <form onSubmit={handleGenderPreferenceSave} className="mt-4 space-y-2">
            <div className="flex">
            <div className="flex items-center h-5">
              <input
                id="everyone-radio"
                aria-describedby="everyone-radio-text"
                type="radio"
                value="Everyone"
                className="mt-4 w-4 h-4 md:w-6 md:h-6 text-textcolor bg-gray-100 border-gray-300 focus:ring-textcolor"
                checked={matchWith === "everyone"}
                onChange={() => handleMatchWith("everyone")}
              />
            </div>
            <div className="ms-4 text-md">
              <label
                htmlFor="everyone-radio"
                className="text-md xl:text-lg text-greenbg "
              >
                Everyone
              </label>
            </div>
          </div>

          <div className="flex">
            <div className="flex items-center h-5">
              <input
                id="radio2"
                aria-describedby="radio2-radio-text"
                type="radio"
                value=""
                className="mt-4 w-4 h-4 md:w-6 md:h-6 text-textcolor bg-gray-100 border-gray-300 focus:ring-textcolor"
                checked={matchWith === userProfile.userGender[0]}
                onChange={() => handleMatchWith(userProfile.userGender[0])}
              />
            </div>
            <div className="ms-4 text-md">
              <label
                htmlFor="radio2"
                className="text-md xl:text-lg text-greenbg "
              >
                Only {userProfile.userGender[0] === 'Man' ? 'Men' : userProfile.userGender[0] === 'Woman' ? 'Women' : userProfile.userGender[0]}
              </label>
            </div>
          </div>

          <div className="pt-10  rounded-b">
                  <button
                    type="submit"
                    className="w-full bg-textcolor py-3 text-md xl:text-lg px-3.5 hover:bg-darkbrown text-white rounded-md transition-all duration-500 ease-in-out"
                  >
                    Save gender preference
                  </button>
                </div>
          </form>
          <p className="mt-6 text-center text-md text-formgray">
        FocusBuddy supports Transgender inclusion and gender diversity.
      </p>
        </div>
      ) : (
        
        <div className="mt-8">
          <p className="mt-4 mb-8 text-md xl:text-lg text-center text-formgray">Your gender determines your matching options.<span className="text-greenbg">({userProfile.userGender.join()})</span></p>
          <div className="flex">
            <button
              type="button"
              className={`basis-1/2 py-2 text-formgray text-md xl:text-lg rounded-s-md border border-formgray ${
                preference ? "bg-transparent" : "bg-textcolor text-white"
              }`}
              onClick={() => setPreference(false)}
            >
              OFF
            </button>
            <button
              type="button"
              className={`basis-1/2 py-2 text-formgray text-md xl:text-lg rounded-e-md border border-formgray ${
                preference ? "bg-textcolor text-white" : "bg-transparent"
              }`}
              onClick={() => setPreference(true)}
            >
              ON
            </button>
          </div>
          <div className={`mt-6 ${preference ? 'opacity-100' : 'opacity-60'}`}>
            <p className="text-md xl:text-lg text-formgray">Don't match me with:</p>
            <form onSubmit={handleGenderPreferenceSave} className="mt-4 space-y-2">
              <div className="flex">
                <div className="flex items-center h-5">
                  <input
                    disabled={!preference}
                    id="radio3"
                    aria-describedby="radio3-radio-text"
                    type="radio"
                    value=""
                    className="mt-4 w-6 h-6 text-textcolor bg-gray-100 border-gray-300 focus:ring-textcolor"
                    checked={noMatchWith === "Men"}
                onChange={() => handleNoMatchWith("Men")}
                  />
                </div>
                <div className="ms-4 text-md">
                  <label
                    htmlFor="radio3"
                    className="text-md xl:text-lg text-greenbg "
                  >
                    Men
                  </label>
                </div>
              </div>
              <div className="flex">
                <div className="flex items-center h-5">
                  <input
                  disabled={!preference}
                    id="radio4"
                    aria-describedby="radio4-radio-text"
                    type="radio"
                    value=""
                    className="mt-4 w-4 h-4 md:w-6 md:h-6 text-textcolor bg-gray-100 border-gray-300 focus:ring-textcolor"
                    checked={noMatchWith === "Cisgender Men"}
                onChange={() => handleNoMatchWith("Cisgender Men")}
                  />
                </div>
                <div className="ms-4 text-md">
                  <label
                    htmlFor="radio4"
                    className="text-md xl:text-lg text-greenbg "
                  >
                    Cisgender men
                  </label>
                </div>
              </div>
              <div className="flex">
                <div className="flex items-center h-5">
                  <input
                    disabled={!preference}
                    id="radio5"
                    aria-describedby="radio5-radio-text"
                    type="radio"
                    value=""
                    className="mt-4 w-4 h-4 md:w-6 md:h-6 text-textcolor bg-gray-100 border-gray-300 focus:ring-textcolor"
                    checked={noMatchWith === "Women"}
                onChange={() => handleNoMatchWith("Women")}
                  />
                </div>
                <div className="ms-4 text-md">
                  <label
                    htmlFor="radio5"
                    className="text-md xl:text-lg text-greenbg "
                  >
                    Women
                  </label>
                </div>
              </div>
              <div className="flex">
                <div className="flex items-center h-5">
                  <input
                  disabled={!preference}
                    id="radio6"
                    aria-describedby="radio6-radio-text"
                    type="radio"
                    value=""
                    className="mt-4 w-4 h-4 md:w-6 md:h-6 text-textcolor bg-gray-100 border-gray-300 focus:ring-textcolor"
                    checked={noMatchWith === "Cisgender Women"}
                onChange={() => handleNoMatchWith("Cisgender Women")}
                  />
                </div>
                <div className="ms-4 text-md">
                  <label
                    htmlFor="radio6"
                    className="text-md xl:text-lg text-greenbg "
                  >
                    Cisgender women
                  </label>
                </div>
              </div>

              <div className="pt-10  rounded-b">
                  <button
                    type="submit"
                    disabled={!preference}
                    className="w-full bg-textcolor py-3 text-md xl:text-lg px-3.5 hover:bg-darkbrown text-white rounded-md transition-all duration-500 ease-in-out"
                  >
                    Save gender preference
                  </button>
                </div>

            </form>
          </div>
        </div>
      )}

      { success ?  <SuccessToast text={'Gender preference updated.'}/> : null }
      
    </div>
  );
}
