import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

export default function PaymentHistoryMock() {
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [nextMonthlyFee, setNextMonthlyFee] = useState();
  const [history, setHistory] = useState([]);
  const [statusCurrentPayment, setStatusCurrentPayment] = useState();
  const [companyCustomers, setCompanyCustomers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getCompanyDatas();
  }, []);

  const getCompanyDatas = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));

      if (!userData.id) {
        alert("Usuário não encontrado, estamos redirecionando...");
        return navigate("/login");
      }

      axiosInstance
        .get(`/customers/company/${userData.id}`)
        .then((response) => {
          const data = response.data;
          // console.log("Lista de usuários da empresa:", data);
          setCompanyCustomers(response.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar lista de usuários:", error);
        });

      axiosInstance
        .get(`/companies/transactions/${userData.id}`)
        .then((response) => {
          const data = response.data;
          console.log("Lista de transações da empresa:", data);

          if (data.length > 0) {
            const lastTransaction = data[data.length - 1];
            data.pop(); // remove para verificar se está pago

            // status
            if (
              lastTransaction.status == "APROVADO" ||
              lastTransaction.status == "PAGO"
            ) {
              data.push(lastTransaction); // adiciona novamente para mostrar no histórico

              const currentMon = new Date().getMonth() + 1;
              const transactionMon =
                new Date(lastTransaction.dataNotificacao).getMonth() + 1;

              if (transactionMon >= currentMon) {
                setStatusCurrentPayment("Pago");
                // proxima cobranca
                const date = new Date(
                  lastTransaction.dataNotificacao.replace(" ", "T"),
                );
                const year = date.getFullYear();
                const mon = date.getMonth();
                const newYear = mon === 11 ? year + 1 : year;
                const newMon = (mon + 1) % 12;
                const newDate = new Date(newYear, newMon, 1);

                // console.log(newDate.toLocaleDateString('pt-BR'));

                setNextMonthlyFee(newDate.toLocaleDateString("pt-BR"));
              } else {
                setStatusCurrentPayment("Pendente");
              }
            } else if (lastTransaction.status == "AGUARDANDO") {
              setStatusCurrentPayment("Em processamento");
            } else {
              setStatusCurrentPayment("Pendente");
            }
          } else {
            setStatusCurrentPayment("Pendente");
          }

          setHistory(data);
        })
        .catch((error) => {
          console.error("Erro ao buscar lista de transações:", error);
        });
    } catch (e) {
      console.error("Erro ao interpretar dados do localStorage:", e);
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  };

  // const gerarComprovante = (idTransacao) => {
  //   alert(`Mock: gerar comprovante para transação ${idTransacao}`);
  // };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-lg shadow mt-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Histórico de Pagamentos
      </h1>

      {loading && <p className="text-gray-500">Carregando...</p>}
      {erro && <p className="text-red-500">{erro}</p>}

      {!loading && !erro && (
        <>
          <section className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <div className="flex flex-row">
                  <h2 className="text-lg font-semibold text-gray-700">
                    Pagamento atual
                  </h2>
                  <p className="text-yellow-600 font-medium ml-4">
                    {statusCurrentPayment}
                  </p>
                </div>
                <p className="text-gray-600">
                  R$ {(companyCustomers.length * 20).toFixed(2)} reais
                  <span className="text-sm text-gray-500">
                    (total de {companyCustomers.length} bolsistas matriculados)
                  </span>
                </p>
                {statusCurrentPayment == "Pago" && (
                  <p className="text-gray-500 text-sm">
                    Sua próxima cobrança será em
                    <strong> {nextMonthlyFee}</strong>
                  </p>
                )}
              </div>
              <div className="mt-4 sm:mt-0">
                {statusCurrentPayment == "Pendente" && (
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/company/checkout")}
                  >
                    Efetuar pagamento
                  </button>
                )}
              </div>
            </div>
          </section>

          <hr className="my-6" />

          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Histórico</h3>
            <ul className="divide-y divide-gray-200">
              {history.length === 0 ? (
                <p className="text-gray-500">Nenhum pagamento registrado.</p>
              ) : (
                history.map((transacao) => (
                  <li key={transacao.id} className="py-4">
                    <div className="flex flex-col sm:flex-row justify-between">
                      <div>
                        <p className="text-sm text-gray-700 font-medium">
                          R$ {transacao.valor.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Pago no dia{" "}
                          {new Date(
                            transacao.dataCobranca,
                          ).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">
                          {transacao.metodoPagamento.replace("_", " ")}
                        </p>
                      </div>

                      {/* <div className="mt-2 sm:mt-0 sm:text-right">
                        <button
                          onClick={() => gerarComprovante(transacao.id)}
                          className="text-sm text-blue-600 hover:text-blue-800 underline transition"
                        >
                          Gerar comprovante
                        </button>
                      </div> */}
                    </div>
                  </li>
                ))
              )}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
