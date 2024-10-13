import { useCallStateHooks } from '@stream-io/video-react-sdk';

export const CustomScreenShareButton = () => {
  const { useScreenShareState, useHasOngoingScreenShare } = useCallStateHooks();
  const { screenShare, isMute: isScreenSharing } = useScreenShareState();

  // determine, whether somebody else is sharing their screen
  const isSomeoneScreenSharing = useHasOngoingScreenShare();
  return (
    <button
    className='bg-white cursor-pointer text-black'
      // disable the button in case I'm not the one sharing the screen
      disabled={!isScreenSharing && isSomeoneScreenSharing}
      onClick={() => screenShare.toggle()}
    >
      {isScreenSharing ? (
        <span className="my-icon-enabled">enabled</span>
      ) : (
        <span className="my-icon-disabled">disabled</span>
      )}
    </button>
  );
};