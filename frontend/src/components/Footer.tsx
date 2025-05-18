import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-white py-10 border-t border-amber-100/30 mt-0 shadow-inner">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-6">
          <div>
            <h3 className="font-semibold mb-2 text-white">Sobre RevMak</h3>
            <ul className="space-y-1 text-sm text-white/80">
              <li><a href="#" className="hover:underline">Quem somos</a></li>
              <li><a href="#" className="hover:underline">Termos e condições</a></li>
              <li><a href="#" className="hover:underline">Política de privacidade</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-white">Pagamento</h3>
            <ul className="space-y-1 text-sm text-white/80">
              <li><a href="#" className="hover:underline">Formas de pagamento</a></li>
              <li><a href="#" className="hover:underline">Parcelamento</a></li>
              <li><a href="#" className="hover:underline">Boleto bancário</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-white">Atendimento</h3>
            <ul className="space-y-1 text-sm text-white/80">
              <li><a href="#" className="hover:underline">Fale conosco</a></li>
              <li><a href="#" className="hover:underline">Suporte</a></li>
              <li><a href="#" className="hover:underline">Reclamações</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-white">Redes Sociais</h3>
            <ul className="space-y-1 text-sm text-white/80">
              <li><a href="#" className="hover:underline">Facebook</a></li>
              <li><a href="#" className="hover:underline">Instagram</a></li>
              <li><a href="#" className="hover:underline">Twitter</a></li>
            </ul>
          </div>
        </div>
        <hr className="border-amber-100/30 mb-4" />
        <div className="text-center text-xs text-white/80">
          &copy; {new Date().getFullYear()} RevMak. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
