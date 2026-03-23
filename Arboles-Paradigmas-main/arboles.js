// ==============================
// SECCION JAVASCRIPT
// Toda la logica del proyecto
// ==============================
 
// ==============================
// CLASE NODO
// ==============================
class Nodo {
  constructor(valor) {
    this.valor     = valor;
    this.izquierda = null;
    this.derecha   = null;
  }
}
 
// ==============================
// CLASE ARBOL
// ==============================
class Arbol {
  constructor() {
    this.raiz = null;
  }
 
  agregar(valor) {
    const nuevoNodo = new Nodo(valor);
    if (this.raiz === null) {
      this.raiz = nuevoNodo;
    } else {
      this.insertarNodo(this.raiz, nuevoNodo);
    }
  }
 
  insertarNodo(nodoActual, nuevoNodo) {
    if (nuevoNodo.valor < nodoActual.valor) {
      if (nodoActual.izquierda === null) {
        nodoActual.izquierda = nuevoNodo;
      } else {
        this.insertarNodo(nodoActual.izquierda, nuevoNodo);
      }
    } else if (nuevoNodo.valor > nodoActual.valor) {
      if (nodoActual.derecha === null) {
        nodoActual.derecha = nuevoNodo;
      } else {
        this.insertarNodo(nodoActual.derecha, nuevoNodo);
      }
    }
  }
 
  buscarBinario(valor) {
    let actual = this.raiz;
    while (actual !== null) {
      if (valor === actual.valor) {
        alert("Valor encontrado: " + valor);
        return;
      } else if (valor < actual.valor) {
        actual = actual.izquierda;
      } else {
        actual = actual.derecha;
      }
    }
    alert("Valor no encontrado");
  }
 
  buscarAnchura() {
    if (this.raiz === null) return;
    let cola = [this.raiz];
    let resultado = [];
    while (cola.length > 0) {
      let nodo = cola.shift();
      resultado.push(nodo.valor);
      if (nodo.izquierda !== null) cola.push(nodo.izquierda);
      if (nodo.derecha !== null) cola.push(nodo.derecha);
    }
    animarRecorrido(resultado);
  }
 
  buscarProfundidad(nodo, resultado = []) {
    if (nodo === null) return resultado;
    this.buscarProfundidad(nodo.izquierda, resultado);
    resultado.push(nodo.valor);
    this.buscarProfundidad(nodo.derecha, resultado);
    return resultado;
  }
}
 
// ==============================
// VARIABLES GLOBALES
// miArbol     → arbol BST activo
// tipoArbolActivo → define el color de animacion
//   'bst'       → azul
//   'aleatorio' → morado
//   'expresion' → verde
//   'json'      → naranja
// ==============================
let miArbol         = new Arbol();
let tipoArbolActivo = 'bst';
 
// ==============================
// ARBOL ALEATORIO
// ==============================
function generarBSTAleatorio() {
  tipoArbolActivo = 'aleatorio';
  const valores = new Set();
  while (valores.size < 7) {
    const num = Math.floor(Math.random() * 100) + 1;
    valores.add(num);
  }
  miArbol = new Arbol();
  valores.forEach(n => miArbol.agregar(n));
  actualizarInterfaz(miArbol.raiz);
}
 
// ==============================
// TARJETA 1: NUMEROS BST
// ==============================
function procesarNumeros() {
  tipoArbolActivo = 'bst';
  const input = document.getElementById("inputNumeros").value;
  const lista = input.split(",").map(n => n.trim()).filter(n => n !== "").map(Number);
  if (lista.some(isNaN)) {
    alert("Ingresa solo numeros separados por comas.");
    return;
  }
  miArbol = new Arbol();
  lista.forEach(n => miArbol.agregar(n));
  actualizarInterfaz(miArbol.raiz);
}
 
// ==============================
// TARJETA 2: EXPRESION MATEMATICA
// ==============================
function leerExpresion() {
  tipoArbolActivo = 'expresion';
  const texto = document.getElementById("inputExpresion").value.trim();
  if (!texto) return alert("Escribe una expresión.");
  try {
    const raizGenerada = ConstruirArbol(texto);
    actualizarInterfaz(raizGenerada);
  } catch (e) { alert("Error: " + e.message); }
}
 
function ConstruirArbol(exp) {
  const prioridad = {'+': 1, '-': 1, '*': 2, '/': 2, '^': 3, 'sqrt': 4};
  const valores = [];
  const operadores = [];
  const tokens = exp.match(/(sqrt|[a-zA-Z0-9]+|[\+\-\*\/\(\)\^])/g);
  if (!tokens) return null;
  const procesar = () => {
    const op = operadores.pop();
    if (op === 'sqrt') {
      const hijo = valores.pop();
      const nodo = new Nodo("√");
      nodo.izquierda = hijo;
      valores.push(nodo);
    } else {
      const der = valores.pop();
      const izq = valores.pop();
      const nodo = new Nodo(op);
      nodo.izquierda = izq; nodo.derecha = der;
      valores.push(nodo);
    }
  };
  tokens.forEach(token => {
    if (token === '(') operadores.push(token);
    else if (token === ')') {
      while (operadores.length && operadores[operadores.length - 1] !== '(') procesar();
      operadores.pop();
    } else if (prioridad[token]) {
      while (operadores.length && prioridad[operadores[operadores.length - 1]] >= prioridad[token]) procesar();
      operadores.push(token);
    } else { valores.push(new Nodo(token)); }
  });
  while (operadores.length) procesar();
  return valores[0];
}
 
