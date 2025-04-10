import { useEffect, useCallback, useState } from "react";
import sdk from "@farcaster/frame-sdk";
import Scoreboard from "./scoreboard";

import { Button } from "~/components/ui/Button";


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

 

  const close = useCallback(() => {
    sdk.actions.close();
  }, []);


  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[90%] max-w-[420px] mx-auto py-4">
      <Scoreboard />
        <div className="m-4">
          <Button onClick={close}>Close Frame</Button>
        </div>
    </div>
  );
}
