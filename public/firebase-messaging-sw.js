// firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/11.8.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.8.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBt_ygYw6AgCcOlQYcMAn3rw6Q325IRyy4",
  authDomain: "quizania-b8292.firebaseapp.com",
  projectId: "quizania-b8292",
  messagingSenderId: "94747680142",
  appId: "1:94747680142:web:520ef8559cfe766f0c58df"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message', payload);

  const { title, body } = payload.notification;
  const notificationOptions = {
    body,
    icon: '/icon.png' // Optional icon path
  };

  self.registration.showNotification(title, notificationOptions);
});
