import { useEffect, useCallback, useState } from "react";
import sdk, { type FrameContext } from "@farcaster/frame-sdk";
import Scoreboard from "./scoreboard";

import { Button } from "~/components/ui/Button";

// https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard

export default function Demo() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();
  const [isContextOpen, setIsContextOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context);
      sdk.actions.ready();
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  const openUrl = useCallback(() => {
    sdk.actions.openUrl("https://www.scoreb.site/");
  }, []);

  const close = useCallback(() => {
    sdk.actions.close();
  }, []);

  const toggleContext = useCallback(() => {
    setIsContextOpen((prev) => !prev);
  }, []);

  const renderError = (error: Error | null) => {
    if (!error) return null;
    return <div className="text-red-500 text-xs mt-1">{error.message}</div>;
  };

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[300px] mx-auto py-4">
      <h1 className="text-2xl font-bold text-center mb-4">
        College Football Scores
      </h1>

      <div className="mb-4 px-2">
        <button
          onClick={toggleContext}
          className="flex items-center gap-2 transition-colors"
        >
          <span
            className={`transform transition-transform ${
              isContextOpen ? "rotate-90" : ""
            }`}
          >
            ➤
          </span>
          Tap to view current games
        </button>

        {isContextOpen && (
          <div className="mt-2">
            <Scoreboard />
          </div>
        )}
      </div>

      <div>
        <div className="m-4">
          <Button onClick={openUrl}>View More Scores</Button>
        </div>
        <div className="m-4">
          <Button onClick={close}>Close Frame</Button>
        </div>
      </div>
    </div>
  );
}
