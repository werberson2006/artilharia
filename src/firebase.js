// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // precisa importar o getDatabase

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcwNdTr5-rc7yjF-sMOvVJIlte6Ymm0JM",
  authDomain: "pelada-artilharia.firebaseapp.com",
  databaseURL: "https://pelada-artilharia-default-rtdb.firebaseio.com",
  projectId: "pelada-artilharia",
  storageBucket: "pelada-artilharia.firebasestorage.app",
  messagingSenderId: "630450451003",
  appId: "1:630450451003:web:b8d289125835ea58c9e21e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Realtime Database
const database = getDatabase(app);

// Exporta o database como default
export default database;
