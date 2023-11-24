import SettingsClientLayout from "@/components/ws/settings/layout";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SettingsClientLayout>{children}</SettingsClientLayout>
    </div>
  );
}
