// ==============================
// SECCION JAVASCRIPT
// Toda la logica del proyecto
// ==============================

// ==============================
// CLASE NODO
// Representa cada elemento del arbol
// Cada nodo tiene un valor, y puede
// tener un hijo izquierdo y uno derecho
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
// Contiene la raiz y los metodos
// para insertar y buscar nodos
// ==============================
class Arbol {
  constructor() {
    this.raiz = null;
  }

  // agrega un nuevo valor al arbol
  agregar(valor) {
    const nuevoNodo = new Nodo(valor);
    if (this.raiz === null) {
      this.raiz = nuevoNodo;       // si esta vacio, el nuevo nodo es la raiz
    } else {
      this.insertarNodo(this.raiz, nuevoNodo);
    }
    
  }

  // decide si el nodo va a la izquierda o derecha
  insertarNodo(nodoActual, nuevoNodo) {
    if (nuevoNodo.valor < nodoActual.valor) {
      // va a la izquierda si es menor
      if (nodoActual.izquierda === null) {
        nodoActual.izquierda = nuevoNodo;
      } else {
        this.insertarNodo(nodoActual.izquierda, nuevoNodo);
      }
    } else if (nuevoNodo.valor > nodoActual.valor) {
      // va a la derecha si es mayor
      if (nodoActual.derecha === null) {
        nodoActual.derecha = nuevoNodo;
      } else {
        this.insertarNodo(nodoActual.derecha, nuevoNodo);
      }
    }
    // si es igual, no se inserta (sin duplicados)
  }

  // ==============================
  // CARGAR JSON DESDE ARCHIVO
  // Lee un .json del disco, lo muestra
  // en el textarea y dibuja el arbol
  // ==============================
    cargarArchivoJSON(event) {
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

          // muestra el contenido en el textarea
          const textarea = document.getElementById("inputJSON");
          if (textarea) textarea.value = JSON.stringify(datos, null, 2);

          // construye y dibuja el arbol
          const raiz = jsonANodo(datos);
          actualizarInterfaz(raiz);

        } catch (err) {
          alert("Error al leer el archivo JSON: " + err.message);
        }
      };

    lector.onerror = () => alert("No se pudo leer el archivo.");
    lector.readAsText(archivo);

    // permite volver a cargar el mismo archivo
    event.target.value = "";
  }

    // BUSQUEDA BINARIA (BST)
  
    buscarBinario(valor) {
      let actual = this.raiz;

      while (actual !== null) {

        if (valor === actual.valor) {
          alert("Valor encontrado: " + valor);
          return;
        }

        else if (valor < actual.valor) {
          actual = actual.izquierda;
        }

        else {
          actual = actual.derecha;
        }
      }

      alert("Valor no encontrado");
    }

  // BUSQUEDA POR ANCHURA (BFS)
  
  buscarAnchura() {

    if (this.raiz === null) return;

    let cola = [this.raiz];
    let resultado = [];

    while (cola.length > 0) {

      let nodo = cola.shift();
      resultado.push(nodo.valor);

      if (nodo.izquierda !== null) {
        cola.push(nodo.izquierda);
      }

      if (nodo.derecha !== null) {
        cola.push(nodo.derecha);
      }
    }
    animarRecorrido(resultado);
  }

  // BUSQUEDA POR PROFUNDIDAD (DFS)
  //inorden
  buscarProfundidad(nodo, resultado = []) {
  
    if (nodo === null) return resultado;

    this.buscarProfundidad(nodo.izquierda, resultado);
    resultado.push(nodo.valor);
    this.buscarProfundidad(nodo.derecha, resultado);

    return resultado;
  }
}

// variable global que guarda el arbol actual
let miArbol = new Arbol();

// ==============================
// ARBOL ALEATORIO (BST)
// Genera 7 numeros unicos al azar
// entre 1 y 99, los inserta en el
// arbol y lo dibuja automaticamente.
// El usuario solo presiona el boton.
// ==============================
function generarBSTAleatorio() {

  // Set garantiza que no haya numeros repetidos
  const valores = new Set();

  // sigue generando hasta tener 7 numeros unicos
  while (valores.size < 7) {
    const num = Math.floor(Math.random() * 100) + 1;
    valores.add(num);
  }

  // reinicia el arbol e inserta cada numero
  miArbol = new Arbol();
  valores.forEach(n => miArbol.agregar(n));

  // dibuja el arbol en pantalla
  actualizarInterfaz(miArbol.raiz);
}

