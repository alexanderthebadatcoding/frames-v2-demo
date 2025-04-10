import { useEffect, useState } from "react";
import sdk from "@farcaster/frame-sdk";
import Scoreboard from "./scoreboard";


export default function Demo() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      sdk.actions.ready();
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

 
  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[95%] max-w-[420px] mx-auto py-4">
      <Scoreboard />
    </div>
  );
}
