import { useState, useEffect } from "react";

export default function PersonalInfoStep({
  formData,
  handleChange,
  errors,
  setErrors,
}) {
  const [semesterOptions] = useState(
    Array.from({ length: 12 }, (_, i) => ({
      value: i + 1,
      label: `${i + 1}º Semestre`,
    }))
  );

  const [monthOptions] = useState([
    { value: "Janeiro", label: "Janeiro" },
    { value: "Fevereiro", label: "Fevereiro" },
    { value: "Março", label: "Março" },
    { value: "Abril", label: "Abril" },
    { value: "Maio", label: "Maio" },
    { value: "Junho", label: "Junho" },
    { value: "Julho", label: "Julho" },
    { value: "Agosto", label: "Agosto" },
    { value: "Setembro", label: "Setembro" },
    { value: "Outubro", label: "Outubro" },
    { value: "Novembro", label: "Novembro" },
    { value: "Dezembro", label: "Dezembro" },
  ]);

  // Define valores padrão ao montar o componente
  useEffect(() => {
    if (!formData.period) {
      handleChange({
        target: {
          name: "period",
          value: semesterOptions[0].value,
        },
      });
    }
    if (!formData.month) {
      handleChange({
        target: {
          name: "month",
          value: monthOptions[0].value,
        },
      });
    }
    if (!formData.timesInMonth) {
      handleChange({
        target: {
          name: "timesInMonth",
          value: 1,
        },
      });
    }
    // eslint-disable-next-line
  }, []);

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
            className="w-full p-2 border border-gray-300 rounded"
          />
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
            className="w-full p-2 border border-gray-300 rounded"
          />
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
            className="w-full p-2 border border-gray-300 rounded"
          />
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
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="000.000.000-00"
          />
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
            className="w-full p-2 border border-gray-300 rounded"
          />
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
            className="w-full p-2 border border-gray-300 rounded"
          />
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
            className="w-full p-2 border border-gray-300 rounded"
          />
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
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>
      {/* Período (Semestre), Mês e Vezes no Mês */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-md font-medium text-gray-700 mb-1">
            Semestre *
          </label>
          <select
            name="period"
            value={formData.period || semesterOptions[0].value}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "period",
                  value: Number(e.target.value),
                },
              })
            }
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="" disabled>
              Selecione o semestre
            </option>
            {semesterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-md font-medium text-gray-700 mb-1">
            Mês *
          </label>
          <select
            name="month"
            value={formData.month || monthOptions[0].value}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
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
        </div>

        <div>
          <label className="block text-md font-medium text-gray-700 mb-1">
            Vezes no Mês *
          </label>
          <input
            type="number"
            name="timesInMonth"
            value={formData.timesInMonth || 1}
            onChange={handleLocalChange}
            min="1"
            max="31"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>
    </div>
  );
}
