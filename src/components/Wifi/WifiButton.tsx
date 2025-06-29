import { useSetAtom } from "jotai";
import { WifiHighIcon, WifiLow, WifiZeroIcon } from "lucide-react";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";

import useGetWifi from "@/hooks/useGetWifi";
import { cn } from "@/lib/utils";
import {
  modalState,
  selectedWifiId,
  selectedWifiName,
  selectedWifiSecurity,
} from "@/store/modal";
import ContextMenu from "@/components/ContextMenu"; // Assuming you added the reusable component

export default function Wifi() {
  const { data: wifi = [] } = useGetWifi();
  const setModalState = useSetAtom(modalState);
  const setSelectedWifi = useSetAtom(selectedWifiName);
  const setSelecteWifiId = useSetAtom(selectedWifiId);
  const setSelectedWifiSecurity = useSetAtom(selectedWifiSecurity);

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [contextTarget, setContextTarget] = useState<{
    ssid: string;
    id: string;
    security: string;
  } | null>(null);

  const checkConnection = async ({
    ssid,
    id,
    security,
  }: {
    ssid: string;
    id: string;
    security: string;
  }) => {
    const response = await invoke<{ message: string; success: boolean }>(
      "check_already_connected_network",
      { name: ssid },
    );
    if (response.success) return toast.success(response.message);

    setModalState(true);
    setSelectedWifi(ssid);
    setSelecteWifiId(id);
    setSelectedWifiSecurity(security);
  };

  const handleForget = async () => {
    if (!contextTarget) return;
    try {
      await invoke("remove_wifi_network", { ssid: contextTarget.ssid });
      toast.success(`Forgot ${contextTarget.ssid}`);
    } catch {
      toast.error("Failed to forget network");
    }
    setMenuVisible(false);
  };

  return (
    <div className="space-y-2 block w-full">
      {wifi.map(({ ssid, security, id, frequency, signal }, index) => (
        <button
          key={id}
          onClick={() => checkConnection({ ssid, id, security })}
          onContextMenu={(e) => {
            e.preventDefault();
            setMenuPosition({ x: e.pageX, y: e.pageY });
            setContextTarget({ ssid, id, security });
            setMenuVisible(true);
          }}
          className={cn(
            "grid grid-cols-[1fr_1fr_0.5fr] w-full hover:cursor-pointer border-b",
            index === wifi.length - 1 && "border-b-none",
          )}
        >
          <span className="text-left">
            {ssid}
            {frequency > 5 && (
              <span className="bg-stone-700 ml-2 inline-block rounded-md px-2 text-xs font-bold">
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
      ))}

      {menuVisible && contextTarget && (
        <ContextMenu
          position={menuPosition}
          onClose={() => setMenuVisible(false)}
          items={[
            {
              label: "Forget",
              onClick: handleForget,
            },
          ]}
        />
      )}
    </div>
  );
}
