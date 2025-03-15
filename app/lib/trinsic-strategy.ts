import { Strategy } from "remix-auth/strategy";
import { Cookie, SetCookie } from "@mjackson/headers";
import { redirect } from "react-router";
import { SessionsApi, Configuration } from "@trinsic/api";
import type { GetSessionResultResponse, KnownIdentityData } from "@trinsic/api";

export class TrinsicStrategy<T> extends Strategy<
  T,
  TrinsicStrategy.VerifyOptions
> {
  readonly name = "trinsic";
  protected readonly cookieName = "trinsic-auth-strategy";
  protected readonly api: SessionsApi;

  constructor(
    protected options: TrinsicStrategy.ConstructorOptions,
    verify: Strategy.VerifyFunction<T, TrinsicStrategy.VerifyOptions>
  ) {
    super(verify);

    const config = new Configuration({
      accessToken: options.accessToken,
    });

    this.api = new SessionsApi(config);
  }

  async authenticate(request: Request): Promise<T> {
    let url = new URL(request.url);

    const sessionId = url.searchParams.get("sessionId");
    const resultsAccessKey = url.searchParams.get("resultsAccessKey");

    if (!sessionId || !resultsAccessKey) {
      const { launchUrl, header } = await this.handleSignIn();

      throw redirect(launchUrl.toString(), {
        headers: { "Set-Cookie": header.toString() },
      });
    }

    return this.handleCallback(request, resultsAccessKey);
  }

  private async handleSignIn() {
    const response = await this.api.createWidgetSession({
      redirectUrl: this.options.redirectUrl,
      providers: this.options.providers,
      knownIdentityData: this.options.knownIdentityData,
    });

    if (!response.launchUrl) {
      throw new TrinsicApiError(
        "Failed to start sign in flow. No launch URL returned."
      );
    }

    if (!response.sessionId) {
      throw new TrinsicApiError(
        "Failed to start sign in flow. No session ID returned."
      );
    }

    const launchUrl = new URL(response.launchUrl);

    const header = new SetCookie({
      name: this.cookieName,
      value: new URLSearchParams({ sessionId: response.sessionId }).toString(),
      httpOnly: true,
      maxAge: 60 * 5, // 5 minutes
      path: "/",
      sameSite: "Lax",
    });

    return { launchUrl, header };
  }

  private async handleCallback(request: Request, resultsAccessKey: string) {
    const cookie = new Cookie(request.headers.get("Cookie") || "");
    const params = new URLSearchParams(cookie.get(this.cookieName) || "");

    const sessionId = params.get("sessionId");

    if (!sessionId) {
      throw new ReferenceError("Missing sessionId in cookie");
    }

    const results = await this.api.getSessionResult(sessionId, {
      resultsAccessKey,
    });

    const t = this.verify({ request, results });

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
    redirectUrl: string;
    providers?: string[];
    knownIdentityData?: KnownIdentityData;
  }
}

class TrinsicApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TrinsicApiError";
  }
}
