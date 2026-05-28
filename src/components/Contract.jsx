import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import assinaturaPetrusVieira from "../../public/assinatura_petrus_vieira.png";

// Estilos
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 40,
    backgroundColor: "#ffffff",
    fontSize: 12,
    color: "#333333",
  },
  section: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2c3e50",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "bold",
  },
  paragraph: {
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 1.5,
  },
  bold: {
    fontWeight: "bold",
  },
  footer: {
    fontSize: 10,
    textAlign: "center",
    color: "#888888",
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
    paddingTop: 10,
  },
  signatureBlock: {
    width: "100%",
    alignItems: "center",
    marginVertical: 20,
  },
  signatureLine: {
    width: "100%",
    textAlign: "center",
  },
  signatureLabel: {
    textAlign: "center",
    marginTop: 5,
  },
  signatureImage: {
    width: 120,
    height: 60,
    objectFit: "contain", // mantém a proporção da imagem
    marginBottom: 5,
  },
});

export default function Contract({ registration }) {
  console.log(registration);

  const scholarshipHolder = registration.scholarshipHolders;
  const customer = scholarshipHolder.customers;
  const course = registration.courses;
  const instituition = registration.institution;

  console.log(scholarshipHolder, customer, course, instituition);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabeçalho */}
        <View style={styles.section}>
          <Text style={styles.title}>
            Contrato do Aluno Bolsista - Educação Básica - Prol EduPass
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.bold}>Aluno(a) Beneficiado(a)</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>{scholarshipHolder.fullName}</Text>,
            nascido em{" "}
            <Text style={styles.bold}>{scholarshipHolder.dateOfBirth}</Text>
          </Text>
          <Text style={styles.bold}>Responsável Financeiro</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>{customer.fullName}</Text>, inscrito no
            CPF nº <Text style={styles.bold}>{customer.cpf}</Text>, residente à{" "}
            <Text style={styles.bold}>
              {customer.logradouro}, {customer.cidade}, {customer.estado}.
            </Text>
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>
              CONTRATADA: PROL EDUCA SOLUÇÕES EDUCACIONAIS LTDA
            </Text>
            , CNPJ: 22.802.728/0001-70, com sede na Av. Mascarenhas de Morais,
            4861, Faculdade Pernambucana de Saúde / Foz, Imbiribeira, Recife/PE.
            CEP: 51.210-902.
          </Text>
          <Text style={styles.bold}>Escola Concedente do Benefício</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>{instituition.nomeFantasia}</Text>, CNPJ:{" "}
            {instituition.cnpj}, com sede em{" "}
            <Text style={styles.bold}>
              {instituition.street}, {instituition.city}, {instituition.state}.
            </Text>
          </Text>
        </View>

        {/* Bolsa de estudos e descontos */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>1. Bolsa de estudos e descontos</Text>
          <Text style={styles.paragraph}>
            1. Bolsa de Estudo de{" "}
            <Text style={styles.bold}>{course.percentageScholarship}%</Text>{" "}
            sobre valor da mensalidade vigente, para o curso{" "}
            <Text style={styles.bold}>{course.name}</Text>, do segmento{" "}
            <Text style={styles.bold}>Educação Básica</Text>, no turno{" "}
            <Text style={styles.bold}>{course.shift}</Text>, durante o ano
            letivo de <Text style={styles.bold}>2025</Text>, não cumulativo com
            outros benefícios.
          </Text>
          <Text style={styles.paragraph}>
            2. 100% de desconto na matrícula. Valor correspondente à Taxa de
            Adesão ao Benefício, a ser pago ao Prol Educa.
          </Text>
        </View>

        {/* Requisitos Essenciais */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>2. REQUISITOS ESSENCIAIS</Text>
          <Text style={styles.paragraph}>
            3. O Aluno(a) terá direito à Bolsa de Estudo desde que ele e/ou o
            Responsável cumpra os exigências:
          </Text>
          <Text style={styles.paragraph}>
            a. Nunca ter sido matriculado na Escola Concedente da Bolsa de
            Estudo;
          </Text>
          <Text style={styles.paragraph}>
            b. Alunos que vem através das empresas parceiras da Prol Educa - no
            produto Prol EduPass, estão isentos do pagamento de matricula ao
            programa de bolsa;
          </Text>
          <Text style={styles.paragraph}>
            c. Realizar o pagamento da Taxa de Renovação até o final de cada ano
            letivo;
          </Text>
          <Text style={styles.paragraph}>
            d. Ser aprovado na avaliação da Escola;
          </Text>
          <Text style={styles.paragraph}>
            e. Assinar o contrato de prestação de serviço educacional com a
            Escola;
          </Text>
          <Text style={styles.paragraph}>
            f. Entregar este Contrato assinado na Escola;
          </Text>
          <Text style={styles.paragraph}>
            g. Realizar o pagamento das mensalidades diretamente na Escola até a
            data do vencimento;
          </Text>

          <Text style={styles.paragraph}>
            4. O Aluno(a) perderá automaticamente o benefício nas seguintes
            situações:
          </Text>
          <Text style={styles.paragraph}>
            a. Trancamento ou desistência da matrícula;
          </Text>
          <Text style={styles.paragraph}>
            b. Rescisão do contrato de prestação de serviço educacional com a
            Escola;
          </Text>
          <Text style={styles.paragraph}>
            c. Transferência para outra Escola;
          </Text>
          <Text style={styles.paragraph}>
            d. Transferência de turno na mesma Escola;
          </Text>
          <Text style={styles.paragraph}>
            e. Descumprimento do Regulamento Interno da Escola ou infração
            disciplinar, além dos dispositivos deste Contrato;
          </Text>
        </View>

        {/* Pagamento das mensalidades e taxa de renovação */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>
            3. PAGAMENTO DAS MENSALIDADES E TAXA DE RENOVAÇÃO
          </Text>
          <Text style={styles.paragraph}>
            5. O pagamento das mensalidades deve ser realizado diretamente na
            Escola até a data de vencimento.
          </Text>
          <Text style={styles.paragraph}>
            6. Caso não seja efetuado o pagamento da mensalidade no dia do
            vencimento, o benefício do programa estará suspenso naquele mês
            inadimplente, sendo restaurado o valor integral da respectiva
            mensalidade, além de incidir as penalidades de mora previstas em
            Lei.
          </Text>
          <Text style={styles.paragraph}>
            7. O valor da taxa de renovação corresponde a{" "}
            <Text style={styles.bold}>{course.percentageScholarship}%</Text> do
            valor integral da mensalidade, a ser pago ao Prol Educa, até o
            início do próximo ano letivo, durante o período da Etapa de Formação
            atual.
          </Text>
        </View>

        {/* VIGÊNCIA E RESCISÃO */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>4. VIGÊNCIA E RESCISÃO</Text>
          <Text style={styles.paragraph}>
            8. Obedecidas as exigências, o Contrato vigora a partir do primeiro
            dia de aula, data em que o Aluno(a) passa a gozar o direito à Bolsa
            de Estudos, e se encerra ao final da Etapa de Formação atual. Este
            Contrato será renovado automaticamente até a conclusão da Etapa de
            Formação, desde que cumprida às exigências dispostas.
          </Text>
          <Text style={styles.paragraph}>
            8.1 Este Contrato será renovado automaticamente até a conclusão da
            Etapa de Formação, desde que cumprida às exigências dispostas.
          </Text>
          <Text style={styles.paragraph}>
            9. O Aluno(a) ou Responsável poderá rescindir o Contrato até antes
            do início das aulas.
          </Text>
          <Text style={styles.paragraph}>
            10. A solicitação de cancelamento de contrato deverá ser feita na
            área do aluno que poderá ser acessada no site da Prol Educa.
          </Text>
        </View>

        {/* Proteção de Dados */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>5. PROTEÇÃO DE DADOS</Text>
          <Text style={styles.paragraph}>
            11. O Aluno(a) e/ou Responsável manifesta expresso consentimento
            sobre o uso dos dados fornecidos para execução deste Contrato.
          </Text>
          <Text style={styles.paragraph}>
            12. Após a vigência deste Contrato, o Aluno(a) e/ou Responsável
            poderá revogar o consentimento, ficando o tratamento dos dados pelo
            Prol Educa sujeito a sua Política de Privacidade.
          </Text>
        </View>

        {/* Disposições Gerais */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>6. DISPOSIÇÕES GERAIS</Text>
          <Text style={styles.paragraph}>
            13. O Aluno(a) ou o Responsável são os únicos responsáveis pela
            veracidade das informações prestadas.
          </Text>
          <Text style={styles.paragraph}>
            14. Caso seja verificado a inveracidade das informações, a Parte
            lesada se reserva no direito de rescindir este Contrato sem
            necessidade de comunicação prévia, além de exigir o ressarcimento
            pelo eventual prejuízo oriundo do benefício indevido.
          </Text>
          <Text style={styles.paragraph}>
            15. A Escola, por mera liberalidade, poderá permitir o acúmulo de
            benefícios sem que haja rescisão automática deste Contrato.
          </Text>
          <Text style={styles.paragraph}>
            16. As partes ficam autorizadas a divulgar os termos deste Contrato,
            inclusive nomes e identificação pessoal, tornando público os
            resultados deste Contrato de Bolsa de Estudos da Prol Educa.
          </Text>
          <Text style={styles.paragraph}>
            17. A não exigência, por qualquer uma das Partes, do cumprimento de
            qualquer Cláusula ou condição estabelecida neste Contrato, será
            considerada mera liberalidade e não implicará em novação ou renúncia
            quanto ao exercício desse direito, que poderá ser exigido a qualquer
            tempo.
          </Text>
          <Text style={styles.paragraph}>
            18. Este contrato somente terá validade após a matrícula do(a)
            Aluno(a) na Escola concedente, a qual está condicionada à existência
            de vagas e sua aprovação no processo de avaliação.
          </Text>
          <Text style={styles.paragraph}>
            19. O Responsável autoriza a Escola a fornecer informações ao Prol
            Educa referente ao pagamento das mensalidades, notas das avaliações,
            registro de faltas e comportamento disciplinar do(a) Aluno(a).
          </Text>
        </View>

        {/* Foro */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>7. FORO</Text>
          <Text style={styles.paragraph}>
            24. Fica eleito o Foro da Comarca do Recife/PE, com exclusão de
            qualquer outro, por mais privilegiado que seja, para dirimir
            quaisquer problemas decorrentes deste Contrato.
          </Text>
        </View>

        {/* Assinaturas */}
        <View>
          <View style={styles.signatureBlock} break>
            <Text>________________________________________</Text>
            <Text style={styles.signatureLabel}>Assinatura do Aluno(a)</Text>
          </View>

          <View style={styles.signatureBlock}>
            <Text>________________________________________</Text>
            <Text style={styles.signatureLabel}>Assinatura do responsável</Text>
          </View>

          <View style={styles.signatureBlock}>
            <Image style={styles.signatureImage} src={assinaturaPetrusVieira} />
            <Text style={styles.signatureLine}>
              ________________________________________
            </Text>
            <Text style={styles.signatureLabel}>Assinatura da Prol Educa</Text>
          </View>
        </View>

        {/* Rodapé */}
        <View style={styles.footer}>
          <Text>
            Contrato gerado digitalmente - Prol Educa Soluções Educionais
          </Text>
        </View>
      </Page>
    </Document>
  );
}
