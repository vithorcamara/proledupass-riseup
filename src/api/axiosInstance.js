import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://proleduca-edupass-latest.onrender.com",
  // baseURL: "https://edupass-backend-production.up.railway.app",
  baseURL: "http://localhost:8080/",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    console.error("Erro ao configurar requisição:", error);
    return Promise.reject(error);
  },
);

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       return console.error(`Erro na resposta [${error.response.status}]:`, error.response.data);

//       if (error.response.status === 401) {
//         console.warn("Token inválido ou expirado. Redirecionando para login...");
//         localStorage.removeItem("token");
//         window.location.href = "/login";
//       }

//     } else if (error.request) {
//       console.error("Nenhuma resposta recebida do servidor:", error.request);
//     } else {
//       console.error("Erro ao criar requisição:", error.message);
//     }

//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
