import * as yup from "yup";

// Função para validar CPF real
function isValidCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let sum = 0,
    rest;
  for (let i = 1; i <= 9; i++)
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf.substring(9, 10))) return false;
  sum = 0;
  for (let i = 1; i <= 10; i++)
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf.substring(10, 11))) return false;
  return true;
}

export const formSchema = yup.object().shape({
  name: yup
    .string()
    .min(6, "Nome deve ter mais de 5 letras")
    .required("Nome é obrigatório"),
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  docRG: yup
    .string()
    .matches(/^\d+$/, "RG deve conter apenas números")
    .min(5, "RG deve ter mais de 4 números")
    .required("RG é obrigatório"),
  docCPF: yup
    .string()
    .matches(
      /^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/,
      "CPF deve estar no formato 000.000.000-00 ou 00000000000"
    )
    .test("cpf-valido", "CPF inválido", (value) => isValidCPF(value || ""))
    .required("CPF é obrigatório"),
  period: yup.number().required("Semestre é obrigatório"),
  institution: yup.string().required("Instituição é obrigatória"),
  course: yup.string().required("Curso é obrigatório"),
  month: yup.string().required("Mês é obrigatório"),
  timesInMonth: yup
    .string()
    .required("Vezes no mês é obrigatório")
    .test(
      "is-number",
      "Vezes no mês deve ser um número",
      (val) => !isNaN(Number(val))
    )
    .test(
      "min",
      "Vezes no mês não pode ser menor que 1",
      (val) => Number(val) >= 1
    )
    .test(
      "max",
      "Vezes no mês não pode ser maior que 31",
      (val) => Number(val) <= 31
    ),
  city: yup.string().required("Cidade é obrigatória"),
  phone: yup.string().required("Telefone é obrigatório"),
});
