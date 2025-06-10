# 🚗 Sistema de Solicitação de Auxílio Transporte — Viadutos

## 📝 Descrição do Projeto

Este sistema permite que estudantes solicitem o Auxílio Transporte de forma 100%
digital, eliminando a necessidade de impressão, assinatura manual e entrega
presencial de documentos. O fluxo é simples: o aluno preenche um formulário,
assina digitalmente, anexa comprovantes e recebe (junto à prefeitura) o PDF
gerado e assinado por e-mail.

---

## Principais Funcionalidades

- **Formulário Online**: Coleta dados pessoais, curso, cidade, mês, etc.
- **Assinatura Digital**: O estudante assina diretamente na tela, sem papel.
- **Upload de Comprovantes**: Permite anexar comprovantes de presença (PDF).
- **Geração Automática de PDF**: Preenche um modelo oficial com os dados e
  assinatura.
- **Envio Automático por E-mail**: O PDF e anexos são enviados para a prefeitura
  e para o estudante.
- **Validação de Dados**: Campos obrigatórios, validação de anexos e tipos de
  arquivo.
- **Segurança**: CSRF, CORS, rate limit, e headers de segurança.

---

## 🛠 Stack Tecnológica

- **Frontend**:
  - Next.js (JavaScript/React)
  - Tailwind CSS
- **Bibliotecas**:
  - `pdf-lib` (manipulação de PDF)
  - `signature_pad` (captura de assinatura digital)
  - `nodemailer` (envio de e-mails via SMTP)
  - `zod` (validação de dados)
- **Hospedagem**:
  - Vercel

---

## 🏗 Estrutura do Projeto

```
components/
  ├── form/                # Passos do formulário
  ├── email/               # Pré-visualização de email e PDF
  ├── FileUpload.js        # Upload de arquivos
  └── SignaturePad.js      # Assinatura digital

pages/
  ├── index.js             # Página principal
  └── api/
      ├── sendEmail.js     # API de envio de email
      └── csrf-token.js    # API de CSRF

public/
  └── template.pdf         # Modelo de PDF

utils/
  ├── editPdf.js           # Função de preenchimento do PDF
  └── emailTemplate.js     # Template HTML do email
```

---

## 🔧 Configuração

### Pré-requisitos

- Node.js (v18+)
- Conta na Vercel (ou Firebase Hosting)
- Conta de e-mail SMTP (ou SendGrid)

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/danielbelle/form-pdfedit-emailsend-fullstack.git
cd next-transporte
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente: Crie um arquivo `.env` na raiz do projeto
   com:

```env
MAIL_HOST=smtp.seuprovedor.com
MAIL_PORT=587
REFEMAIL_SENDER_N=seu@email.com
REFEMAIL_SENDER_P=sua_senha
NEXT_PUBLIC_EMAIL_RECEIVER=secretaria@prefeitura.com
NODE_ENV=development
```

4. Coloque seu modelo de PDF em `public/template.pdf`

5. **Mapeamento dos campos no PDF**:  
   No arquivo `utils/editPdf.js`, é necessário mapear corretamente as posições
   dos campos do seu modelo de PDF dentro do objeto `PDFpositions`.  
   Cada chave representa um campo do formulário e o valor é um array com as
   coordenadas `[x, y]` em centímetros, indicando onde o texto ou assinatura
   será inserido no PDF.  
   Ajuste essas posições conforme o layout do seu template para garantir que os
   dados apareçam nos locais corretos.

---

## 🚀 Executando o Projeto

```bash
npm run dev
```

Acesse `http://localhost:3000` no seu navegador.

---

## 🌐 Deploy

### Na Vercel

1. Conecte seu repositório GitHub à Vercel
2. Adicione as variáveis de ambiente no painel da Vercel
3. O deploy será automático após push para o repositório

---

## 📚 Componentes Principais

### `SignaturePad.js`

Componente para captura de assinatura digital usando `signature_pad`.

### `FileUpload.js`

Componente para upload de múltiplos arquivos PDF.

### `editPdf.js`

Funções para edição do PDF usando `pdf-lib`:

- Adiciona texto ao PDF
- Insere assinatura digital
- Salva o PDF modificado

---

## ✉️ Envio de E-mail

A rota `/api/sendEmail` utiliza o Nodemailer para:

- Enviar o PDF editado como anexo
- Incluir arquivos adicionais (PDF)
- Enviar para o e-mail da prefeitura e do estudante

---

## ⚠️ Solução de Problemas

| Problema                      | Solução                                   |
| ----------------------------- | ----------------------------------------- |
| Assinatura de baixa qualidade | Aumente o DPI do canvas                   |
| PDF não é gerado              | Verifique se template.pdf está em public/ |
| E-mail não enviado            | Confira as credenciais SMTP               |

---

## 📌 Próximas Melhorias

- [ ]

---

## 🤝 Contribuição

Contribuições são bem-vindas! Abra uma issue ou pull request.

---

## 💼 Para Empresas e Prefeituras

- **Código limpo e modular**: Fácil de adaptar para outros municípios ou fluxos.
- **Segurança**: CSRF, CORS, validação de anexos, rate limit e headers de
  segurança.
- **Experiência do Usuário**: Interface moderna, responsiva e intuitiva.
- **Pronto para produção**: Deploy fácil na Vercel ou Firebase.
- **Documentação clara**: Facilita manutenção e onboarding de novos devs.

Se você deseja adaptar, implantar ou contratar melhorias neste sistema, entre em
contato:

- **Nome**: Daniel Henrique Bellé
- **E-mail**: henrique.danielb@gmail.com
- **LinkedIn**: https://www.linkedin.com/in/danielbelle/

---
