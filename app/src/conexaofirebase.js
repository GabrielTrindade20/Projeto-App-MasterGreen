// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCkfd9YNytniQkOgXW-WoLhoioli0Jipvo",
  authDomain: "appmastergreen.firebaseapp.com",
  projectId: "appmastergreen",
  storageBucket: "appmastergreen.appspot.com",
  messagingSenderId: "320660252639",
  appId: "1:320660252639:web:495e871b710000edfb066a",
  measurementId: "G-Y8DQWENEYF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);