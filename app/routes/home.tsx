import { Link, redirect } from "react-router";
import type { Route } from "./+types/home";
import { data } from "react-router";
import { getSession } from "~/sessions.server";

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div className="text-center p-4">
      <h1 className="text-2xl">Hello, {loaderData.name}</h1>
      <Link
        className="block mt-2 text-blue-500 underline hover:text-blue-600"
        to="/auth/github/logout"
      >
        Logout
      </Link>
    </div>
  );
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  if (!user) throw redirect("/login");
  return data(user);
}
