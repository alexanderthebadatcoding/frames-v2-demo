"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import moment from "moment";

// Type definitions (same as before)
type Game = {
  id: string;
  date: string;
  status: {
    type: {
      state: string;
      detail: string;
    };
    displayClock: string;
    period: number;
  };
  competitions: Array<{
    broadcast: string;
    headlines?: Array<{
      shortLinkText: string;
    }>;
    series?: {
      type: string;
      title: string;
      summary: string;
    };
    notes?: Array<{ headline: string }>;
    competitors: Array<{
      homeAway: string;
      team: {
        id: string;
        abbreviation: string;
        displayName: string;
        shortDisplayName: string;
        logo: string;
      };
      score: string;
      records: Array<{
        type: string;
        summary: string;
      }>;
      curatedRank?: {
        current: string;
      };
    }>;
    situation?: {
      downDistanceText: string;
      possessionText: string;
      possession: string;
      lastPlay?: {
        text: string;
      };
    };
    odds: Array<{
      details: string;
    }>;
    broadcasts: Array<{
      names: Array<{
        type: string;
      }>;
    }>;
    outsText: string;
  }>;
};

export default function Scoreboard() {
  const [games, setGames] = useState<Game[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch game data from the API
  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await fetch(
          "https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard"
        );
        const data = await response.json();
        setGames(data.events || []);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchGames();
  }, []);

  if (isLoading) {
    return <div className="text-center mt-10">Loading games...</div>;
  }

  if (!games || games.length === 0) {
    return (
      <div className="text-center mt-10">No games available at the moment.</div>
    );
  }

  return (
    <section>
      <div className="grid grid-cols-1 gap-6 auto-cols-max">
        {games.map((game) => {
          const competition = game.competitions?.[0];
          const situation = competition?.situation;
          return (
            <div
              key={game.id}
              className={`shadow-md rounded-lg overflow-hidden col-span-full
              }`}
            >
              <div className="flex justify-between items-center bg-gray-200 dark:bg-slate-900 p-3">
                <span className="font-semibold text-lg">
                  {game.status.type.state === "in"
                    ? `${game.status.type.detail} ${
                        competition?.outsText || ""
                      }`
                    : game.status.type.state === "post"
                    ? "Final"
                    : moment.utc(game.date).local().format("MM/DD h:mm a")}
                </span>

                <span className="text-sm text-gray-600 dark:text-gray-200">
                  {game.status.type.state === "pre"
                    ? competition?.odds?.[0]?.details || ""
                    : game.status.type.state === "post"
                    ? ""
                    : competition?.broadcast || ""}
                </span>
              </div>
              <div className={`pt-6 px-5`}>
                {competition?.competitors?.map((team) => (
                  <div
                    key={team.homeAway}
                    className="flex justify-between items-center mb-4"
                  >
                    <div className="flex items-center">
                      <Image
                        src={team.team.logo || "/NA.png"}
                        alt={`${team.team.displayName} logo`}
                        width={48}
                        height={48}
                        className="mr-3"
                        onError={(e) => {
                          e.currentTarget.src = "/NA.png";
                        }}
                      />
                      <div>
                        <span className="font-bold text-lg">
                          {team.team.shortDisplayName}{" "}
                          <p className="text-gray-600 dark:text-gray-400 font-medium inline">
                            {team.curatedRank?.current || ""}
                          </p>
                          {situation?.possession === team.team.id && " 🏈"}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400 block">
                          {team.records?.[0]?.summary}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-center items-center">
                      <span className="text-2xl font-semibold text-center">
                        {game.status.type.state !== "pre" ? team.score : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col justify-center items-center pb-5 px-3 text-center dark:text-gray-500 text-slate-600">
                {situation && (
                  <div className="text-lg mt-3">
                    <div>{situation.downDistanceText}</div>
                    <div>{situation.lastPlay?.text || ""}</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
