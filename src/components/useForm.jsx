// useForm.js
import { useState } from "react";
import { validateName, validateLastname, validatePhone, validateEmail } from "../utils/validation";

export const useForm = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  
  const [nameError, setNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleNameChange = (text) => {
    setName(text);
    setNameError(validateName(text).message);
  };

  const handleLastNameChange = (text) => {
    setLastName(text);
    setLastNameError(validateLastname(text).message);
  };

  const handlePhoneChange = (text) => {
    setPhone(text);
    setPhoneError(validatePhone(text).message);
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    setEmailError(validateEmail(text).message);
  };

  return {
    name, lastName, phone, email,
    nameError, lastNameError, phoneError, emailError,
    handleNameChange, handleLastNameChange, handlePhoneChange, handleEmailChange
  };
};
