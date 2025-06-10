const emailTemplate = (studentName, studentEmail) => {
  return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Declaração de Auxílio Transporte</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
              }
              .header {
                  font-size: 18px;
                  margin-bottom: 20px;
              }
              .content {
                  margin-bottom: 20px;
              }
              .footer {
                  font-style: italic;
                  margin-top: 30px;
              }
              .student-info {
                  padding: 10px;
                  border-radius: 5px;
                  margin: 10px 0;
              }
          </style>
      </head>
      <body>
          <div class="header">
              <strong>Olá, 
              <br/> 
              equipe da Prefeitura Municipal de Viadutos.</strong>
          </div>
          
          <div class="content">
              <p>Este é um e-mail preenchido automaticamente pelo(a) estudante(a):</p>
              
              <div class="student-info">
                  ${studentName}
              </div>
              
              <p>No mesmo contém o anexo da <strong>Declaração do auxílio transporte</strong>, previsto na Lei Municipal nº 2.721/2011, que regulamenta o auxílio transporte, alterada pela Lei Municipal nº 3.647/2025.</p>
              
              <p>Uma cópia deste e-mail foi enviada para o e-mail do(a) estudante(a):</p>
              
              <div class="student-info">
                  ${studentEmail}
              </div>
          </div>
          
          <div class="footer">
              <p>Atenciosamente,</p>
              <p>${studentName}</p>
          </div>
      </body>
      </html>
    `;
};

module.exports = emailTemplate;
