# 🔒 Sistema de Preservación de Ajustes Manuales

## ✅ **CONFIGURACIÓN COMPLETADA**

Se ha implementado un sistema completo para preservar permanentemente los ajustes manuales de sincronización en las secciones especificadas.

## 📋 **Secciones Protegidas**

Los ajustes manuales realizados con las teclas **G** y **H** se preservarán automáticamente en:

1. ✅ **Delfín Austral** - Todas las respuestas
2. ✅ **Escuela Secundaria N° 3 Malvinas Argentinas** - Todas las respuestas  
3. ✅ **Museo Escolar** - Todas las respuestas
4. ✅ **Contexto Geográfico e Histórico de las Islas Malvinas** - Todas las respuestas
5. ✅ **Impacto Social y Cultural de la Guerra en Argentina** - Todas las respuestas
6. ✅ **Legado y Realidad Actual de las Islas Malvinas** - Todas las respuestas

## 🛠️ **Archivos Modificados**

### 1. `src/utils/manualSyncManager.js`
- ✅ Agregadas secciones protegidas
- ✅ Sistema de carga automática de ajustes permanentes
- ✅ Funciones de exportación y preservación
- ✅ Verificación de secciones protegidas

### 2. `src/data/AjustesManualesPermanentes.json`
- ✅ Archivo de configuración para ajustes permanentes
- ✅ Estructura preparada para cada sección protegida

### 3. `src/data/SincronizacionAudio.json`
- ✅ Corregida la sección "Desarrollo y Consecuencias del Conflicto Armado"
- ✅ Bloques de 5 segundos para facilitar ajustes manuales

## 🎯 **Cómo Funciona**

### Preservación Automática
1. **Carga**: Al iniciar, el sistema carga ajustes desde localStorage Y desde el archivo permanente
2. **Prioridad**: localStorage tiene prioridad, pero se preservan ajustes del archivo permanente
3. **Protección**: Las secciones especificadas mantienen sus ajustes automáticamente

### Exportar Ajustes Actuales
1. Abre el archivo `tmp_rovodev_preserve_settings.html` en tu navegador
2. Haz clic en "Ver Ajustes Actuales" para ver lo que tienes guardado
3. Haz clic en "Exportar Ajustes Protegidos" para preparar la preservación
4. Haz clic en "Descargar como JSON" para obtener el archivo actualizado
5. Reemplaza `src/data/AjustesManualesPermanentes.json` con el archivo descargado

## 🔄 **Flujo de Trabajo Recomendado**

### Para Preservar Ajustes Actuales:
```bash
# 1. Abre el navegador y ve a la aplicación
# 2. Realiza tus ajustes manuales con G y H
# 3. Abre tmp_rovodev_preserve_settings.html
# 4. Exporta y descarga los ajustes
# 5. Reemplaza el archivo AjustesManualesPermanentes.json
```

### Para Desarrollo Futuro:
- ✅ Los ajustes se cargan automáticamente al iniciar
- ✅ Las teclas G y H siguen funcionando normalmente
- ✅ Los cambios se guardan en localStorage
- ✅ Las secciones protegidas mantienen sus ajustes

## 🚀 **Beneficios**

1. **Persistencia**: Los ajustes sobreviven a limpiezas de caché/localStorage
2. **Backup**: Archivo JSON como respaldo permanente
3. **Flexibilidad**: Puedes seguir haciendo ajustes manuales
4. **Protección**: Solo las secciones especificadas están protegidas
5. **Compatibilidad**: No afecta el funcionamiento normal del sistema

## ⚠️ **Notas Importantes**

- Los ajustes en localStorage siempre tienen prioridad sobre el archivo permanente
- El archivo permanente actúa como respaldo y configuración inicial
- Las secciones no protegidas siguen funcionando normalmente
- Los ajustes se preservan incluso si se limpia el localStorage

## 🎵 **Uso de las Teclas G y H**

- **G**: Disminuir duración del bloque actual (-0.5 segundos)
- **H**: Aumentar duración del bloque actual (+0.5 segundos)
- **Shift+G**: Disminuir duración global de toda la respuesta
- **Shift+H**: Aumentar duración global de toda la respuesta

Los cambios se aplican inmediatamente y se guardan automáticamente.