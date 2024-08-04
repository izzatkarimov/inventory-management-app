import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCEejZreI-ol-4orB--HfOReW5T_omVU8E",
  authDomain: "inventory-management-app-4a20d.firebaseapp.com",
  projectId: "inventory-management-app-4a20d",
  storageBucket: "inventory-management-app-4a20d.appspot.com",
  messagingSenderId: "290875032080",
  appId: "1:290875032080:web:f2d61bde5909ad43104095",
  measurementId: "G-HG7H9FDZVM"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
