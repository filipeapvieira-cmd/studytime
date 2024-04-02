export const DELETE_SESSION_ENDPOINT = "/api/session/delete/";
export const SAVE_SESSION_ENDPOINT = "/api/session/save";
export const UPDATE_SESSION_ENDPOINT = "/api/session/update/";
export const GET_ALL_SESSIONS_ENDPOINT = "/api/session/get/sessions";
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
