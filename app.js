// 🔥 Configuración de Firebase (copiada desde tu consola)
const firebaseConfig = {
  apiKey: "AIzaSyCEqtQ-gd0KjSqrT6IAofqoB4aYX_yTUp4",
  authDomain: "apuestapartido-5e41a.firebaseapp.com",
  databaseURL: "https://apuestapartido-5e41a-default-rtdb.firebaseio.com",
  projectId: "apuestapartido-5e41a",
  storageBucket: "apuestapartido-5e41a.firebasestorage.app",
  messagingSenderId: "188012180116",
  appId: "1:188012180116:web:8d51916ad67a025c993a81",
  measurementId: "G-RKZK0CKFP2"
};

// Inicializar Firebase (modo compatibilidad - ideal para sitios estáticos)
firebase.initializeApp(firebaseConfig);

// Obtener referencia a la base de datos
const database = firebase.database();
const predictionsRef = database.ref('predictions');

// Formulario
const form = document.getElementById('predictionForm');
const tolScore = document.getElementById('tolima-score');
const junScore = document.getElementById('junior-score');
const container = document.getElementById('predictions-container');

// Enviar predicción
form.addEventListener('submit', async (e) => {
  e.preventDefault();

const tol = parseInt(tolScore.value);
const jun = parseInt(junScore.value);
const userName = document.getElementById('user-name').value.trim();

if (isNaN(tol) || isNaN(jun) || tol < 0 || jun < 0) {
  alert('Por favor ingresa un marcador válido.');
  return;
}

if (!userName) {
  alert('Por favor ingresa tu nombre.');
  return;
}

const prediction = {
  tol,
  jun,
  name: userName, // 👈 Guardamos el nombre
  timestamp: firebase.database.ServerValue.TIMESTAMP
};
  try {
    await predictionsRef.push(prediction);
    tolScore.value = '';
    junScore.value = '';
    tolScore.focus();
  } catch (err) {
    console.error('Error al guardar:', err);
    alert('Hubo un error. Intenta de nuevo.');
  }
});

// Escuchar predicciones en tiempo real
predictionsRef.on('value', (snapshot) => {
  const data = snapshot.val();
  container.innerHTML = '';

  if (!data) {
    container.innerHTML = '<p class="loading">Aún no hay predicciones 🤔</p>';
    return;
  }

  const predictions = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);

  predictions.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'prediction-item';
    const time = new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    div.innerHTML = `
  <span style="font-weight: bold; color: #ffd700;">${p.name}:</span>
  <span class="score">
    <span style="color:#e53935">${p.tol}</span> – <span style="color:#e63946">${p.jun}</span>
  </span>
  <small>${time}</small>
`;
    container.appendChild(div);
  });
});