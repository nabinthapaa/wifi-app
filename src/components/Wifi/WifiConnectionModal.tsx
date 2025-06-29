import { invoke } from "@tauri-apps/api/core";
import { useAtom } from "jotai";
import { FormEvent } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  modalState,
  selectedWifiName,
  selectedWifiSecurity,
} from "@/store/modal";

export default function WifiConnectionModal() {
  const [isDialogOpen, setIsDialogOpen] = useAtom(modalState);
  const [name, setName] = useAtom(selectedWifiName);
  const [security, setSecurity] = useAtom(selectedWifiSecurity);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const password = formData.get("password")?.toString() ?? "";

    if (!name || !password) {
      console.error("Missing SSID or password");
      return;
    }

    const response = await invoke<{ message: string; success: boolean }>(
      "connect_with_password",
      {
        name,
        password,
        security,
      },
    );
    if (response.success) {
      setIsDialogOpen(false);
      setName("");
      setSecurity("");
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="bg-stone-900">
          <DialogHeader>
            <DialogTitle className="text-white">
              Connect to Wifi: {name}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex gap-2 flex-col mt-4 items-start">
                <label htmlFor="password" className="text-lg font-semibold">
                  Password
                </label>
                <input
                  autoFocus
                  id="password"
                  name="password"
                  placeholder="Enter Password"
                  className="border-2 border-stone-700 rounded-md w-full p-2 text-lg"
                />
              </div>
              <div className="flex items-center justify-end my-2">
                <button className="bg-green-800/60 px-4 py-2 rounded-md">
                  Connect
                </button>
              </div>
            </form>
          </DialogDescription>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
