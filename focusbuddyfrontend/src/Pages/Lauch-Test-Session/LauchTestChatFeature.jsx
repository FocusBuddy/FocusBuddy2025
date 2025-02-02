import 'stream-chat-react/dist/css/v2/index.css';
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  useCreateChatClient,
  TypingIndicator
} from "stream-chat-react";
import { useState, useEffect, useContext } from "react";
import { myContext } from '../../utils/PrivateRoutes';

const apiKey = import.meta.env.VITE_GETSTREAM_KEY;

export default function LauchTestChatFeature({ mainToken,testToken, availableEvents }) {
  const { userProfile } = useContext(myContext);
  const userID = userProfile.displayName.split(' ').join('_');
  const other_user = 'Test2';

  // Use the hook directly in the component's body
  const mainchatclient = useCreateChatClient({
    apiKey,
    tokenOrProvider: mainToken,
    userData: {
      id: userID,
      role: "admin"
    }
  });

  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const createChannel = async () => {
      if (mainchatclient) {
        const channel = mainchatclient.channel('messaging', {
          members: [userID, other_user]
        });

        await channel.watch();
        setChannel(channel);
      }
    };

    createChannel();

    return () => {
      if (mainchatclient) {
        mainchatclient.disconnectUser();
      }
    };
  }, [mainchatclient]);
// console.log("chatclient",mainchatclient)
  if (!mainchatclient || !channel) return <div>Loading...</div>;

  return (
    <Chat client={mainchatclient}>
      <Channel channel={channel}>
        <Window>
          <ChannelHeader>
            <TypingIndicator/>
          </ChannelHeader>
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
}
