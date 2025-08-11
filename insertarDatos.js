import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 1. Crear un usuario
  const usuario = await prisma.usuario.create({
    data: {
      email: 'usuario2@email.com',
      nombre: 'Usuario Dos'
    }
  });
  console.log('Usuario creado:', usuario);

  // 2. Crear una conversación para ese usuario
  const conversacion = await prisma.conversacion.create({
    data: {
      usuarioId: usuario.id
    }
  });
  console.log('Conversación creada:', conversacion);

  // 3. Crear mensajes predefinidos del chatbot
  const mensajesBot = [
    {
      contenido: '¡Hola! Soy un delfín austral que vive en las costas de Argentina y Chile. Suelo visitar las hermosas aguas de las Islas Malvinas.',
      esBot: true,
      conversacionId: conversacion.id
    },
    {
      contenido: 'Soy el chatbot del Museo Escolar de la Escuela de Educación Secundaria N°3 Malvinas Argentinas, voy a ayudarte a buscar información.',
      esBot: true,
      conversacionId: conversacion.id
    },
    {
      contenido: 'Pero primero quiero pedirte un favor, ¿podrías elegirme un nombre? ¡GRACIAS!',
      esBot: true,
      conversacionId: conversacion.id
    },
    {
      contenido: 'Una vez que me hayas elegido un nombre, estaré listo para ayudarte con toda la información que necesites sobre nuestro museo y las Malvinas Argentinas.',
      esBot: true,
      conversacionId: conversacion.id
    }
  ];

  // Insertar todos los mensajes
  for (const mensaje of mensajesBot) {
    const mensajeCreado = await prisma.mensaje.create({
      data: mensaje
    });
    console.log('Mensaje creado:', mensajeCreado);
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());