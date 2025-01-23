import React, { useState, useEffect } from "react";
import { getAllMatches } from "../api/matchApi";
import MatchCard from "./MatchCard";
import { Match } from "../types";
import "./MatchList.css";
import { useSwipeable, SwipeableProps } from "react-swipeable";

const MatchList: React.FC = () => {
  const [matches, setMatches] = useState<{ [key: string]: Match[] }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const stages = Object.keys(matches);
  const stagesLength = stages.length;
  const stagesPerView = 3;

  const getVisibleStages = () => {
    if (currentIndex === 0) {
      return stages.slice(0, stagesPerView);
    } else if (currentIndex === stagesLength - 1) {
      return stages.slice(stagesLength - stagesPerView, stagesLength);
    } else {
      return stages.slice(
        Math.max(0, currentIndex - 1),
        Math.min(currentIndex + 2, stagesLength)
      );
    }
  };

  const visibleStages = getVisibleStages();
  const selectedStage = stages[currentIndex];

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < stagesLength - 1) {
        setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, stagesLength - 1));
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0) {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  } as SwipeableProps);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await getAllMatches();

        const groupedMatches = data.reduce(
          (acc: { [key: string]: Match[] }, match: Match) => {
            if (!acc[match.etapa]) {
              acc[match.etapa] = [];
            }
            acc[match.etapa].push(match);
            return acc;
          },
          {}
        );

        for (const etapa in groupedMatches) {
          groupedMatches[etapa] = groupedMatches[etapa].sort(
            (a: Match, b: Match) => {
              const dateA = new Date(a.matchDate).getTime();
              const dateB = new Date(b.matchDate).getTime();
              return dateA - dateB;
            }
          );
        }

        setMatches(groupedMatches);
      } catch (error) {
        console.error("Failed to fetch matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return <div>Loading matches...</div>;
  }

  const highlightBarStyle = {
    width: `calc(100% / ${stagesPerView})`,
    left: `calc(${visibleStages.indexOf(selectedStage)} * (100% / ${stagesPerView}))`,
  };

  return (
    <div className="match-list-container">
      <div className="stage-selector">
        {visibleStages.map((etapa) => (
          <div
            key={etapa}
            className={`stage-button ${selectedStage === etapa ? "active" : ""}`}
            onClick={() => setCurrentIndex(stages.indexOf(etapa))}
          >
            <p>{`Etapa ${etapa}`}</p>
          </div>
        ))}
        <div className="highlight-bar" style={highlightBarStyle}></div>
      </div>

      <div className="match-list-wrapper" {...swipeHandlers}>
        <div className="match-list">
          {matches[selectedStage] &&
            matches[selectedStage].map((match) => (
              <div className="match-card-wrapper" key={match.id}>
                <MatchCard match={match} />
              </div>
            ))}
        </div>
      </div>
      <div className="spacer"></div>
    </div>
  );
};

export default MatchList;
