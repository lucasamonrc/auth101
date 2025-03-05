import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("auth/github", "routes/auth/github/index.ts"),
  route("auth/github/callback", "routes/auth/github/callback.ts"),
  route("auth/github/logout", "routes/auth/github/logout.ts"),
] satisfies RouteConfig;
