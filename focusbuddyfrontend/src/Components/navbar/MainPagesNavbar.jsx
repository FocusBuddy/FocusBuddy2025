import { useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { initFlowbite} from 'flowbite'
import BrownButtonOnBlue from "../UI/BrownButtonOnBlue/BrownButtonOnBlue";

export default function RegisterPagesNavbar() {
  const [openNav,setOpenNav] = useState(false);
  const [openDropdown,setOpenDropdown] = useState(false);
  const location = useLocation();
  console.log(location);

  useEffect(() => {
    setOpenDropdown(false);
    setOpenNav(false);
  },[location.key])
  
useEffect(() => {
  initFlowbite();
},[]);

console.log(openNav,openDropdown)
  return (
    <nav className="sticky top-0 z-50 pb-2 rounded-b-[100px] bg-greenbg border-gray-200">
      <div className="lg:max-w-screen-2xl px-10 md:px-16 2xl:px-0 flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center text-2xl lg:text-4xl text-white whitespace-nowrap">
            FocusBuddy
          </span>
        </Link>
        <button
          data-collapse-toggle="navbar-dropdown"
          type="button"
          
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-lg text-white rounded-lg md:hidden hover:bg-textcolor focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="navbar-dropdown"
          // aria-expanded="false"
          aria-expanded="false"
          onClick={() => setOpenNav(!openNav)}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5 "
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
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div 
        // className={`z-10 font-normal max-h-screen bg-white divide-y divide-gray-100 rounded-lg shadow overflow-hidden transition-max-height duration-300 ease-in-out ${openNav ? 'max-h-screen' : 'max-h-0'}`}
        className={`w-full md:w-[50%] overflow-hidden transition-max-height duration-300 ease-in-out ${openNav ? 'max-h-screen' : 'max-h-0 md:max-h-screen'}`}
        // className={openNav ? "block w-full md:block md:w-auto" : "hidden w-full md:block md:w-auto"} 
        id="navbar-dropdown"
        >
          <ul className="flex flex-col justify-end w-full bg-white md:bg-transparent text-md xl:text-lg p-4 md:p-0 mt-4 border border-gray-100 rounded-lg space-y-1 md:space-y-0 md:space-x-10 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
            <li className="my-auto">
              <button
                id="productdropdownbutton"
                data-dropdown-toggle="productdropdown"
                className="flex items-center justify-between w-full py-2 px-3 text-md xl:text-lg text-textcolor md:text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 ps-4 md:ps-0 md:p-0 md:w-auto"

                onClick={() => setOpenDropdown(!openDropdown)}
              >
                Product{" "}
                <svg
                  className="w-2.5 h-2.5 ms-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>

              <div
                id="productdropdown"
                className={`z-10 ${openDropdown ? 'block' : 'hidden'} divide-y bg-white divide-gray-100 rounded-lg shadow w-80`}
                style={{ minWidth: '10rem', top: '100%' }}
              >
                <ul
                  aria-labelledby="productdropdownbutton"
                  className="py-2 text-md xl:text-lg text-textcolor"
                >
                  <li>
                    <Link
                      to={"/how-it-works"}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      How It Works
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/features"}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/use-cases"}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      What Can I Do On FocusBuddy ?
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/science"}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      The Science Behind FocusBuddy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"pricing"}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
            <li className="flex items-center">
              <Link
                to={"/faq"}
                className="ps-4 md:ps-0 block py-2 px-3 text-textcolor md:text-white md:border-0 md:p-0"
              >
                FAQ
              </Link>
            </li>
            <li className="flex items-center">
              <Link
                to={"/login"}
                className="ps-4 md:ps-0 block py-2 px-3 text-textcolor md:text-white md:border-0 md:p-0"
              >
                Sign in
              </Link>
            </li>
            <li>
              <Link
                to={"/signup"}
                className="block py-2 px-3 text-white md:border-0 md:p-0"
              >
                <BrownButtonOnBlue text={"Join for free"} />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
