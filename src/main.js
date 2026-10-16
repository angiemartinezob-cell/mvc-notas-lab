
// RAÍZ DE COMPOSICIÓN: aquí se conectan las piezas MVC.


import { NotasModelo } from './modelo.js';
import { NotasVista } from './vista.js';
import { NotasControlador } from './controlador.js';
import { AlmacenSesion } from './almacen.js';
import { TermometroVista } from './termometro-vista.js';

// 1. Crear el Modelo utilizando almacenamiento de sesión
const modelo = new NotasModelo(new AlmacenSesion('notas.v1'));

// 2. Crear la Vista principal
const vista = new NotasVista(document.getElementById('app'), modelo);

// 3. Conectar el Controlador
new NotasControlador(modelo, vista);

// 4. Crear la segunda Vista: termómetro de aprobación
new TermometroVista(document.getElementById('termometro'), modelo);

