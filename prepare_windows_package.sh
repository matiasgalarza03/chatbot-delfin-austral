#!/bin/bash

# Detener cualquier servidor en ejecución
echo "Deteniendo servidores en ejecución..."
pkill -f "vite" 2>/dev/null || echo "No se encontraron servidores en ejecución"

# Crear carpeta para el paquete
PACKAGE_DIR="NTUC_Learning_Hub_Windows"
echo "Creando directorio para el paquete: $PACKAGE_DIR"
rm -rf "$PACKAGE_DIR"
mkdir -p "$PACKAGE_DIR"

# Construir la aplicación
echo "Construyendo la aplicación..."
npm run build

# Copiar archivos necesarios
echo "Copiando archivos al paquete..."
cp -r dist "$PACKAGE_DIR/"
cp -r public "$PACKAGE_DIR/"

# Crear archivo de inicio para Windows
echo "Creando archivo de inicio para Windows..."
cat > "$PACKAGE_DIR/Iniciar.bat" << 'EOF'
@echo off
title NTUC Learning Hub
echo Iniciando el servidor local...
start http://localhost:5000
serve -s dist -l 5000
pause
EOF

# Crear archivo README con instrucciones
echo "Creando archivo README..."
cat > "$PACKAGE_DIR/LEEME.txt" << 'EOF'
INSTRUCCIONES DE INSTALACIÓN PARA WINDOWS
======================================

1. INSTALAR NODE.JS (si no está instalado)
   - Descargar desde: https://nodejs.org/
   - Ejecutar el instalador y seguir las instrucciones

2. INSTALAR SERVE GLOBALMENTE (abrir CMD como administrador):
   npm install -g serve

3. INICIAR LA APLICACIÓN:
   - Hacer doble clic en "Iniciar.bat"
   - O abrir CMD, navegar a esta carpeta y ejecutar:
     serve -s dist -l 5000

4. ABRIR EL NAVEGADOR:
   - Abrir http://localhost:5000 en tu navegador

Para cerrar la aplicación, simplemente cierra la ventana del CMD.
EOF

# Crear archivo de desinstalación
echo "Creando script de desinstalación..."
cat > "$PACKAGE_DIR/Desinstalar.bat" << 'EOF'
@echo off
echo Desinstalando NTUC Learning Hub...
rmdir /s /q dist
rmdir /s /q public
del Iniciar.bat
del LEEME.txt
del Desinstalar.bat
echo Desinstalación completada.
pause
EOF

# Crear archivo ZIP del paquete
echo "Creando archivo ZIP..."
zip -r "${PACKAGE_DIR}.zip" "$PACKAGE_DIR"

echo "¡Paquete creado exitosamente!"
echo "Archivo generado: ${PACKAGE_DIR}.zip"

# Mostrar instrucciones finales
echo ""
echo "INSTRUCCIONES PARA USAR EL PAQUETE:"
echo "1. Copia el archivo '${PACKAGE_DIR}.zip' a la computadora Windows"
echo "2. Extrae el contenido del ZIP"
echo "3. Sigue las instrucciones en el archivo LEEME.txt"
echo ""
echo "¡Listo! La aplicación está lista para ser usada en Windows."
