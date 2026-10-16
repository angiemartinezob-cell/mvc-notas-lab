/**
 * VISTA · Notas del semestre                                             (PARTE 3 de la guía)
 *
 * SABE: dibujar el estado del Modelo en el DOM y avisar qué hizo el usuario (clics, formularios).
 * NO SABE: ninguna regla de negocio, ni cambiar el Modelo, ni guardar datos.
 *
 * Lee del Modelo (solo lectura) y se suscribe a sus cambios para redibujarse sola.
 * El HTML estático (formulario, tabla, resumen) ya está en index.html: aquí solo se rellena y se escucha.
 */

export class NotasVista {
  #modelo;
  #el;

  
  constructor(raiz, modelo) {
  // Guardar la referencia al Modelo
  this.#modelo = modelo;

  // Buscar los elementos HTML de la aplicación
  this.#el = {
    form: raiz.querySelector('#form'),
    nombre: raiz.querySelector('#nombre'),
    peso: raiz.querySelector('#peso'),
    nota: raiz.querySelector('#nota'),
    error: raiz.querySelector('#error'),
    tabla: raiz.querySelector('#tabla'),
    vacio: raiz.querySelector('#vacio'),
    acumulado: raiz.querySelector('#acumulado'),
    pesoCalificado: raiz.querySelector('#pesoCalificado'),
    pesoPendiente: raiz.querySelector('#pesoPendiente'),
    necesaria: raiz.querySelector('#necesaria'),
    estado: raiz.querySelector('#estado')
  };

  // Suscribirse a los cambios del Modelo
  this.#modelo.suscribir(() => this.render());

  // Dibujar la interfaz por primera vez
  this.render();
}


  // ---------------------------------------------------------- 3B · Eventos que la Vista ofrece
  // El Controlador se registra aquí. La Vista no decide qué hacer: solo avisa "el usuario hizo esto".

  
alAgregar(manejador) {
  this.#el.form.addEventListener('submit', (evento) => {
    evento.preventDefault();

    manejador(this.leerFormulario());
  });
}


  // EJEMPLO RESUELTO (para que hagas alAgregar y alCalificar igual): un solo escuchador en la tabla
  // sirve para todas las filas (delegación de eventos); el id viaja en el atributo data-eliminar.
  // Funciona cuando termines 3A (this.#el.tabla) y 3D (los botones "Eliminar" con data-eliminar).
  alEliminar(manejador) {
    this.#el.tabla.addEventListener('click', (evento) => {
      const boton = evento.target.closest('button[data-eliminar]');
      if (boton) manejador(Number(boton.dataset.eliminar));
    });
  }

  
alCalificar(manejador) {
  this.#el.tabla.addEventListener('change', (evento) => {
    const campo = evento.target.closest('input[data-nota]');

    if (campo) {
      const id = Number(campo.dataset.nota);
      const textoEscrito = campo.value;

      manejador(id, textoEscrito);
    }
  });
}


  // ---------------------------------------------------------- 3C · Órdenes que la Vista obedece

  
leerFormulario() {
  return {
    nombre: this.#el.nombre.value,
    peso: this.#el.peso.value,
    nota: this.#el.nota.value
  };
}


  
limpiarFormulario() {
  this.#el.nombre.value = '';
  this.#el.peso.value = '';
  this.#el.nota.value = '';
}


  
mostrarError(mensaje) {
  this.#el.error.textContent = mensaje;
}


  
limpiarError() {
  this.#el.error.textContent = '';
}


  // ---------------------------------------------------------- 3D · Dibujar

  /** Dibuja TODO a partir del Modelo. No decide nada: solo presenta. */
  
render() {
  // 1. Obtener los datos del Modelo
  const evaluaciones = this.#modelo.evaluaciones;
  const resumen = this.#modelo.resumen();

  // 2. Limpiar la tabla antes de dibujarla
  this.#el.tabla.replaceChildren();

  // 3. Crear una fila por cada evaluación
  for (const evaluacion of evaluaciones) {
    const fila = document.createElement('tr');

    // Nombre
    const celdaNombre = document.createElement('td');
    celdaNombre.textContent = evaluacion.nombre;

    // Peso
    const celdaPeso = document.createElement('td');
    celdaPeso.textContent = `${evaluacion.peso} %`;

    // Campo para la nota
    const celdaNota = document.createElement('td');
    const campoNota = document.createElement('input');

    campoNota.type = 'number';
    campoNota.step = 'any';
    campoNota.value = evaluacion.nota === null ? '' : evaluacion.nota;
    campoNota.dataset.nota = evaluacion.id;

    celdaNota.appendChild(campoNota);

    // Aporte al acumulado
    const celdaAporte = document.createElement('td');

    celdaAporte.textContent = evaluacion.nota === null
      ? '—'
      : (evaluacion.peso * evaluacion.nota / 100).toFixed(2);

    // Botón eliminar
    const celdaAccion = document.createElement('td');
    const botonEliminar = document.createElement('button');

    botonEliminar.textContent = 'Eliminar';
    botonEliminar.dataset.eliminar = evaluacion.id;

    celdaAccion.appendChild(botonEliminar);

    // Agregar las celdas a la fila
    fila.append(
      celdaNombre,
      celdaPeso,
      celdaNota,
      celdaAporte,
      celdaAccion
    );

    // Agregar la fila a la tabla
    this.#el.tabla.appendChild(fila);
  }

  // 4. Mostrar mensaje si no hay evaluaciones
  this.#el.vacio.style.display =
    evaluaciones.length === 0 ? 'block' : 'none';

  // 5. Mostrar el resumen académico
  this.#el.acumulado.textContent = resumen.acumulado.toFixed(2);

  this.#el.pesoCalificado.textContent =
    `${Math.round(resumen.pesoCalificado * 100) / 100} %`;

  this.#el.pesoPendiente.textContent =
    `${Math.round(resumen.pesoPendiente * 100) / 100} %`;

  this.#el.necesaria.textContent =
    resumen.notaNecesaria === null
      ? '—'
      : resumen.notaNecesaria.toFixed(2);

  // 6. Mostrar el estado académico
  let mensaje;
  let clase;

  switch (resumen.estado) {
    case 'aprobado':
      mensaje = '¡Aprobado! Ya aseguraste la nota mínima.';
      clase = 'ok';
      break;

    case 'imposible':
      mensaje = 'Imposible aprobar con las notas actuales.';
      clase = 'imposible';
      break;

    case 'en-riesgo':
      mensaje = `En riesgo: necesitas ${resumen.notaNecesaria.toFixed(2)} en lo que falta.`;
      clase = 'riesgo';
      break;

    default:
      mensaje = `En camino: necesitas ${resumen.notaNecesaria.toFixed(2)} en lo que falta.`;
      clase = 'en-camino';
  }

  this.#el.estado.textContent = mensaje;
  this.#el.estado.className = `estado ${clase}`;
}

}
