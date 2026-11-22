import React, { useState } from 'react';
import { Bot, MessageCircle, Send, X } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

function getSmartReply(input, pt) {
  const q = input.toLowerCase();
  if (q.includes('buffet') || q.includes('preç') || q.includes('pric') || q.includes('quanto') || q.includes('cost')) {
    return pt
      ? 'O nosso Buffet Livre (pequeno-almoço, almoço e jantar) varia entre 1.000 e 1.500 CVE (referência média de 1.200 CVE), com pratos cabo-verdianos, internacionais, opções vegetarianas/veganas e sushi!'
      : 'Our All-You-Can-Eat Buffet (breakfast, lunch & dinner) is 1,000–1,500 CVE (avg. 1,200 CVE), featuring Cabo Verdean, international, vegetarian/vegan dishes & sushi!';
  }
  if (q.includes('hora') || q.includes('aberto') || q.includes('open') || q.includes('24') || q.includes('madrugada')) {
    return pt
      ? 'Estamos ABERTOS 24 horas por dia, 7 dias por semana! Pode vir comer no salão em Achada de Santo António ou pedir delivery a qualquer hora.'
      : 'We are OPEN 24/7! Visit us in Achada de Santo António or order delivery anytime, day or night.';
  }
  if (q.includes('vinti4') || q.includes('cart') || q.includes('pag') || q.includes('nfc') || q.includes('cash')) {
    return pt
      ? 'Aceitamos Dinheiro (CVE), Cartões de Crédito/Débito e pagamentos móveis (NFC / Vinti4).'
      : 'We accept Cash (CVE), Credit/Debit Cards, and contactless NFC / Vinti4 payments.';
  }
  if (q.includes('onde') || q.includes('loca') || q.includes('morada') || q.includes('where') || q.includes('address')) {
    return pt
      ? `Ficamos em ${RESTAURANT_INFO.address}. Também entregamos na Achada, Prainha, Quebra Canela, Palmarejo, Plateau e arredores!`
      : `We are located at ${RESTAURANT_INFO.address}. We also deliver across Praia (Achada, Prainha, Quebra Canela, Palmarejo, Plateau).`;
  }
  return pt
    ? `Posso ajudar com horários (24/7), Buffet (1.200 CVE), Delivery na Praia ou reservas! Para falar direto com a nossa equipa: WhatsApp ${RESTAURANT_INFO.whatsappDisplay} ou linha gratuita ${RESTAURANT_INFO.tollFree}.`
    : `I can help with 24/7 hours, Buffet (1,200 CVE), Praia delivery, or reservations! To speak directly with our team: WhatsApp ${RESTAURANT_INFO.whatsappDisplay} or toll-free ${RESTAURANT_INFO.tollFree}.`;
}

export default function Chat24hWidget({ pt }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      textPt: 'Olá! Bem-vindo ao Restaurante 24h ("24 hora ta pensa na bô!"). Quer saber sobre o Buffet (1.200 CVE), Delivery ou Vinti4?',
      textEn: 'Hi! Welcome to Restaurante 24h ("Flavor that never sleeps!"). Ask me about our Buffet (1,200 CVE), 24/7 delivery, or Vinti4!',
    },
  ]);

  function sendMessage(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    const reply = getSmartReply(trimmed, pt);
    setMessages((prev) => [
      ...prev,
      { role: 'user', textPt: trimmed, textEn: trimmed },
      { role: 'bot', textPt: reply, textEn: reply },
    ]);
    setText('');
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="mb-3 w-80 sm:w-96 rounded-2xl bg-[#181210] border border-amber-500/30 shadow-2xl overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-4 py-3 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <div>
                <p className="text-xs font-bold leading-tight">24 Hora • Assistente 24/7</p>
                <p className="text-[10px] text-amber-100">SmartBizChat AI • PT / EN</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 space-y-2.5 max-h-72 overflow-y-auto text-xs">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl max-w-[85%] leading-relaxed ${
                  m.role === 'user'
                    ? 'ml-auto bg-amber-500 text-stone-950 font-medium'
                    : 'bg-stone-800 text-stone-100 border border-stone-700'
                }`}
              >
                {pt ? m.textPt : m.textEn}
              </div>
            ))}
          </div>

          <div className="px-3 pb-2 flex flex-wrap gap-1.5">
            {[
              pt ? 'Preço do Buffet?' : 'Buffet price?',
              pt ? 'Aceitam Vinti4?' : 'Do you take cards/Vinti4?',
              pt ? 'Onde ficam?' : 'Location?',
            ].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => {
                  const reply = getSmartReply(q, pt);
                  setMessages((prev) => [
                    ...prev,
                    { role: 'user', textPt: q, textEn: q },
                    { role: 'bot', textPt: reply, textEn: reply },
                  ]);
                }}
                className="px-2 py-1 rounded-full bg-stone-800 hover:bg-stone-700 text-[11px] text-amber-300 border border-stone-700 transition"
              >
                {q}
              </button>
            ))}
          </div>

          <form onSubmit={sendMessage} className="p-2.5 border-t border-stone-800 flex gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={pt ? 'Escreva a sua dúvida...' : 'Ask a question...'}
              className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-stone-400 focus:border-amber-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-stone-950 font-bold text-xs shadow-xl hover:scale-105 transition"
      >
        <MessageCircle className="w-4 h-4" />
        <span>{pt ? 'Dúvidas 24h (PT/EN)' : '24/7 Chat (PT/EN)'}</span>
      </button>
    </div>
  );
}
