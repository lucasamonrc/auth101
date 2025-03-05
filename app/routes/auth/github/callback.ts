import { authenticator } from "~/services/authenticator";
import type { Route } from "./+types/callback";
import { redirect } from "react-router";
import { commitSession, getSession } from "~/sessions.server";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = await authenticator.authenticate("github", request);
  session.set("user", user);
  return redirect(`/`, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
