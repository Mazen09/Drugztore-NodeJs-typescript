import config from "config";

export function applyCofigurations() {
  if (!config.get("jwtPrivateKey"))
    throw new Error("FATAL ERROR: jwtPrivateKey not defined");
}
