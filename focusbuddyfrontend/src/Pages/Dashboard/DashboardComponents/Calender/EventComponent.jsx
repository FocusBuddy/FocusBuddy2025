
import EventBox from "./EventBox";
import { useContext } from "react";
import { myContext } from "../../../../utils/PrivateRoutes";

function EventComponent({event}) {
  const { userProfile } = useContext(myContext);

  // console.log('sdsdfsd',event)          
  const {
    filteredEvents,
    setFilteredEvents,
    showConfirmation,
    setShowConfirmation,
    eventIdToDelete,
    setEventIdToDelete,
    setShowDeleteMsg,
     setShowJoin, setStartEvent
  } = useContext(myContext);

  // console.log('join',showJoin, 'event',startEvent);

  // console.log(filteredEvents,'asfads');
  function handleConfirm(eventId) {
    setShowConfirmation(true);
    // console.log('id to delete',eventId);
    setEventIdToDelete(eventId);
    setShowJoin(false);
    setStartEvent(false);
  }

  const handleEventCancel = async() => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_PRO_URL}/api/events/deletesession`,{
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({eventId: eventIdToDelete})
    })
    const data = await response.json();
    // console.log('deleteresponse',data);
      if(data.updatedEvent.length > 0){
        setFilteredEvents(
          filteredEvents.filter((appointment) => ((appointment.myID !== data.updatedEvent.updatedEvent.myID) && (appointment.myID !== eventIdToDelete) ))
        )
      }else{
        setFilteredEvents(
          filteredEvents.filter((appointment) => (appointment.myID !== eventIdToDelete) )
        )
        setShowDeleteMsg(true);
      }
      
      setShowConfirmation(false);
      setEventIdToDelete(null);
  }

  return (
    <>
      {showConfirmation ? (
        event.event.myID === eventIdToDelete ? (
          <div style={{zIndex:2003}} className="flex flex-col gap-2">
            <div className="text-white text-center text-lg">Cancel ?</div>
            <div className="flex justify-between">
              <button
                type="button"
                className="text-white w-[50%] p-3 hover:bg-white hover:text-textcolor transition-all duration-500 ease-in-out"
                onClick={() => setShowConfirmation(false)}
              >
                No
              </button>
              <button
                type="button"
                className="text-white w-[50%] p-3 hover:bg-white hover:text-textcolor transition-all duration-500 ease-in-out"
                onClick={handleEventCancel}
              >
                Yes
              </button>
            </div>
          </div>
        ) :
        event.event.matchedPersonName === 'Matching...' ? 
          <EventBox event={event} handleConfirm={handleConfirm}/>
          : (event.event.matchedPersonName === (userProfile.givenName + " " + (userProfile.familyName ? userProfile.familyName[0] : " ")) || event.event.name === (userProfile.givenName + " " + (userProfile.familyName ? userProfile.familyName[0] : " "))) 
          ? <EventBox event={event} handleConfirm={handleConfirm}/>
          :null 
        
      ) :event.event.matchedPersonName === 'Matching...' ? 
      <EventBox event={event} handleConfirm={handleConfirm}/>
      : (event.event.matchedPersonName === (userProfile.givenName + " " + (userProfile.familyName ? userProfile.familyName[0] : " ")) || event.event.name === (userProfile.givenName + " " + (userProfile.familyName ? userProfile.familyName[0] : " "))) 
      ? <EventBox event={event} handleConfirm={handleConfirm}/>
      :null }

    </>
  );
}

export default EventComponent;
