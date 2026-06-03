import axios from "axios";
import db from "../../db.json";

const axiosInstance = axios.create({
  baseURL: "/",
});

// Mock Adapter para simular o Backend apenas no Frontend
axiosInstance.defaults.adapter = async (config) => {
  const { data } = config;
  const url = config.url || "";
  const method = (config.method || "get").toLowerCase();
  
  // Normaliza a URL: Remove host, query params e limpa barras duplas/finais
  let path = url.replace(/^https?:\/\/[a-zA-Z0-9.:-]+/, "").split("?")[0];
  
  // Limpeza robusta: remove prefixos de rota e garante formato /recurso
  path = path.replace("/portal/api", "").replace("/portal", "").replace("/api", "");
  path = path.replace(/\/+/g, "/"); // Remove barras duplas //
  if (!path.startsWith("/")) path = "/" + path;
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1); // Remove barra final

  console.log(`[Mock API Interceptor] ${method.toUpperCase()} ${path}`);

  // Simula atraso de rede (opcional)
  await new Promise(resolve => setTimeout(resolve, 300));

  // GET /courses ou /opportunities (suporta ambas as rotas comuns)
  if ((path === "/courses" || path === "/opportunities") && method === "get") {
    return { data: db.courses, status: 200, statusText: "OK", headers: {}, config };
  }

  // GET /courses/:id
  if ((path.includes("/courses/") || path.includes("/opportunities/")) && method === "get") {
    const parts = path.split("/").filter(Boolean);
    const id = parts.pop();
    const course = db.courses.find(c => String(c.id) === String(id));
    return course 
      ? { data: course, status: 200, statusText: "OK", headers: {}, config }
      : { data: { message: "Not Found" }, status: 404, statusText: "Not Found", headers: {}, config };
  }

  // GET /customers/:id
  if (path.includes("/customers/") && method === "get") {
    const id = path.split("/").filter(Boolean).pop();
    const customer = db.customers.find(c => String(c.id) === String(id));
    return customer 
      ? { data: customer, status: 200, statusText: "OK", headers: {}, config }
      : { data: { message: "User Not Found" }, status: 404, statusText: "Not Found", headers: {}, config };
  }

  // GET /registrations
  if (path === "/registrations" && method === "get") {
    return { data: db.registrations, status: 200, statusText: "OK", headers: {}, config };
  }

  // GET /scholarship-holders (Suporte para área administrativa)
  if (path === "/scholarship-holders" && method === "get") {
    return { data: db.scholarshipHolders || [], status: 200, statusText: "OK", headers: {}, config };
  }

  // Fallback para outras rotas (POST/PUT/DELETE) - Simula sucesso
  if (method !== "get") {
    try {
      const responseData = typeof data === 'string' ? JSON.parse(data || "{}") : (data || {});
      return { data: responseData, status: 200, statusText: "OK", headers: {}, config };
    } catch (e) {
      return { data: {}, status: 200, statusText: "OK", headers: {}, config };
    }
  }

  // Fallback para GET desconhecido: Retorna vazio em vez de erro de rede
  return { data: [], status: 200, statusText: "OK", headers: {}, config };
};

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

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(`Erro na resposta [${error.response.status}]:`, error.response.data);
      if (error.response.status === 401) {
        console.warn("Token inválido ou expirado. Redirecionando para login...");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } else if (error.request) {
      console.error("Nenhuma resposta recebida do servidor.");
    } else {
      console.error("Erro ao configurar requisição:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
