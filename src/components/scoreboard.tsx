"use client";
import React, { useEffect, useState } from "react";
import moment from "moment";

type Competitor = {
  athlete: {
    displayName: string;
  };
  score: string;
  status: {
    position: {
      displayName: string;
    };
  };
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

        const competitors = rawCompetitors.map((comp: any) => ({
          athlete: comp.athlete,
          score: comp.score,
          status: comp.status,
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
      <h2 className="text-center text-2xl font-bold my-4">{event.name}</h2>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
        {moment.utc(event.date).local().format("MMMM D, YYYY")}
      </p>

      <div className="grid grid-cols-1 gap-4">
        {event.competitors.map((player, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-semibold text-lg">
                {player.athlete?.displayName ?? "Unknown"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Score: {player.score ?? "—"}
              </p>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">
                {player.status?.position?.displayName ?? "—"}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pos</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
