# Formulário de Edição de PDF com Next.js

## 📝 Descrição do Projeto

Um formulário web que coleta dados do usuário, edita um PDF pré-existente com
essas informações, adiciona uma assinatura digital e envia o documento final por
e-mail com anexos opcionais.

## 🛠 Stack Tecnológica

- **Frontend**:
  - Next.js (JavaScript)
  - Tailwind CSS
- **Bibliotecas**:
  - `pdf-lib` (manipulação de PDF)
  - `signature_pad` (captura de assinatura digital)
  - `@sendgrid/mail` (envio de e-mails)
- **Backend**:
  - Firebase Functions (opcional)
  - Firestore (banco de dados)
- **Hospedagem**:
  - Vercel (frontend)
  - Firebase Hosting (alternativo)

## 🚀 Funcionalidades

- Formulário de coleta de dados
- Captura de assinatura digital
- Upload de arquivos anexos
- Edição de PDF com dados do formulário
- Envio automático por e-mail

## 🏗 Estrutura do Projeto

```
src/
├── components/
│   ├── SignaturePad.js   # Componente de captura de assinatura
│   ├── FileUpload.js     # Componente de upload de arquivos
├── pages/
│   ├── index.js          # Página principal do formulário
│   ├── api/
│   │   └── send-email.js # Rota para envio de e-mail
├── public/
│   └── template.pdf      # Modelo de PDF para edição
├── utils/
│   └── editPdf.js        # Lógica de edição do PDF
```

## 🔧 Configuração

### Pré-requisitos

- Node.js (v18+)
- Conta na Vercel
- Conta no Firebase (opcional)
- Chave API do SendGrid

### Instalação

1. Clone o repositório:

```bash
git clone [URL_DO_REPOSITORIO]
cd [NOME_DO_PROJETO]
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente: Crie um arquivo `.env.local` na raiz do
   projeto com:

```env
SENDGRID_API_KEY=sua_chave_aqui
NEXT_PUBLIC_FIREBASE_CONFIG='sua_configuracao_firebase'
```

4. Coloque seu modelo de PDF em `public/template.pdf`

## 🚀 Executando o Projeto

```bash
npm run dev
```

Acesse `http://localhost:3000` no seu navegador.

## 🌐 Deploy

### Na Vercel

1. Conecte seu repositório GitHub à Vercel
2. Adicione as variáveis de ambiente no painel da Vercel
3. O deploy será automático após push para o repositório

### No Firebase (opcional)

```bash
firebase init
firebase deploy
```

## 📚 Componentes Principais

### `SignaturePad.js`

Componente para captura de assinatura digital usando `signature_pad`.

### `FileUpload.js`

Componente para upload de múltiplos arquivos.

### `editPdf.js`

Funções para edição do PDF usando `pdf-lib`:

- Adiciona texto ao PDF
- Insere assinatura digital
- Salva o PDF modificado

## ✉️ Envio de E-mail

A rota `/api/send-email` utiliza o SendGrid para:

- Enviar o PDF editado como anexo
- Incluir arquivos adicionais
- Enviar para o e-mail fornecido no formulário

## ⚠️ Solução de Problemas

| Problema                      | Solução                                   |
| ----------------------------- | ----------------------------------------- |
| Assinatura de baixa qualidade | Aumente o DPI do canvas                   |
| PDF não é gerado              | Verifique se template.pdf está em public/ |
| E-mail não enviado            | Confira as credenciais do SendGrid        |

## 📌 Próximas Melhorias

- [ ] Validação de campos do formulário
- [ ] Autenticação com Firebase Auth
- [ ] Visualização prévia do PDF antes do envio

## 🤝 Contribuição

Contribuições são bem-vindas! Abra uma issue ou pull request.
