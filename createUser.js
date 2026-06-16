require('dotenv').config();

const { initializeFirebase, getAuth } = require('./src/config/firebase');

initializeFirebase();

async function createUser() {
  try {
    const user = await getAuth().createUser({
      email: 'profesor@santacruz.edu',
      password: '12345678',
      displayName: 'Profesor Principal'
    });

    console.log('✅ Usuario creado');
    console.log('UID:', user.uid);
  } catch (error) {
    console.error(error);
  }
}

createUser();