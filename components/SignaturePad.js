import { useRef, useEffect } from "react";
import SignaturePad from "signature_pad";

export default function SignaturePadComponent({ onSave, value }) {
  const canvasRef = useRef(null);
  const signaturePadRef = useRef(null);

  useEffect(() => {
    signaturePadRef.current = new SignaturePad(canvasRef.current, {
      backgroundColor: "rgb(255,255,255)",
      penColor: "rgb(0,0,0)",
      onEnd: () => {
        if (onSave) onSave(signaturePadRef.current.toDataURL("image/png"));
      },
    });
    const handleResize = () => {
      const canvas = canvasRef.current;
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext("2d").scale(ratio, ratio);
      signaturePadRef.current.clear();
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    // Restaurar assinatura se existir
    if (value) {
      signaturePadRef.current.fromDataURL(value);
    }

    return () => {
      signaturePadRef.current.off();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Atualiza assinatura se prop mudar
  useEffect(() => {
    if (value && signaturePadRef.current) {
      signaturePadRef.current.clear();
      signaturePadRef.current.fromDataURL(value);
    }
  }, [value]);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Assinatura Digital</h3>
      <div className="border border-gray-300 rounded-lg p-4">
        <canvas
          ref={canvasRef}
          className="w-full h-48 border border-gray-300 rounded bg-white"
        />
      </div>
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => onSave(canvasRef.current.toDataURL("image/png"))}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Confirmar Assinatura
        </button>
        <button
          type="button"
          onClick={() => {
            signaturePadRef.current.clear();
          }}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Limpar Tudo
        </button>
        <button
          type="button"
          onClick={() => {
            const data = signaturePadRef.current.toData();
            if (data.length > 0) {
              data.pop(); // Remove o último traço
              signaturePadRef.current.fromData(data);
            }
          }}
          className="px-4 py-2 bg-yellow-400 text-gray-900 rounded hover:bg-yellow-500"
        >
          Voltar Último Traço
        </button>
      </div>
    </div>
  );
}
