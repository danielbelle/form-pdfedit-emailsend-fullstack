import { useState } from "react";
import PersonalInfoStep from "./PersonalInfoStep";
import FileUpload from "../FileUpload";
import SignaturePad from "../SignaturePad";
import EmailPreview from "../email/EmailPreview";
import { z } from "zod";

export default function FormWizard() {
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    docRG: "",
    docCPF: "",
    period: "",
    institution: "",
    course: "",
    month: "",
    timesInMonth: 0,
    city: "",
    phone: "",
    sign: "",
    signatureName: "",
    inputDocument: null,
  });

  // Valida todo o formulário
  const validateForm = async () => {
    try {
      await formSchema.parseAsync(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const steps = [
    { id: 1, name: "Dados para Preencher" },
    { id: 2, name: "Assinatura e Comprovante" },
    { id: 3, name: "Confirmar PDF e Assinatura" },
    { id: 4, name: "Prévia de Email e Enviar" },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileUpload = (files) => {
    setFormData((prev) => ({ ...prev, attachments: files }));
  };

  const handleSignatureSave = (signature) => {
    setFormData((prev) => ({ ...prev, signature }));
  };

  const nextStep = () => {
    setFormData((prev) => ({ ...prev }));
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => {
    // Garante que signature e attachments estejam salvos no formData
    setFormData((prev) => ({
      ...prev,
      signature: prev.signature,
      attachments: prev.attachments,
    }));
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    /*if (await validateForm()) {
      // Processar o formulário
      console.log("Formulário válido:", formData);
    } else {
      console.log("Corrija os erros no formulário");
      // Rolagem para o primeiro erro
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        document.querySelector(`[name="${firstError}"]`)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }*/
  };

  return (
    <div className="md:max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md max-w-xl">
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center 
              ${
                currentStep >= step.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {step.id}
            </div>
            <span
              className={`mt-2 text-sm ${
                currentStep >= step.id
                  ? "font-bold text-blue-500"
                  : "text-gray-500"
              }`}
            >
              {step.name}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <PersonalInfoStep
            formData={formData}
            handleChange={handleChange}
            errors={errors}
            setErrors={setErrors}
          />
        )}
        {currentStep === 2 && (
          <div className="space-y-6">
            <SignaturePad
              onSave={handleSignatureSave}
              value={formData.signature || ""}
            />
            <FileUpload
              onFileChange={handleFileUpload}
              value={formData.attachments || []}
            />
          </div>
        )}
        {currentStep === 3 && <EmailPreview formData={formData} />}

        <div className="flex mt-8">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Voltar
            </button>
          )}

          <div className="flex-1"></div>

          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-auto"
            >
              Avançar
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-auto"
            >
              Enviar Email
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
