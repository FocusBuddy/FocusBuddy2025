import { Link, NavLink,useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaCaretDown } from "react-icons/fa";
import { FaCalendarCheck } from "react-icons/fa6";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaStar } from "react-icons/fa6";
import {initFlowbite} from 'flowbite'


export default function DashboardInnerNav() {
  // const [dropdown, setDropdown] = useState(false);
  const location = useLocation();

  useEffect(() => {
    initFlowbite();
  },[]);

  return (
    <>
      <nav className="flex md:container mx-auto text-[14px] lg:text-lg py-6 px-4">
        <div className="w-[60%] md:w-[50%] relative">
          <NavLink
            to={"/dashboard"}
            end
            className={(location.pathname === "/dashboard") ? "me-4 lg:me-10 active" : "me-4 lg:me-10 inactive"}
            // style={{marginRight: '40px'}}
            // className="text-textcolor mx-4 hover:text-greenbg"
          >
            Calendar
          </NavLink>
          <NavLink
            to={"/sessions-list"}
            className={(location.pathname === "/sessions-list") ? "me-4 lg:me-10 active" : "me-4 lg:me-10 inactive"}
            // style={{marginRight: '40px'}}
          >
            Sessions
          </NavLink>

          <NavLink
          id="innerDashboardNavbar"
          data-dropdown-toggle="innerDashboarddropdown"
            className={(location.pathname.startsWith("/profile")) ? "active" : "inactive"}
            // style={{marginRight: '40px'}}
            // className="inline-flex text-textcolor mx-4 hover:text-greenbg text-md xl:text-lg"
            type="button"
            // onClick={() => setDropdown(!dropdown)}
          >
            <span className="sr-only">Open user menu</span>
            People <FaCaretDown/>
          </NavLink>
          <div
          id='innerDashboarddropdown'
            className={
                // ? "inline z-10 absolute top-8 xl:top-0 left-[40%] bg-white divide-y divide-gray-100 rounded-md shadow w-56"
                 "z-40 hidden bg-white divide-y divide-gray-100 rounded-md shadow-lg w-56"
            }
          >
            <ul
            aria-labelledby="innerDashboardNavbar"
              className="py-2 text-xm xl:text-lg space-y-2 text-formgray"
            >
              <li>
                <Link to={"/profile/favorites/availability"} className="flex items-center gap-2 px-4 py-2 hover:bg-greenbg hover:text-white">
                  <FaCalendarCheck/>Favorites Availability
                </Link>
              </li>
              <li>
                <Link
                  to={"/profile/people/favorites"}
                  className="flex items-center gap-2 px-4  py-2 hover:bg-greenbg hover:text-white"
                >
                  <FaStar/>Favorites
                </Link>
              </li>
              <li>
                <Link
                  to={"/profile/people/allpartners"}
                  className="flex items-center gap-2 px-4  py-2 hover:bg-greenbg hover:text-white"
                >
                  <BsFillPeopleFill/>All Partners
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-[40%] md:w-[50%] text-end">
          <Link to={'/session/test-session'} target={'_blank'} rel="noopener noreferrer"  className="text-textcolor px-0 md:px-4 hover:text-greenbg ">
            Lauch Test Session
          </Link>
        </div>
      </nav>
    </>
  );
}
