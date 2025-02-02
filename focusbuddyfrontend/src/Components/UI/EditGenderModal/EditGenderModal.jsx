import { useState } from "react";
import { FaLock } from "react-icons/fa";
import { Tooltip } from "flowbite-react";
import SuccessToast from "../toast-components/SuccessToast";

export default function EditGenderModal({userProfile,setUserProfile,setOpenGenderEditModal}) {
  const [selectedGender, setSelectedGender] = useState(['Prefer not to say']);
  const [showAddInput, setShowAddInput] = useState(false);
  const [additionalGender,setAdditionalGender] = useState('');
  const [success,setSuccess] = useState(false);


// console.log(additionalGender);
const handleCheckboxChange = (value) => {
  // console.log(value);
  setSelectedGender((prev) => {
    if (value === "Prefer not to say") {
      return prev.includes(value) ? [] : [value];
    } else {
      if (prev.includes("Prefer not to say")) {
        return [value];
      }
      if (value === "Transgender" && prev.includes("Cisgender")) {
        return prev.filter((item) => item !== "Cisgender").concat(value);
      }
      if (value === "Cisgender" && prev.includes("Transgender")) {
        return prev.filter((item) => item !== "Transgender").concat(value);
      }
      return prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value];
    }
  });
};


  const handleEditGenderSave = async (e) => {
    e.preventDefault();
    try{
      const response = await fetch(`${import.meta.env.VITE_BACKEND_PRO_URL}/api/user/setting_change_gender`,{
        method: 'PUT',
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({email: userProfile.email,gender:selectedGender})
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
    <div className="px-4 md:px-20 py-0">
      <h1 className="text-3xl font-medium text-greenbg text-center">
        I am....
      </h1>
      <p className="mt-3 text-center text-md xl:text-lg text-formgray">
        This helps find partners for users with a gender preference.
      </p>
      <p className="mt-6 text-center text-md xl:text-lg text-formgray">
        Choose one or more genders:
      </p>

      <form onSubmit={handleEditGenderSave}>
        <div className="mt-6 space-x-6 md:space-x-10 space-y-2 md:space-y-4 flex flex-wrap border border-x-0 border-t-0 pb-8 border-b-formgray">
          <div className="flex w-fit items-center px-4 border border-gray-200 rounded hover:border-formgray">
            <input
              id="woman-checkbox-1"
              type="checkbox"
              value=""
              name="woman-checkbox"
              className="w-4 h-4 text-textcolor bg-gray-100 border-gray-300 rounded focus:ring-textcolor "
              checked={selectedGender.includes("Woman")}
              onChange={() => handleCheckboxChange("Woman")}
            />
            <label
              htmlFor="woman-checkbox-1"
              className="w-full py-4 ms-2 text-sm font-medium"
            >
              Woman
            </label>
          </div>

          <div className="flex w-fit items-center px-4 border border-gray-200 rounded hover:border-formgray">
            <input
              id="man-checkbox-2"
              type="checkbox"
              value=""
              name="man-checkbox"
              className="w-4 h-4 text-textcolor bg-gray-100 border-gray-300 rounded focus:ring-textcolor "
              checked={selectedGender.includes("Man")}
              onChange={() => handleCheckboxChange("Man")}
            />
            <label
              htmlFor="man-checkbox-2"
              className="w-full py-4 ms-2 text-sm font-medium"
            >
              Man
            </label>
          </div>
          <Tooltip
            content="Term used by some people who experience their gender as falling outside the categories of man and woman"
            className="text-xs font-normal w-[50%] xl:w-[30%] text-center"
          >
            <div className="flex w-fit items-center px-4 border border-gray-200 rounded hover:border-formgray">
              <input
                id="nonbinary-checkbox-2"
                type="checkbox"
                value=""
                name="nonbinary-checkbox"
                className="w-4 h-4 text-textcolor bg-gray-100 border-gray-300 rounded focus:ring-textcolor "
                checked={selectedGender.includes("Non-binary")}
                onChange={() => handleCheckboxChange("Non-binary")}
              />
              <label
                htmlFor="nonbinary-checkbox-2"
                className="w-full py-4 ms-2 text-sm font-medium"
              >
                Non-binary
              </label>
            </div>
          </Tooltip>

          <Tooltip
            content="Umbrella term for people whose gender differs from what is typically associated with the sex they were assigned at birth"
            className="text-xs font-normal w-[50%] xl:w-[30%] text-center"
            placement="top"
          >
            <div className="flex w-fit items-center px-4 border border-gray-200 rounded hover:border-formgray">
              <input
                id="transgender-checkbox-2"
                type="checkbox"
                value=""
                name="transgender-checkbox"
                className="w-4 h-4 text-textcolor bg-gray-100 border-gray-300 rounded focus:ring-textcolor "
                checked={selectedGender.includes("Transgender")}
                onChange={() => handleCheckboxChange("Transgender")}
              />
              <label
                htmlFor="transgender-checkbox-2"
                className="w-full py-4 ms-2 text-sm font-medium"
              >
                Transgender
              </label>
            </div>
          </Tooltip>

          <Tooltip
            content="Term for a person whose gender aligns with what is typically associated with the sex assigned to them at birth"
            className=" text-xs font-normal w-[50%] xl:w-[30%] text-center"
            placement="top"
          >
            <div className="flex w-fit items-center px-4 border border-gray-200 rounded hover:border-formgray">
              <input
                id="cisgender-checkbox-2"
                type="checkbox"
                value=""
                name="cisgender-checkbox"
                className="w-4 h-4 text-textcolor bg-gray-100 border-gray-300 rounded focus:ring-textcolor "
                checked={selectedGender.includes("Cisgender")}
                onChange={() => handleCheckboxChange("Cisgender")}
              />
              <label
                htmlFor="cisgender-checkbox-2"
                className="w-full py-4 ms-2 text-sm font-medium"
              >
                Cisgender
              </label>
            </div>
          </Tooltip>

          <div className="flex w-fit items-center px-4 border border-gray-200 rounded hover:border-formgray">
            <input
              id="nosay-checkbox-2"
              type="checkbox"
              value=""
              name="nosay-checkbox"
              className="w-4 h-4 text-textcolor bg-gray-100 border-gray-300 rounded focus:ring-textcolor "
              checked={selectedGender.includes("Prefer not to say")}
              onChange={() => handleCheckboxChange("Prefer not to say")}
            />
            <label
              htmlFor="nosay-checkbox-2"
              className="w-full py-4 ms-2 text-sm font-medium"
            >
              Prefer not to say
            </label>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowAddInput(!showAddInput)
              setSelectedGender((prev) => prev.includes("Prefer not to say") ?  [] : [prev])
            }}
            className="border border-gray-200 rounded px-4 hover:bg-formgray hover:text-white"
          >
            Add +
          </button>
        </div>
        {showAddInput ?
        selectedGender.some((item) => item !== "Prefer not to say") ?
          null
        :
        <div className="mt-5">
            <label
              htmlFor="additional_gender"
              className="block mb-2 text-md xl:text-lg text-formgray dark:text-white"
            >
              Additional gender(s)
            </label>
            <input
              type="text"
              id="additional_gender"
              className="bg-gray-50 border border-gray-300 hover:border-textcolor text-md xl:text-lg rounded-lg focus:ring-textcolor focus:border-textcolor block w-full p-2.5"
              placeholder=""
              value={additionalGender}
              onChange={(e) => setAdditionalGender(e.target.value)}
              required
            />
          </div>
      :null}
        <p className="flex items-center justify-center gap-2 mt-6 text-md text-formgray">
          {" "}
          <FaLock />
          Gender is not shown on your profile.
        </p>

        <div className="mt-10 pt-5 border-t border-gray-200 rounded-b">
          
          <button
            type="submit"
            className="w-full bg-textcolor py-3 text-md xl:text-lg px-3.5 hover:bg-darkbrown text-white rounded-md transition-all duration-500 ease-in-out"
          >
            Save Gender(s)
          </button>
           </div>
      </form>
      <p className="mt-6 text-center text-md text-formgray">
        FocusBuddy supports Transgender inclusion and gender diversity.
      </p>
      { success ?  <SuccessToast text={'Gender(s) updated.'}/> : null }

    </div>
  );
}
