import FormWizard from "../components/form/FormWizard";

export default function IndexWizard() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header responsivo com logo à esquerda e texto centralizado */}
      <header className="w-full px-4 flex flex-col md:flex-row items-center md:justify-between shadow-none bg-white">
        {/* Logo à esquerda */}
        <a
          href="https://viadutos.rs.gov.br/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center mb-2 md:mb-0"
        >
          <img
            src="/logo-prefeitura.png"
            alt="Logo Prefeitura"
            className="h-[100px] w-[100px] md:h-[200px] md:w-[200px] object-contain"
          />
        </a>
        {/* Texto centralizado */}
        <div className="flex-1 flex justify-center">
          <span className="text-lg md:text-2xl font-bold text-gray-800 text-center">
            Auxílio Transporte Viadutos - Carro
          </span>
        </div>
        {/* Espaço à direita para manter o texto centralizado em telas grandes */}
        <div className="hidden md:block w-[200px] h-[200px]" />
      </header>

      {/* Conteúdo centralizado */}
      <main className="flex-1 flex flex-col items-center justify-center px-2 ">
        <div className="w-full">
          <FormWizard />
        </div>
      </main>

      {/* Footer simples */}
      <footer className="w-full py-4 px-6 text-center text-gray-500 text-sm bg-white">
        © {new Date().getFullYear()} Prefeitura Municipal de Viadutos. Todos os
        direitos reservados.
      </footer>
    </div>
  );
}
