import React, { useState } from 'react';
import {
  CalendarCheck,
  Clock,
  CreditCard,
  ExternalLink,
  Globe,
  MapPin,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  Utensils,
  X,
} from 'lucide-react';
import {
  MENU_CATEGORIES,
  MENU_ITEMS,
  NEIGHBORHOODS,
  RESTAURANT_INFO,
} from './data/restaurantData';
import Chat24hWidget from './components/Chat24hWidget';

export default function App() {
  const [lang, setLang] = useState('pt');
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Delivery checkout state
  const [customerName, setCustomerName] = useState('');
  const [neighborhood, setNeighborhood] = useState(NEIGHBORHOODS[0]);
  const [addressNote, setAddressNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Vinti4 / Cartão NFC');

  // Reservation state
  const [resName, setResName] = useState('');
  const [resPhone, setResPhone] = useState('');
  const [resGuests, setResGuests] = useState('4');
  const [resDateTime, setResDateTime] = useState('');
  const [resType, setResType] = useState('Jantar / Mesa');
  const [resSent, setResSent] = useState(false);

  const pt = lang === 'pt';

  const filteredItems = MENU_ITEMS.filter((item) => {
    if (category !== 'all' && item.category !== category) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.namePt.toLowerCase().includes(q) ||
      item.nameEn.toLowerCase().includes(q) ||
      item.descPt.toLowerCase().includes(q)
    );
  });

  function addToCart(item) {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  }

  function updateQty(id, delta) {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0)
    );
  }

  const totalItems = cart.reduce((acc, c) => acc + c.qty, 0);
  const knownSubtotal = cart.reduce(
    (acc, c) => acc + (c.priceCve ? c.priceCve * c.qty : 0),
    0
  );
  const hasUnpricedItems = cart.some((c) => c.priceCve === null);

  function buildWhatsAppOrderUrl() {
    const lines = cart.map((c) => {
      const name = pt ? c.namePt : c.nameEn;
      const priceLabel = c.priceCve
        ? `${(c.priceCve * c.qty).toLocaleString('pt-PT')} CVE`
        : pt
        ? 'Preço a confirmar'
        : 'Price to confirm';
      return `• ${c.qty}x ${name} (${priceLabel})`;
    });

    const msg = [
      `🍽️ *Novo Pedido — ${RESTAURANT_INFO.name}*`,
      customerName ? `👤 Cliente: ${customerName}` : null,
      `📍 Bairro: ${neighborhood}`,
      addressNote ? `🏠 Referência: ${addressNote}` : null,
      `💳 Pagamento: ${paymentMethod}`,
      '',
      '*Itens:*',
      ...lines,
      '',
      knownSubtotal > 0
        ? `💰 Subtotal parcial: ${knownSubtotal.toLocaleString('pt-PT')} CVE${
            hasUnpricedItems ? ' (+ itens a confirmar)' : ''
          }`
        : '💰 Total: A confirmar pelo balcão',
    ]
      .filter(Boolean)
      .join('\n');

    return `https://wa.me/${RESTAURANT_INFO.whatsappDigits}?text=${encodeURIComponent(msg)}`;
  }

  function handleReservationSubmit(e) {
    e.preventDefault();
    const msg = [
      `📅 *Pedido de Reserva — ${RESTAURANT_INFO.name}*`,
      `🎉 Tipo: ${resType}`,
      `👤 Nome: ${resName}`,
      `📱 WhatsApp: ${resPhone}`,
      `👥 Pessoas: ${resGuests}`,
      `🕒 Data/Hora: ${resDateTime || 'A combinar'}`,
    ].join('\n');
    setResSent(true);
    window.open(
      `https://wa.me/${RESTAURANT_INFO.whatsappDigits}?text=${encodeURIComponent(msg)}`,
      '_blank',
      'noopener,noreferrer'
    );
  }

  return (
    <div className="min-h-screen bg-[#0C0908] text-stone-100">
      {/* 1. STICKY TOP 24H CONVERSION BAR */}
      <header className="sticky top-0 z-40 border-b border-amber-500/20 bg-[#0C0908]/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo-dark.jpg"
              alt="Logótipo Restaurante 24h"
              className="w-10 h-10 rounded-xl object-cover border border-amber-500/40 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm sm:text-base">
                  {RESTAURANT_INFO.brandShort}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-300 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {pt ? 'Aberto Agora • 24/7' : 'Open Now • 24/7'}
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block">
                Achada de Santo António • Praia
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setLang(pt ? 'en' : 'pt')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-stone-700 bg-stone-900 text-xs font-semibold text-stone-200 hover:border-amber-500/50 transition"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{pt ? 'PT' : 'EN'}</span>
            </button>

            <a
              href={`tel:${RESTAURANT_INFO.tollFree.replace(/\s+/g, '')}`}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-700 bg-stone-900 text-xs font-semibold text-stone-200 hover:border-amber-500/50 transition"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{RESTAURANT_INFO.tollFree}</span>
            </a>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition shadow"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{pt ? 'Pedido' : 'Order'}</span>
              {totalItems > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-stone-950 text-amber-400 text-[10px]">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* 2. HERO SECTION */}
        <section className="relative overflow-hidden border-b border-stone-800/80 py-14 sm:py-20">
          <div
            className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[780px] h-[360px] rounded-full opacity-20 blur-3xl"
            style={{ background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)' }}
          />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5" />
                {RESTAURANT_INFO.sloganPrimary} • {RESTAURANT_INFO.sloganSecondary}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
                {pt
                  ? 'Buffet, Fast-Food & Delivery 24 Horas na Praia.'
                  : '24/7 Buffet, Burgers & Late-Night Delivery in Praia.'}
              </h1>

              <p className="text-base sm:text-lg text-stone-300 max-w-xl leading-relaxed">
                {pt
                  ? 'Em Achada de Santo António — aberto todos os dias sem fechar. Peça no site em segundos com entrega por bairro ou reserve mesa para grupos e aniversários.'
                  : 'Located in Achada de Santo António — open nonstop 24/7. Order delivery across Praia in seconds or book a table for groups and birthdays.'}
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href="#menu"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition shadow-lg"
                >
                  <Utensils className="w-4 h-4" />
                  {pt ? 'Ver Cardápio & Pedir Agora' : 'Order Delivery 24/7'}
                </a>
                <a
                  href="#reservas"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-stone-700 bg-stone-900 hover:border-amber-500/50 text-white font-semibold text-sm transition"
                >
                  <CalendarCheck className="w-4 h-4 text-amber-400" />
                  {pt ? 'Reservar Mesa / Aniversário' : 'Book a Table / Event'}
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-5 pt-2 text-xs text-stone-300">
                <span className="inline-flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <strong>{RESTAURANT_INFO.googleRating}★</strong> Google ({RESTAURANT_INFO.googleReviews})
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  {RESTAURANT_INFO.foodSafetyPartner}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  Vinti4 / NFC / {pt ? 'Dinheiro' : 'Cash'}
                </span>
              </div>
            </div>

            {/* HERO SHOWCASE CARD */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-gradient-to-br from-stone-900 to-stone-950 border border-amber-500/25 overflow-hidden shadow-2xl">
                <img
                  src="/images/mesa-buffet-24h.jpg"
                  alt="Mesa de Buffet e Pratos do Restaurante 24 Hora na Praia"
                  className="w-full h-56 object-cover border-b border-stone-800"
                />
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                        {pt ? 'Destaque do Dia & Madrugada' : '24/7 Highlights'}
                      </p>
                      <p className="text-base font-bold text-white">Restaurante 24h • Praia</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-[11px] font-bold">
                      24/7
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-stone-800 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-white">Buffet Livre (Self-Service)</p>
                        <p className="text-xs text-stone-400">
                          {pt ? 'Cabo-verdiana • Internacional • Vegana • Sushi' : 'Local • International • Vegan • Sushi'}
                        </p>
                      </div>
                      <span className="text-sm font-extrabold text-amber-400">1.200 CVE</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-stone-800 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-white">Monster Burger &amp; Roleta de Pizza</p>
                        <p className="text-xs text-stone-400">
                          {pt ? 'Delivery rápido por bairro na Praia' : 'Fast late-night Praia delivery'}
                        </p>
                      </div>
                      <a
                        href="#menu"
                        className="px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold hover:bg-amber-500 hover:text-stone-950 transition"
                      >
                        {pt ? 'Pedir' : 'Order'}
                      </a>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-xs text-stone-400">
                    <span>{pt ? 'Linha Gratuita:' : 'Toll-free:'} {RESTAURANT_INFO.tollFree}</span>
                    <span>WhatsApp: {RESTAURANT_INFO.whatsappDisplay}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. BUFFET LIVRE SECTION */}
        <section className="py-16 border-b border-stone-800/80 bg-[#120D0B]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {pt ? 'Pequeno-Almoço • Almoço • Jantar' : 'Breakfast • Lunch • Dinner'}
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                {pt ? 'Buffet Livre Todos os Dias' : 'Daily All-You-Can-Eat Buffet'}
              </h2>
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                {pt
                  ? 'Variedade diária de comida tradicional cabo-verdiana, pratos internacionais, opções vegetarianas/veganas e sushi. Disponível para consumo no local ou Buffet Take-Away.'
                  : 'Daily selection of traditional Cabo Verdean cuisine, international dishes, vegetarian/vegan options, and sushi. Available for dine-in or Buffet Take-Away.'}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {['Cabo-verdiana', 'Internacional', 'Vegetariana / Vegana', 'Sushi', 'Buffet Take-Away'].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-stone-900 border border-stone-700 text-xs text-stone-200"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="md:col-span-5 rounded-3xl bg-gradient-to-br from-amber-500/15 to-orange-600/10 border border-amber-500/30 overflow-hidden text-center">
              <img
                src="/images/buffet-quente.jpg"
                alt="Buffet Quente Restaurante 24h"
                className="w-full h-44 object-cover border-b border-amber-500/20"
              />
              <div className="p-6 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  {pt ? 'Preço Médio Buffet' : 'Average Buffet Price'}
                </p>
                <p className="text-4xl font-black text-white">1.200 CVE</p>
                <p className="text-xs text-stone-300">
                  {pt ? 'Faixa habitual: 1.000 a 1.500 CVE' : 'Typical range: 1,000 – 1,500 CVE'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    addToCart(MENU_ITEMS[0]);
                    setCartOpen(true);
                  }}
                  className="w-full py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition"
                >
                  {pt ? 'Pedir Buffet Take-Away (1.200 CVE)' : 'Order Buffet Take-Away (1,200 CVE)'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 4. MENU CATALOG + CART */}
        <section id="menu" className="py-16 border-b border-stone-800/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {pt ? 'Delivery 24/7 na Praia' : '24/7 Praia Delivery'}
                </span>
                <h2 className="text-3xl font-extrabold text-white mt-1">
                  {pt ? 'Cardápio Fast-Food, Buffet & Bar' : 'Fast-Food, Buffet & Bar Menu'}
                </h2>
              </div>

              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={pt ? 'Procurar prato, burger, pizza...' : 'Search burger, pizza, buffet...'}
                  className="w-full h-10 pl-10 pr-4 rounded-full bg-stone-900 border border-stone-700 text-xs text-white placeholder:text-stone-400 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {MENU_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                    category === cat.id
                      ? 'bg-amber-500 text-stone-950'
                      : 'bg-stone-900 text-stone-300 border border-stone-800 hover:border-stone-600'
                  }`}
                >
                  {pt ? cat.labelPt : cat.labelEn}
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredItems.map((item) => {
                const inCart = cart.find((c) => c.id === item.id);
                return (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-[#16110E] border border-stone-800 p-5 flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition"
                  >
                    <div className="space-y-3">
                      <div className="relative h-44 rounded-xl overflow-hidden border border-white/10 bg-stone-900">
                        <img
                          src={item.image}
                          alt={pt ? item.namePt : item.nameEn}
                          className="w-full h-full object-cover"
                        />
                        {(pt ? item.badgePt : item.badgeEn) && (
                          <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-stone-950/85 text-amber-300 text-[10px] font-bold uppercase border border-amber-500/30">
                            {pt ? item.badgePt : item.badgeEn}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">
                          {pt ? item.namePt : item.nameEn}
                        </h3>
                        <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                          {pt ? item.descPt : item.descEn}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-800/80">
                      <span className="text-sm font-bold text-amber-400">
                        {item.priceCve
                          ? `${item.priceCve.toLocaleString('pt-PT')} CVE`
                          : pt
                          ? 'A confirmar no pedido'
                          : 'Confirm on order'}
                      </span>

                      {inCart ? (
                        <div className="inline-flex items-center gap-2 bg-stone-900 border border-stone-700 rounded-full px-2 py-1">
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, -1)}
                            className="p-1 text-stone-300 hover:text-white"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold text-white px-1">{inCart.qty}</span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, 1)}
                            className="p-1 text-amber-400 hover:text-amber-300"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addToCart(item)}
                          className="px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition"
                        >
                          {pt ? '+ Adicionar' : '+ Add'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. RESERVATIONS & EVENTS (BOOKGRID PREVIEW) */}
        <section id="reservas" className="py-16 border-b border-stone-800/80 bg-[#120D0B]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-5 space-y-4">
              <div className="rounded-2xl overflow-hidden border border-stone-800 shadow-lg">
                <img
                  src="/images/balcao-24h.jpg"
                  alt="Receção e Atendimento Restaurante 24 Hora"
                  className="w-full h-52 object-cover object-top"
                />
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
                <Sparkles className="w-4 h-4" />
                {pt ? 'Mesas, Aniversários & Grupos' : 'Tables, Birthdays & Groups'}
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                {pt ? 'Reserve a sua mesa a qualquer hora' : 'Book your table anytime'}
              </h2>
              <p className="text-sm text-stone-300 leading-relaxed">
                {pt
                  ? 'Ambiente casual e espaçoso para famílias, grupos e comemorações — com bar completo e encomenda antecipada de Bolo de Amor.'
                  : 'Casual, welcoming space for families, groups, and birthday celebrations — with full bar service and Bolo de Amor pre-orders.'}
              </p>
            </div>

            <form
              onSubmit={handleReservationSubmit}
              className="md:col-span-7 rounded-3xl bg-[#181210] border border-stone-800 p-6 space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={resName}
                  onChange={(e) => setResName(e.target.value)}
                  placeholder={pt ? 'O seu nome' : 'Your name'}
                  className="h-11 rounded-xl bg-stone-900 border border-stone-700 px-3.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
                <input
                  type="tel"
                  required
                  value={resPhone}
                  onChange={(e) => setResPhone(e.target.value)}
                  placeholder={pt ? 'WhatsApp (+238 ...)' : 'WhatsApp (+238 ...)'}
                  className="h-11 rounded-xl bg-stone-900 border border-stone-700 px-3.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <select
                  value={resType}
                  onChange={(e) => setResType(e.target.value)}
                  className="h-11 rounded-xl bg-stone-900 border border-stone-700 px-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="Jantar / Mesa">{pt ? 'Jantar / Mesa' : 'Table / Dining'}</option>
                  <option value="Aniversário">{pt ? 'Aniversário' : 'Birthday'}</option>
                  <option value="Grupo / Evento">{pt ? 'Grupo / Evento' : 'Group / Event'}</option>
                </select>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={resGuests}
                  onChange={(e) => setResGuests(e.target.value)}
                  placeholder={pt ? 'Pessoas' : 'Guests'}
                  className="h-11 rounded-xl bg-stone-900 border border-stone-700 px-3.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
                <input
                  type="datetime-local"
                  value={resDateTime}
                  onChange={(e) => setResDateTime(e.target.value)}
                  className="h-11 rounded-xl bg-stone-900 border border-stone-700 px-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition"
              >
                {pt ? 'Confirmar Reserva via WhatsApp' : 'Confirm Reservation via WhatsApp'}
              </button>

              {resSent && (
                <p className="text-xs text-emerald-400 font-medium text-center">
                  {pt
                    ? 'Pedido de reserva preparado no WhatsApp!'
                    : 'Reservation details opened in WhatsApp!'}
                </p>
              )}
            </form>
          </div>
        </section>

        {/* 6. SPACE GALLERY, TRUST & LOCATION */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {pt ? 'Espaço Moderno • Achada de Santo António' : 'Modern Space • Achada de Santo António'}
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                {pt ? 'Fachada Iluminada & Salão Interior 24/7' : 'Illuminated Facade & 24/7 Dining Room'}
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  src: '/images/fachada-noite.jpg',
                  labelPt: 'Fachada Iluminada à Noite',
                  labelEn: 'Night Facade (Achada)',
                },
                {
                  src: '/images/salao-rececao.png',
                  labelPt: 'Receção & Atendimento',
                  labelEn: 'Reception & Counter',
                },
                {
                  src: '/images/salao-decor.png',
                  labelPt: 'Decoração & Arte Local',
                  labelEn: 'Interior Decor',
                },
                {
                  src: '/images/salao-clientes.jpg',
                  labelPt: 'Ambiente para Grupos',
                  labelEn: 'Group Dining',
                },
              ].map((photo) => (
                <div
                  key={photo.src}
                  className="rounded-2xl overflow-hidden bg-[#16110E] border border-stone-800"
                >
                  <img
                    src={photo.src}
                    alt={pt ? photo.labelPt : photo.labelEn}
                    className="w-full h-44 object-cover"
                  />
                  <div className="px-3 py-2 text-xs font-semibold text-stone-300">
                    {pt ? photo.labelPt : photo.labelEn}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-[#16110E] border border-stone-800 p-6 space-y-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h3 className="font-bold text-white">{RESTAURANT_INFO.foodSafetyPartner}</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                {pt
                  ? 'Acompanhamento técnico em segurança alimentar e higiene para garantir qualidade 24h por dia.'
                  : 'Technical food-safety monitoring ensuring consistent quality around the clock.'}
              </p>
            </div>

            <div className="rounded-2xl bg-[#16110E] border border-stone-800 p-6 space-y-2">
              <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
              <h3 className="font-bold text-white">
                {RESTAURANT_INFO.googleRating}★ Google &amp; {RESTAURANT_INFO.guidesRating}★ Guias
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                {pt
                  ? 'Recomendado por moradores e viajantes que chegam fora de horas na Ilha de Santiago.'
                  : 'Recommended by locals and late-arriving travelers across Santiago Island.'}
              </p>
            </div>

            <div className="rounded-2xl bg-[#16110E] border border-stone-800 p-6 space-y-3">
              <MapPin className="w-6 h-6 text-amber-400" />
              <h3 className="font-bold text-white">Achada de Santo António</h3>
              <p className="text-xs text-stone-400">{RESTAURANT_INFO.address}</p>
              <a
                href={RESTAURANT_INFO.mapsQueryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:underline"
              >
                {pt ? 'Abrir Rota no Google Maps →' : 'Open Directions in Google Maps →'}
              </a>
            </div>
          </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-stone-800 bg-[#090706] py-10 px-4 text-xs text-stone-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo-dark.jpg"
              alt="24 Hora"
              className="w-9 h-9 rounded-lg object-cover border border-amber-500/30"
            />
            <div>
              <span className="font-bold text-white">{RESTAURANT_INFO.name}</span> •{' '}
              <span>{RESTAURANT_INFO.sloganPrimary}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={RESTAURANT_INFO.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-amber-400"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              @24hora_cv
            </a>
            <a href={`mailto:${RESTAURANT_INFO.email}`} className="hover:text-amber-400">
              {RESTAURANT_INFO.email}
            </a>
            <span className="text-stone-500">Protótipo por GilByte Solutions</span>
          </div>
        </div>
      </footer>

      {/* CART DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-[#16110E] border-l border-stone-800 h-full flex flex-col justify-between p-5 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <h2 className="text-base font-bold text-white">
                  {pt ? 'Seu Pedido Delivery 24h' : 'Your 24/7 Delivery Order'}
                </h2>
                <button type="button" onClick={() => setCartOpen(false)}>
                  <X className="w-5 h-5 text-stone-400 hover:text-white" />
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-xs text-stone-400 py-8 text-center">
                  {pt ? 'O seu carrinho está vazio. Adicione itens do cardápio.' : 'Your cart is empty.'}
                </p>
              ) : (
                <div className="space-y-2.5">
                  {cart.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">
                          {pt ? c.namePt : c.nameEn}
                        </p>
                        <p className="text-[11px] text-amber-400">
                          {c.priceCve
                            ? `${(c.priceCve * c.qty).toLocaleString('pt-PT')} CVE`
                            : pt
                            ? 'Preço a confirmar'
                            : 'Price to confirm'}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateQty(c.id, -1)}
                          className="p-1 text-stone-400 hover:text-white"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold px-1">{c.qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(c.id, 1)}
                          className="p-1 text-amber-400 hover:text-amber-300"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => updateQty(c.id, -c.qty)}
                          className="p-1 text-rose-400 hover:text-rose-300 ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {cart.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-stone-800">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={pt ? 'O seu nome' : 'Your name'}
                    className="w-full h-10 rounded-xl bg-stone-900 border border-stone-700 px-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                  <select
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full h-10 rounded-xl bg-stone-900 border border-stone-700 px-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                  >
                    {NEIGHBORHOODS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={addressNote}
                    onChange={(e) => setAddressNote(e.target.value)}
                    placeholder={pt ? 'Ponto de referência / Rua' : 'Street / Landmark'}
                    className="w-full h-10 rounded-xl bg-stone-900 border border-stone-700 px-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full h-10 rounded-xl bg-stone-900 border border-stone-700 px-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Vinti4 / Cartão NFC">Vinti4 / Cartão NFC</option>
                    <option value="Dinheiro (CVE)">{pt ? 'Dinheiro (CVE)' : 'Cash (CVE)'}</option>
                  </select>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-stone-800 space-y-3">
                <a
                  href={buildWhatsAppOrderUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  {pt ? 'Enviar Pedido no WhatsApp (+238 985 42 74)' : 'Send Order via WhatsApp'}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      <Chat24hWidget pt={pt} />
    </div>
  );
}
