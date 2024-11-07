import {
  CallControls,
  CallingState,
  ParticipantView,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import VideoHeader from "./VideoHeader";
import VideoFooter from "./VideoFooter";
import ParticipantsState from "./ParticipantsState";
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { useEffect, useState, useContext } from "react";
import { myContext } from "../../utils/PrivateRoutes";
import Loading from "../../Components/UI/LoadingComponent/Loading";
import { useLocation } from "react-router-dom";
// import './style.css';

// const apiKey = 'mmhfdzb5evj2';
const apiKey = import.meta.env.VITE_GETSTREAM_KEY;
// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL1NoYWFrX1RpIiwidXNlcl9pZCI6IlNoYWFrX1RpIiwidmFsaWRpdHlfaW5fc2Vjb25kcyI6NjA0ODAwLCJpYXQiOjE3Mjg4MDk3NzMsImV4cCI6MTcyOTQxNDU3M30.chanW8qpELiDfH3R9zBxuJRN9SjwBBSeVDwa3W0DtCg';
// const userId = 'Shaak_Ti';
// const callId = 'IwXQbkelWfoS';

// const user = {
//   id: userId,
//   name: 'Oliver',
//   image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
// };

// const client = new StreamVideoClient({ apiKey, user, token });
// const call = client.call('default', callId);
// call.join({ create: true });

export default function App() {

  const  {userProfile} = useContext(myContext);
  const userId = userProfile.displayName.split(" ").join("_");
  const location = useLocation();
  const { availableEvents } = location.state || {};
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [mainToken, setMainToken] = useState(null);
  const [sessionevent,setSessionevent] = useState(null);

  const callId = availableEvents[0].callID;


  useEffect(() => {

    const getEvent = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_PRO_URL}/api/events/getEvent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ callid: availableEvents[0].callID, fullname: availableEvents[0].fullName }),
          }
        );
        const data = await response.json();
        console.log(data);
        setSessionevent(data.event);
      } catch (err) {
        console.log(err);
        throw new Error("Error while fetching matched user details.");
      }
    };
    getEvent();

    const tokenProvider = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_PRO_URL}/api/video/generate-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userId }),
        }
      );
      const data = await response.json();
      setMainToken(data.token);
      return data.token;
    };
    // tokenProvider();
  
    const user = {
      id: userId,
      name: userProfile.displayName,
      image: userProfile.profilePic,
    };
  
    const client = new StreamVideoClient({ apiKey, user, tokenProvider });
    setClient(client);
    const call = client.call('default', callId);
  
    const createCall = async() => {
  
      await call.getOrCreate({
        data:{
          name: "default",
          settings_override: {
            limits: {
              max_participants: 2,
              max_duration_seconds: 3000 
            }
          },
        }
      });
      setCall(call);
  
      if (call) {
        await call.join();
    // console.log(session);
  
      }
    }
  
    createCall();

    return () => {
      if (call.state.callingState !== CallingState.LEFT) {
        call.leave();
      }
      setClient(undefined);
    };

  },[])
  
  if(client === null || call === null) return <Loading/>

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
      <MyUILayout
                call={call}
                availableEvents={availableEvents}
                mainToken={mainToken}
                sessionevent={sessionevent}
              />
      </StreamCall>
    </StreamVideo>
  );
}

export const MyUILayout = (props) => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    return <Loading/>;
  }

  return (
    <div className='px-0 bg-[#19232D] md:bg-[#222222] overflow-hidden'>
    <ParticipantsState 
       call={props.call} 
       availableEvents={props.availableEvents}/>
    <StreamTheme>
    <VideoHeader 
              call={props.call} 
              availableEvents={props.sessionevent}
            />
      <SpeakerLayout participantsBarPosition='top' />
    <VideoFooter call={props.call} mainToken={props.mainToken} availableEvents={props.availableEvents}/>
    </StreamTheme>
    </div>
  );
};

// import "@stream-io/video-react-sdk/dist/css/styles.css";
// import {
//   StreamVideoClient,
//   StreamVideo,
//   StreamTheme,
//   StreamCall,
//   PaginatedGridLayout,
//   CallingState,
//   useCallStateHooks
// } from "@stream-io/video-react-sdk";
// // import ChatFeature from "./ChatFeature";
// import { useEffect, useState, useContext } from "react";
// import { myContext } from "../../utils/PrivateRoutes";
// import "../../App.css";
// import Loading from "../../Components/UI/LoadingComponent/Loading";
// import { useLocation } from "react-router-dom";
// import VideoHeader from "./VideoHeader";
// import VideoFooter from "./VideoFooter";
// import ParticipantsState from "./ParticipantsState";


