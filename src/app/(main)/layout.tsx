import { ClientLayoutWrapper } from "@/components/layout/client-layout-wrapper";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayoutWrapper>{children}</ClientLayoutWrapper>;
}
