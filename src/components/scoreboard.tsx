"use client";
import React, { useEffect, useState } from "react";
import moment from "moment-timezone"; // Import moment-timezone

type Competitor = {
  athlete: {
    displayName: string;
  };
  score: string;
  linescores?: Array<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    linescores: Array<any>; // Hole-by-hole scores
    teeTime?: string; // Tee time for the round
  }>;
};

type Event = {
  id: string;
  name: string;
  date: string;
  competitors: Competitor[];
};

export default function Scoreboard() {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchScoreboard() {
      try {
        const res = await fetch(
          "https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard"
        );
        const data = await res.json();
        const rawEvent = data.events?.[0];
        const rawCompetition = rawEvent?.competitions?.[0];
        const rawCompetitors = rawCompetition?.competitors ?? [];

        if (!rawEvent || !rawCompetitors.length) {
          throw new Error("No competition data available.");
        }

        const competitors = rawCompetitors.map((comp: {
          athlete: { displayName: string };
          score: string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          linescores?: Array<{ linescores: Array<any>; teeTime?: string }>;
        }) => ({
          athlete: comp.athlete,
          score: comp.score,
          linescores: comp.linescores,
        }));

        setEvent({
          id: rawEvent.id,
          name: rawEvent.name,
          date: rawEvent.date,
          competitors,
        });
      } catch (err) {
        console.error("Error fetching golf data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchScoreboard();
  }, []);

  if (isLoading) {
    return <div className="text-center mt-10">Loading leaderboard...</div>;
  }

  if (!event || !event.competitors.length) {
    return <div className="text-center mt-10">No player data available.</div>;
  }

  return (
    <section>
      <h2 className="text-center text-2xl font-bold mb-4">{event.name}</h2>
    
      <div className="grid grid-cols-1 gap-4">
        {event.competitors.map((player, index) => {
          const lineScoreArray = player.linescores?.[0]?.linescores;
          const teeTime = player.linescores?.[1]?.teeTime;

          // Determine Thru or Tee Time based on available data
          const thru =
            lineScoreArray?.[2]?.value ??
            lineScoreArray?.[1]?.value ??
            lineScoreArray?.[0]?.value ??
            (teeTime ? moment.utc(teeTime).subtract(2, 'hours').format("h:mm A") : "—");


          return (
            <div
              key={index}
              className="bg-white dark:bg-green-800 rounded-lg shadow p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-lg">
                  {player.athlete?.displayName ?? "Unknown"}
                </p>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                {lineScoreArray?.length ? `Thru ${thru}` : teeTime ? `Tee ${thru}` : ""}
                </div>
              </div>
              <div className="text-center">
              <p className="text-xl text-gray-600 dark:text-gray-300">
                  {player.score ?? "—"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
