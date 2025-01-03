import {
  CallControls,
  CallingState,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
  User,
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
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL1NoYWFrX1RpIiwidXNlcl9pZCI6IlNoYWFrX1RpIiwidmFsaWRpdHlfaW5fc2Vjb25kcyI6NjA0ODAwLCJpYXQiOjE3Mjg4MDk3NzMsImV4cCI6MTcyOTQxNDU3M30.chanW8qpELiDfH3R9zBxuJRN9SjwBBSeVDwa3W0DtCg';
const userId = 'NOAH_.';
const callId = 'IwXQbkelWfoS';

const user = {
  id: userId,
  name: 'Oliver',
  image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
};



const client = new StreamVideoClient({ apiKey, user, token });
const call = client.call('default', callId);
call.join({ create: true });

// export default function App() {

//   const  {userProfile} = useContext(myContext);
//   const userId = userProfile.displayName.split(" ").join("_");
//   const location = useLocation();
//   const { availableEvents } = location.state || {};
//   const [client, setClient] = useState(null);
//   const [call, setCall] = useState(null);
//   const [mainToken, setMainToken] = useState(null);
//   const [sessionevent,setSessionevent] = useState(null);

//   const callId = availableEvents[0].callID;


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

//     const tokenProvider = async () => {
//       const response = await fetch(
//         `${import.meta.env.VITE_BACKEND_PRO_URL}/api/video/generate-token`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ userId: userId }),
//         }
//       );
//       const data = await response.json();
//       setMainToken(data.token);
//       return data.token;
//     };
//     // tokenProvider();
  
//     const user = {
//       id: userId,
//       name: userProfile.displayName,
//       image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
//     };
  
//     const client = new StreamVideoClient({ apiKey, user, tokenProvider });
//     setClient(client);
//     const call = client.call('default', callId);
  
//     const createCall = async() => {
  
//       await call.getOrCreate({
//         data:{
//           name: "default",
//           settings_override: {
//             limits: {
//               max_participants: 2,
//               max_duration_seconds: 3000 
//             }
//           },
//         }
//       });
//       setCall(call);
  
//       if (call) {
//         await call.join();
//     console.log(session);
  
//       }
//     }
  
//     createCall();

//     return () => {
//       if (call.state.callingState !== CallingState.LEFT) {
//         call.leave();
//       }
//       setClient(undefined);
//     };

//   },[])
  
//   if(client === null || call === null) return <Loading/>

//   return (
//     <StreamVideo client={client}>
//       <StreamCall call={call}>
//       <MyUILayout
//                 call={call}
//                 availableEvents={availableEvents}
//                 mainToken={mainToken}
//                 sessionevent={sessionevent}
//               />
//       </StreamCall>
//     </StreamVideo>
//   );
// }

// export const MyUILayout = (props) => {
//   const { useCallCallingState } = useCallStateHooks();
//   const callingState = useCallCallingState();

//   if (callingState !== CallingState.JOINED) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <>
//     <ParticipantsState 
//        call={props.call} 
//        availableEvents={props.availableEvents}/>
//     <VideoHeader 
//               call={props.call} 
//               availableEvents={props.sessionevent}
//             />
//     <StreamTheme>
//       <SpeakerLayout participantsBarPosition='bottom' />
//       {/* <CallControls /> */}
//     <VideoFooter call={props.call} mainToken={props.mainToken} availableEvents={props.availableEvents}/>
//     </StreamTheme>
//     </>
//   );
// };