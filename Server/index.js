import express, { json } from "express";
import cors from "cors";
import axios from "axios";
import qs from "query-string";
import dotenv from "dotenv";

dotenv.config();

const app = express()
app.use(cors());
app.use(json());

app.post("/login", async (req, res) => {
  try {
    const resCode = await exchangeCodeForAccessToken(req.body.code);
    console.log("resCode", resCode);
    res.status(200).json(resCode);
  } catch (err) {
    console.log("err", err);
    res.sendStatus(500);
  }
});

async function exchangeCodeForAccessToken(code) {
  const GITHUB_ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';
  const { REDIRECT_URL, CLIENT_ID, CLIENT_SECRET } = process.env;
  const params = {
    code,
    redirect_uri: REDIRECT_URL,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  };

  const { data } = await axios.post(GITHUB_ACCESS_TOKEN_URL, params, {
    headers: {
      'Content-Type': 'application/json'
    },
  });

  const parsedData = qs.parse(data);
  return parsedData.access_token;
}

app.post("/user", async (req, res) => {
  const user = await fetchUser(req.body.accessToken);
  res.status(200).json(user);
});

async function fetchUser(token) {
  const GITHUB_ENDPOINT = "https://api.github.com/user";
  const response = await axios.get(GITHUB_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'X-GitHub-API-Version': '2022-11-28',
    },
  });

  return response.data;
}

app.post("/followers", async (req, res) => {
  const user = await fetchFollowers(req.body.accessToken);
  res.status(200).json(user);
});



async function fetchFollowers(token) {
  const GITHUB_ENDPOINT = "https://api.github.com/user/followers";
  const response = await axios.get(GITHUB_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'X-GitHub-API-Version': '2022-11-28',
    },
  });

  return response.data;
}

app.post("/following", async (req, res) => {
  const user = await fetchFollowing(req.body.accessToken);
  res.status(200).json(user);
});

async function fetchFollowing(token) {
  const GITHUB_ENDPOINT = "https://api.github.com/user/following";
  const response = await axios.get(GITHUB_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'X-GitHub-API-Version': '2022-11-28',
    },
  });
  return response.data;
}

app.listen(5000, () => {
  console.log(`Server is up and running.`);
});