import axios from "axios";

// this page contains axios instance with global settings such as the baseURL
const instance = axios.create({
  // baseURL:"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]"
  // 后半截在store.js的actions里面
  baseURL: "https://identitytoolkit.googleapis.com/v1/"
});

export default instance;
