import './style.css'
import { productos, categorias } from './data.js'
import { productCard } from './product-card.js'

const grid = document.querySelector('#grid')
const filtros = document.querySelector('#filtros')
const vacio = document.querySelector('#vacio')
const orden = document.querySelector('#orden')
const contador = document.querySelector('#carrito-cantidad')
const tema = document.querySelector('#tema')

let categoria = 'Todos'

const ordenadores = {
  destacados: (a, b) => b.rating * Math.log(b.opiniones) - a.rating * Math.log(a.opiniones),
  'precio-asc': (a, b) => a.precio - b.precio,
  'precio-desc': (a, b) => b.precio - a.precio,
  rating: (a, b) => b.rating - a.rating,
}

function pintarFiltros() {
  filtros.innerHTML = categorias
    .map(
      (item) => `
      <button type="button" data-categoria="${item}"
        class="shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition
        ${item === categoria
          ? 'border-brand-600 bg-brand-600 text-white'
          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'}">
        ${item}
      </button>`,
    )
    .join('')
}

function pintar() {
  const lista = productos
    .filter((p) => categoria === 'Todos' || p.categoria === categoria)
    .sort(ordenadores[orden.value])

  grid.innerHTML = lista.map(productCard).join('')
  vacio.classList.toggle('hidden', lista.length > 0)
}

filtros.addEventListener('click', (evento) => {
  const boton = evento.target.closest('[data-categoria]')
  if (!boton) return
  categoria = boton.dataset.categoria
  pintarFiltros()
  pintar()
})

orden.addEventListener('change', pintar)

grid.addEventListener('click', (evento) => {
  const favorito = evento.target.closest('[data-favorito]')
  if (favorito) {
    const activo = favorito.classList.toggle('text-rose-500')
    favorito.innerHTML = `
      <svg viewBox="0 0 24 24" fill="${activo ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" class="size-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25s-7.5-4.32-7.5-9.6A4.15 4.15 0 0 1 12 7.5a4.15 4.15 0 0 1 7.5 3.15c0 5.28-7.5 9.6-7.5 9.6Z"/>
      </svg>`
    return
  }

  const agregar = evento.target.closest('[data-agregar]')
  if (agregar && !agregar.disabled) {
    contador.textContent = Number(contador.textContent) + 1
    agregar.classList.add('bg-emerald-600', 'hover:bg-emerald-600')
    agregar.innerHTML = '¡Agregado!'
    setTimeout(() => {
      agregar.classList.remove('bg-emerald-600', 'hover:bg-emerald-600')
      agregar.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="size-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 4h2l2.2 10.4a1.5 1.5 0 0 0 1.5 1.2h7.7a1.5 1.5 0 0 0 1.5-1.2L20 8H6"/>
          <circle cx="10" cy="20" r="1.2"/><circle cx="17" cy="20" r="1.2"/>
        </svg>Agregar al carrito`
    }, 1200)
  }
})

tema.addEventListener('click', () => document.documentElement.classList.toggle('dark'))

pintarFiltros()
pintar()