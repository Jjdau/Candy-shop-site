// firebase-init.js
const firebaseConfig = {
  apiKey: "AIzaSyC40unSYPU3AdjWZINHFll_dHbOt9AWe68",
  authDomain: "the-candy-shop-fad88.firebaseapp.com",
  projectId: "the-candy-shop-fad88",
  storageBucket: "the-candy-shop-fad88.firebasestorage.app",
  messagingSenderId: "148707806077",
  appId: "1:148707806077:web:5fc31376b975b762ce1a14",
  measurementId: "G-NW4467SCWT"
};
try {
  firebase.initializeApp(firebaseConfig);
  window.firebase = firebase;
  console.log("Firebase initialized successfully");
  console.log("Firestore available:", !!window.firebase.firestore);
  console.log("Storage available:", !!window.firebase.storage);
} catch (error) {
  console.error("Firebase initialization failed:", error);
  document.getElementById("fallback").innerHTML = `
    <h2>Error: Firebase Failed to Load</h2>
    <p>${error.message}</p>
    <p>Please check the console for details and contact support.</p>
  `;
  document.getElementById("fallback").style.display = "block";
}