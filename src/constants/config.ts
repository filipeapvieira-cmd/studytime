export const DELETE_SESSION_ENDPOINT = "/api/session/delete/";
export const SAVE_SESSION_ENDPOINT = "/api/session/save";
export const UPDATE_SESSION_ENDPOINT = "/api/session/update/";
export const GET_ALL_SESSIONS_ENDPOINT = "/api/session/get/sessions";
export const GET_UNIQUE_TOPICS_ENDPOINT = "/api/session/get/unique-topics";
export const GET_UNIQUE_HASHTAGS_ENDPOINT = "/api/session/get/unique-hashtags";
export const GET_COMMUNITY_SESSIONS_ENDPOINT =
  "/api/session/get/communityVsUser";
export const GET_USER_IMG_UPLOAD_CONFIG_ENDPOINT = "/api/user/img-config";

export const HTTP_METHOD = {
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  GET: "GET",
};
export enum SessionStatusEnum {
  Initial = "initial",
  Play = "play",
  Pause = "pause",
  Stop = "stop",
}

export const FEELING_OPTIONS = [
  "VERY_GOOD",
  "GOOD",
  "NEUTRAL",
  "BAD",
  "VERY_BAD",
];

export const DOMAIN = process.env.DOMAIN;
