import { useCallStateHooks } from "@stream-io/video-react-sdk";
import moment from "moment";
import { useEffect, useRef, useState } from "react";

export default function ParticipantsState({ getEvent,availableEvents,call }) {
  const useParticipantState = () => {
    const { useParticipants, useParticipantCount } = useCallStateHooks();
    const participants = useParticipants();
    // const participantsCount = useParticipantCount();
    // // Reference to keep track of participants already logged
    // const loggedParticipantsRef = useRef(new Set());
    // console.log("participants",client)

    // const handleParticipantLeft = async (event) => {
    //     console.log('handleParticipantLeft');
    //     try{
    //       const response = await  fetch( `${import.meta.env.VITE_BACKEND_PRO_URL}/api/events/updateUserCallLeaveTiming`,{
    //         method: 'POST',
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //           participantsDetails: event,
    //           availableEvents:availableEvents[0]
    //         }),
    //       });
    //       const data = await response.json();
    //       console.log(data.callDetails);
    //     }catch(err){
    //       console.log(err);
    //       throw new Error("Error while handling participants..")
    //     }
    // }
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
      // const participantLeft = (event) => {
      //   console.log(event);
      //   // Handle the participant left event
      //   handleParticipantLeft(event);
      // };
      const participantJoin= (event) => {
        console.log(event);
        // Handle the participant left event
        handleParticipantJoin(event);
        getEvent();
      };

      // Register the listener
      call.on('call.session_participant_joined', participantJoin);
      // call.on('call.session_participant_left', participantLeft);
      // call.on('call.ended',callEnded);
    
      // Cleanup function to remove the listener
      return () => {
        call.off('call.session_participant_joined', participantJoin);
        // call.off('call.session_participant_left', participantLeft);
        // call.off('call.ended',callEnded);
        // window.removeEventListener('beforeunload', handleWindowClose);
      };
    }, [call]); // Ensure call object remains consistent


    // useEffect(() => {
    //   console.log(loggedParticipantsRef);
    //   if(participantsCount === 1 && participants.length === 1){
    //     loggedParticipantsRef.current.forEach((items) => {
    //       console.log(items,participants);
    //       if(items !== participants[0].userId){
    //         console.log('not eequal')
    //         loggedParticipantsRef.current.delete(items)
    //         console.log(loggedParticipantsRef.current);
    //       }
    //     })
        
    //   }
    //     participants.forEach((participant) => {
    //       // Check if the participant has already been logged
    //       if (!loggedParticipantsRef.current.has(participant.userId)) {
    //         // Store the participant's join time
    //         handleParticipantJoin(participant);
    
    //         // Mark the participant as logged
    //         loggedParticipantsRef.current.add(participant.userId);
    //       }
    //     });
    //   }, [participants,participantsCount]);

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
