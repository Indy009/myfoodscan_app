import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBWwXnzBIvFXNWXIpbTkeG_vozpXBpTN80",
  authDomain: "myfoodscan-backend-99cb3.firebaseapp.com",
  projectId: "myfoodscan-backend-99cb3",
  storageBucket: "myfoodscan-backend-99cb3.appspot.com",
  messagingSenderId: "161261244857",
  appId: "1:161261244857:web:ed71d357791c58e9c0a668",
  measurementId: "G-C3H2R2T7YX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { db, app, auth };
