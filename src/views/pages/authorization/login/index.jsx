// assets
import Form from "../../../../components/reusable/form";

// others
import formInputs from "./elements.jsx";

export default function Login({ formChange, formType }) {
  return (
    <>
      <Form inputs={formInputs} formChange={formChange} formType={formType} />
    </>
  );
}
