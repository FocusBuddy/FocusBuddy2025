import { Outlet , Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState, createContext } from "react";
import Loading from "../Components/UI/LoadingComponent/Loading";
import React from 'react';
import DashboardNavbar from "../Components/navbar/DashboardNavbar";
import fetchEvents from "./fetchEvents/fetchEvents";
import ConditionalNavbar from "./ConditionalNavbar";


const myContext = createContext();

function PrivateRoutes (){
  const [authenticated, setAuthenticated] = useState(null);
  const [userProfile,setUserProfile] = useState(null);
  const [updatedImg,setUpdatedImg] = useState(null);
  const [profile,setProfile] = useState(null)
  const [showJoin, setShowJoin] = useState(false);
  const [startEvent, setStartEvent] = useState(false);
  const [missedEvent, setMissedEvent] = useState(null);
  const [appointments , setAppointments] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showDeleteMsg,setShowDeleteMsg] = useState(false);
  const [showEditMsg,setShowEditMsg] = useState(false);
  const [columns, setColumns] = useState(true);
  // const [activeEventTab, setActiveEventTab] = useState("deskEvent");
  const [activePartnerTab, setActivePartnerTab] = useState("anyonePartner");
  const [isThereError, setIsThereError] = useState(false);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);
  const [quiteMode,setQuiteMode] = useState(false);
  const [openUpEditModal,setOpenUpEditModal] = useState(false);
  const [openEbEditModal,setOpenEbEditModal] = useState(false);
  const [editEvent,setEditEvent] = useState(null);
  const navigate = useNavigate();


  function handleTabSetting(tabSetting) {
    // if (tabSetting === "deskEvent") {
    //   setActiveEventTab("deskEvent");
    // } else if (tabSetting === "movingEvent") {
    //   setActiveEventTab("movingEvent");
    // } else if (tabSetting === "anythingEvent") {
    //   setActiveEventTab("anythingEvent");
    // } else 
    if (tabSetting === "anyonePartner") {
      setActivePartnerTab("anyonePartner");
    } else if (tabSetting === "favoritePartner") {
      setActivePartnerTab("favoritePartner");
    }
  }

  const handleToggleChange = () => {
    setQuiteMode(!quiteMode)
  }


  useEffect(() => {
    // console.log('fetch events');
    if(window.screen.width < 1024){
      setColumns(false);
    }
    const fetchAppointments = async () => {
      const data = await fetchEvents();
      setAppointments(data);
      setFilteredEvents(data);
      // await fetchEvents();
    };
    fetchAppointments();

  },[isSuccess,showDeleteMsg,showEditMsg]);

  useEffect(() => {
    const check = async () => {
      try{
        const response = await fetch(`${import.meta.env.VITE_BACKEND_PRO_URL}/auth/checkAuthAndReturnUser`,{
          method: 'GET',
          credentials: 'include'
        })
        const data = await response.json();

        // console.log(data);
        if(response.ok){
          setAuthenticated(data.status);
          setUserProfile(data.user);
          setUpdatedImg(data.user.profilePic);

          // setLoading(false)
        }else if(response.status === 401){
          // const data = await response.json();
          setAuthenticated(data.status);
        }else if(response.status === 403){
          if(data.trial_ended === true || data.sub_cancelled === true){
            navigate('/account/trail-ended',{ state: { profile: data } });
          }else{
            navigate('/account/account-ban', { state: { profile: data } });
          } 
        
        }
      }catch(err){
        console.log(err);
      }
    }
    check();
  },[authenticated,profile]); //if any problem come while authen
  
// console.log(authenticated);
  if (authenticated === null) {
    return <Loading/>;
  }
    return authenticated ? (
    <myContext.Provider 
      value={{
        authenticated ,
        missedEvent, 
        setMissedEvent,
        userProfile, 
        handleTabSetting,
        handleToggleChange,
        setUserProfile,
        profile,
        setProfile,
        setAuthenticated, 
        updatedImg, 
        setUpdatedImg,
        showJoin, 
        setShowJoin, 
        startEvent, 
        setStartEvent,
        appointments,
        setAppointments,
        quiteMode,setQuiteMode,
        setShowDeleteMsg,showDeleteMsg,
        filteredEvents,
        showEditMsg,setShowEditMsg,
        openEbEditModal,setOpenEbEditModal,
        editEvent,setEditEvent,
        openUpEditModal,setOpenUpEditModal,
        setFilteredEvents,
        columns,
        setColumns,
        eventIdToDelete,
        setEventIdToDelete,
        showConfirmation,
        setShowConfirmation,
        // activeEventTab,
        // setActiveEventTab,
        activePartnerTab,
        setActivePartnerTab,
        isThereError,
        setIsThereError,
        isSuccess,
        setIsSuccess,
        }}>
      <ConditionalNavbar/>
      <Outlet />
    </myContext.Provider>
    ) : 
    <Navigate to={'/signup'} replace/>

};

export {PrivateRoutes,myContext};
