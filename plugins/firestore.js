import firebase from "firebase";
import 'firebase/firestore';

if(!firebase.apps.length){
  const firebaseConfig = {
    apiKey: "AIzaSyBz0us1giAY4bYLK2f6K-Nrf9J611w0qlo",
    authDomain: "nuxt-news-8a468.firebaseapp.com",
    databaseURL: "https://nuxt-news-8a468.firebaseio.com",
    projectId: "nuxt-news-8a468",
    storageBucket: "nuxt-news-8a468.appspot.com",
    messagingSenderId: "366978635196",
    appId: "1:366978635196:web:dce2aa7e93fce77a"
  };
  firebase.initializeApp(firebaseConfig);
  firebase.firestore().settings({
    timestampsInSnapshots: true
  })
}

const db = firebase.firestore();

export default db;
