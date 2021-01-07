import axios from 'axios';

const api = axios.create({
  baseURL: 'https://adadcristao-com-br.umbler.net',
  //baseURL: 'http://localhost:3333',
  //  baseURL: 'https://rpzbackend.herokuapp.com',
});

export default api;
