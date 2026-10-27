/* =====================================
   LIBRERÍA EL SABER
   Catálogo y lista de compras
===================================== */

/* 1. Arreglo de objetos con los productos */
const productos = [
  {
    id: 1,
    nombre: "Cuaderno cosido 100 hojas",
    categoria: "Cuadernos",
    precio: 6500,
    imagen: "cuaderno.png"
  },
  {
    id: 2,
    nombre: "Cuaderno argollado 200 hojas",
    categoria: "Cuadernos",
    precio: 12000,
    imagen: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 3,
    nombre: "Cuaderno de dibujo",
    categoria: "Cuadernos",
    precio: 9500,
    imagen: "cuaderno-dibujo.png"
  },
  {
    id: 4,
    nombre: "Cien años de soledad",
    categoria: "Libros",
    precio: 58000,
    imagen: "cien-años-de-soledad.png"
  },
  {
    id: 5,
    nombre: "Diccionario escolar",
    categoria: "Libros",
    precio: 32000,
    imagen: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 6,
    nombre: "Atlas universal",
    categoria: "Libros",
    precio: 45000,
    imagen: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 7,
    nombre: "Set de lápices x12",
    categoria: "Papelería",
    precio: 8000,
    imagen: "lapiz.png"
  },
  {
    id: 8,
    nombre: "Caja de colores x12",
    categoria: "Papelería",
    precio: 15000,
    imagen: "set-lapices.png"
  },
  {
    id: 9,
    nombre: "Resaltadores x4",
    categoria: "Papelería",
    precio: 11000,
    imagen: "resaltadores.png"
  },
  {
    id: 10,
    nombre: "Calculadora científica",
    categoria: "Tecnología",
    precio: 65000,
    imagen: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 11,
    nombre: "Memoria USB 32 GB",
    categoria: "Tecnología",
    precio: 28000,
    imagen: "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 12,
    nombre: "Audífonos",
    categoria: "Tecnología",
    precio: 39000,
    imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80"
  }
];

/* 2. Conexión con los elementos del HTML */
const catalogo = document.getElementById("catalogo");
const buscador = document.getElementById("buscador");
const filtros = document.getElementById("filtros");
const contador = document.getElementById("contador");
const sinResultados = document.getElementById("sin-resultados");

const listaUL = document.getElementById("lista");
const estadoLista = document.getElementById("estado-lista");
const totalEl = document.getElementById("total");
const btnVaciar = document.getElementById("vaciar");

/* 3. Estado de la página */
let categoriaActiva = "todos";
let miLista = cargarLista();

/* 4. Formatear precios en pesos colombianos */
function formatoPrecio(valor) {
  return "$" + valor.toLocaleString("es-CO");
}

/* 5. Guardar y recuperar la lista con localStorage */
function cargarLista() {
  try {
    const datos = JSON.parse(
      localStorage.getItem("listaElSaber")
    );

    if (!Array.isArray(datos)) return [];

    // Recuperar solamente artículos válidos.
    return datos
      .filter(item =>
        productos.some(p => p.id === item.id) &&
        Number.isInteger(item.cantidad) &&
        item.cantidad > 0
      )
      .map(item => {
        const producto = productos.find(p => p.id === item.id);

        return {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad: item.cantidad
        };
      });
  } catch (error) {
    return [];
  }
}

function guardarLista() {
  try {
    localStorage.setItem(
      "listaElSaber",
      JSON.stringify(miLista)
    );
  } catch (error) {
    console.warn("No se pudo guardar la lista en este navegador.");
  }
}

/* 6. Crear una tarjeta de producto */
function crearTarjeta(producto) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "tarjeta";

  const imagen = document.createElement("img");
  imagen.src = producto.imagen;
  imagen.alt = "Fotografía ilustrativa de " + producto.nombre;
  imagen.loading = "lazy";

  // Mostrar una imagen alternativa si falla la fotografía.
  imagen.onerror = function () {
    this.onerror = null;
    this.src =
      "https://placehold.co/500x350/e9f6ed/185d34?text=El+Saber";
    this.alt = "Imagen no disponible para " + producto.nombre;
  };

  const categoria = document.createElement("span");
  categoria.className = "categoria";
  categoria.textContent = producto.categoria;

  const nombre = document.createElement("h3");
  nombre.textContent = producto.nombre;

  const precio = document.createElement("span");
  precio.className = "precio";
  precio.textContent = formatoPrecio(producto.precio);

  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "btn";
  boton.textContent = "Agregar a mi lista";
  boton.dataset.id = producto.id;

  tarjeta.append(imagen, categoria, nombre, precio, boton);

  return tarjeta;
}

