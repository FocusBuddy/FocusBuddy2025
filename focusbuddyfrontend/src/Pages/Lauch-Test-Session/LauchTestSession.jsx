import "@stream-io/video-react-sdk/dist/css/styles.css";
import {
  StreamVideoClient,
  StreamVideo,
  StreamTheme,
  StreamCall,
  PaginatedGridLayout,
  CallingState,
} from "@stream-io/video-react-sdk";
import LauchTestChatFeature from './LauchTestChatFeature'; // Your chat component
import { useEffect, useState, useContext } from "react";
import { myContext } from "../../utils/PrivateRoutes";
import "../../App.css";
import Loading from "../../Components/UI/LoadingComponent/Loading";
import VideoFooter from "../Video-Session/VideoFooter";


const apiKey = "ct9ycfrh4prr";

export default function LauchTestSession() {
  const { userProfile } = useContext(myContext);
  const userID = userProfile.displayName.split(" ").join("_");
  const testUserID = 'Test2'; // Define your test user ID here
  const [mainClient, setMainClient] = useState(null);
  const [testClient, setTestClient] = useState(null);
  const [call, setCall] = useState(null);
  const [mainToken, setMainToken] = useState(null);
  const [testToken, setTestToken] = useState(null); // State for the test user's token

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const mainUserTokenResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_PRO_URL}/api/video/generate-token`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: userID }),
          }
        );
        const mainUserTokenData = await mainUserTokenResponse.json();
        console.log('Main user token:', mainUserTokenData.token);
        setMainToken(mainUserTokenData.token);

        const testUserTokenResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_PRO_URL}/api/video/generate-token`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: testUserID }),
          }
        );
        const testUserTokenData = await testUserTokenResponse.json();
        console.log('Test user token:', testUserTokenData.token);
        setTestToken(testUserTokenData.token);
      } catch (error) {
        console.error('Error fetching tokens:', error);
      }
    };

    fetchTokens();
  }, [userID, testUserID]);

  useEffect(() => {
    if (mainToken && testToken) {
      // Main user configuration
      const mainUser = {
        id: userID,
        name: userProfile.displayName,
        role: "admin",
      };

      // Test user configuration
      const testUser = {
        id: testUserID,
        name: "Anonymous",
        role: "user",
      };

      // Initialize the Stream Video client for the main user
      const mainClientInstance = new StreamVideoClient({
        apiKey,
        user: mainUser,
        tokenProvider: () => Promise.resolve(mainToken),
      });
      setMainClient(mainClientInstance);

      // Initialize the Stream Video client for the test user
      const testClientInstance = new StreamVideoClient({
        apiKey,
        user: testUser,
        tokenProvider: () => Promise.resolve(testToken),
      });
      setTestClient(testClientInstance);
    }
  }, [mainToken, testToken, userProfile.displayName]);

  useEffect(() => {
    if (mainClient) {
      const callType = "default";
      const callId = userProfile._id;

      // Create or join the call
      const newCall = mainClient.call(callType, callId);
      newCall.getOrCreate({
        data: {
          name: "default",
        },
      });
      setCall(newCall);

      // Join the call
      newCall.join().catch((error) => console.error('Error joining call:', error));

      // Clean up on component unmount
      return () => {
        if (newCall.state.callingState !== CallingState.LEFT) {
          newCall.leave();
        }
        setMainClient(null);
        setTestClient(null);
      };
    }
  }, [mainClient, userProfile._id]);

  // Early return if client or call is not ready
  if (mainClient === null || call === null) return <Loading />;

  return (
    <div className="min-h-screen min-w-screen bg-[#292D3E] md:px-0">
      <StreamVideo client={mainClient}>
        <StreamTheme>
          {call && (
            <StreamCall call={call}>
              <div className=" w-full h-[5.4rem] px-10 bg-[#19232D]"></div>
              {/* <LauchTestChatFeature mainToken={mainToken} testToken={testToken} availableEvents={''} /> */}
              <PaginatedGridLayout />
              <VideoFooter call={call} mainToken={mainToken} testToken={testToken} availableEvents={''} />
            </StreamCall>
          )}
        </StreamTheme>
      </StreamVideo>
    </div>
  );
}
