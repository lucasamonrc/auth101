import { authenticator } from "~/services/authenticator";
import type { Route } from "./+types";

export async function loader({ request }: Route.LoaderArgs) {
  await authenticator.authenticate("trinsic", request);
}
