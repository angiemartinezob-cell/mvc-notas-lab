/**
 * CONTROLADOR · Notas del semestre                                       (PARTE 4 de la guía)
 *
 * SABE: traducir lo que hace el usuario (eventos de la Vista) en órdenes para el Modelo,
 *       y qué mostrar cuando el Modelo rechaza una orden.
 * NO SABE: HTML ni DOM (eso es de la Vista), ni las reglas del negocio (eso es del Modelo).
 *
 * Es "delgado": cada método hace tres cosas como máximo (leer → ordenar → reaccionar).
 */

import { ErrorDeReglas } from './modelo.js';

export class NotasControlador {
  #modelo;
  #vista;

  
constructor(modelo, vista) {
  this.#modelo = modelo;
  this.#vista = vista;

  // Agregar una evaluación
  this.#vista.alAgregar((datos) => {
    const nombre = datos.nombre;
    const peso = Number(datos.peso);
    const nota = datos.nota.trim() === ''
      ? null
      : Number(datos.nota);

    this.#ejecutar(() => {
      this.#modelo.agregar({ nombre, peso, nota });
    }, true);
  });

  // Eliminar una evaluación
  this.#vista.alEliminar((id) => {
    this.#ejecutar(() => {
      this.#modelo.eliminar(id);
    });
  });

  // Calificar una evaluación
  this.#vista.alCalificar((id, textoNota) => {
    const nota = textoNota.trim() === ''
      ? null
      : Number(textoNota);

    this.#ejecutar(() => {
      this.#modelo.calificar(id, nota);
    });
  });
}

#ejecutar(orden, limpiarFormulario = false) {
  try {
    // Ejecutar la operación solicitada al Modelo
    orden();

    // Si todo salió bien, limpiar el error
    this.#vista.limpiarError();

    // Limpiar el formulario únicamente al agregar
    if (limpiarFormulario) {
      this.#vista.limpiarFormulario();
    }

  } catch (error) {
    if (error instanceof ErrorDeReglas) {
      // Mostrar el mensaje de validación
      this.#vista.mostrarError(error.message);

      // Restaurar los datos visibles desde el Modelo
      this.#vista.render();
    } else {
      // No ocultar errores inesperados
      throw error;
    }
  }
}


  // TODO 4B: un método privado que ejecute una orden al Modelo y, si lanza un ErrorDeReglas, le pida a la Vista
  //          que muestre el mensaje (y que se redibuje, para deshacer lo que el usuario escribió y el Modelo no aceptó).
  //          Los errores que NO sean de reglas no se esconden: se vuelven a lanzar.
  //          Si todo sale bien: limpia el error. Para "agregar", además limpia el formulario.
}
