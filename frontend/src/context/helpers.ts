import { GameDataType, RoomDataType } from "./types";
export const intialValue: GameDataType = {
  ball: {
    x: 0,
    y: 0,
    z: 1,
  },
  player1: {
    x: 0,
    y: -60 / 2 + 3,
    z: 0,
  },
  player2: {
    x: 0,
    y: 60 / 2 - 3,
    z: 0,
  },
  score: {
    player1: 0,
    player2: 0,
  },
};

export const initialRoom: RoomDataType = {
  player1: "",
  player2: "",
  roomName: "",
  status: "",
  winner: "",
  type: "hard",
};

const serverurl = process.env.NEXT_PUBLIC_API;

const handleErrors = () => {
  //TODO implemet handel error func
  return "error";
};

export const fetcher = async (args: {
  path?: string;
  queryPayload?: Record<string, any>;
  token?: string;
  url?: string;
}) => {
  const { path = "", queryPayload = {}, url = serverurl } = args;

  const queryString = new URLSearchParams(
    JSON.parse(JSON.stringify(queryPayload))
  ).toString();
  return fetch(`${url}${path}?${queryString}`, {
    method: "GET",
    headers: {
      // "Content-type": "application/json; charset=UTF-8",
      "Content-Type": "application/json",
    },
  })
    .then((response: any) => response.json())
    .then((data) => data);
};

// const deleter = async (args: {
//   path?: string;
//   queryPayload?: Record<string, any>;
//   token?: string;
//   url?: string;
// }) => {
//   const { path = "", queryPayload = {}, url = serverurl } = args;

//   const queryString = new URLSearchParams(
//     JSON.parse(JSON.stringify(queryPayload))
//   ).toString();
//   return fetch(`${url}${path}?${queryString}`, {
//     method: "",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then((response: any) => response.json())
//     .then((data) => data);
// };

export const poster = async (
  path: string,
  payload: Record<string, any> | Record<string, any>[] = {},
  url = serverurl,
  queryPayload: Record<string, any> = {}
) => {
  const queryString = new URLSearchParams(
    JSON.parse(JSON.stringify(queryPayload))
  ).toString();

  return fetch(`${url}${path}?${queryString}`, {
    method: "POST",
    headers: {
      // "Content-Type": "application/x-www-form-urlencoded"
      "Content-Type": "application/json",
      //token
    },
    body: JSON.stringify(payload),
  })
    .then((response: any) => response.json())
    .then((data) => data);
};
