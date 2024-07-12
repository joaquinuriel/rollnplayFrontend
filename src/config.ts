import { ofetch } from "ofetch";

export const baseURL = "http://localhost:8080/";
export const fetcher = ofetch.create({
  baseURL,
});
