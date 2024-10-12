import { CallControls } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import {
  StreamVideoClient,
  StreamVideo,
  StreamTheme,
  StreamCall,
  PaginatedGridLayout,
  CallingState,
  useCallStateHooks
} from "@stream-io/video-react-sdk";


const apiKey = "ct9ycfrh4prr";

export default function DemoVideo(){

    const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);

    useEffect(() => {

        const user = {
            id: "test",
            name: "test",
            role: "admin",
          };
    
          const tokenProvider = async () => {
            const response = await fetch(
              `${import.meta.env.VITE_BACKEND_DEV_URL}/api/video/generate-token`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: "test" }),
              }
            );
            const data = await response.json();
            // setMainToken(data.token);
            return data.token;
          };
      
          const myClient = new StreamVideoClient({ apiKey, user, tokenProvider });
          setClient(myClient);

    const callType = "default";
    const callId = "234234234";
    // const callId = userProfile.familyName;

    const call = myClient.call(callType, callId);
    call.getOrCreate({
      data:{
        name: "default",
        settings_override: {
          limits: {
            max_participants: 2,
            max_duration_seconds: 3000 //50 * 60
            // max_duration_seconds: 120 //50 * 60
          }
        },
        // starts_at: "2024-08-31T06:30:00.000Z"
        // starts_at: availableEvents[0].start
      }
    });
    setCall(call);

    if (call) {
      call.join();
  // console.log(session);

    }

    return () => {
      if (call.state.callingState !== CallingState.LEFT) {
        call.leave();
      }
      setClient(undefined);
    };

    },[]);

    

    return(
        <div className="min-h-screen min-w-screen bg-[#292D3E] md:px-0">
      <StreamVideo client={client}>
        <StreamTheme>
          {call && (
            <StreamCall call={call}>
              {/* <ChatFeature token={token} availableEvents={availableEvents}/>  */}
              <PaginatedGridLayout />
              <CallControls/>
            </StreamCall>
          )}
        </StreamTheme>
      </StreamVideo>
    </div>
    )
}