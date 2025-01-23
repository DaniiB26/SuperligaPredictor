import React, { useState, useEffect } from "react";
import { IonCard, IonCardContent } from "@ionic/react";
import { getPredictionsForUser, recalculatePoints } from "../api/predictionApi";
import { getAllMatches } from "../api/matchApi";
import { Match, Predictie } from "../types";
import { useAuth } from "../context/AuthContext";
import PredictionCard from "./PredictionCard";
import { useSwipeable, SwipeableProps } from "react-swipeable";
import "./MyPredictions.css";

const MyPredictions: React.FC = () => {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState<Predictie[]>([]);
  const [matches, setMatches] = useState<{ [key: string]: Match[] }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPoints, setTotalPoints] = useState<number>(0);
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
    const fetchData = async () => {
      if (user) {
        try {
          const matchData = await getAllMatches();
          const predictionData = await getPredictionsForUser(user);

          const groupedMatches = matchData.reduce(
            (acc: { [key: string]: Match[] }, match: Match) => {
              if (!acc[match.etapa]) {
                acc[match.etapa] = [];
              }
              acc[match.etapa].push(match);
              return acc;
            },
            {}
          );

          Object.keys(groupedMatches).forEach((etapa) => {
            groupedMatches[etapa].sort((a: Match, b: Match) => {
              const dateA = new Date(a.matchDate).getTime();
              const dateB = new Date(b.matchDate).getTime();
              return dateA - dateB;
            });
          });

          setMatches(groupedMatches);
          setPredictions(predictionData);

          const totalUserPoints = predictionData.reduce(
            (sum: number, prediction: Predictie) => sum + prediction.points,
            0
          );
          setTotalPoints(totalUserPoints);

          const now = Date.now();
          let closestStageIndex = null;
          let minTimeDifference = Number.MAX_VALUE;

          for (let index = 0; index < Object.keys(groupedMatches).length; index++) {
            const stage = Object.keys(groupedMatches)[index];
            const stageMatches = groupedMatches[stage];

            const upcomingMatch = stageMatches.find(
              (match: Match) => match.status !== "completed"
            );
            if (upcomingMatch) {
              const matchTime = new Date(upcomingMatch.matchDate).getTime();
              const timeDifference = Math.abs(matchTime - now);

              if (timeDifference < minTimeDifference) {
                closestStageIndex = index;
                minTimeDifference = timeDifference;
              }
            }
          }

          if (closestStageIndex !== null) {
            setCurrentIndex(closestStageIndex);
          } else {
            setCurrentIndex(stages.length - 1);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user]);

  const findUserPrediction = (matchId: string) => {
    return predictions.find(
      (prediction: Predictie) => prediction.match.id === matchId
    );
  };

  const handleRefresh = async () => {
    if (user) {
      try {
        setLoading(true);
        await recalculatePoints(user);
        const updatedPredictions = await getPredictionsForUser(user);
        setPredictions(updatedPredictions);
        const updatedTotalPoints = updatedPredictions.reduce(
          (sum: number, prediction: Predictie) => sum + prediction.points,
          0
        );
        setTotalPoints(updatedTotalPoints);
      } catch (error) {
        console.error("Error recalculating points:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <div>Loading predictions...</div>;
  }

  const highlightBarStyle = {
    width: `calc(100% / ${stagesPerView})`,
    left: `calc(${visibleStages.indexOf(selectedStage)} * (100% / ${stagesPerView}))`,
  };

  return (
    <div className="my-predictions">
      <div className="user-info">
        <div className="user-details">
          <h2>{user ?? "Guest"}</h2>
        </div>
        <div className="points-refresh">
          <button className="refresh-button" onClick={handleRefresh}>
            <img src="/refresh.png" alt="Refresh" />
          </button>
          <span className="points">{totalPoints} pts</span>
        </div>
      </div>

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
            matches[selectedStage].map((match: Match) => (
              <div className="match-card-wrapper" key={match.id}>
                <IonCard>
                  <IonCardContent>
                    <PredictionCard
                      match={match}
                      userPrediction={findUserPrediction(match.id)}
                    />
                  </IonCardContent>
                </IonCard>
              </div>
            ))}
        </div>
      </div>
      <div className="spacer"></div>
    </div>
  );
};

export default MyPredictions;
