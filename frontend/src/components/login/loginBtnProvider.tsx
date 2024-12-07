import { getServerSession } from "next-auth";
import { authOptions } from "../../app/api/auth/[...nextauth]/route";

import { LoginBtnProvider } from "./context";
import { LoginBtn } from "./loginBtn";

export default function Page() {
  const sessionPromise = getServerSession(authOptions);

  return (
    <LoginBtnProvider sessionPromise={sessionPromise}>
      <LoginBtn />
    </LoginBtnProvider>
  );
}