/* 7. Mostrar catálogo y aplicar búsqueda y filtros */
function mostrarCatalogo() {
  const texto = buscador.value.trim().toLocaleLowerCase("es");

  const filtrados = productos.filter(producto => {
    const coincideCategoria =
      categoriaActiva === "todos" ||
      producto.categoria === categoriaActiva;

    const coincideTexto =
      producto.nombre.toLocaleLowerCase("es").includes(texto) ||
      producto.categoria.toLocaleLowerCase("es").includes(texto);

    return coincideCategoria && coincideTexto;
  });

  catalogo.replaceChildren();

  filtrados.forEach(producto => {
    catalogo.appendChild(crearTarjeta(producto));
  });

  contador.textContent =
    filtrados.length + (filtrados.length === 1
      ? " producto"
      : " productos");

  sinResultados.hidden = filtrados.length !== 0;
}

/* 8. Mostrar lista de productos seleccionados */
function mostrarLista() {
  listaUL.replaceChildren();

  let total = 0;

  miLista.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const li = document.createElement("li");

    const nombre = document.createElement("span");
    nombre.className = "nombre";
    nombre.textContent = item.nombre;

    const precio = document.createElement("span");
    precio.className = "subtotal";
    precio.textContent = formatoPrecio(subtotal);

    const cantidad = document.createElement("div");
    cantidad.className = "cantidad";

    const btnMenos = document.createElement("button");
    btnMenos.type = "button";
    btnMenos.textContent = "−";
    btnMenos.dataset.accion = "menos";
    btnMenos.dataset.id = item.id;
    btnMenos.setAttribute("aria-label", "Disminuir " + item.nombre);

    const numero = document.createElement("span");
    numero.textContent = item.cantidad;
    numero.setAttribute("aria-label", "Cantidad");

    const btnMas = document.createElement("button");
    btnMas.type = "button";
    btnMas.textContent = "+";
    btnMas.dataset.accion = "mas";
    btnMas.dataset.id = item.id;
    btnMas.setAttribute("aria-label", "Aumentar " + item.nombre);

    cantidad.append(btnMenos, numero, btnMas);

    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.className = "btn-quitar";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.dataset.accion = "quitar";
    btnEliminar.dataset.id = item.id;
    btnEliminar.setAttribute("aria-label", "Eliminar " + item.nombre);

    li.append(nombre, precio, cantidad, btnEliminar);
    listaUL.appendChild(li);
  });

  // Mostrar u ocultar el mensaje de lista vacía.
  estadoLista.hidden = miLista.length > 0;

  totalEl.textContent = formatoPrecio(total);
  btnVaciar.disabled = miLista.length === 0;

  guardarLista();
}

/* 9. Agregar producto a la lista */
function agregarProducto(id) {
  const producto = productos.find(p => p.id === id);

  if (!producto) return;

  const existente = miLista.find(item => item.id === id);

  if (existente) {
    existente.cantidad++;
  } else {
    miLista.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1
    });
  }

  mostrarLista();
}

/* 10. Aumentar o disminuir cantidad */
function cambiarCantidad(id, cambio) {
  const item = miLista.find(producto => producto.id === id);

  if (!item) return;

  item.cantidad += cambio;

  if (item.cantidad <= 0) {
    eliminarProducto(id);
  } else {
    mostrarLista();
  }
}

/* 11. Eliminar producto */
function eliminarProducto(id) {
  miLista = miLista.filter(item => item.id !== id);
  mostrarLista();
}

/* 12. Buscador en tiempo real */
buscador.addEventListener("input", mostrarCatalogo);

/* 13. Filtros de categorías */
filtros.addEventListener("click", evento => {
  const boton = evento.target.closest(".filtro");

  if (!boton) return;

  categoriaActiva = boton.dataset.cat;

  filtros.querySelectorAll(".filtro").forEach(filtro => {
    const seleccionado = filtro === boton;

    filtro.classList.toggle("activo", seleccionado);
    filtro.setAttribute("aria-pressed", String(seleccionado));
  });

  mostrarCatalogo();
});

/* 14. Botones para agregar productos */
catalogo.addEventListener("click", evento => {
  const boton = evento.target.closest("button[data-id]");

  if (!boton) return;

  agregarProducto(Number(boton.dataset.id));
});

/* 15. Botones de la lista */
listaUL.addEventListener("click", evento => {
  const boton = evento.target.closest("button[data-accion]");

  if (!boton) return;

  const id = Number(boton.dataset.id);
  const accion = boton.dataset.accion;

  if (accion === "mas") {
    cambiarCantidad(id, 1);
  } else if (accion === "menos") {
    cambiarCantidad(id, -1);
  } else if (accion === "quitar") {
    eliminarProducto(id);
  }
});

/* 16. Vaciar toda la lista */
btnVaciar.addEventListener("click", () => {
  miLista = [];
  mostrarLista();
});

/* 17. Iniciar el sitio web */
mostrarCatalogo();
mostrarLista();