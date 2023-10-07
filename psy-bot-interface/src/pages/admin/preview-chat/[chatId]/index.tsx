import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { requireAdminAuthentication, requireAuthentication } from "~/actions/auth";
import SettingsLayout from "~/components/layouts/SettingsLayout";
import PreviewCurrentChat from "~/components/admin/PreviewChat";

const PrewievChat = () => {
  const router = useRouter();
  const { chatId } = router.query;

  // // Fetch messages data
  const { data: messagesData } =
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
      <div>
        <PreviewCurrentChat initialMessages={messagesWithContent}/>
      </div>
  );
};

export default PrewievChat;

PrewievChat.PageLayout = SettingsLayout

export const getServerSideProps = requireAdminAuthentication;