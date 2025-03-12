import { data, Link, redirect } from "react-router";
import type { Route } from "./+types/login";
import { getSession } from "~/sessions.server";

export default function Login() {
  return (
    <div className="text-center p-4">
      <Link
        className="block mt-2 text-blue-500 underline hover:text-blue-600"
        to="/auth/github"
      >
        Sign in with GitHub
      </Link>
      <Link
        className="block mt-2 text-blue-500 underline hover:text-blue-600"
        to="/auth/trinsic"
      >
        Sign in with Trinsic
      </Link>
    </div>
  );
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  if (user) throw redirect("/");
  return data(null);
}
