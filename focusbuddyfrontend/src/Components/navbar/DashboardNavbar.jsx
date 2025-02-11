import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect, useContext, useRef } from "react";
import { myContext } from "../../utils/PrivateRoutes";
import { MdLiveHelp } from "react-icons/md";
import { IoCheckbox } from "react-icons/io5";
import WelcomeCheckList from "../../Pages/Dashboard/WelcomeChecklist";
import {initFlowbite} from 'flowbite';

const DashboardNavbar = () => {
  const { userProfile,setUserProfile, setAuthenticated, updatedImg } = useContext(myContext);
  // console.log(updatedImg);
  const [openDropdown, setOpenDropdown] = useState(false);
  // const [dropdown, setDropdown] = useState(false);
  const [welcomeCheckListModal,setWelcomeCheckListModal] = useState(false);
  const [finalDone, setFinalDone] = useState(userProfile.welcomeChecklistState.final);
  // const [closeCheckList,setCloseCheckList] = useState(false);
  // const [openChecklistAutomatically,setOpenChecklistAutomatically] = useState(true) ;
  const [openChecklistAutomatically,setOpenChecklistAutomatically] = useState(userProfile.automaticallyPopUpWelcome) ;
  const navigate = useNavigate();
  const location = useLocation();

  // useEffect(() => {
  //   const checkautopopup = async() => {
  //     try{
  //       const response = await fetch(
  //         `${
  //           import.meta.env.VITE_BACKEND_PRO_URL
  //         }/api/user/automaticchecklistpopup?email=${
  //           userProfile.email
  //         }`,
  //         {
  //           method: "GET",
  //         }
  //       );
  //       const data = await response.json();
  //       if (response.ok) {
  //         // setUserProfile(data.updateduser);
  //         setOpenChecklistAutomatically(data.updateduser.automaticallyPopUpWelcome);
  //       }
  //     }catch(err){
  //       console.log(err);
  //       throw new Error("Error while closing welcome checklist.");
  //     }
  //   }
  //   checkautopopup();
  // },[]);
  // console.log(welcomeCheckListModal);

  useEffect(() => {
    setOpenDropdown(false);
  }, [location]);

  useEffect(() => {
    initFlowbite();
    if(userProfile.automaticallyPopUpWelcome){
      localStorage.setItem("automaticallyPopUpWelcome", true);
    }
  },[])

  // useEffect(() => {
  //   const close_automatic_popup = async() => {
  //     try {
  //       const response = await fetch(`${import.meta.env.VITE_BACKEND_PRO_URL}/api/user/automaticallypopupchecklist`, {
  //         method: 'POST',
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ email: userProfile.email })
  //       });
  
  //       const data = await response.json();
  //       console.log(data);
  
  //       if (response.ok) {
  //         // setUserProfile(data.updateduser);
  //         // setOpenChecklistAutomatically(data.updateduser.automaticallyPopUpWelcome);
  //         localStorage.setItem("automaticallyPopUpWelcome",false);
  //       }
  //     } catch (err) {
  //       console.log(err);
  //       throw new Error("Error while closing welcome checklist.");
  //     }
  //   }

  //   if (localStorage.getItem("automaticallyPopUpWelcome") === "true" && closeCheckList) {
  //    close_automatic_popup(); 
  //   }

  // },[closeCheckList])


  const handleSignOut = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_PRO_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setAuthenticated(false);
        navigate("/");
      } else {
        const data = await response.json();
        // console.log(data);
      }
    } catch (err) {
      console.log(err);
      throw new Error("Error while sigining out.");
    }
  };
// console.log(location.pathname);

// console.log("WCLM",welcomeCheckListModal,"OCLA",openChecklistAutomatically,"local",localStorage.getItem("automaticallyPopUpWelcome"))

