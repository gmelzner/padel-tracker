import type { MagiaRecord, MatchAction, MatchState, PointRecord, Team } from "./types";
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
    magias: [],
    matchOver: false,
    winningTeam: null,
  };
}

let pointCounter = 0;
let magiaCounter = 0;

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

      // Winner + Forced Error Generated = point for player's team.
      // Unforced Error = point for opposing team.
      const pointWonByTeam: Team =
        pointType === "unforced-error"
          ? (player.team === 1 ? 2 : 1)
          : player.team;

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

    case "RECORD_QUICK_POINT": {
      if (state.matchOver) return state;

      const { team } = action.payload;
      const scoreBefore = JSON.parse(JSON.stringify(state.score));

      const { newScore, matchOver, winningTeam } = advanceScore(
        state.score,
        state.config,
        team
      );

      const record: PointRecord = {
        id: `point-${++pointCounter}`,
        timestamp: Date.now(),
        pointType: null,
        playerId: null,
        pointWonByTeam: team,
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

    case "RECORD_MAGIA": {
      const { magiaType, playerId } = action.payload;
      const record: MagiaRecord = {
        id: `magia-${++magiaCounter}`,
        timestamp: Date.now(),
        magiaType,
        playerId,
      };
      return {
        ...state,
        magias: [...state.magias, record],
      };
    }

    case "UNDO_MAGIA": {
      if (state.magias.length === 0) return state;
      return {
        ...state,
        magias: state.magias.slice(0, -1),
      };
    }

    case "RESET_MATCH": {
      pointCounter = 0;
      magiaCounter = 0;
      return getInitialState();
    }

    default:
      return state;
  }
}
