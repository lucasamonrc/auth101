import { Authenticator } from "remix-auth";
import { GitHubStrategy } from "remix-auth-github";
import { TrinsicStrategy } from "~/lib/trinsic-strategy";
import type { GitHubUser, User } from "~/models/user";

export let authenticator = new Authenticator<User>();

authenticator.use(
  new GitHubStrategy<User>(
    {
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
      redirectURI: "http://localhost:5173/auth/github/callback",
    },
    async ({ tokens }) => {
      let response = await fetch("https://api.github.com/user", {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${tokens.accessToken()}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      let user = (await response.json()) as GitHubUser;

      return {
        avatar: user.avatar_url,
        id: user.id.toString(),
        name: user.name,
        username: user.login,
      };
    }
  )
);

authenticator.use(
  new TrinsicStrategy<User>(
    {
      accessToken: process.env.TRINSIC_ACCESS_TOKEN ?? "",
      redirectUrl: "http://localhost:5173/auth/trinsic/callback",
    },
    async ({ results }) => {
      let user = results.identityData;

      return {
        id: user?.document?.number ?? results.session.id,
        name:
          (user?.person?.givenName ?? "") +
          " " +
          (user?.person?.familyName ?? ""),
        username: user?.person?.givenName ?? "",
        avatar: "",
      };
    }
  )
);
