import { type Request, type Response } from 'express';
import axios from 'axios';
import { clientId, clientSecret } from './fatSecretConfig';

const apiUrl = 'https://platform.fatsecret.com/rest/server.api';
let accessToken: string;

interface APIResponse {
  data: APIData | APIError;
}

interface APIData {
  food: unknown;
}

interface APIError {
  error: { code: number };
}

async function getAccessToken(): Promise<string> {
  const accessData = {
    grant_type: 'client_credentials',
    scope: 'basic',
  };

  const accessOptions = {
    auth: {
      username: clientId,
      password: clientSecret,
    },
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    json: true,
  };

  try {
    const response = await axios.post(
      'https://oauth.fatsecret.com/connect/token',
      accessData,
      accessOptions,
    );

    accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    throw new Error('Request Failed');
  }
}

export const searchFood = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (accessToken === null) {
    accessToken = await getAccessToken();
  }

  const searchData = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      method: 'foods.search',
      format: 'json',
      search_expression: req.params.foodName,
    },
  };

  try {
    let response = await axios.post(apiUrl, null, searchData);
    let data = response.data;

    if (needsRefreshToken(response)) {
      const newToken = await getAccessToken();
      const newSearchData = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newToken}`,
        },
        params: {
          method: 'foods.search',
          format: 'json',
          search_expression: req.params.foodName,
        },
      };

      response = await axios.post(apiUrl, null, newSearchData);
    }

    console.log(response);
    data = response.data;
    if (data.foods.total_results > 0) {
      res.send(data.foods.food);
    } else {
      res.send('no results');
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

const needsRefreshToken = (promise: APIResponse): boolean => {
  if ('error' in promise.data && promise.data.error.code === 13) {
    return true;
  } else {
    return false;
  }
};

const sendRequestWithRetry = async (
  url: string,
  data: { headers: { Authorization: string } },
): Promise<any> => {
  try {
    const response = await axios.post(url, null, data);
    if (needsRefreshToken(response)) {
      const newToken = await getAccessToken();
      const newData = data;
      newData.headers.Authorization = `Bearer ${newToken}`;

      const retryResponse = await axios.post<APIResponse>(url, null, newData);
      return retryResponse;
    }

    return response;
  } catch (error) {
    throw new Error('request failed');
  }
};

export const searchFoods = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const foodNames: string[] = req.body.foodNames;

  if (accessToken === null) {
    accessToken = await getAccessToken();
  }
  console.log('here');
  const apiRequests = foodNames.map(async (foodName) => {
    const searchData = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        method: 'foods.search',
        format: 'json',
        search_expression: foodName,
      },
    };
    try {
      const response = await sendRequestWithRetry(apiUrl, searchData);
      // const response = await axios.post(apiUrl, null, searchData);
      return response;
    } catch (error) {
      console.log(error);
    }
    // return axios.post(apiUrl, null, searchData);
  });

  console.log('here');

  try {
    const allPromise = await Promise.all(apiRequests);
    console.log(allPromise);
    res.send('asdf');
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

// curl -u 3477ff089c6f4f209a2b9cc2e0322ed4:11ec95931d6c4828a820787677941242 -d "grant_type=client_credentials&scope=basic" -X POST https://oauth.fatsecret.com/connect/token