// const apiKey = import.meta.env.VITE_GETSTREAM_KEY;

// export default function VideoSDK() {
//   const { userProfile } = useContext(myContext);
//   // const { useCallSession } = useCallStateHooks();
//   // const session = useCallSession();
//   const userID = userProfile.displayName.split(" ").join("_");
//   const location = useLocation();
//   const { availableEvents } = location.state || {};
//   console.log(availableEvents);
//   const matchedUserID = availableEvents[0].matchedPersonFullName.split(" ").join("_");
//   const [client, setClient] = useState(null);
//   const [call, setCall] = useState(null);
//   const [mainToken, setMainToken] = useState(null);
//   const [sessionevent,setSessionevent] = useState(null);
//   const [matchedPersonToken, setMatchedPersonToken] = useState(null);


//   useEffect(() => {

//     const getEvent = async () => {
//       try {
//         const response = await fetch(
//           `${import.meta.env.VITE_BACKEND_PRO_URL}/api/events/getEvent`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ callid: availableEvents[0].callID, fullname: availableEvents[0].fullName }),
//           }
//         );
//         const data = await response.json();
//         console.log(data);
//         setSessionevent(data.event);
//       } catch (err) {
//         console.log(err);
//         throw new Error("Error while fetching matched user details.");
//       }
//     };
//     getEvent();


//     const user = {
//       id: userID,
//       name: userProfile.displayName,
//       role: "admin",
//     };

//     // Test user configuration
//     // const testUser = {
//     //   id: testUserID,
//     //   name: "Test User",
//     //   role: "user",
//     // };

//     const getMatchedPersonToken = async () => {
//       const matchedPersonTokenResponse = await fetch(
//         `${import.meta.env.VITE_BACKEND_PRO_URL}/api/video/generate-token`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ userId: matchedUserID }),
//         }
//       );
//       const matchedUserTokenData = await matchedPersonTokenResponse.json();
//       console.log('Test user token:', matchedUserTokenData.token);
//       matchedPersonToken(matchedUserTokenData.token);
//     }
//     getMatchedPersonToken();

//     const tokenProvider = async () => {
//       const response = await fetch(
//         `${import.meta.env.VITE_BACKEND_PRO_URL}/api/video/generate-token`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ userId: userID }),
//         }
//       );
//       const data = await response.json();
//       setMainToken(data.token);
//       return data.token;
//     };

//     const myClient = new StreamVideoClient({ apiKey, user, tokenProvider });
//     setClient(myClient);

//     const callType = "default";
//     const callId = availableEvents[0].callID;
//     // const callId = userProfile.familyName;

//     const call = myClient.call(callType, callId);
    

//     const createCall = async() => {

//       await call.getOrCreate({
//         data:{
//           name: "default",
//           settings_override: {
//             limits: {
//               max_participants: 2,
//               max_duration_seconds: 3000 //50 * 60
//               // max_duration_seconds: 120 //50 * 60
//             }
//           },
//           // starts_at: "2024-08-31T06:30:00.000Z"
//           // starts_at: availableEvents[0].start
//         }
//       });
//       setCall(call);

//       if (call) {
//         await call.join();
//     // console.log(session);
  
//       }
//     }

//     createCall();

//     return () => {
//       if (call.state.callingState !== CallingState.LEFT) {
//         call.leave();
//       }
//       setClient(undefined);
//     };
//   }, []);

//   console.log("client", client, "call", call);
//   // console.log(token);

//   if(client === null || call === null) return <Loading/>

//   return (
//     <div className="min-h-screen min-w-screen bg-[#292D3E] md:px-0">
//       <StreamVideo client={client}>
//         <StreamTheme>
//           {call && (
//             <StreamCall call={call}>
//               <ParticipantsState call={call} availableEvents={availableEvents}/>
//               {sessionevent && 
//               <VideoHeader call={call} availableEvents={sessionevent}/>
//               }
//               {/* <ChatFeature token={token} availableEvents={availableEvents}/>  */}
//               <PaginatedGridLayout />
//               <VideoFooter call={call} mainToken={mainToken} availableEvents={availableEvents}/>
//             </StreamCall>
//           )}
//         </StreamTheme>
//       </StreamVideo>
//     </div>
//   );
// }
