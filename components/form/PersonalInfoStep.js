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
    if (formData.timesInMonth === undefined || formData.timesInMonth === null) {
      handleChange({
        target: {
          name: "timesInMonth",
          value: "1", // string!
        },
      });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Informações Pessoais</h2>
      {/* Nome Completo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="name"
            className="block text-md font-medium text-gray-700 mb-1"
          >
            Nome Completo *
          </label>
          <input
            id="name"
            type="text"
            name="name"
            autoComplete="name"
            value={formData.name || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.name && (
            <span className="text-red-500 text-xs">{errors.name}</span>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-md font-medium text-gray-700 mb-1"
          >
            Email *
          </label>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            value={formData.email || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.email && (
            <span className="text-red-500 text-xs">{errors.email}</span>
          )}
        </div>
      </div>
      {/* RG, CPF e tel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="docRG"
            className="block text-md font-medium text-gray-700 mb-1"
          >
            RG *
          </label>
          <input
            id="docRG"
            type="text"
            name="docRG"
            autoComplete="off"
            value={formData.docRG || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.docRG && (
            <span className="text-red-500 text-xs">{errors.docRG}</span>
          )}
        </div>
        <div>
          <label
            htmlFor="docCPF"
            className="block text-md font-medium text-gray-700 mb-1"
          >
            CPF *
          </label>
          <input
            id="docCPF"
            type="text"
            name="docCPF"
            autoComplete="off"
            value={formData.docCPF || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="000.000.000-00"
          />
          {errors.docCPF && (
            <span className="text-red-500 text-xs">{errors.docCPF}</span>
          )}
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-md font-medium text-gray-700 mb-1"
          >
            Telefone *
          </label>
          <input
            id="phone"
            type="tel"
            name="phone"
            autoComplete="tel"
            value={formData.phone || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.phone && (
            <span className="text-red-500 text-xs">{errors.phone}</span>
          )}
        </div>
      </div>

      {/* Cidade, Instituição e Curso */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="city"
            className="block text-md font-medium text-gray-700 mb-1"
          >
            Cidade Transporte *
          </label>
          <input
            id="city"
            type="text"
            name="city"
            autoComplete="address-level2"
            value={formData.city || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.city && (
            <span className="text-red-500 text-xs">{errors.city}</span>
          )}
        </div>
        <div>
          <label
            htmlFor="institution"
            className="block text-md font-medium text-gray-700 mb-1"
          >
            Instituição *
          </label>
          <input
            id="institution"
            type="text"
            name="institution"
            autoComplete="organization"
            value={formData.institution || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.institution && (
            <span className="text-red-500 text-xs">{errors.institution}</span>
          )}
        </div>
        <div>
          <label
            htmlFor="course"
            className="block text-md font-medium text-gray-700 mb-1"
          >
            Curso *
          </label>
          <input
            id="course"
            type="text"
            name="course"
            autoComplete="off"
            value={formData.course || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.course && (
            <span className="text-red-500 text-xs">{errors.course}</span>
          )}
        </div>
      </div>
      {/* Período (Semestre), Mês e Vezes no Mês */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="period"
            className="block text-md font-medium text-gray-700 mb-1"
          >
            Semestre *
          </label>
          <select
            id="period"
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
            autoComplete="off"
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
          {errors.period && (
            <span className="text-red-500 text-xs">{errors.period}</span>
          )}
        </div>

        <div>
          <label
            htmlFor="month"
            className="block text-md font-medium text-gray-700 mb-1"
          >
            Mês *
          </label>
          <select
            id="month"
            name="month"
            value={formData.month || monthOptions[0].value}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            autoComplete="off"
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
            <span className="text-red-500 text-xs">{errors.month}</span>
          )}
        </div>
        <div>
          <label
            htmlFor="timesInMonth"
            className="block text-md font-medium text-gray-700 mb-1"
          >
            Vezes no Mês *
          </label>
          <input
            id="timesInMonth"
            type="number"
            name="timesInMonth"
            autoComplete="off"
            value={formData.timesInMonth}
            onChange={handleChange}
            min="1"
            max="31"
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.timesInMonth && (
            <span className="text-red-500 text-xs">{errors.timesInMonth}</span>
          )}
        </div>
      </div>
    </div>
  );
}
