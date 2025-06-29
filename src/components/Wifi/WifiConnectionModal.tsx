import { modalState, selectedWifiName } from "@/store/modal";
import { useAtom, useAtomValue } from "jotai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";

export default function WifiConnectionModal() {
  const [isDialogOpen, setIsDialogOpen] = useAtom(modalState);
  const selectedWifi = useAtomValue(selectedWifiName);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="bg-stone-900">
          <DialogHeader>
            <DialogTitle className="text-white">
              Connect to Wifi: {selectedWifi}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <form className="flex flex-col gap-5">
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
