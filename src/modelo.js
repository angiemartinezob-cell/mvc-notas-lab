/**
 * MODELO · Notas del semestre                                            (PARTE 2 de la guía)
 *
 * SABE: qué es una evaluación, las reglas (pesos, rangos, nota mínima) y cómo se calcula el resumen.
 * NO SABE: que existe una pantalla, el DOM, localStorage, alert()... Por eso se prueba sin navegador.
 *
 * Se comunica con el resto SIN conocerlo: avisa de sus cambios con el patrón Observer (suscribir).
 *
 * Tu trabajo: reemplazar cada "TODO" por código real hasta que `npm run test:modelo` quede en verde.
 * Las reglas exactas y los mensajes de error están en la guía (Parte 2) y en pruebas/modelo.pruebas.js.
 */

export const NOTA_MINIMA = 3.0; // para aprobar
export const NOTA_MAXIMA = 5.0;
export const UMBRAL_RIESGO = 4.0; // si necesitas más que esto en lo que falta, estás "en riesgo"
export const MAX_NOMBRE = 40;

const EPS = 1e-9; // tolerancia para comparar decimales (0.1 + 0.2 no es exactamente 0.3 en un computador)

/** Error de negocio: su mensaje se puede mostrar tal cual al usuario. */
export class ErrorDeReglas extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = 'ErrorDeReglas';
  }
}

/** Ayuda ya escrita: redondea hacia ARRIBA (la nota que "necesitas" nunca debe quedarse corta). */
const redondearArriba = (valor, decimales = 2) => {
  const f = 10 ** decimales;
  return Math.ceil(valor * f - EPS) / f;
};

export class NotasModelo {
  #almacen;
  #evaluaciones;
  #siguienteId;
  #suscriptores = new Set();

  // Ya escrito: recibe el almacén (no sabe cuál es), carga lo guardado y calcula el próximo id.
  constructor(almacen) {
    this.#almacen = almacen;
    this.#evaluaciones = almacen.cargar();
    this.#siguienteId = this.#evaluaciones.reduce((max, e) => Math.max(max, e.id), 0) + 1;
  }

  // Ya escrito: devuelve COPIAS, para que nadie cambie el estado interno saltándose las reglas.
  get evaluaciones() {
    return this.#evaluaciones.map((e) => ({ ...e }));
  }

  // ---------------------------------------------------------------- 2A · Agregar y validar
  
agregar({ nombre, peso, nota = null }) {
  // 1. Validar el nombre
  nombre = typeof nombre === 'string' ? nombre.trim() : '';

  if (nombre === '') {
    throw new ErrorDeReglas('El nombre es obligatorio.');
  }

  if (nombre.length > MAX_NOMBRE) {
    throw new ErrorDeReglas('El nombre no puede superar 40 caracteres.');
  }
  
  
  // Validar que no exista otra evaluación con el mismo nombre
  const nombreRepetido = this.#evaluaciones.some(
    evaluacion =>
      evaluacion.nombre.trim().toLowerCase() === nombre.toLowerCase()
  );

  if (nombreRepetido) {
    throw new ErrorDeReglas(
      'Ya existe una evaluación con ese nombre.'
    );
  }


  // 2. Validar el peso
  if (typeof peso !== 'number' || !Number.isFinite(peso) || peso < 1 || peso > 100) {
    throw new ErrorDeReglas('El peso debe estar entre 1 y 100.');
  }

  // 3. Validar la nota, si se proporciona
  if (nota !== null &&
      (typeof nota !== 'number' || !Number.isFinite(nota) || nota < 0 || nota > NOTA_MAXIMA)) {
    throw new ErrorDeReglas('La nota debe estar entre 0 y 5.');
  }

  // 4. Validar que los pesos no superen el 100 %
  const total = this.#evaluaciones.reduce((suma, e) => suma + e.peso, 0);

  if (total + peso > 100 + EPS) {
    const restante = Math.round((100 - total) * 100) / 100;
    throw new ErrorDeReglas(
      `Los pesos no pueden sumar más de 100 % (te quedan ${restante} %).`
    );
  }

  // 5. Registrar la evaluación
  const evaluacion = {
    id: this.#siguienteId++,
    nombre,
    peso,
    nota
  };

  this.#evaluaciones.push(evaluacion);
  this.#cambio();
}


  // ---------------------------------------------------------------- 2B · Calificar y eliminar
  
calificar(id, nota) {
  // Buscar la evaluación por su ID
  const evaluacion = this.#evaluaciones.find(e => e.id === id);

  if (!evaluacion) {
    throw new ErrorDeReglas('No existe la evaluación.');
  }

  // Validar la nota, permitiendo null
  if (nota !== null &&
      (typeof nota !== 'number' || !Number.isFinite(nota) ||
       nota < 0 || nota > NOTA_MAXIMA)) {
    throw new ErrorDeReglas('La nota debe estar entre 0 y 5.');
  }

  // Actualizar la nota
  evaluacion.nota = nota;

  // Guardar y notificar el cambio
  this.#cambio();
}


  
eliminar(id) {
  // Buscar la posición de la evaluación
  const indice = this.#evaluaciones.findIndex(e => e.id === id);

  if (indice === -1) {
    throw new ErrorDeReglas('No existe la evaluación.');
  }

  // Eliminar la evaluación
  this.#evaluaciones.splice(indice, 1);

  // Guardar y notificar el cambio
  this.#cambio();
}


  // ---------------------------------------------------------------- 2C · Resumen
  
resumen() {
  let acumulado = 0;
  let pesoCalificado = 0;

  for (const evaluacion of this.#evaluaciones) {
    if (evaluacion.nota !== null) {
      acumulado += evaluacion.peso * evaluacion.nota / 100;
      pesoCalificado += evaluacion.peso;
    }
  }

  const pesoPendiente = 100 - pesoCalificado;

  let notaNecesaria = null;

  if (pesoPendiente > 0) {
    const calculo = Math.max(
      0,
      (NOTA_MINIMA - acumulado) / (pesoPendiente / 100)
    );

    notaNecesaria = redondearArriba(calculo);
  }

  let estado;

  if (acumulado + EPS >= NOTA_MINIMA) {
    estado = 'aprobado';
  } else if (
    notaNecesaria === null ||
    notaNecesaria > NOTA_MAXIMA
  ) {
    estado = 'imposible';
  } else if (notaNecesaria > UMBRAL_RIESGO) {
    estado = 'en-riesgo';
  } else {
    estado = 'en-camino';
  }

  return {
    acumulado,
    pesoCalificado,
    pesoPendiente,
    notaNecesaria,
    estado
  };
}


  // ---------------------------------------------------------------- 2D · Observer y persistencia
  
suscribir(suscriptor) {
  // Registrar el observador
  this.#suscriptores.add(suscriptor);

  // Devolver una función para cancelar la suscripción
  return () => {
    this.#suscriptores.delete(suscriptor);
  };
}


  
#cambio() {
  // Guardar las evaluaciones actualizadas
  this.#almacen.guardar(this.evaluaciones);

  // Avisar a todos los observadores
  for (const suscriptor of this.#suscriptores) {
    suscriptor();
  }
}


  // Puedes agregar aquí los métodos privados que necesites (por ejemplo #buscar(id) o #validarNota(nota)).
}
