import { Toaster } from "sonner";

import { PlateEditor } from "@/components/editor/plate-editor";
import { SettingsProvider } from "@/components/editor/settings";

export default function Page() {
  return (
    <div className="flex justify-center h-[750px]">
      <div className="h-screen w-full" data-registry="plate">
        <SettingsProvider>
          <PlateEditor />
        </SettingsProvider>

        <Toaster />
      </div>
    </div>
  );
}
