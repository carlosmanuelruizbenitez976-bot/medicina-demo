(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const installed = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  let registration, downloading = false, reloadForUpdate = false, ready = false;
  const dialog = $('device-dialog');
  function status(text, complete = false) {
    $('device-status').textContent = text;
    $('device-status').dataset.ready = String(complete);
    $('download-status').textContent = text;
    ready = complete;
  }
  function showDevice() { dialog.showModal(); refresh(); }
  $('device-open').onclick = showDevice;
  $('device-close').onclick = () => dialog.close();
  $('device-open').textContent = installed() ? 'Mi dispositivo' : 'Instalar app';
  $('install-help').hidden = installed();
  async function refresh() {
    if (registration?.active) registration.active.postMessage({type:'STATUS'});
    try {
      const persisted = await navigator.storage?.persisted?.();
      $('storage-status').textContent = persisted
        ? 'El navegador concedió almacenamiento persistente. Conserva también una copia de tu progreso.'
        : 'El progreso se guarda en este dispositivo. Guarda una copia antes de borrar datos del navegador o cambiar de teléfono.';
    } catch (_) {}
  }
  function watch(worker) {
    if (!worker) return;
    downloading = true;
    $('retry-download').disabled = true;
    const changed = () => {
      if (worker.state === 'installed') {
        downloading = false;
        $('retry-download').disabled = false;
        if (registration.waiting) {
          $('apply-update').hidden = false;
          $('download-status').textContent = 'Hay una actualización descargada. Guarda lo que estés haciendo antes de abrirla.';
        } else refresh();
      }
      if (worker.state === 'activated') refresh();
      if (worker.state === 'redundant') {
        downloading = false;
        $('retry-download').disabled = false;
        status('Descarga pendiente · reintentar');
        $('download-status').textContent = 'No se completó la descarga. Conéctate a internet y pulsa Reintentar.';
      }
    };
    worker.addEventListener('statechange', changed);
    changed();
  }
  async function register() {
    if (!('serviceWorker' in navigator) || !window.isSecureContext) {
      status('Abre el enlace seguro en Safari');
      return;
    }
    try {
      if (!ready) status('Preparando uso sin conexión…');
      registration = await navigator.serviceWorker.register('sw.js', {scope:'./', updateViaCache:'none'});
      registration.addEventListener('updatefound', () => watch(registration.installing));
      if (registration.installing) watch(registration.installing);
      if (registration.waiting) $('apply-update').hidden = false;
      await refresh();
    } catch (_) {
      status('Descarga pendiente · reintentar');
      $('retry-download').disabled = false;
    }
  }
  navigator.serviceWorker?.addEventListener('message', event => {
    const data = event.data || {};
    if (data.type === 'PROGRESS') {
      $('download-progress').hidden = false;
      $('download-progress').max = data.total;
      $('download-progress').value = data.done;
      if (!ready) status('Descargando para usar sin conexión…');
      $('download-status').textContent = 'Guardando archivos: ' + data.done + ' de ' + data.total + '. Mantén la app abierta.';
    }
    if (data.type === 'STATUS') {
      if (downloading && !data.ready) return;
      downloading = false;
      $('retry-download').disabled = false;
      $('download-progress').hidden = true;
      status(data.ready ? (navigator.onLine ? 'Lista para usar sin conexión' : 'Sin conexión · lista para estudiar') : 'Descarga incompleta · reintentar', data.ready);
      $('retry-download').textContent = data.ready ? 'Buscar actualización' : 'Reintentar descarga';
    }
    if (data.type === 'ERROR') {
      downloading = false;
      $('retry-download').disabled = false;
      status('Descarga pendiente · reintentar');
    }
  });
  navigator.serviceWorker?.addEventListener('controllerchange', () => {
    if (reloadForUpdate) location.reload();
    else refresh();
  });
  $('retry-download').onclick = async () => {
    if (downloading) return;
    await register();
    if (!ready && registration?.active && !registration.installing) {
      downloading = true;
      $('retry-download').disabled = true;
      registration.active.postMessage({type:'REPAIR'});
    }
    try { await registration?.update(); } catch (_) { $('download-status').textContent = 'Para descargar o actualizar necesitas internet.'; }
  };
  $('apply-update').onclick = () => {
    if (!registration?.waiting) return;
    reloadForUpdate = true;
    registration.waiting.postMessage({type:'ACTIVATE'});
  };
  $('keep-storage').onclick = async () => {
    try {
      const granted = await navigator.storage?.persist?.();
      await refresh();
      if (!granted) $('storage-status').textContent = 'El navegador administra este permiso. Añade Medicina a la pantalla de inicio y guarda una copia de tu progreso.';
    } catch (_) { $('storage-status').textContent = 'No se pudo solicitar almacenamiento persistente. Puedes guardar una copia.'; }
  };
  function preferences() {
    const data = {};
    for (const key of Object.keys(localStorage)) if (key.startsWith('flutter.')) data[key] = localStorage.getItem(key);
    return data;
  }
  $('export-backup').onclick = () => {
    try {
      const backup = {app:'medicina-mi-estudio',version:1,created:new Date().toISOString(),preferences:preferences()};
      const url = URL.createObjectURL(new Blob([JSON.stringify(backup,null,2)],{type:'application/json'}));
      const link = document.createElement('a');
      link.href = url; link.download = 'Medicina-progreso-' + new Date().toISOString().slice(0,10) + '.json';
      document.body.append(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url),60000);
      $('backup-message').textContent = 'Copia preparada. Guárdala en Archivos; contiene tus tareas, notas y progreso de esta versión web.';
    } catch (_) { $('backup-message').textContent = 'No se pudo crear la copia. Comprueba que el navegador permite guardar datos.'; }
  };
  $('backup-file').onchange = async event => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      if (file.size > 5000000) throw Error('La copia es demasiado grande.');
      const backup = JSON.parse(await file.text());
      if (backup.app !== 'medicina-mi-estudio' || backup.version !== 1 || !backup.preferences || Array.isArray(backup.preferences) || typeof backup.preferences !== 'object') throw Error('Este archivo no es una copia de Medicina.');
      const entries = Object.entries(backup.preferences);
      for (const [key,value] of entries) {
        if (!key.startsWith('flutter.') || key.length > 300 || typeof value !== 'string') throw Error('La copia contiene datos no válidos.');
        const decoded = JSON.parse(value);
        if (!(typeof decoded === 'string' || typeof decoded === 'boolean' || typeof decoded === 'number' || (Array.isArray(decoded) && decoded.every(v => typeof v === 'string')))) throw Error('La copia contiene valores no válidos.');
      }
      if (!entries.length) throw Error('Esta copia no contiene progreso para recuperar.');
      if (!confirm('Se reemplazará el progreso web de este dispositivo por el de la copia. ¿Continuar?')) return;
      const before = preferences();
      try {
        Object.keys(before).forEach(key => localStorage.removeItem(key));
        entries.forEach(([key,value]) => localStorage.setItem(key,value));
      } catch (error) {
        Object.keys(preferences()).forEach(key => localStorage.removeItem(key));
        Object.entries(before).forEach(([key,value]) => localStorage.setItem(key,value));
        throw error;
      }
      location.reload();
    } catch (error) { $('backup-message').textContent = error.message || 'No se pudo recuperar la copia.'; }
    finally { event.target.value = ''; }
  };
  addEventListener('online',refresh); addEventListener('offline',refresh);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
  register();
})();
