import { formatMoney, descuento } from './data.js'

const iconos = {
  corazon: (activo) => `
    <svg viewBox="0 0 24 24" fill="${activo ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" class="size-5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25s-7.5-4.32-7.5-9.6A4.15 4.15 0 0 1 12 7.5a4.15 4.15 0 0 1 7.5 3.15c0 5.28-7.5 9.6-7.5 9.6Z"/>
    </svg>`,
  estrella: (llena) => `
    <svg viewBox="0 0 20 20" fill="currentColor" class="size-3.5 ${llena ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'}">
      <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L10 14.77l-5.2 2.73.99-5.78-4.21-4.1 5.82-.85z"/>
    </svg>`,
  camion: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="size-4">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3 7h10v8H3zM13 10h4l3 3v2h-7z"/>
      <circle cx="7" cy="17" r="1.6"/><circle cx="17" cy="17" r="1.6"/>
    </svg>`,
  carrito: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="size-4">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3 4h2l2.2 10.4a1.5 1.5 0 0 0 1.5 1.2h7.7a1.5 1.5 0 0 0 1.5-1.2L20 8H6"/>
      <circle cx="10" cy="20" r="1.2"/><circle cx="17" cy="20" r="1.2"/>
    </svg>`,
  candado: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="size-4">
      <rect x="4.5" y="10" width="15" height="10" rx="2"/>
      <path stroke-linecap="round" d="M8 10V7a4 4 0 0 1 8 0v3"/>
    </svg>`,
}

const tonos = {
  descuento: 'bg-rose-600 text-white',
  nuevo: 'bg-emerald-600 text-white',
  top: 'bg-amber-400 text-amber-950',
}

const estrellas = (rating) => {
  const llenas = Math.round(rating)
  return Array.from({ length: 5 }, (_, i) => iconos.estrella(i < llenas)).join('')
}

const colores = (lista) =>
  lista
    .map(
      (color) => `
      <button type="button" title="Ver color ${color}"
        class="size-5 rounded-full border border-slate-300 transition hover:scale-110 dark:border-slate-600"
        style="background-color:${color}"></button>`,
    )
    .join('')

export function productCard(producto) {
  const agotado = producto.stock === 0
  const ahorro = descuento(producto)
  const badge = producto.badge
    ? `<span class="rounded-full px-2.5 py-1 text-xs font-semibold ${tonos[producto.badge.tono]}">
         ${producto.badge.texto}
       </span>`
    : ''

  return `
  <article data-id="${producto.id}" class="group card-shadow flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
    <div class="relative overflow-hidden bg-slate-100 dark:bg-slate-800">
      <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy"
           class="aspect-4/3 w-full object-cover transition duration-500 group-hover:scale-105">

      ${badge ? `<div class="absolute left-3 top-3 flex flex-col items-start gap-1.5">${badge}</div>` : ''}

      ${agotado ? `<div class="absolute inset-0 grid place-items-center bg-white/70 backdrop-blur-[2px] dark:bg-slate-950/70">
                     <span class="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white dark:bg-white dark:text-slate-900">Agotado</span>
                   </div>` : ''}

      <button type="button" data-favorito aria-label="Agregar a favoritos"
        class="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 text-slate-500 shadow-sm backdrop-blur transition hover:scale-105 hover:text-rose-500 dark:bg-slate-900/90 dark:text-slate-400">
        ${iconos.corazon(false)}
      </button>

      ${producto.stock > 0 && producto.stock <= 10
        ? `<span class="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-rose-600 shadow-sm backdrop-blur dark:bg-slate-900/90">¡Solo ${producto.stock} left!</span>`
        : ''}
    </div>

    <div class="flex flex-1 flex-col gap-3 p-4">
      <div class="flex items-center justify-between gap-2">
        <span class="text-[11px] font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">${producto.categoria}</span>
        <span class="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
          <span class="flex">${estrellas(producto.rating)}</span>
          <span class="font-medium text-slate-700 dark:text-slate-200">${producto.rating}</span>
          <span class="hidden sm:inline">(${producto.opiniones.toLocaleString('es-MX')})</span>
        </span>
      </div>

      <h3 class="line-clamp-2 text-sm leading-snug font-semibold text-slate-900 dark:text-white">
        <a href="#" class="transition hover:text-brand-600 dark:hover:text-brand-400">${producto.nombre}</a>
      </h3>

      <div class="flex items-center gap-1.5">${colores(producto.colores)}</div>

      <div class="mt-auto space-y-2.5 pt-1">
        <div class="flex flex-wrap items-baseline gap-2">
          <span class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">${formatMoney(producto.precio)}</span>
          ${producto.precioAntes
            ? `<span class="text-sm text-slate-400 line-through">${formatMoney(producto.precioAntes)}</span>
               <span class="text-xs font-semibold text-emerald-600 dark:text-emerald-400">-${ahorro}%</span>`
            : ''}
        </div>

        <p class="text-xs text-slate-500 dark:text-slate-400">${producto.installment}</p>

        <div class="flex items-center gap-1.5 text-xs font-medium ${producto.envio === 'Gratis' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}">
          ${iconos.camion}<span>Envío ${producto.envio.toLowerCase()}</span>
        </div>

        <button type="button" data-agregar ${agotado ? 'disabled' : ''}
          class="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition
                 focus-visible:ring-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                 ${agotado
                   ? 'cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
                   : 'bg-brand-600 text-white hover:bg-brand-700 active:scale-[.98] dark:bg-brand-500 dark:hover:bg-brand-600'}">
          ${iconos.carrito}${agotado ? 'Sin stock' : 'Agregar al carrito'}
        </button>

        <p class="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          ${iconos.candado} Compra 100% segura
        </p>
      </div>
    </div>
  </article>`
}