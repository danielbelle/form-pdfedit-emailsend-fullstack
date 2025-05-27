import { useRef, useEffect } from "react";
import SignaturePad from "signature_pad";

export default function SignaturePadComponent({ onSave }) {
  const canvasRef = useRef(null);
  const signaturePadRef = useRef(null); // Adicione esta linha

  useEffect(() => {
    signaturePadRef.current = new SignaturePad(canvasRef.current, {
      backgroundColor: "rgb(255, 255, 255)",
      penColor: "rgb(0, 0, 0)",
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

    return () => {
      signaturePadRef.current.off();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Assinatura Digital</h3>
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
          Assinatura Feita
        </button>
        <button
          type="button"
          onClick={() => {
            signaturePadRef.current.clear();
          }}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Limpar Assinatura
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
          Desfazer
        </button>
      </div>
    </div>
  );
}