// ==============================
// TARJETA 1: NUMEROS (BST)
// Lee los numeros del input,
// los inserta en el arbol y dibuja
// ==============================
function procesarNumeros() {
  const input = document.getElementById("inputNumeros").value;

  // convierte "50, 30, 70" en [50, 30, 70]
  const lista = input.split(",").map(n => n.trim()).filter(n => n !== "").map(Number);

  // valida que todos sean numeros
  if (lista.some(isNaN)) {
    alert("Ingresa solo numeros separados por comas.");
    return;
  }

  // reinicia el arbol e inserta cada numero
  miArbol = new Arbol();
  lista.forEach(n => miArbol.agregar(n));

  // dibuja el arbol en pantalla
  actualizarInterfaz(miArbol.raiz);
}

// ==============================
// TARJETA 2: EXPRESION MATEMATICA
// ==============================
function leerExpresion() {
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
// Lee el JSON del textarea,
// lo convierte a Nodos y dibuja
// ==============================
function leerJSON() {
  const texto = document.getElementById("inputJSON").value.trim();

  // intenta convertir el texto a objeto JavaScript
  let datos;
  try {
    datos = JSON.parse(texto);
  } catch (e) {
    alert("JSON invalido: " + e.message);
    return;
  }

  // valida que tenga la estructura correcta
  if (!validarJSON(datos)) return;

  // convierte el objeto JSON a nodos del arbol
  const raiz = jsonANodo(datos);
  actualizarInterfaz(raiz);
}

// revisa que cada nodo tenga "name" y "children" validos
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

// convierte un objeto JSON en una estructura de Nodos
function jsonANodo(obj) {
  let n = new Nodo(obj.name);
  if (obj.children && obj.children[0]) n.izquierda = jsonANodo(obj.children[0]);
  if (obj.children && obj.children[1]) n.derecha   = jsonANodo(obj.children[1]);
  return n;
}

// ==============================
// DIBUJAR EL ARBOL EN PANTALLA
// Recibe la raiz del arbol y
// actualiza el HTML con el grafico
// y los recorridos
// ==============================
function actualizarInterfaz(raiz) {

  // dibuja el grafico del arbol
  const grafico = document.getElementById("arbol-grafico");
  grafico.innerHTML = `<ul>${dibujarNodo(raiz, true)}</ul>`;

  // muestra los tres recorridos
  const resultados = document.getElementById("resultadosTexto");
  resultados.innerHTML = `
    <strong>Recorridos del arbol:</strong><br>
    <b>Inorden:</b>   ${recorrido(raiz, 'in')}<br>
    <b>Preorden:</b>  ${recorrido(raiz, 'pre')}<br>
    <b>Postorden:</b> ${recorrido(raiz, 'post')}
  `;
}

// convierte un nodo en HTML con su forma de pildora
function dibujarNodo(nodo, esRaiz = false) {
  if (!nodo) return '<li><div class="node-vacio"></div></li>';

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
// recorre el arbol y devuelve los valores en orden
function recorrido(nodo, tipo) {
  let resultado = [];

  function recorrer(n) {
    if (!n) return;
    if (tipo === 'pre') resultado.push(n.valor);   // raiz primero
    recorrer(n.izquierda);
    if (tipo === 'in')  resultado.push(n.valor);   // raiz en medio
    recorrer(n.derecha);
    if (tipo === 'post') resultado.push(n.valor);  // raiz al final
  }

  recorrer(nodo);
  return resultado.join(" → ");
}

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
  
function animarRecorrido(lista){

  let i = 0;

  // limpiar animaciones anteriores
  document.querySelectorAll(".node-pildora").forEach(n=>{
    n.classList.remove("visitado");
  });

  function iluminar(){

    if(i >= lista.length) return;

    let nodo = document.getElementById("nodo-" + lista[i]);

    if(nodo){

      nodo.classList.add("visitado");

      setTimeout(()=>{

        nodo.classList.remove("visitado");
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