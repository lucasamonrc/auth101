import { Strategy } from "remix-auth/strategy";
import createDebug from "debug";
import { Cookie, SetCookie } from "@mjackson/headers";
import { redirect } from "react-router";
import type { GetSessionResultResponse } from "@trinsic/api";

const debug = createDebug("TrinsicStrategy");

export class TrinsicStrategy<T> extends Strategy<
  T,
  TrinsicStrategy.VerifyOptions
> {
  name = "trinsic";

  private cookieName = "trinsic-auth-strategy";

  constructor(
    protected options: TrinsicStrategy.ConstructorOptions,
    verify: Strategy.VerifyFunction<T, TrinsicStrategy.VerifyOptions>
  ) {
    super(verify);
  }

  async authenticate(request: Request): Promise<T> {
    debug("Request URL", request.url);

    let url = new URL(request.url);

    const sessionId = url.searchParams.get("sessionId");
    const key = url.searchParams.get("resultsAccessKey");

    const signInFlow = !sessionId && !key;

    if (signInFlow) {
      debug("No sessionId or key found, starting sign in flow");

      const response = await fetch(
        "https://api.trinsic.id/api/v1/sessions/beta/widget",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.options.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to start sign in flow");
      }

      const data = (await response.json()) as {
        sessionId: string;
        launchUrl: string;
      };

      const launchUrl = new URL(data.launchUrl);
      launchUrl.searchParams.set("redirectUrl", this.options.redirectURI);

      debug("Launch URL", launchUrl.toString());

      const header = new SetCookie({
        name: this.cookieName,
        value: new URLSearchParams({ sessionId: data.sessionId }).toString(),
        httpOnly: true,
        maxAge: 60 * 5, // 5 minutes
        path: "/",
        sameSite: "Lax",
      });

      throw redirect(launchUrl.toString(), {
        headers: { "Set-Cookie": header.toString() },
      });
    }

    const cookie = new Cookie(request.headers.get("Cookie") || "");
    const params = new URLSearchParams(cookie.get(this.cookieName) || "");

    const ogSessionId = params.get("sessionId");

    if (!ogSessionId) {
      throw new ReferenceError("Missing sessionId in cookie");
    }

    debug("Fetching verification results");
    const response = await fetch(
      `https://api.trinsic.id/api/v1/sessions/${sessionId}/results`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.options.accessToken}`,
        },
        body: JSON.stringify({
          resultsAccessKey: key,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch verification results");
    }

    const data = (await response.json()) as GetSessionResultResponse;
    const t = this.verify({ request, results: data });

    return t;
  }
}

export namespace TrinsicStrategy {
  export interface VerifyOptions {
    request: Request;
    results: GetSessionResultResponse;
  }

  export interface ConstructorOptions {
    accessToken: string;
    redirectURI: string;
  }
}
