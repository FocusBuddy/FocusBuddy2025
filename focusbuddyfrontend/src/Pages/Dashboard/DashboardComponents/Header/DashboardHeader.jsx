import { useContext } from "react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useEffect,useRef } from "react";
import { FaCaretDown } from "react-icons/fa";
import { myContext } from "../../../../utils/PrivateRoutes";
import { initFlowbite } from "flowbite";


const DashboardHeader = () => {
  const {userProfile,columns,setColumns} = useContext(myContext);
  const location = useLocation();

  useEffect(() => {
    // Reinitialize Flowbite dropdowns on mount or when route changes
    initFlowbite();
  }, [location.key]);

  function showColumns(){
    setColumns(!columns);
  }

  
    return(
        <div className={`dashboard-header flex ${userProfile.welcomeChecklistState.final === true ? 'mt-6' : 'mt-16' } md:mt-8 p-6 bg-white rounded-lg shadow`}>
          <div className="flex items-center gap-4 w-[40%] md:w-[33.33%]">
            <button type="button" onClick={showColumns}>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                color="#583531"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          </div>
          <div className="w-[50%] md:w-[33.33%] flex justify-center">
          <ul className="flex">
            <li>
              <Link to={'/dashboard'} className="text-md xl:text-lg text-textcolor py-2 px-3  hover:text-greenbg" aria-current="page">
                Calendar
              </Link>
            </li>
            <li>
              <Link to={'/sessions-list'} className="text-md xl:text-lg text-textcolor py-2 px-3  hover:text-greenbg">
                Session
              </Link>
            </li>
            <li>
              
          <Link
            id="calendarheaderbutton"
            data-dropdown-toggle="calendarheaderdropdown"
            data-dropdown-placement="bottom-start"
            // className={({ isActive }) => (isActive ? 'active' : 'inactive')}
            className="inline-flex items-center text-textcolor mx-4 hover:text-greenbg text-md xl:text-lg"
            // type="button"
            // onClick={() => setDropdown(!dropdown)}
          >
            <span className="sr-only">Open user menu</span>
            People <FaCaretDown/>
          </Link>

          <div
            id="calendarheaderdropdown"
            className={
                // ? "inline z-10 absolute bg-greenbg divide-y divide-gray-100 rounded-md shadow-bordercolor shadow-xl w-64"
                "z-10 hidden bg-greenbg divide-y divide-gray-100 rounded-md shadow-bordercolor shadow-xl w-64"
            }
          >
            <ul
            aria-labelledby="calendarheaderbutton"
              className="py-2 text-md xl:text-lg space-y-4 text-white"
            >
              <li>
                <Link to={"/profile/favorites/availability"} className="block py-2 px-4 hover:bg-white hover:text-greenbg">
                  Favorites Availability
                </Link>
              </li>
              <li>
                <Link
                  to={"/profile/people/favorites"}
                  className="block py-2 px-4 hover:bg-white hover:text-greenbg"
                >
                  Favorites
                </Link>
              </li>
              <li>
                <Link
                  to={"/profile/people/allpartners"}
                  className="block py-2 px-4 hover:bg-white hover:text-greenbg"
                >
                  All Partners
                </Link>
              </li>
            </ul>
          </div>
            </li>
          </ul>
          </div>
          <div className="w-[40%] md:w-[33.33%] text-end hidden sm:block">

          <Link to={'/session/test-session'} target={'_blank'} rel="noopener noreferrer" className="text-md xl:text-lg text-textcolor hover:text-greenbg">Lauch Test Session</Link>
          </div>
        </div>
    )
};

export default DashboardHeader;