"use client";
import React, { useEffect, useState } from "react";
import moment from "moment";

type Player = {
  displayName: string;
  stats: Array<{ name: string; displayValue: string }>;
  position: { displayValue: string };
};

type Event = {
  id: string;
  name: string;
  date: string;
  leaderboard: Player[];
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
        const currentEvent = data.events?.[0];

        if (!currentEvent || !currentEvent.leaderboard) {
          throw new Error("No leaderboard data found");
        }

        setEvent({
          id: currentEvent.id,
          name: currentEvent.name,
          date: currentEvent.date,
          leaderboard: currentEvent.leaderboard,
        });
      } catch (err) {
        console.error("Error fetching scoreboard:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchScoreboard();
  }, []);

  if (isLoading) {
    return <div className="text-center mt-10">Loading leaderboard...</div>;
  }

  if (!event || !event.leaderboard.length) {
    return <div className="text-center mt-10">No leaderboard data available.</div>;
  }

  return (
    <section>
      <h2 className="text-center text-2xl font-bold my-4">{event.name}</h2>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
        {moment.utc(event.date).local().format("MMMM D, YYYY")}
      </p>

      <div className="grid grid-cols-1 gap-4">
        {event.leaderboard.map((player, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-semibold text-lg">{player.displayName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Score: {player.stats[3]?.displayValue ?? "—"}
              </p>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{player.position.displayValue}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pos</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
