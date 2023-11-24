import { WSClientLayout } from "@/components/ws/layout";

export default function WSLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div>
        <WSClientLayout>{children}</WSClientLayout>
      </div>
    );
  }
  