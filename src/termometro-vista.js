
import { NOTA_MINIMA, NOTA_MAXIMA } from './modelo.js';

export class TermometroVista {
  constructor(raiz, modelo) {
    this.modelo = modelo;

    // Crear la barra del termómetro
    const barra = document.createElement('div');
    barra.className = 'termometro';

    // Crear el relleno que representa el acumulado
    this.relleno = document.createElement('div');
    this.relleno.className = 'relleno';

    // Crear la línea que indica la nota mínima
    const linea = document.createElement('div');
    linea.className = 'linea';
    linea.style.left = `${(NOTA_MINIMA / NOTA_MAXIMA) * 100}%`;

    // Crear el texto informativo
    this.leyenda = document.createElement('p');
    this.leyenda.className = 'leyenda';

    // Organizar los elementos
    barra.append(this.relleno, linea);
    raiz.append(barra, this.leyenda);

    // Actualizar el termómetro cuando cambie el Modelo
    this.modelo.suscribir(() => this.render());

    // Dibujarlo por primera vez
    this.render();
  }

  render() {
    const resumen = this.modelo.resumen();

    // Calcular cuánto debe llenarse la barra
    const porcentaje = Math.min(
      100,
      (resumen.acumulado / NOTA_MAXIMA) * 100
    );

    this.relleno.style.width = `${porcentaje}%`;

    // Mostrar el acumulado y la nota mínima
    this.leyenda.textContent =
      `${resumen.acumulado.toFixed(2)} de ${NOTA_MAXIMA.toFixed(1)} · la línea marca el mínimo para aprobar (${NOTA_MINIMA.toFixed(1)})`;
  }
}
