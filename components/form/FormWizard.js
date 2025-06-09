import { useState, useEffect, useRef } from "react";
import PersonalInfoStep from "./PersonalInfoStep";
import FileUpload from "../FileUpload";
import SignaturePad from "../SignaturePad";
import EmailPreview from "../email/EmailPreview";
import { z } from "zod";
import PdfAndSignaturePreview from "../email/PdfAndSignaturePreview";

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
  const [showSubmit, setShowSubmit] = useState(false);
  const signaturePadRef = useRef(null);

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

  useEffect(() => {
    if (currentStep === steps.length) {
      setShowSubmit(false);
      const timer = setTimeout(() => setShowSubmit(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowSubmit(false);
    }
  }, [currentStep, steps.length]);

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
    if (currentStep === 2) {
      saveSignatureBetweenSteps();
    }
    setFormData((prev) => ({ ...prev }));
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => {
    // Salva a assinatura ao voltar também
    saveSignatureBetweenSteps();
    setFormData((prev) => ({
      ...prev,
      signature: prev.signature,
      attachments: prev.attachments,
    }));
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const saveSignatureBetweenSteps = () => {
    if (signaturePadRef.current) {
      handleSignatureSave(signaturePadRef.current.toDataURL("image/png"));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmSend = window.confirm(
      "Você deseja realmente enviar o e-mail?"
    );
    if (!confirmSend) return;

    // Monte o array de anexos (FileUpload + PDF editado)
    const attachments = [];

    // Adicione arquivos do FileUpload
    if (formData.attachments) {
      for (let i = 0; i < formData.attachments.length; i++) {
        const file = formData.attachments[i];
        const base64 = await toBase64(file);
        attachments.push({
          filename: file.name,
          content: base64.split(",")[1], // remove o prefixo data:...
          contentType: file.type,
        });
      }
    }

    // Adicione o PDF editado, se existir
    if (formData.pdfEdited) {
      attachments.push({
        filename: "documento-editado.pdf",
        content: formData.pdfEdited.split(",")[1], // base64 puro
        contentType: "application/pdf",
      });
    }

    // Envie como JSON
    try {
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          attachments,
        }),
      });
      if (response.ok) {
        alert("Email enviado com sucesso!");
      } else {
        alert("Falha ao enviar email.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Função auxiliar para converter arquivo em base64
  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

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
              ref={signaturePadRef}
              onSave={handleSignatureSave}
              value={formData.signature || ""}
            />
            <FileUpload
              onFileChange={handleFileUpload}
              value={formData.attachments || []}
            />
          </div>
        )}
        {currentStep === 3 && (
          <PdfAndSignaturePreview
            formData={formData}
            onPdfGenerated={(pdfBase64) =>
              setFormData((prev) => ({ ...prev, pdfEdited: pdfBase64 }))
            }
          />
        )}
        {currentStep === 4 && <EmailPreview formData={formData} />}

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
            showSubmit && (
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-auto"
              >
                Enviar Email
              </button>
            )
          )}
        </div>
      </form>
    </div>
  );
}
