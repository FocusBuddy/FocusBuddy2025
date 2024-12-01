import { useState } from "react";
import SuccessToast from "../../../Components/UI/toast-components/SuccessToast";
import { stateDistrictMap } from "../../../utils/state_city_list/list";

export default function EditNameModal({
  userProfile,
  setUserProfile,
  setOpenAddLocationModal,
}) {
  const [selectedState, setSelectedState] = useState("");
  const [districtsArr, setDistrictsArr] = useState([]);
  const [district, setDistrict] = useState("");
  const [success, setSuccess] = useState(false);

  const handleStateChange = (event) => {
    const state = event.target.value;
    setSelectedState(state);
    setDistrictsArr(stateDistrictMap[state] || []);
  };



  const handleAddLocation = async (e) => {
    e.preventDefault();
    console.log(selectedState, district);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_DEV_URL}/api/user/add_user_location`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userProfile.email,
            userState: selectedState,
            userDistrict: district
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setUserProfile(data.updatedUser);
        setSuccess(true);
        setTimeout(() => {
            setOpenAddLocationModal(false);
          setSuccess(false);
        }, 700);
      }
    } catch (err) {
      console.log(err);
      throw new Error("Error while updating name.");
    }
  };

  return (
    <div className="pt-12 md:p-20">
      <h1 className="text-3xl font-medium text-greenbg text-center">
        What is your location?
      </h1>
      <p className="mt-3 stext-md xl:text-lg text-formgray text-center">
        Let other users know where you are from.
      </p>
      <form className="mt-8 space-y-6" onSubmit={handleAddLocation}>
        <div className="peer-focus:text-textcolor peer-focus:dark:text-textcolor mt-8 flex gap-4 justify-center">
          <div className="text-textcolor w-[50%] form-group col-md-4">
            <select
              className="form-control block p-4 pt-2 w-full text-textcolor bg-white rounded-lg border-1 border-textcolor appearance-none focus:outline-none focus:ring-0 focus:border-textcolor peer text-md xl:text-lg"
              id="inputState"
              onChange={handleStateChange}
            >
              <option value="" className="">
                Select State
              </option>
              {Object.keys(stateDistrictMap).map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          <div className="text-md xl:text-lg text-textcolor w-[50%] form-group col-md-4">
            <select
              className="form-control block p-4 pt-2 w-full text-textcolor bg-white rounded-lg border-1 border-textcolor appearance-none focus:outline-none focus:ring-0 focus:border-textcolor peer text-md xl:text-lg"
              id="inputDistrict"
              onChange={(e) => setDistrict(e.target.value)}
            >
              <option value="">Select District</option>
              {districtsArr.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-10 pt-5 border-t border-gray-200 rounded-b">
          {((selectedState === "" || district === "") || (selectedState === 'Select State' || district === 'Select District')) ? (
            <button
              disabled
              type="submit"
              className="w-full cursor-not-allowed bg-bordercolor py-4 text-md xl:text-lg px-3.5 text-formgray rounded-md border border-formgray"
            >
              Save location
            </button>
          ) : (
            <button
              type="submit"
              className="w-full bg-textcolor py-4 text-lg px-3.5 hover:bg-darkbrown text-white rounded-md transition-all duration-500 ease-in-out"
            >
              Save location
            </button>
          )}
        </div>
      </form>
      {success ? <SuccessToast text={"Location updated."} /> : null}
    </div>
  );
}
