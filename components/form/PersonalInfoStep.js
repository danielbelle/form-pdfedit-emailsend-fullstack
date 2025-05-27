import { useEffect, useState } from "react";

import { z } from "zod";

// Esquema de validação Zod
const formSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  docRG: z.string().min(4, "RG deve ter pelo menos 4 dígitos"),
  docCPF: z.string().refine((val) => {
    const cpf = val.replace(/[^\d]+/g, "");
    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;

    const digits = cpf.split("").map((x) => parseInt(x));
    const rest = (count) =>
      ((digits
        .slice(0, count - 12)
        .reduce((soma, el, index) => soma + el * (count - index), 0) *
        10) %
        11) %
      10;

    return rest(10) === digits[9] && rest(11) === digits[10];
  }, "CPF inválido"),
  period: z.enum(["matutino", "vespertino", "noturno", "integral"], {
    errorMap: () => ({ message: "Selecione um período válido" }),
  }),
  institution: z
    .string()
    .min(3, "Instituição deve ter pelo menos 3 caracteres"),
  course: z.string().min(3, "Curso deve ter pelo menos 3 caracteres"),
  month: z.string().min(1, "Selecione um mês"),
  timesInMonth: z.number().int().positive("Vezes que foi para aula"),
  city: z.string().min(3, "Cidade deve ter pelo menos 3 caracteres"),
  phone: z.string().min(1, "Telefone obrigatório"),
});

export default function PersonalInfoStep({
  formData,
  handleChange,
  errors,
  setErrors,
}) {
  const [periodOptions] = useState([
    { value: "matutino", label: "Matutino" },
    { value: "vespertino", label: "Vespertino" },
    { value: "noturno", label: "Noturno" },
    { value: "integral", label: "Integral" },
  ]);

  const [monthOptions] = useState([
    { value: "1", label: "Janeiro" },
    { value: "2", label: "Fevereiro" },
    { value: "3", label: "Março" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Maio" },
    { value: "6", label: "Junho" },
    { value: "7", label: "Julho" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ]);

  // Seleciona o mês atual como padrão se não houver valor em formData.month
  const currentMonth = String(new Date().getMonth() + 2);

  // Deixe o período "noturno" como padrão se não houver valor em formData.period
  const defaultPeriod = "noturno";

  const validateField = async (name, value) => {
    try {
      // Cria um sub-schema para validar apenas o campo atual
      const fieldSchema = formSchema.pick({ [name]: true });
      await fieldSchema.parseAsync({ [name]: value });
      setErrors((prev) => ({ ...prev, [name]: "" }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [name]: error.errors[0].message }));
      }
      return false;
    }
  };

  const handleBlur = async (e) => {
    const { name, value } = e.target;
    // Converta para número se for o campo timesInMonth
    const parsedValue = name === "timesInMonth" ? Number(value) : value;
    await validateField(name, parsedValue);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    handleChange({ target: { name: "inputDocument", value: file } });
    await validateField("inputDocument", file);
  };

  // Renomeie a função interna:
  const handleLocalChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === "timesInMonth" ? Number(value) : value;
    if (name === "timesInMonth") {
      handleChange({
        target: {
          name,
          value: parsedValue,
        },
      });
    } else {
      handleChange(e);
    }
  };

  // Validação inicial ao montar o componente
  useEffect(() => {
    const validateInitialData = async () => {
      for (const key in formData) {
        if (formData[key]) {
          await validateField(key, formData[key]);
        }
      }
    };
    validateInitialData();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Informações Pessoais</h2>
      {/* Nome Completo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-md font-medium text-gray-700 mb-1">
            Nome Completo *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } rounded`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>
        {/* Email */}
        <div>
          <label className="block text-md font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
      </div>
      {/* RG, CPF e tel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-md font-medium text-gray-700 mb-1">
            RG *
          </label>
          <input
            type="text"
            name="docRG"
            value={formData.docRG || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border ${
              errors.docRG ? "border-red-500" : "border-gray-300"
            } rounded`}
          />
          {errors.docRG && (
            <p className="text-red-500 text-xs mt-1">{errors.docRG}</p>
          )}
        </div>

        <div>
          <label className="block text-md font-medium text-gray-700 mb-1">
            CPF *
          </label>
          <input
            type="text"
            name="docCPF"
            value={formData.docCPF || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border ${
              errors.docCPF ? "border-red-500" : "border-gray-300"
            } rounded`}
            placeholder="000.000.000-00"
          />
          {errors.docCPF && (
            <p className="text-red-500 text-xs mt-1">{errors.docCPF}</p>
          )}
        </div>
        <div>
          <label className="block text-md font-medium text-gray-700 mb-1">
            Telefone *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border ${
              errors.phone ? "border-red-500" : "border-gray-300"
            } rounded`}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Cidade, Instituição e Curso */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-md font-medium text-gray-700 mb-1">
            Cidade Transporte *
          </label>
          <input
            type="text"
            name="city"
            value={formData.city || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border ${
              errors.city ? "border-red-500" : "border-gray-300"
            } rounded`}
          />
          {errors.city && (
            <p className="text-red-500 text-xs mt-1">{errors.city}</p>
          )}
        </div>

        <div>
          <label className="block text-md font-medium text-gray-700 mb-1">
            Instituição *
          </label>
          <input
            type="text"
            name="institution"
            value={formData.institution || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border ${
              errors.institution ? "border-red-500" : "border-gray-300"
            } rounded`}
          />
          {errors.institution && (
            <p className="text-red-500 text-xs mt-1">{errors.institution}</p>
          )}
        </div>

        <div>
          <label className="block text-md font-medium text-gray-700 mb-1">
            Curso *
          </label>
          <input
            type="text"
            name="course"
            value={formData.course || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border ${
              errors.course ? "border-red-500" : "border-gray-300"
            } rounded`}
          />
          {errors.course && (
            <p className="text-red-500 text-xs mt-1">{errors.course}</p>
          )}
        </div>
      </div>
      {/* Período, Mês e Vezes no Mês */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-md font-medium text-gray-700 mb-1">
            Período *
          </label>
          <select
            name="period"
            value={formData.period || defaultPeriod}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border ${
              errors.period ? "border-red-500" : "border-gray-300"
            } rounded`}
          >
            <option value="" disabled>
              Selecione
            </option>
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.period && (
            <p className="text-red-500 text-xs mt-1">{errors.period}</p>
          )}
        </div>

        <div>
          <label className="block text-md font-medium text-gray-700 mb-1">
            Mês *
          </label>
          <select
            name="month"
            value={formData.month || currentMonth}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border ${
              errors.month ? "border-red-500" : "border-gray-300"
            } rounded`}
          >
            <option value="" disabled>
              Selecione o mês
            </option>
            {monthOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.month && (
            <p className="text-red-500 text-xs mt-1">{errors.month}</p>
          )}
        </div>

        <div>
          <label className="block text-md font-medium text-gray-700 mb-1">
            Vezes no Mês *
          </label>
          <input
            type="number"
            name="timesInMonth"
            value={formData.timesInMonth || ""}
            onChange={handleLocalChange}
            onBlur={handleBlur}
            min="1"
            max="31"
            className={`w-full p-2 border ${
              errors.timesInMonth ? "border-red-500" : "border-gray-300"
            } rounded`}
          />
          {errors.timesInMonth && (
            <p className="text-red-500 text-xs mt-1">{errors.timesInMonth}</p>
          )}
        </div>
      </div>
    </div>
  );
}
