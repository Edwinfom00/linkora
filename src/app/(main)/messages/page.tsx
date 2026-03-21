import type { Metadata } from "next";
import { MessagesView } from "@/modules/messages/ui/views/messages-view";

export const metadata: Metadata = {
  title: "Messages",
  description: "Gérez vos conversations avec les entreprises sur BizConnect Cameroun.",
};

export default function MessagesPage() {
  return <MessagesView />;
}
