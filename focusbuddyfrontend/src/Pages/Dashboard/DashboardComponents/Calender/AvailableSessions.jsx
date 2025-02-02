import UpcomingEvents from "./UpcomingEvents";
import { useContext , useEffect} from "react";
import { myContext } from "../../../../utils/PrivateRoutes";

function AvailableSessions({availableEvents,setSessionAvailable,onGoing,setOnGoing}) {

  // console.log(availableEvents);
  const {
    showConfirmation,
    setShowConfirmation,
    eventIdToDelete,
    setEventIdToDelete,
    filteredEvents,
    setShowDeleteMsg,
    setFilteredEvents,
    setShowJoin, setStartEvent
    } = useContext(myContext);

  function handleConfirm(eventId) {
    setShowConfirmation(true);
    setEventIdToDelete(eventId);
    setShowJoin(false);
    setStartEvent(false);
  }


  //shows the latest upcoming event but if i delete that event it should show the next upcoming event 
  const handleEventCancel = async() => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_PRO_URL}/api/events/deletesession`,{
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({eventId: eventIdToDelete})
    })
    const data = await response.json();
    // console.log(data);
    if(data.updatedEvent.length > 0){
      setFilteredEvents(
        filteredEvents.filter((appointment) => ((appointment.myID !== data.updatedEvent.updatedEvent.myID) && (appointment.myID !== eventIdToDelete) ))
      )
      setShowDeleteMsg(true);

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
        availableEvents[0].myID === eventIdToDelete ? (
          <>
            <div className="mt-4 flex flex-col gap-4 justify-center pt-9 text-white bg-[#DE3535] rounded-md">
              <div className="text-center text-lg">Cancel ?</div>
              <div className="flex justify-between">
                <button
                  type="button"
                  className="w-[50%] p-3 hover:bg-white hover:text-textcolor transition-all duration-500 ease-in-out"
                  onClick={() => setShowConfirmation(false)}
                >
                  No
                </button>
                <button
                  type="button"
                  className="w-[50%] p-3 hover:bg-white hover:text-textcolor transition-all duration-500 ease-in-out"
                  onClick={handleEventCancel}
                >
                  Yes
                </button>
              </div>
            </div>
          </>
        ) : (
          <UpcomingEvents
            handleConfirm={handleConfirm}
            availableEvents={availableEvents}
            onGoing={onGoing} 
            setOnGoing={setOnGoing}
          />
        )
      ) : (
        <UpcomingEvents
          handleConfirm={handleConfirm}
          availableEvents={availableEvents}
          onGoing={onGoing} 
          setOnGoing={setOnGoing}
        />
      )}
    </>
  );
}

export default AvailableSessions;
