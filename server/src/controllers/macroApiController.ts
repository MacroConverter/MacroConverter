import { type Request, type Response } from 'express';
// import axios from 'axios';

const clientID = '3477ff089c6f4f209a2b9cc2e0322ed4';
const clientSecret = '11ec95931d6c4828a820787677941242';
// let accessToken: string;

const options = {
  method: 'POST',
  url: 'https://oauth.fatsecret.com/connect/token',
  auth: {
    user: clientID,
    password: clientSecret,
  },
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  form: {
    grant_type: 'client_credentials',
    scope: 'basic',
  },
  json: true,
};

export async function getAccessToken(): Promise<void> {
  const response = await axios.post(options);
  console.log(response);
  accessToken = response.data.access_token;
}

export const getAccessWrapper = (req: Request, res: Response): void => {
  getAccessToken().catch((error) => {
    console.log(error);
    res.send(error.message);
  });
};

export const getMacroFor = (ingredient: string): number => {
  return 5;
};
