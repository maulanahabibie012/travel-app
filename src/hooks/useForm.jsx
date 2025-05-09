import { useState } from "react";

// Custom hook untuk manajemen form
const useForm = (initialState = {}) => {
  const [values, setValues] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const resetForm = () => setValues(initialState);

  return { values, handleChange, resetForm, setValues };
};

export default useForm;
