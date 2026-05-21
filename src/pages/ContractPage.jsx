import { ContractBenefit } from "../components/landing_page/ContractBenefit";
import { HeaderLP } from "../components/landing_page/HeaderLP";
import { useNavigate } from "react-router-dom";

export default function ContractPage() {
  const navigate = useNavigate();

  const onBack = () => {
    navigate("/LP");
  };

  return (
    <div>
      <HeaderLP />
      <ContractBenefit onBack={onBack} />
    </div>
  );
}
