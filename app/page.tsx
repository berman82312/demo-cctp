import { Divider } from "@mui/material";
import ConnectButton from "./components/ConnectButton";
import SourceForm from "./components/SourceForm";
import DestinationForm from "./components/DestinationForm";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <ConnectButton />
        <h2 className="text-2xl">Transfer your USDC</h2>
        <SourceForm />
        <Divider className="w-full">To</Divider>
        <DestinationForm />
      </main>
    </div>
  );
}
