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
import ChatNotAvailable from './ChatNotAvailable';
import messageCameSound from '../../../public/message-incoming.mp3'


const apiKey = import.meta.env.VITE_GETSTREAM_KEY;

export default function ChatFeature({setNewMsgCame, setNewMsgEvent, token, availableEvents }) {
  const { userProfile } = useContext(myContext);
  const userID = userProfile.displayName.split(' ').join('_');
  const other_user = availableEvents[0].matchedPersonFullName === 'Matching...' ? 'Matching' : availableEvents[0].matchedPersonFullName.split(' ').join('_');


  // Use the hook directly in the component's body
  const chatClient = useCreateChatClient({
    apiKey,
    tokenOrProvider: token,
    userData: {
      id: userID,
      role: "admin"
    }
  });
  console.log(chatClient)


  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const createChannel = async () => {
      if (chatClient) {
        const channel = chatClient.channel('messaging', {
          members: [userID, other_user]
        });

        await channel.watch();
        setChannel(channel);

        // Listen for new messages
        chatClient.on('message.new', (event) => {
          // console.log('New message received:', event.message);
          setNewMsgEvent(event.message);
          const audio = new Audio(messageCameSound);
          if(userProfile.displayName !== event.message.user.name){
            audio.play();
          }
          if(event.message){
            setNewMsgCame(true);
          }
          });
      }
    };

    createChannel();

    return () => {
      if (chatClient) {
        chatClient.disconnectUser();
      }
    };
  }, [chatClient]);
console.log("chatclient",chatClient)
  if (!chatClient || !channel) return <ChatNotAvailable/>;

  return (
    <Chat client={chatClient}>
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
