import { fetcher } from "./fethcer";

export const signup = async (name:string, email: string, password: string) => {
    return fetcher('authentication_app/signup/', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
    });
}

export const signin = async (email: string, password: string) => {
    return fetcher('authentication_app/signin/', {
        method: 'POST',
        body: JSON.stringify({email, password }),
    });
}

export const getUserProfile = async (token: string) => {
    return fetcher('authentication_app/user_profile/', {}, token);
}

export const updateUserProfile = async (
  token: string,
  updates: { name?: string;}
) => {
  return fetcher(
    "authentication_app/user_profile/",
    {
      method: "PATCH",
      body: JSON.stringify(updates),
    },
    token,
  );
};