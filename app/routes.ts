import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("auth/github", "routes/auth/github/index.ts"),
  route("auth/github/callback", "routes/auth/github/callback.ts"),
  route("auth/github/logout", "routes/auth/github/logout.ts"),
  route("auth/trinsic", "routes/auth/trinsic/index.ts"),
  route("auth/trinsic/callback", "routes/auth/trinsic/callback.ts"),
  route("auth/trinsic/logout", "routes/auth/trinsic/logout.ts"),
] satisfies RouteConfig;
