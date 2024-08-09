import { useState } from "react";
import Home from "./Home";
import UserDetails from "./UserDetails";
import PostPage from "./PostPage";
import "./App.css";

interface User {
  linkedinId: string;
  name: string;
  email: string;
  picture: string;
  accessToken: string;
}

function App() {
  const [page, setPage] = useState<"home" | "userDetails" | "postPage" | any>(
    "home"
  );
  const [user, setUser] = useState<User | null | any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function signInWithLinkedIn() {
    try {
      const redirectUri = browser.identity.getRedirectURL();
      console.log(redirectUri);

      const clientId = "86ixdo3yglf589";
      const state = "DCEeFWf45A53sdfKef424";
      const scope =
        "w_member_social%20email%20profile%20openid%20r_basicprofile%20r_organization_social%20w_organization_social%20r_organization_admin%20rw_organization_admin";

      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;

      chrome.identity.launchWebAuthFlow(
        {
          url: authUrl,
          interactive: true,
        },
        (redirectUrl: string | undefined) => {
          if (browser.runtime.lastError) {
            console.error(
              "Auth flow error:",
              browser.runtime.lastError.message
            );
            return;
          }

          if (redirectUrl) {
            const url = new URL(redirectUrl);
            const code = url.searchParams.get("code");
            if (code) {
              getUserDetails(code);
            } else {
              console.error("No code found in the redirect URL");
            }
          } else {
            console.error("Redirect URL is undefined");
          }
        }
      );
    } catch (error: any) {
      console.error("Error signing in with LinkedIn:", error.message);
    }
  }

  async function getUserDetails(code: string) {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/get-linkedin-access-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data: User = await response.json();
      setUser(data);
      setPage("userDetails");
    } catch (error: any) {
      console.error("Error fetching user details:", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-container">
      {page === "home" && <Home signInWithLinkedIn={signInWithLinkedIn} />}
      {page === "userDetails" && (
        <UserDetails user={user} setPage={setPage} loading={loading} />
      )}
      {page === "postPage" && (
        <PostPage
          user={user}
          setPage={setPage}
          loading={loading}
          setLoading={setLoading}
        />
      )}
    </div>
  );
}

export default App;
