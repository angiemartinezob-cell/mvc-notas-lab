# Entrega · Laboratorio MVC · Notas del semestre

**Equipo:** __4__ 
**Integrantes:** __Angie Sofia Martinez Obando y David Sanchez__  
**Repositorio:** (https://github.com/angiemartinezob-cell/mvc-notas-lab)

> Completa este archivo a medida que avanzas (cada sección dice en qué parte de la guía se llena).
> Escribe con tus palabras: las respuestas copiadas de la guía o de otro equipo no cuentan.

---

## 1. Mapa de responsabilidades (Parte 1)

Clasifica cada fragmento de `espagueti.html`: **M** (Modelo), **V** (Vista), **C** (Controlador) o **Mezcla**
(en ese caso, escribe qué roles se mezclan). En "¿Por qué?" justifica en una frase.


| # | Fragmento | Rol(es) | ¿Por qué? |
|---|---|---|---|
| 1 | `var n = document.getElementById('nombre').value.trim();` | V | Lee el nombre escrito por el usuario en el formulario. |
| 2 | Validación del peso entre 1 y 100 | Mezcla (M y V) | Valida el peso y muestra el mensaje de error en pantalla. |
| 3 | Validación de la suma de pesos | Mezcla (M y V) | Comprueba que no supere el 100 % y muestra el error. |
| 4 | `evals.push(...)` | M | Agrega una nueva evaluación a los datos. |
| 5 | `localStorage.setItem(...)` | M (Almacén) | Guarda las evaluaciones; en MVC se separó en almacen.js. |
| 6 | `document.getElementById('nombre').value = '';` | V | Limpia el campo del nombre en el formulario. |
| 7 | `input` con `onchange` | Mezcla (V y C) | Crea el campo de nota y conecta directamente un evento. |
| 8 | `Math.ceil(...)` | M | Redondea hacia arriba la nota necesaria para aprobar. |
| 9 | Condición de aprobado | Mezcla (M y V) | Decide si aprobó y define el mensaje y la clase visual. |
| 10 | `document.getElementById('tabla').innerHTML = filas;` | V | Actualiza la tabla que aparece en pantalla. |
| 11 | `function borrar(id)` | Mezcla (M, V y C) | Elimina datos, los guarda y actualiza la pantalla. |
| 12 | `(e.peso * e.nota / 100).toFixed(2)` | Mezcla (M y V) | Calcula el aporte y lo presenta con dos decimales. |


## 2. Olores del espagueti (Parte 1)

Lista **al menos 5** problemas de diseño de `espagueti.html`. Para cada uno, escribe qué consecuencia tiene
cuando el proyecto crece y en qué pieza de MVC viviría la solución.


| Olor | Consecuencia | Dónde se arregla (M, V o C) |
|---|---|---|
| Responsabilidades mezcladas | Las funciones hacen varias tareas al mismo tiempo, por lo que cualquier cambio puede afectar otras partes de la aplicación. | M, V y C: cada uno se encarga de su responsabilidad. |
| Validaciones dentro de la interfaz | Si cambian las reglas de las notas o los porcentajes, hay que buscar dónde están mezcladas con el código de pantalla. | M: las validaciones se centralizan en modelo.js. |
| Función pintar() con demasiadas tareas | Calcula las notas, decide el estado y actualiza la pantalla, lo que dificulta entenderla y mantenerla. | M para los cálculos y V para mostrar los resultados. |
| Almacenamiento mezclado con las acciones | Cambiar localStorage por otro tipo de almacenamiento obliga a modificar las funciones que gestionan las evaluaciones. | M con apoyo de almacen.js. |
| Eventos escritos directamente en el HTML | La interfaz queda muy relacionada con las funciones de JavaScript y es más difícil modificarla. | V para escuchar eventos y C para coordinar las acciones. |


## 3. El flujo de «agregar una evaluación» (Parte 6)

Dibuja (a mano y pega una foto, o con texto/Mermaid) el recorrido completo desde que el usuario presiona
**Agregar** hasta que ve la fila nueva en la tabla. Marca en cada paso **el archivo y el método** que actúa.

```text

1. Usuario
   Presiona el botón "Agregar".
          |
          v
2. vista.js → alAgregar()
   Detecta el envío del formulario.
          |
          v
3. vista.js → leerFormulario()
   Obtiene el nombre, peso y nota como texto.
          |
          v
4. controlador.js → constructor()
   Recibe los datos y convierte peso y nota.
          |
          v
5. controlador.js → #ejecutar()
   Solicita al Modelo agregar la evaluación.
          |
          v
6. modelo.js → agregar()
   Valida los datos y registra la evaluación.
          |
          v
7. modelo.js → #cambio()
   Guarda los datos y avisa a los suscriptores.
          |
          v
8. almacen.js → guardar()
   Conserva las evaluaciones en sessionStorage.
          |
          v
9. vista.js → render()
   Actualiza la tabla y el resumen académico.
          |
          v
10. termometro-vista.js → render()
    Actualiza la barra de aprobación.
          |
          v
11. Usuario
    Ve la nueva evaluación y el termómetro actualizado.

```

## 4. Evidencias (Partes 2, 3, 4 y 6)

**Salida de `npm test`** (pega el final, donde dice cuántas pruebas pasan):

```text
npm test               

> mvc-notas-lab@1.0.0 test
> node pruebas/ejecutar.mjs


MODELO
  ✓ A · Agregar y validar ......................... 11/11
  ✓ B · Calificar y eliminar ...................... 7/7
  ✓ C · Resumen ................................... 10/10
  ✓ D · Observador y persistencia ................. 8/8
  ✓ E · Parte 5A · Nombres únicos ................. 3/3

ARQUITECTURA
  ✓ Modelo puro ................................... 4/4
  ✓ Vista pasiva .................................. 5/5
  ✓ Controlador delgado ........................... 6/6

✓ 54 de 54 pruebas pasan.
```

**Salida de `npm run arquitectura`:**

```text
npm run arquitectura

> mvc-notas-lab@1.0.0 arquitectura
> node pruebas/ejecutar.mjs arquitectura


ARQUITECTURA
  ✓ Modelo puro ................................... 4/4
  ✓ Vista pasiva .................................. 5/5
  ✓ Controlador delgado ........................... 6/6

✓ 15 de 15 pruebas pasan.
```

**Captura de pantalla** de la aplicación con la tabla, el resumen y el termómetro de aprobación:

![Aplicación MVC funcionando](evidencias/app-mvc.png)


## 5. Tres cambios, tres lugares (Parte 5)

Después de cada cambio ejecuta `git diff --stat HEAD~1` (o `git show --stat`) y pega el resultado.
La idea: **cada cambio debía tocar solo las piezas que le corresponden**.


| Cambio | Archivos que tocaste | ¿Era lo esperado? ¿Por qué? |
|---|---|---|
| 5A · Nombres únicos | `src/modelo.js` | Sí, porque la verificación de nombres repetidos debía hacerse en el Modelo, que es donde manejamos las reglas de las evaluaciones. |
| 5B · Segunda vista (termómetro) | `src/termometro-vista.js`, `src/main.js` | Sí, porque creamos una nueva Vista para mostrar el progreso académico y la conectamos al Modelo desde `main.js`, sin modificar las reglas de negocio. |
| 5C · Otro almacén | `src/almacen.js`, `src/main.js` | Sí, porque agregamos `AlmacenSesion` para guardar los datos en `sessionStorage` y cambiamos su configuración en `main.js`, sin modificar la lógica del Modelo. |

### Evidencia de Git

Para verificar los archivos modificados en cada cambio, utilizamos el comando `git --no-pager show --stat` con el identificador del commit correspondiente.

**Parte 5A · Validación de nombres únicos**

Comando: `git --no-pager show --stat 7dbb58a`

```text
src/modelo.js | 186
1 file changed, 165 insertions(+), 21 deletions(-)
```

La validación de nombres únicos se incluyó en el mismo commit donde implementamos las funcionalidades principales del Modelo. Los cambios se realizaron en `modelo.js`, porque las validaciones corresponden a las reglas de negocio de la aplicación.

**Parte 5B · Segunda vista del termómetro**

Comando: `git --no-pager show --stat 83aab50`

```text
src/termometro-vista.js | 51
1 file changed, 51 insertions(+)
```

Creamos una vista independiente para mostrar el progreso académico mediante un termómetro. Esto permitió incorporar otra representación de la información sin modificar las reglas de negocio del Modelo.

**Parte 5C · Almacenamiento de sesión**

Comando: `git --no-pager show --stat b60a010`

```text
src/almacen.js | 24
src/main.js   | 21
2 files changed, 36 insertions(+), 9 deletions(-)
```

Implementamos `AlmacenSesion` utilizando `sessionStorage` y configuramos su uso desde `main.js`. Así pudimos cambiar el mecanismo de almacenamiento sin modificar el funcionamiento interno del Modelo.


## 6. Reflexión (Parte 6)

1. En la versión espagueti, ¿qué tuviste que leer o tocar para entender dónde se decide si el estudiante aprobó? ¿Y en la versión MVC?
En la versión espagueti tenía que revisar una función que mezclaba cálculos, condiciones y cambios en la pantalla. En MVC es más sencillo porque el Modelo se encarga de calcular y determinar el estado académico, mientras que la Vista muestra el resultado.
2. ¿Por qué el Modelo **no** debe llamar a `alert()` ni a `document`? ¿Qué pasaría con las pruebas del Modelo si lo hiciera?
Porque el Modelo debe encargarse únicamente de los datos y las reglas del sistema, sin depender de la interfaz. Si utilizara alert() o document, sería más difícil probarlo de forma independiente y reutilizarlo en otra aplicación.
3. El Modelo avisa de sus cambios sin saber quién escucha (Observer). ¿Qué ganamos con eso frente a que el Modelo llame directamente a `vista.render()`?
Con Observer logramos que el Modelo avise cuando algo cambia, sin tener que saber qué vistas están conectadas. Esto nos sirvió cuando agregamos el termómetro, porque pudimos actualizarlo sin cambiar el funcionamiento del Modelo.
4. Elige un olor de MVC (controlador gordo, lógica en la Vista, Modelo que toca la pantalla, Modelo anémico) que te hubiera sido fácil cometer hoy. ¿Cuál y cómo lo evitaron?
Uno de los errores más fáciles de cometer era colocar las validaciones dentro de la Vista, porque allí se reciben los datos del formulario. Lo evitamos dejando las reglas de negocio en el Modelo y utilizando el Controlador para coordinar las acciones del usuario.
5. ¿Para qué tipo de aplicación **no** usarías MVC? Justifica con lo que viste en el laboratorio.
No lo utilizaría necesariamente en una página estática muy sencilla, que solo muestre información y no tenga reglas de negocio ni interacciones importantes. En ese caso, separar todo en Modelo, Vista y Controlador podría agregar una complejidad que no se necesita.