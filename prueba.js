   const { PrismaClient } = require('@prisma/client');
   const prisma = new PrismaClient();

   async function main() {
     const usuario = await prisma.usuario.create({
       data: {
         email: 'prueba@email.com',
         nombre: 'Usuario de Prueba'
       }
     });
     console.log('Usuario creado:', usuario);
   }

   main()
     .catch(e => console.error(e))
     .finally(() => prisma.$disconnect());