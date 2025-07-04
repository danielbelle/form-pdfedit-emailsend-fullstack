"use client";
import { useState, useEffect, useRef } from "react";
import PersonalInfoStep from "./PersonalInfoStep";
import FileUpload from "../FileUpload";
import SignaturePad from "../SignaturePad";
import EmailPreview from "../email/EmailPreview";
import PdfAndSignaturePreview from "../email/PdfAndSignaturePreview";
import { formSchema } from "./FormSchema";

export default function FormWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    docRG: "",
    docCPF: "",
    period: 1,
    institution: "",
    course: "",
    month: "",
    timesInMonth: "22", 
    city: "",
    phone: "",
    sign: "",
    signatureName: "",
    inputDocument: null,
  });
  const [showSubmit, setShowSubmit] = useState(false);
  const [errors, setErrors] = useState({});
  const signaturePadRef = useRef(null);
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    fetch("/api/csrf-token")
      .then((res) => res.json())
      .then((data) => {
        setCsrfToken(data.token);
      });
  }, []);

  const steps = [
    { id: 1, name: "Dados para Preencher" },
    { id: 2, name: "Assinatura e Comprovante" },
    { id: 3, name: "Confirmar PDF e Assinatura" },
    { id: 4, name: "Prévia de Email e Enviar" },
  ];

  useEffect(() => {
    document.title =
      "Formulário de Solicitação - Preencha os dados para solicitar o auxílio";
    if (currentStep === steps.length) {
      setShowSubmit(false);
      const timer = setTimeout(() => setShowSubmit(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowSubmit(false);
    }
  }, [currentStep, steps.length]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "timesInMonth"
          ? value 
          : (type === "number" || name === "period")
          ? value === "" ? "" : Number(value)
          : value,
    }));
  };

  const handleFileUpload = (files) => {
    setFormData((prev) => ({ ...prev, attachments: files }));
  };

  const handleSignatureSave = (signature) => {
    setFormData((prev) => ({ ...prev, signature }));
  };

  const nextStep = async () => {
    const valid = await validateForm();
    if (valid) {
      if (currentStep === 2) {
        saveSignatureBetweenSteps();
      }
      setFormData((prev) => ({ ...prev }));
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const saveSignatureBetweenSteps = () => {
    if (signaturePadRef.current) {
      // Salva a assinatura atual do canvas
      handleSignatureSave(signaturePadRef.current.toDataURL("image/png"));
    }
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

    const confirmSend = window.confirm(
      "Seu email será enviado com a solicitação preenchida para " +
        (process.env.NEXT_PUBLIC_EMAIL_RECEIVER || "o destinatário padrão") +
        ". Deseja continuar?"
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
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({
          ...formData,
          attachments,
        }),
      });
      if (response.ok) {
        alert("Email enviado com sucesso!");
        //window.location.reload();
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

  const validateForm = async () => {
    try {
      await formSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      if (err.inner) {
        const formErrors = {};
        err.inner.forEach((error) => {
          formErrors[error.path] = error.message;
        });
        setErrors(formErrors);
      }
      return false;
    }
  };

  // Função para trocar de step com validação se for avanço
  const goToStep = async (targetStep) => {
    if (targetStep === currentStep) return;
    // Só permite ir para steps à frente se validar o formulário
    if (targetStep > currentStep) {
      const valid = await validateForm();
      if (valid) {
        setCurrentStep(targetStep);
      }
    } else {
      // Permite voltar sem validação
      setCurrentStep(targetStep);
    }
  };

  return (
    <div className="md:max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md max-w-xl">
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {steps.map((step) => {
          const isStepAllowed = step.id <= currentStep + 1;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => {
                if (isStepAllowed) goToStep(step.id);
              }}
              className="flex flex-col items-center focus:outline-none group"
              tabIndex={0}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200
                  ${
                    currentStep >= step.id
                      ? "bg-blue-500 text-white group-hover:bg-blue-600"
                      : "bg-gray-200 text-gray-600 group-hover:bg-gray-300"
                  }
                  ${isStepAllowed ? "cursor-pointer" : "cursor-not-allowed"}
                `}
              >
                {step.id}
              </div>
              <span
                className={`mt-2 text-sm transition-colors duration-200
                  ${
                    currentStep >= step.id
                      ? "font-bold text-blue-500 group-hover:text-blue-600"
                      : "text-gray-500 group-hover:text-gray-700"
                  }
                `}
              >
                {step.name}
              </span>
            </button>
          );
        })}
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
