# Medicina · versión web sin conexión

Enlace: https://carlosmanuelruizbenitez976-bot.github.io/medicina-demo/

En Safari del iPhone: Compartir → Añadir a pantalla de inicio → Abrir como app web (si aparece). Abre el nuevo icono con internet y espera “Lista para usar sin conexión”. La primera descarga ocupa aproximadamente 33 MB. No requiere modo desarrollador, cable, firma ni AltStore.

Incluye sin conexión el material integrado, guías, cuestionarios, retos, tareas y progreso. Los libros externos, portadas remotas y búsquedas académicas necesitan internet. Esta versión no programa los recordatorios locales de las aplicaciones nativas.

Las preferencias y el progreso permanecen en el almacenamiento local del navegador. El panel Mi dispositivo permite guardar y recuperar una copia JSON, sin enviar esos datos al servidor. No hay sincronización automática con la app nativa ni entre dispositivos. No borres la app anterior si aún necesitas su progreso. El navegador puede eliminar datos si se borran manualmente o según sus políticas de almacenamiento; conserva una copia.

## Mantenimiento

La aplicación Flutter compilada se conserva. La envoltura web incorpora un hostElement y un panel de instalación, descarga y copias. El worker propio precarga los recursos de esta versión y comprueba su integridad SHA-256. Las actualizaciones descargadas esperan que el usuario pulse Aplicar actualización. No se cachean libros ni peticiones a servicios externos.

Los cambios de plantilla se copiaron también a medicina_mobile/web. Tras compilar Flutter con recursos locales, ejecutar:

```
python tool/prepare_offline.py build/web
```

El script genera sw.js a partir de los archivos actuales y offline-worker.template.js. Regenerarlo siempre después de modificar recursos, antes de publicar build/web. No publicar llaves, certificados ni datos de dispositivos.

El funcionamiento en un iPhone físico y la apertura en modo avión quedan pendientes de confirmación en el dispositivo. No se ejecutaron suites de pruebas para esta actualización.
