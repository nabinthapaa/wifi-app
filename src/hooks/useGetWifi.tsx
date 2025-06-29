import { WifiNetwork } from "@nmcli";
import { useSuspenseQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export default function useGetWifi() {
  return useSuspenseQuery({
    queryKey: ["wifi"],
    queryFn: () =>
      invoke<WifiNetwork[]>("get_available_networks_with_security_type"),
  });
}
