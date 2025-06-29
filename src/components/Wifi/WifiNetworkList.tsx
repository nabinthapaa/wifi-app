import useGetWifi from "@/hooks/useGetWifi";
import Wifi from "./WifiButton";
import WifiConnectionModal from "./WifiConnectionModal";

export default function WifiNetworksList() {
  const { refetch } = useGetWifi();

  return (
    <div>
      <div className="flex py-2 items-center justify-between border-b-2 border-b-stone-600">
        <h1 className="text-3xl ">Wifi Networks</h1>
        <button
          onClick={() => refetch()}
          className="p-2 bg-blue-500 rounded-md"
        >
          Refresh
        </button>
      </div>
      <div className="grid grid-cols-[1fr_1fr_0.5fr] font-bold  text-2xl my-4">
        <h2>SSID</h2>
        <h2>Security</h2>
        <h2>Strength</h2>
      </div>
      <Wifi />
      <WifiConnectionModal />
    </div>
  );
}
