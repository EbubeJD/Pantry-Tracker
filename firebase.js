// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbMjEaxkQpxeMLP5HIypwuhy09rXI3Xlc",
  authDomain: "inventory-management-87349.firebaseapp.com",
  projectId: "inventory-management-87349",
  storageBucket: "inventory-management-87349.appspot.com",
  messagingSenderId: "712165663012",
  appId: "1:712165663012:web:764238002d0c8a28fdd3b1",
  measurementId: "G-7JQE25LVE2"
};

let app;
let db;

if (typeof window !== "undefined") {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);

  
}

export { db };