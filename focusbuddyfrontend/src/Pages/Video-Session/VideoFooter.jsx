import {
  CancelCallButton,
  SpeakingWhileMutedNotification,
  ToggleAudioPublishingButton,
  ToggleVideoPublishingButton,
  ScreenShareButton,
  ReactionsButton,
} from "@stream-io/video-react-sdk";
import ChatControl from "./ChatControl";
import { useNavigate } from "react-router-dom";

export default function VideoFooter({mainToken,testToken,availableEvents,call}) {
  const navigate = useNavigate();

  async function handleCallEnd(){
      console.log('call leave')
      await call.leave();
      navigate('/dashboard');
  }


  return (
    <div id="VideoSDKfooter" className={`${window.screen.width < 676 ? 'fixed bottom-0': 'static' } w-full gap-2 md:gap-6 h-16 bg-[#19232D] flex justify-center items-center`}>
      <SpeakingWhileMutedNotification>
        <ToggleAudioPublishingButton />
      </SpeakingWhileMutedNotification>
      <ToggleVideoPublishingButton />
      <ReactionsButton/>
      {
        window.screen.width < 676 
        ?
        null
        :
        <ScreenShareButton/>

      }
      <ChatControl mainToken={mainToken} testToken={testToken} availableEvents={availableEvents}/>
      <CancelCallButton onClick={handleCallEnd}/>
    </div>
  );
}
