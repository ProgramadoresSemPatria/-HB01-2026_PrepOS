import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Boundary de erro global. Captura exceções de renderização em qualquer ponto
 * da árvore e exibe um fallback amigável em vez de uma tela em branco.
 * Error boundaries ainda exigem class component no React 19.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log para observabilidade — substituível por Sentry/etc. no futuro.
    console.error("Erro não tratado capturado pelo ErrorBoundary:", error, info);
  }

  handleReset = () => {
    // Volta para a tela inicial num estado limpo, evitando re-render do mesmo erro.
    window.location.href = "/";
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#171717] px-6">
        <div className="bg-[#202020] border border-gray-700 rounded-2xl p-8 md:p-10 max-w-md w-full text-center shadow-lg">
          <div className="flex justify-center text-amber-400 mb-4">
            <AlertTriangle size={48} strokeWidth={1.5} />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">
            Algo deu errado
          </h1>
          <p className="text-sm text-[#9a9a9a] leading-relaxed mb-6">
            Encontramos um problema inesperado ao exibir esta página. Você pode
            voltar ao início e tentar novamente.
          </p>
          <button
            onClick={this.handleReset}
            className="bg-[#3ecf8e] text-[#171717] text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#3ecf8e]/90 transition"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }
}
