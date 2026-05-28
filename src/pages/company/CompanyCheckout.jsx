import { useEffect, useRef, useState } from "react";
import IMask from "imask";
import axiosInstance from "../../api/axiosInstance";
import EfiPay from "payment-token-efi";
import { useNavigate } from "react-router-dom";

export default function CompanyCheckout() {
  const [method, setMethod] = useState("cartao");
  const [message, setMessage] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState({
    number: "",
    cvv: "",
    expirationDate: "",
    expirationYear: "",
    holderName: "",
  });

  const [billetData, setBilletData] = useState({
    street: "",
    number: "",
    neighborhood: "",
    zipcode: "",
    city: "",
    complement: "",
    state: "",
  });

  // const [billetData, setBilletData] = useState({
  //   street: "Avenida Juscelino Kubitschek",
  //   number: "909",
  //   neighborhood: "Bauxita",
  //   zipcode: "35400000",
  //   city: "Ouro Preto",
  //   complement: "",
  //   state: "MG"
  // });

  const [billetDownloadLink, setBilletDownloadLink] = useState(null);
  const [qrCodePix, setQrCodePix] = useState(null);

  const [loggedCompany, setLoggedCompany] = useState(0);
  const [monthlyFee, setMonthlyFee] = useState(0);

  const navigate = useNavigate();

  const numberRef = useRef();
  const cvvRef = useRef();
  const expirationDateRef = useRef();
  const expirationYearRef = useRef();
  const stateRef = useRef();

  useEffect(() => {
    getCompanyData();

    // mock para preencher o forms do cartao
    // setCardData({
    //   number: "4485785674290087",
    //   cvv: "123",
    //   expirationDate: "05",
    //   expirationYear: "2029",
    //   holderName: "Gorbadoc Oldbuck",
    // });
  }, []);

  useEffect(() => {
    try {
      switch (method) {
        case "cartao":
          if (numberRef.current)
            IMask(numberRef.current, { mask: "0000 0000 0000 0000" });
          if (cvvRef.current) IMask(cvvRef.current, { mask: "000[0]" });
          if (expirationDateRef.current) {
            IMask(expirationDateRef.current, {
              mask: "MM",
              blocks: {
                MM: { mask: IMask.MaskedRange, from: 1, to: 12 },
              },
            });
          }

          if (expirationYearRef.current) {
            IMask(expirationYearRef.current, {
              mask: "YY",
              blocks: {
                YY: { mask: IMask.MaskedRange, from: 25, to: 99 },
              },
            });
          }
          break;

        case "boleto":
          if (stateRef.current) {
            const mask = IMask(stateRef.current, {
              mask: "aa",
              prepare: (str) => str.toUpperCase(),
              blocks: {
                a: {
                  mask: IMask.MaskedPattern,
                  mask: /^[A-Za-z]$/,
                },
              },
            });

            return () => mask.destroy();
          }
          break;

        default:
          // máscaras para campos do pix se necessário
          break;
      }
    } catch (err) {
      console.error(err.message);
    }
  }, [method]);

  const getCompanyData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData.id) {
        navigate("/login");
      }

      axiosInstance
        .get(`/companies/monthly-fee/${userData.id}`)
        .then((response) => {
          const data = response.data;
          console.log("Dados do usuário:", data);
          setLoggedCompany(userData.id);
          setMonthlyFee(data.monthlyFeeValue);
        })
        .catch((error) => {
          console.error("Erro ao buscar dados do usuário:", error);
        });
    } catch (e) {
      console.error("Erro ao interpretar dados do localStorage:", e);
    }
  };

  const handleCardChange = (e) => {
    setCardData({
      ...cardData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBilletChange = (e) => {
    setBilletData({
      ...billetData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage({ show: false, type: "", message: "" });

    try {
      if (method === "cartao") {
        const cardNumber = cardData.number.toString();

        if (cardNumber.length < 16) {
          throw new Error("O número do cartão precisa conter 16 digítos.");
        }

        // identificar bandeira do cartão
        // cartão de testes: 4485785674290087
        const brand =
          await EfiPay.CreditCard.setCardNumber(cardNumber).verifyCardBrand();

        console.log("bandeira do cartão: ", brand);

        // criar token de pagamento
        const paymentToken = await EfiPay.CreditCard.setAccount(
          "d79120393ce89a1101f3692f9428e4ee",
        ) // id da conta
          .setEnvironment("sandbox") // homologação
          .setCreditCardData({
            brand: brand,
            number: cardNumber,
            cvv: cardData.cvv,
            expirationMonth: cardData.expirationDate,
            expirationYear: cardData.expirationYear,
            holderName: cardData.holderName,
            reuse: false,
          })
          .getPaymentToken();

        console.log("token de pagamento:", paymentToken);

        const response = await axiosInstance.post("/payment/card", {
          company: {
            companyId: loggedCompany,
          },
          billing: {
            value: monthlyFee,
            installments: 1,
            paymentToken: paymentToken.payment_token,
          },
        });

        const data = response.data;
        console.log(data);

        if (data?.status && data?.message) {
          // mostrar modal com ícone, título, descrição e botão "concluir"
          setMessage({ show: true, type: "success", message: data.message });
        } else {
          setMessage({ show: true, type: "danger", message: data.message });
        }
      } else if (method === "boleto") {
        if (
          !billetData.street ||
          !billetData.number ||
          !billetData.neighborhood ||
          !billetData.zipcode ||
          !billetData.city ||
          !billetData.state
        ) {
          // setMessage("É necessário preencher todos os campos obrigatórios!");
          throw new Error(
            "É necessário preencher todos os campos obrigatórios!",
          );
        }

        const response = await axiosInstance.post("/payment/billet", {
          company: {
            companyId: loggedCompany,
            address: billetData,
          },
          billing: {
            value: monthlyFee,
          },
        });

        console.log(response);

        const data = response.data;

        if (data.status && data.billetPdfLink) {
          setBilletDownloadLink(data.billetPdfLink);
        } else {
          console.error("Erro ao gerar boleto");
        }
      } else {
        const response = await axiosInstance.post("/payment/pix", {
          company: {
            companyId: loggedCompany,
          },
          billing: {
            value: monthlyFee,
          },
        });

        const data = response.data;

        if (data?.status && data?.imagemQrcode) {
          setQrCodePix(data.imagemQrcode);
        } else {
          console.error("Erro na criação da imagem Qrcode pix");
        }
      }
    } catch (err) {
      console.error(err);
      if (err.message) {
        setMessage({ show: true, type: "danger", message: err.message });
      } else {
        setMessage({
          show: true,
          type: "danger",
          message:
            "Erro não identificado ao processar pagamento. Entre em contato com o suporte.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold">Pagamento da mensalidade</h2>
      <p className="mb-6">Valor de R$ {monthlyFee} reais</p>

      {/* Métodos de pagamento */}
      <div className="flex gap-3 mb-6">
        {["cartao", "boleto", "pix"].map((opt) => (
          <button
            key={opt}
            onClick={() => {
              setMethod(opt);
              setQrCodePix(null);
              setMessage({
                show: false,
                type: "",
                message: "",
              });
            }}
            className={`px-4 py-2 rounded cursor-pointer ${
              method === opt
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {opt === "cartao" ? "Cartão" : opt === "boleto" ? "Boleto" : "Pix"}
          </button>
        ))}
      </div>

      {/* Mensagem */}
      {message.show && (
        <div
          className={`mb-4 p-3 rounded text-sm ${message.type == "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"}`}
        >
          {message.message}
        </div>
      )}

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {method === "cartao" && (
          <>
            <div className="mb-4">
              <label htmlFor="holderName" className="block mb-1 font-bold">
                Nome no cartão
              </label>
              <input
                id="holderName"
                name="holderName"
                placeholder="Nome no cartão"
                // value={cardData.holderName}
                onChange={handleCardChange}
                className="form-input w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="number" className="block mb-1 font-bold">
                Número do cartão
              </label>
              <input
                id="number"
                name="number"
                placeholder="Número do cartão"
                // value={cardData.number}
                ref={numberRef}
                onChange={handleCardChange}
                className="form-input w-full"
              />
            </div>
            <div className="flex gap-4 mb-4">
              <div className="w-full">
                <label
                  htmlFor="expirationDate"
                  className="block mb-1 font-bold"
                >
                  Mês (MM)
                </label>
                <input
                  id="expirationDate"
                  name="expirationDate"
                  placeholder="MM"
                  // value={cardData.expirationDate}
                  ref={expirationDateRef}
                  onChange={handleCardChange}
                  className="form-input w-full"
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="expirationYear"
                  className="block mb-1 font-bold"
                >
                  Ano (AA)
                </label>
                <input
                  id="expirationYear"
                  name="expirationYear"
                  placeholder="AA"
                  // value={cardData.expirationYear}
                  ref={expirationYearRef}
                  onChange={handleCardChange}
                  className="form-input w-full"
                />
              </div>
              <div className="w-full">
                <label htmlFor="cvv" className="block mb-1 font-bold">
                  CVV
                </label>
                <input
                  id="cvv"
                  name="cvv"
                  placeholder="CVV"
                  // value={cardData.cvv}
                  ref={cvvRef}
                  onChange={handleCardChange}
                  className="form-input w-full"
                />
              </div>
            </div>
          </>
        )}

        {method === "boleto" && (
          <>
            {!billetDownloadLink ? (
              <>
                <div>
                  <label htmlFor="zipcode" className="font-bold">
                    CEP
                  </label>
                  <input
                    id="zipcode"
                    name="zipcode"
                    type="number"
                    placeholder="CEP"
                    // value={billetData.zipcode}
                    onChange={handleBilletChange}
                    className="form-input w-full"
                  />
                </div>
                <div>
                  <label htmlFor="street" className="font-bold">
                    Nome da rua
                  </label>
                  <input
                    id="street"
                    name="street"
                    placeholder="Rua"
                    // value={billetData.street}
                    onChange={handleBilletChange}
                    className="form-input w-full"
                  />
                </div>
                <div>
                  <label htmlFor="number" className="font-bold">
                    Número
                  </label>
                  <input
                    id="number"
                    name="number"
                    type="number"
                    placeholder="Número"
                    // value={billetData.number}
                    onChange={handleBilletChange}
                    className="form-input w-full"
                  />
                </div>
                <div>
                  <label htmlFor="neighborhood" className="font-bold">
                    Bairro
                  </label>
                  <input
                    id="neighborhood"
                    name="neighborhood"
                    placeholder="Bairro"
                    // value={billetData.neighborhood}
                    onChange={handleBilletChange}
                    className="form-input w-full"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="font-bold">
                    Cidade
                  </label>
                  <input
                    id="city"
                    name="city"
                    placeholder="Cidade"
                    // value={billetData.city}
                    onChange={handleBilletChange}
                    className="form-input w-full"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="font-bold">
                    Estado
                  </label>
                  <input
                    id="state"
                    name="state"
                    placeholder="Estado"
                    ref={stateRef}
                    // value={billetData.state}
                    onChange={handleBilletChange}
                    className="form-input w-full"
                  />
                </div>
                <div>
                  <label htmlFor="complement" className="font-bold">
                    Complemento <i>(opcional)</i>
                  </label>
                  <input
                    id="complement"
                    name="complement"
                    placeholder="Complemento"
                    // value={billetData.complement}
                    onChange={handleBilletChange}
                    className="form-input w-full"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded font-bold cursor-pointer"
                >
                  {loading
                    ? "Gerando boleto, espere um momento..."
                    : "Gerar Boleto"}
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-4 w-full p-4 bg-[#d7e3dc]">
                <div>
                  <h4 className="font-bold text-[#005520]">
                    Boleto gerado com sucesso
                  </h4>
                  <p className="text-[#005520]">
                    Estamos aguardando o seu pagamento. Clique no botão para
                    visualizar e baixar o seu boleto.
                  </p>
                </div>
                <button
                  type="button"
                  className="bg-green-600 text-white px-4 py-2 rounded font-bold"
                  onClick={() => window.open(billetDownloadLink)}
                >
                  Visualizar boleto
                </button>
              </div>
            )}
          </>
        )}

        {method === "pix" && (
          <>
            {!qrCodePix ? (
              <>
                <p className="text-gray-700">
                  Pague com Pix escaneando o QR Code gerado. É rápido, seguro e
                  sem taxas!
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded font-bold cursor-pointer"
                >
                  {loading ? "Gerando QR Code..." : "Gerar QR Code Pix"}
                </button>
              </>
            ) : (
              <div className="font-bold">
                <p className="mb-2">Escaneie com seu app de banco:</p>
                <img
                  src={`${qrCodePix}`}
                  alt="QR Code Pix"
                  className="w-60 h-60"
                />
              </div>
            )}
          </>
        )}

        {method == "cartao" && (
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white font-bold px-6 py-2 rounded cursor-pointer"
          >
            {loading ? "Processando..." : "Finalizar Pagamento"}
          </button>
        )}
      </form>
    </div>
  );
}
