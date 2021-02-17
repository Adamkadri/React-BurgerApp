import axios from "axios";

const instance = axios.create({
  baseURL: "https://react-burgerapp-33d05-default-rtdb.firebaseio.com/",
});

export default instance;