const handleClose = async () => {
  // console.log("handle close")
  setWelcomeCheckListModal(false);
  // setCloseCheckList(true);
  setOpenChecklistAutomatically(false);

  const close_automatic_popup = async() => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_PRO_URL}/api/user/automaticallypopupchecklist`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userProfile.email })
      });

      const data = await response.json();
      // console.log(data);

      if (response.ok) {
        // setUserProfile(data.updateduser);
        // setOpenChecklistAutomatically(data.updateduser.automaticallyPopUpWelcome);
        localStorage.setItem("automaticallyPopUpWelcome",false);
      }
    } catch (err) {
      console.log(err);
      throw new Error("Error while closing welcome checklist.");
    }
  }

  if (localStorage.getItem("automaticallyPopUpWelcome") === "true") {
   close_automatic_popup(); 
  }
  
};



  return (
    <>
    <nav
      className="flex sticky top-0 bg-greenbg py-4 px-2 lg:px-10 h-20 text-white"
      style={{ zIndex: 9999 }}
    >
      <div className={`${location.pathname === '/dashboard' ? userProfile.welcomeChecklistState.finalDone === false ? 'my-auto w-[30%] md:w-[33.33%]' : 'my-auto w-[30%] lg:w-[50%]' : 'my-auto w-[30%] lg:w-[50%]'}`}>
        <Link to={"/dashboard"} className="text-white text-2xl lg:text-4xl">
          FocusBuddy
        </Link>
      </div>
      {
        location.pathname === '/dashboard' && 
      <div className={`${finalDone ? 'invisible w-0' : 'absolute w-[63%] md:w-[60.33%]'} md:static top-24 md:top-20 left-16 md:flex justify-center  cursor-pointer`} onClick={() => setWelcomeCheckListModal(true)}>
        <div className="flex gap-2 bg-white px-4 py-2 rounded-md">
        <p className="text-[12px] xl:text-lg font-medium text-textcolor my-auto">WELCOME CHECKLIST</p>
        <div className="flex gap-1 text-xs md:text-xl my-auto">
          <IoCheckbox className={`hover:-translate-y-1 transition-all duration-500 ease-in-out cursor-pointer ${userProfile.welcomeChecklistState.works ? "text-greenbg" : "text-bordercolor"}`}/>
          <IoCheckbox className={`hover:-translate-y-1 transition-all duration-500 ease-in-out cursor-pointer ${userProfile.welcomeChecklistState.guidelines ? "text-greenbg" : "text-bordercolor"}`}/>
          <IoCheckbox className={`hover:-translate-y-1 transition-all duration-500 ease-in-out cursor-pointer ${userProfile.welcomeChecklistState.booking ? "text-greenbg" : "text-bordercolor"}`}/>
          <IoCheckbox className={`hover:-translate-y-1 transition-all duration-500 ease-in-out cursor-pointer ${finalDone ? "text-greenbg" : "text-bordercolor"}`}/>
          </div>
        </div>
      </div>
      }
      <div className={`${location.pathname === '/dashboard' ? userProfile.welcomeChecklistState.finalDone === false ? 'w-[70%] md:w-[33.33%]' : 'w-[70%] lg:w-[50%]' : 'w-[70%] lg:w-[50%]'} flex gap-2 lg:gap-4 justify-end items-center`}>
        <Link to={'/account/upgrade'} className="py-2 rounded-md hover:bg-white hover:text-textcolor px-3 border-2 border-white text-[12px] lg:text-lg">Upgrade</Link>
        <div
          id="helpdropdownbutton"
          data-dropdown-toggle="helpdropdown"
          className="group flex gap-2 p-2 font-medium border-2 border-white hover:bg-white hover:text-textcolor rounded-md items-center text-[12px] lg:text-lg cursor-pointer"
          type="button"
          // onClick={() => setDropdown(!dropdown)}
        >
          <span className="sr-only">Open user menu</span>
          <MdLiveHelp className="text-lg lg:text-2xl group-hover:text-textcolor cursor-pointer" />{" "}
          Help
        </div>
        <div
        id="helpdropdown"
          className={
              // ? "inline z-10 absolute right-20 top-[70px] bg-white divide-y divide-gray-100 rounded-md shadow-lg w-50"
              "z-10 hidden bg-white divide-y divide-gray-100 rounded-md shadow-lg w-50"
          }
        >
          <ul 
          aria-labelledby="helpdropdownbutton"
          className="py-2 text-xs xl:text-lg space-y-2 text-formgray">
            <li>
              <Link
                to={"/community"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex no-underline items-center gap-2 px-4 py-2 text-formgray hover:bg-greenbg hover:text-white"
              >
                Community Guidelines
              </Link>
            </li>
            {/* <li>
              <a
                href="mailto:rupeshchincholkar14@gmail.com"
                className="flex cursor-pointer items-center gap-2 px-4  py-2 hover:bg-greenbg hover:text-white"
              >
                Report a Bug
              </a>
            </li> */}
            <li>
              <Link
                to={"/contact"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex cursor-pointer items-center gap-2 px-4  py-2 hover:bg-greenbg hover:text-white"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <button
        id="imagedropdownbutton"
          data-dropdown-toggle="imagedropdown"
          data-dropdown-placement="bottom-start"
          className="flex text-sm bg-white rounded-full md:me-0 border-4 border-white"
          // type="button"
          // onClick={() => setOpenDropdown(!openDropdown)}
        >
          <span className="sr-only">Open user menu</span>
          <img
            className="w-8 h-8 lg:w-10 lg:h-10 rounded-full"
            src={updatedImg}
            alt="user photo"
          />
        </button>

        <div
        id="imagedropdown"
          // className={
          //   openDropdown
          //     ? "z-10 left-0 top-[72px] absolute bg-white divide-y divide-gray-100 rounded-md shadow w-50"
          //     : "z-10 hidden bg-white divide-y divide-gray-100 rounded-md shadow w-50"
          // }
          className={`z-10 hidden divide-y bg-white divide-gray-100 rounded-lg shadow w-80`}
          // className={`z-10 ${openDropdown ? 'block' : 'hidden'} divide-y bg-white divide-gray-100 rounded-lg shadow w-80`}
        >
          <div  className="px-4 py-3 text-gray-900">
            <div className="font-medium text-textcolor text-md xl:text-lg capitalize ">
              {userProfile.displayName}
            </div>
            <div className="text-sm xl:text-lg mt-1 text-formgray truncate">
              {userProfile.email}
            </div>
          </div>
          <ul
          aria-labelledby="imagedropdownbutton"
            className="py-2 text-sm xl:text-lg  text-formgray"
          >
            <li>
              <Link
                to={"/profile"}
                className="block py-2 px-4 hover:bg-greenbg hover:text-white"
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                to={"/profile/settings"}
                className="block py-2 px-4  hover:bg-greenbg hover:text-white"
              >
                Settings
              </Link>
            </li>
          </ul>
          <div className="">
            <button
              type="button"
              className="w-full block px-4 py-2 text-sm xl:text-lg text-start text-formgray hover:bg-greenbg hover:text-white"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>

    {(welcomeCheckListModal || openChecklistAutomatically) && 
        <WelcomeCheckList 
          // setWelcomeCheckListModal={setWelcomeCheckListModal}
          // welcomeCheckListModal={welcomeCheckListModal}
          finalDone={finalDone} 
          setFinalDone={setFinalDone} 
          handleClose={handleClose}
          // setOpenChecklistAutomatically={setOpenChecklistAutomatically}
          />}
    </>
  );
};

export default DashboardNavbar;
