# Domótica — Flujo de Información y Automatización Residencial

> **Trabajo Práctico Final**  
> **Carrera:** Tecnicatura Superior en Desarrollo de Software  
> **Espacio Curricular:** Tecnología de la Información  
> **Institución:** Escuela Superior de Comercio N° 49 "Cap. Justo José de Urquiza" (Rosario, Santa Fe)  
> **Docente:** Prof. Claudia Gómez  
> **Alumnos:** Alejandro Saenz, Fabricio Grottasanta, Gianni Yppolity, Donato Balbi  
> **Fecha de Entrega:** 19 de Octubre de 2026  

---

## 📖 Descripción del Proyecto
Presentación interactiva y soporte visual de alta gama desarrollado para la exposición oral del trabajo de **Domótica**. 

La aplicación utiliza la técnica de **Scrollytelling sobre Canvas (HTML5)** sincronizando 100 fotogramas Full HD extraídos de un video renderizado de una sala inteligente. A medida que el orador o la audiencia se desplaza por la página, el ambiente transiciona naturalmente desde el día, pasando por el atardecer, hasta llegar al modo noche con iluminación ambiental automatizada.

---

## 🏛️ Estructura del Contenido Académico

1. **01 // ¿Qué es la Domótica?**  
   Definición técnica del conjunto de tecnologías aplicadas al control y la automatización inteligente como un sistema integral de información.

2. **02 // Entrada de Información (Sensores vs Usuarios)**  
   Cómo los sensores de luminosidad (LDR) y presencia (PIR) traducen magnitudes físicas a paquetes digitales, y el rol de las aplicaciones y asistentes de voz.

3. **03 // Canales de Comunicación (Wi-Fi vs Zigbee Malla)**  
   Comparativa de topologías: la saturación de la topología en estrella en Wi-Fi frente a la resiliencia y bajo consumo de las redes malladas Zigbee/Z-Wave con auto-reparación.

4. **04 // Gestión y Almacenamiento (Hub Local Edge vs Cloud)**  
   Diferencias entre el procesamiento local en milisegundos sin dependencia de internet y los servidores de Big Data en la nube.

5. **05 // Ciberseguridad y Privacidad**  
   Mitigación de riesgos: contraseñas por defecto, cámaras expuestas a botnets, cifrado TLS 1.3 y aislamiento perimetral en VLANs.

6. **06 // Conclusión y Reflexión**  
   El verdadero rol del desarrollo de software en la soberanía de los datos, la accesibilidad y la eficiencia energética.

---

## 🚀 Cómo Ejecutar Localmente
Simplemente abre el archivo `index.html` en cualquier navegador web moderno (Google Chrome, Microsoft Edge, Mozilla Firefox o Safari). No requiere servidores ni dependencias externas.

* **Navegación por teclado:** Presiona las teclas `↓` (Flecha Abajo) o `↑` (Flecha Arriba) para desplazarte suavemente entre las etapas durante una exposición oral.

---

## 🛠️ Tecnologías Utilizadas
* **HTML5 Canvas:** Renderizado dinámico de fotogramas a 60 FPS con ajuste responsive cover.
* **Tailwind CSS:** Diseño moderno con efecto de cristal (*glassmorphism*) y modo oscuro de alto contraste.
* **Vanilla JavaScript:** Motor de pre-carga asíncrona, sincronización matemática con el scroll y control de eventos.
* **Lucide Icons:** Iconografía vectorial técnica y minimalista.
