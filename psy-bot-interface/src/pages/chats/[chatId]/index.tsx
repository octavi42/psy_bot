import CurrentChat from "../../../components/Chat";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import ChatLayout from "~/components/ChatLayout";
import { requireAuthentication } from "~/actions/auth";

const MainPage = () => {
  const router = useRouter();
  const { chatId } = router.query;

  // // Fetch messages data
  const { data: messagesData, error } =
    api.chat.getMessages.useQuery(
      {
        chatId: chatId as string,
      },
      {
        enabled: !!chatId,
      }
    );

    // If messagesData exists, map and rename the field
  const messagesWithContent = messagesData?.map((message) => ({
    ...message,
    content: message.text, // Rename the field from 'text' to 'content'
    // Optionally, you can omit the 'text' field if needed
    // text: undefined,
  }));

  return (
    <ChatLayout>
      <CurrentChat initialMessages={messagesWithContent}/>
    </ChatLayout>
  );
};

export default MainPage;

export const getServerSideProps = requireAuthentication;