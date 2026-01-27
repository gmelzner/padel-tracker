import type { MatchAction, MatchState, PointRecord, Team } from "./types";
import { getInitialScore } from "./constants";
import { advanceScore } from "./scoring-engine";

export function getInitialState(): MatchState {
  return {
    screen: "setup",
    config: {
      gamesPerSet: 4,
      numberOfSets: 1,
      deuceMode: "golden-point",
      tiebreakEnabled: true,
    },
    players: [],
    score: getInitialScore(),
    history: [],
    matchOver: false,
    winningTeam: null,
  };
}

let pointCounter = 0;

export function matchReducer(
  state: MatchState,
  action: MatchAction
): MatchState {
  switch (action.type) {
    case "INITIALIZE_MATCH": {
      const { players, config } = action.payload;
      return {
        ...getInitialState(),
        screen: "tracking",
        config,
        players,
        score: getInitialScore(),
      };
    }

    case "RECORD_POINT": {
      if (state.matchOver) return state;

      const { pointType, playerId } = action.payload;
      const player = state.players.find((p) => p.id === playerId);
      if (!player) return state;

      // Winner = point for player's team. Error = point for opposing team.
      const pointWonByTeam: Team =
        pointType === "winner"
          ? player.team
          : player.team === 1
          ? 2
          : 1;

      // Snapshot current score for undo
      const scoreBefore = JSON.parse(JSON.stringify(state.score));

      const { newScore, matchOver, winningTeam } = advanceScore(
        state.score,
        state.config,
        pointWonByTeam
      );

      const record: PointRecord = {
        id: `point-${++pointCounter}`,
        timestamp: Date.now(),
        pointType,
        playerId,
        pointWonByTeam,
        scoreBefore,
      };

      return {
        ...state,
        score: newScore,
        history: [...state.history, record],
        matchOver,
        winningTeam,
        screen: matchOver ? "results" : "tracking",
      };
    }

    case "UNDO_POINT": {
      if (state.history.length === 0) return state;
      const lastRecord = state.history[state.history.length - 1];
      return {
        ...state,
        score: lastRecord.scoreBefore,
        history: state.history.slice(0, -1),
        matchOver: false,
        winningTeam: null,
        screen: "tracking",
      };
    }

    case "END_MATCH": {
      return { ...state, screen: "results" };
    }

    case "SET_SCORE": {
      return {
        ...state,
        score: action.payload.score,
      };
    }

    case "RESET_MATCH": {
      pointCounter = 0;
      return getInitialState();
    }

    default:
      return state;
  }
}
