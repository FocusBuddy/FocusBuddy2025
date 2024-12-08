import { useCallStateHooks } from "@stream-io/video-react-sdk";
import moment from "moment";
import { useEffect, useRef, useState } from "react";

export default function ParticipantsState({ getEvent,availableEvents,call }) {
  const useParticipantState = () => {
    const { useParticipants } = useCallStateHooks();
    const participants = useParticipants();

    const handleParticipantJoin = async (event) => {
        console.log('handleParticipantJoin');
        try{
          const response = await  fetch( `${import.meta.env.VITE_BACKEND_PRO_URL}/api/events/updateUserCallJoinTiming`,{
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              participantsDetails: event,
              availableEvents:availableEvents[0]
            }),
          });
          const data = await response.json();
          console.log(data.callDetails);
        }catch(err){
          console.log(err);
          throw new Error("Error while handling participants..")
        }
    }

    useEffect(() => {
      const participantJoin= (event) => {
        console.log(event);
        // Handle the participant left event
        handleParticipantJoin(event);
        getEvent();
      };

      // Register the listener
      call.on('call.session_participant_joined', participantJoin);
    
      // Cleanup function to remove the listener
      return () => {
        call.off('call.session_participant_joined', participantJoin);
      };
    }, [call]); // Ensure call object remains consistent


    return participants;
  };


  const Participants = () => {
    const members = useParticipantState();
  };

  return (
    <>
      <Participants />
    </>
  );
}
