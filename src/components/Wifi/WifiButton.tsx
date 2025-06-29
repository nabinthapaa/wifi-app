import { useSetAtom } from "jotai";
import { WifiHighIcon, WifiLow, WifiZeroIcon } from "lucide-react";

import useGetWifi from "@/hooks/useGetWifi";
import { cn } from "@/lib/utils";
import { modalState, selectedWifiId, selectedWifiName } from "@/store/modal";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";

export default function Wifi() {
  const { data: wifi } = useGetWifi();
  const setModalState = useSetAtom(modalState);
  const setSelectedWifi = useSetAtom(selectedWifiName);
  const setSelecteWifiId = useSetAtom(selectedWifiId);

  const checkConnection = async ({
    ssid,
    id,
  }: {
    ssid: string;
    id: string;
  }) => {
    const response = await invoke<{ message: string; success: boolean }>(
      "check_already_connected_network",
      {
        name: ssid,
      },
    );
    if (response.success) return toast.success(response.message);

    if (!response.success) {
      setModalState(true);
      setSelectedWifi(ssid);
      setSelecteWifiId(id);
    }
  };

  return (
    <div className="space-y-2 block w-full">
      {wifi.length &&
        wifi.map(({ ssid, security, id, frequency, signal }, index) => {
          return (
            <button
              key={id}
              onClick={() => checkConnection({ ssid, id })}
              className={cn(
                "grid grid-cols-[1fr_1fr_0.5fr] w-full hover:cursor-pointer border-b",
                index === wifi.length - 1 && "border-b-none",
              )}
            >
              <span className="text-left">
                {ssid}
                {frequency > 5 && (
                  <span className="bg-stone-700 ml-2 inlin-block rounded-md px-2 text-xs font-bold">
                    5
                  </span>
                )}
              </span>
              <span className="text-left">{security}</span>
              <span className="text-left py-2">
                {signal > 50 ? (
                  <WifiHighIcon />
                ) : signal > 20 ? (
                  <WifiLow />
                ) : (
                  <WifiZeroIcon />
                )}
              </span>
            </button>
          );
        })}
    </div>
  );
}
