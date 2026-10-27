import { resolve } from "node:path";
/** @param {Record<string, string | undefined>} inherited @param {string} checkout */
export function rehearsalEnvironment(inherited, checkout) {
  const env = { ...inherited };
  for (const key of Object.keys(env)) {
    if (key.startsWith("DOTENV_") || ["DATABASE_URL", "APP_ORIGIN", "HTTPS_PORT", "ADMIN_EMAIL", "ADMIN_PASSWORD", "API_ACTOR_EMAIL", "PUBLIC_API_KEY", "NODE_OPTIONS", "TASKBOARD_E2E_ENV_FILE", "TASKBOARD_E2E_PROJECT", "TASKBOARD_E2E_PORT"].includes(key)) delete env[key];
  }
  env.DATABASE_URL = `file:${resolve(checkout, "data/taskboard.db")}`;
  return env;
}
