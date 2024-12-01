// components
import Authorization from "../authorization";
import Insurances from "../insurances";

export default function Home({ user }) {
  if (user) {
    return <Insurances user={user} />;
  } else {
    return <Authorization />;
  }
}
