// Animate wallet balances
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
  import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
  import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "AIzaSyBt_ygYw6AgCcOlQYcMAn3rw6Q325IRyy4",
    authDomain: "quizania-b8292.firebaseapp.com",
    projectId: "quizania-b8292",
    storageBucket: "quizania-b8292.appspot.com",
    messagingSenderId: "94747680142",
    appId: "1:94747680142:web:520ef8559cfe766f0c58df",
    measurementId: "G-YM2LZBJNCY"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  const cloudName = "dkzjcmkha";
  const unsignedUploadPreset = "Profile photo";

  const profilePhotoInput = document.getElementById("profilePhoto");
  const uploadBtn = document.getElementById("uploadBtn");
  const uploadStatus = document.getElementById("uploadStatus");
  const profilePreview = document.getElementById("profilePreview");
  const matchHistoryEl = document.getElementById("match-history");
  const adminPanel = document.getElementById("admin-panel");

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const uid = user.uid;
      const docRef = doc(db, "users", uid);
      let docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        const defaultData = {
          name: user.email,
          rechargeWallet: 0,
          winningWallet: 0,
          profilePhoto: "",
          isAdmin: false,
          matchHistory: []
        };
        await setDoc(docRef, defaultData);
        docSnap = await getDoc(docRef);
      }

      const data = docSnap.data();
      document.getElementById("user-name").innerText = Welcome, ${data.name};
      document.getElementById("recharge-wallet").innerText = data.rechargeWallet || 0;
      document.getElementById("winning-wallet").innerText = data.winningWallet || 0;

      if (data.profilePhoto) {
        profilePreview.src = data.profilePhoto;
        profilePreview.style.display = "block";
      }

      if (data.isAdmin) {
        adminPanel.classList.remove("hidden");
      }

      if (Array.isArray(data.matchHistory)) {
        data.matchHistory.forEach(match => {
          const entry = document.createElement("div");
          entry.className = "p-2 rounded bg-gray-100 dark:bg-gray-700";
          entry.innerText = ${match.type} | ${match.result} | ₹${match.earned} | ${match.date};
          matchHistoryEl.appendChild(entry);
        });
      }
    } else {
      window.location.href = "login.html";
    }
  });

  uploadBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const file = profilePhotoInput.files[0];
    if (!file) return alert("Please select an image first.");

    uploadStatus.textContent = "Uploading...";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", unsignedUploadPreset);

    try {
      const response = await fetch(https://api.cloudinary.com/v1_1/${cloudName}/upload, {
        method: "POST",
        body: formData
      });
      const data = await response.json();

      if (data.secure_url) {
        const user = auth.currentUser;
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, { profilePhoto: data.secure_url }, { merge: true });
        profilePreview.src = data.secure_url;
        uploadStatus.textContent = "Upload successful!";
      } else {
        uploadStatus.textContent = "Upload failed.";
      }
    } catch (err) {
      console.error(err);
      uploadStatus.textContent = "Upload error.";
    }
  });


function animateWallet(id, endValue) {
  const el = document.getElementById(id);
  let current = 0;
  const duration = 1000;
  const steps = 60;
  const increment = endValue / steps;
  const interval = duration / steps;

  const animate = setInterval(() => {
    current += increment;
    if (current >= endValue) {
      current = endValue;
      clearInterval(animate);
    }
    el.textContent = `₹${Math.floor(current)}`;
  }, interval);
}
window.recharge = function () {
    alert("Recharge coming soon!");
  }

  window.withdraw = function () {
    alert("Withdraw coming soon!");
  }
// Example wallet values (replace with real data from Firebase)
animateWallet("rechargeAmount", 350);
animateWallet("winningAmount", 820);

// Toggle dark/light theme
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

// Load saved theme
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  }

  // Animate match history
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";

  const matches = [
    { type: "Battle", result: "Win", earned: 40, date: "2025-06-05" },
    { type: "Battle", result: "Lose", earned: 0, date: "2025-06-04" },
    { type: "Battle", result: "Win", earned: 60, date: "2025-06-03" },
  ];

  matches.forEach((match, i) => {
    setTimeout(() => {
      const li = document.createElement("li");
      li.className = "history-entry";
      li.textContent = `${match.type} | ${match.result} | ₹${match.earned} | ${match.date}`;
      historyList.appendChild(li);
    }, i * 300);
  });
});

// Sidebar toggle (for mobile)
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
}
  window.logout = function () {
    signOut(auth).then(() => window.location.href = 'login.html');
  }
// Profile photo upload
function uploadProfile(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("profileImage").src = e.target.result;
      // TODO: Upload to Firebase/Cloudinary if needed
    };
    reader.readAsDataURL(file);
  }
}