// ==============================
// TARJETA 3: JSON
// ==============================
function leerJSON() {
  tipoArbolActivo = 'json';
  const texto = document.getElementById("inputJSON").value.trim();
  let datos;
  try {
    datos = JSON.parse(texto);
  } catch (e) {
    alert("JSON invalido: " + e.message);
    return;
  }
  if (!validarJSON(datos)) return;
  const raiz = jsonANodo(datos);
  actualizarInterfaz(raiz);
}
 
function cargarArchivoJSON(event) {
  const archivo = event.target.files[0];
  if (!archivo) return;
  if (!archivo.name.toLowerCase().endsWith(".json")) {
    alert("Solo se permiten archivos con extension .json");
    return;
  }
  const lector = new FileReader();
  lector.onload = function (e) {
    try {
      const datos = JSON.parse(e.target.result);
      if (!validarJSON(datos)) return;
      const textarea = document.getElementById("inputJSON");
      if (textarea) textarea.value = JSON.stringify(datos, null, 2);
      tipoArbolActivo = 'json';
      const raiz = jsonANodo(datos);
      actualizarInterfaz(raiz);
    } catch (err) {
      alert("Error al leer el archivo JSON: " + err.message);
    }
  };
  lector.onerror = () => alert("No se pudo leer el archivo.");
  lector.readAsText(archivo);
  event.target.value = "";
}
 
function validarJSON(nodo) {
  if (!nodo.name) {
    alert("Cada nodo debe tener un campo 'name'.");
    return false;
  }
  if (nodo.children && !Array.isArray(nodo.children)) {
    alert("El campo 'children' debe ser un arreglo.");
    return false;
  }
  if (nodo.children) {
    for (let hijo of nodo.children) {
      if (!validarJSON(hijo)) return false;
    }
  }
  return true;
}
 
function jsonANodo(obj) {
  let n = new Nodo(obj.name);
  if (obj.children && obj.children[0]) n.izquierda = jsonANodo(obj.children[0]);
  if (obj.children && obj.children[1]) n.derecha   = jsonANodo(obj.children[1]);
  return n;
}
 
// ==============================
// DIBUJAR EL ARBOL EN PANTALLA
// Dibuja el arbol y lanza la
// animacion en preorden automaticamente
// ==============================
function actualizarInterfaz(raiz) {
  const grafico = document.getElementById("arbol-grafico");
  grafico.innerHTML = `<ul>${dibujarNodo(raiz, true)}</ul>`;
 
  const resultados = document.getElementById("resultadosTexto");
  resultados.innerHTML = `
    <strong>Recorridos del arbol:</strong><br>
    <b>Inorden:</b>   ${recorrido(raiz, 'in')}<br>
    <b>Preorden:</b>  ${recorrido(raiz, 'pre')}<br>
    <b>Postorden:</b> ${recorrido(raiz, 'post')}
  `;
 
  // animacion automatica en preorden al generar
  const listaPreorden = obtenerPreorden(raiz);
  animarRecorrido(listaPreorden);
}
 
// devuelve los valores del arbol en preorden
function obtenerPreorden(nodo, lista = []) {
  if (!nodo) return lista;
  lista.push(nodo.valor);           // raiz primero
  obtenerPreorden(nodo.izquierda, lista);
  obtenerPreorden(nodo.derecha, lista);
  return lista;
}
 
function dibujarNodo(nodo, esRaiz = false) {
  if (!nodo) return '<li><div class="node-pildora node-vacio"></div></li>';
  const tieneHijos = nodo.izquierda || nodo.derecha;
  return `
    <li>
      <div id="nodo-${nodo.valor}" class="node-pildora ${esRaiz ? 'root' : ''}">
        ${nodo.valor}
      </div>
      ${tieneHijos ? `
        <ul>
          ${dibujarNodo(nodo.izquierda)}
          ${dibujarNodo(nodo.derecha)}
        </ul>
      ` : ''}
    </li>
  `;
}
 
function recorrido(nodo, tipo) {
  let resultado = [];
  function recorrer(n) {
    if (!n) return;
    if (tipo === 'pre') resultado.push(n.valor);
    recorrer(n.izquierda);
    if (tipo === 'in')  resultado.push(n.valor);
    recorrer(n.derecha);
    if (tipo === 'post') resultado.push(n.valor);
  }
  recorrer(nodo);
  return resultado.join(" → ");
}
 
// ==============================
// BUSQUEDA Y RECORRIDOS MANUALES
// ==============================
function buscarNumero() {
  let numero = prompt("Numero a buscar:");
  if (numero === null) return;
  miArbol.buscarBinario(parseInt(numero));
}
 
function recorrerAnchura() {
  miArbol.buscarAnchura();
}
 
function recorrerProfundidad() {
  let resultado = miArbol.buscarProfundidad(miArbol.raiz);
  animarRecorrido(resultado);
  setTimeout(() => {
    alert("Recorrido profundidad: " + resultado.join(" → "));
  }, resultado.length * 700);
}
 
// ==============================
// ANIMAR RECORRIDO
// Usa tipoArbolActivo para el color:
//   bst       → azul
//   aleatorio → morado
//   expresion → verde
//   json      → naranja
// ==============================
function animarRecorrido(lista) {
  const claseColor = 'visitado-' + tipoArbolActivo;
  let i = 0;
 
  // limpia colores anteriores
  document.querySelectorAll(".node-pildora").forEach(n => {
    n.classList.remove(
      "visitado-bst",
      "visitado-aleatorio",
      "visitado-expresion",
      "visitado-json"
    );
  });
 
  function iluminar() {
    if (i >= lista.length) return;
    let nodo = document.getElementById("nodo-" + lista[i]);
    if (nodo) {
      nodo.classList.add(claseColor);
      setTimeout(() => {
        nodo.classList.remove(claseColor);
        i++;
        iluminar();
      }, 700);
    } else {
      i++;
      iluminar();
    }
  }
 
  iluminar();
}