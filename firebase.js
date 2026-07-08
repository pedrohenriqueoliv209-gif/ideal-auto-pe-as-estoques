import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBINAAW4M0q8XIfKDgEBRfe0AJpYV36jWI",
  authDomain: "idealautopecas-37b81.firebaseapp.com",
  projectId: "idealautopecas-37b81",
  storageBucket: "idealautopecas-37b81.firebasestorage.app",
  messagingSenderId: "863110193139",
  appId: "1:863110193139:web:e7365beaecde0151b8fc86"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);