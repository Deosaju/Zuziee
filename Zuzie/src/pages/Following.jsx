import React, { useEffect, useState } from "react"
import { Sidebar } from "/components/"
import axios from "axios";
import Link from "next/link";

function index() {

  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [followers, setFollowers] = useState(null);


  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setAccessToken(accessToken);
    }else{
      window.location.assign('/')
    }
  }, []);

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

}

export default index


