import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Form.css";
import SubmitPayment from "../services/payment.service";

export default function CreditCardForm() {
  const [cardNumber, setCardNumber] = React.useState("");
  const [cardName, setCardName] = React.useState("");
  const [cardExpiration, setCardExpiration] = React.useState("");
  const [cardCvv, setCardCvv] = React.useState("");

  const handleCardNumberChange = (event) => {
    const value = event.target.value
      .replace(/\D/g, "")
      .replace(/(\d{4})(\d{4})?(\d{4})?(\d{4})?/, "$1 $2 $3 $4")
      .trim();
    setCardNumber(value);
  };

  const handleCardNameChange = (event) => {
    const value = event.target.value.toUpperCase();
    setCardName(value);
  };

  const handleCardExpirationChange = (event) => {
    const value = event.target.value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d{2})?/, (match, p1, p2) => {
        return p2 ? `${p1}/${p2}` : p1;
      })
      .trim();
    setCardExpiration(value);
  };

  const handleCardCvvChange = (event) => {
    const value = event.target.value.replace(/\D/g, "").trim();
    setCardCvv(value);
  };

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log(cardNumber, cardName, cardExpiration, cardCvv);

    if (cardNumber.length <= 0 || cardNumber.length > 19) {
      alert("Número de tarjeta inválido");
      return;
    }

    if (cardName.length <= 0) {
      alert("Nombre del titular inválido");
      return;
    }

    if (cardExpiration.length < 5 || cardExpiration.length > 7) {
      alert("Fecha de expiración inválida");
      console.log(cardExpiration);
      return;
    }

    if (cardCvv.length <= 2) {
      alert("CVV inválido");
      return;
    }

    setIsSubmitting(true);
    try {
      await SubmitPayment(cardNumber, cardName, cardExpiration, cardCvv);
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
      if (isSuccess) {
        alert("Pago realizado con éxito");
        setCardNumber("");
        setCardName("");
        setCardExpiration("");
        setCardCvv("");
      } else {
        alert("Error al procesar el pago");
      }
    }
  };

  return (
    <form>
      <div className="mb-3">
        <label htmlFor="cardNumber" className="form-label">
          Número de Tarjeta:
        </label>
        <input
          type="text"
          id="cardNumber"
          value={cardNumber}
          aria-describedby="cardNumberHelp"
          placeholder="0000 0000 0000 0000"
          className="form-control"
          onChange={handleCardNumberChange}
          maxLength="19"
        />
        <small id="cardNumberHelp" className="form-text text-muted">
          No compartas tu número de tarjeta con nadie.
        </small>
      </div>
      <div className="mb-3">
        <label htmlFor="cardName" className="form-label">
          Nombre del Titular:
        </label>
        <input
          type="text"
          id="cardName"
          value={cardName}
          className="form-control"
          onChange={handleCardNameChange}
        />
        <small id="cardNameHelp" className="form-text text-muted">
          Nombre y apellido como aparece en la tarjeta.
        </small>
      </div>
      <div className="mb-3">
        <label htmlFor="cardExpiration" className="form-label">
          Fecha de Expiración:
        </label>
        <input
          type="text"
          id="cardExpiration"
          value={cardExpiration}
          aria-describedby="cardExpirationHelp"
          placeholder="MM/AA"
          className="form-control"
          onChange={handleCardExpirationChange}
          maxLength="5"
        />
        <small id="cardExpirationHelp" className="form-text text-muted">
          Mes y año de expiración de la tarjeta.
        </small>
      </div>
      <div className="mb-3">
        <label htmlFor="cardCvv" className="form-label">
          CVV
        </label>
        <input
          type="text"
          id="cardCvv"
          value={cardCvv}
          aria-describedby="cardCvvHelp"
          placeholder="000"
          className="form-control"
          onChange={handleCardCvvChange}
          maxLength="3"
        />
        <small id="cardCvvHelp" className="form-text text-muted">
          Código de seguridad de 3 dígitos.
        </small>
      </div>
      <div className="d-grid gap-2">
        <button
          type="submit"
          className="btn btn-mb-3 btn-primary"
          onClick={handleSubmit}
        >
          Pagar
        </button>
      </div>
    </form>
  );
}
