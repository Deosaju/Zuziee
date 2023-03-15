import React, { useEffect, useState } from "react"
import { Sidebar } from "/components/"
import qs from "query-string";
import axios from "axios";
import Link from "next/link";

function index() {

  const [accessToken, setAccessToken] = useState(null);
  const [userAutherized, setUserAutherized] = useState(false);
  const [user, setUser] = useState(null);
  const [followers, setFollowers] = useState(null);

  useEffect(() => {
    const { code } = qs.parseUrl(window.location.href).query;
    if (code) {
      setUserAutherized(true);
    }
    else {
      setUserAutherized(false);
    }
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setAccessToken(accessToken);

    }
  }, []);

  function redirectToGithub() {
    const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
    const params = {
      response_type: 'code',
      scope: 'user public_repo',
      client_id: '96cc6be7039ab621069e',
      state: 'test-t5'
    }

    const queryStrings = qs.stringify(params);
    const authorizationUrl = `${GITHUB_AUTH_URL}?${queryStrings}`;
    window.location.href = authorizationUrl;

  }


  async function getAccessToken() {

    const { code } = qs.parseUrl(window.location.href).query;
    if (code) {
      try {
        const response = await axios.post(`http://localhost:5000/login`, { code }); // This is the server
        console.log("Access Token", response.data);
        setAccessToken(response.data);
        localStorage.setItem("accessToken", response.data);

      } catch (err) {
        alert("Ops something went wrong");
        console.log("err", err);
      }
    }

  }

  useEffect(() => {

    if (accessToken) {
      async function getUser() {
        try {
          const response = await axios.post(`http://localhost:5000/user`, { accessToken });
          console.log("User Data", response.data);
          setUser(response.data);
        } catch (err) {
          alert("Ops something went wrong");
          console.log("err", err);
        }
      }
      getUser();
    }
  }, [accessToken]);



  function signOut() {
    localStorage.removeItem("accessToken");
    setAccessToken(null);
    setUser(null);
    window.location.href = "/";
  }
  function getevents() {
    async function getUser() {
      try {
        const response = await axios.post(`http://localhost:5000/following`, { accessToken });
        console.log("User Data", response.data);
        setFollowers(response.data);
      } catch (err) {
        alert("Ops something went wrong");
        console.log("err", err);
      }
    }
    getUser();
  }

  if (accessToken && user) {
    return (
      <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
        <div className="sm:flex hidden mr-10 relative">
          <Sidebar />
        </div>
        <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">

          <nav className="bg-[#13131a] px-8 py-4 flex justify-between">
            <div>
              <a href="/" className="text-white font-bold text-xl">Zuzie</a>
            </div>
            <div className="flex items-center">
              <span className="text-white font-bold mr-2">{user.login}</span>
              <img src={user.avatar_url} alt="Profile Picture" className="rounded-full h-10 w-10 object-cover" />
              <button className="bg-red-600 text-white rounded-full px-4 py-2 ml-4" onClick={signOut}>Sign Out</button>
            </div>
          </nav>
          <div className="bg-[#1f1f2e] rounded-md p-4 mt-4">
            <h1 className="text-white font-bold text-xl">People you are following</h1>
            <button className="bg-[#2f2f3e] rounded-md p-4 mt-4 flex flex-row items-center" onClick={getevents}>Show following</button>
            {followers && followers.map((follower) => (
              //make image and name clickable
              <div className="flex flex-row mt-4">
                <img src={follower.avatar_url} alt="Profile Picture" className="rounded-full h-10 w-10 object-cover" />
                <Link className="text-white font-bold text-xl ml-4" onClick={console.log("suie")} href="/">{follower.login}  </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    )
  }
  else {
    return (
      <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
        <div className="sm:flex hidden mr-10 relative">
          <Sidebar />
        </div>
        <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">

          <nav className="bg-[#13131a] px-8 py-4 flex justify-between">
            <div>
              <a href="/" className="text-white font-bold text-xl">Zuzie</a>
            </div>
            <div className="flex items-center">
              {userAutherized ? <button className="bg-[#2f80ed] text-white px-4 py-2 rounded-md" onClick={getAccessToken}>Get Access Token</button> : <button className="bg-[#2f80ed] text-white px-4 py-2 rounded-md" onClick={redirectToGithub}>Authenticate</button>}
            </div>
          </nav>

        </div>

      </div>
    )
  }

}

export default index


