import axios from "axios";

const API_KEY = "";
export async function createUser(email, password) {
  return authenticate("signUp", email, password);
}

export async function login(email, password) {
  return authenticate("signInWithPassword", email, password);
}

async function authenticate(mode, email, password) {
  const { data } = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`,
    {
      email,
      password,
      returnSecureToken: true,
    }
  );

  return data.idToken;
}
