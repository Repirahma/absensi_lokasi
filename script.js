// Koordinat Universitas Cendekia Abditama
const kampusLat = -7.3302;
const kampusLng = 112.7897;
const maxJarakMeter = 200;

document.getElementById("absenForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const nama = document.getElementById("nama").value;
  const nim = document.getElementById("nim").value;
  const kelas = document.getElementById("kelas").value;

  if (!navigator.geolocation) {
    alert("Geolocation tidak didukung di browser ini.");
    return;
  }

  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const jarak = hitungJarak(lat, lng, kampusLat, kampusLng);

    if (jarak <= maxJarakMeter) {
      const waktu = new Date().toLocaleString();
      const data = { nama, nim, kelas, waktu, lat, lng };
      simpanAbsensi(data);
      tampilkanStatus("✅ Absensi berhasil!");
    } else {
      tampilkanStatus("❌ Kamu berada di luar lokasi kampus!", true);
    }
  }, () => {
    alert("Gagal mendapatkan lokasi.");
  });
});

function tampilkanStatus(pesan, error = false) {
  const statusDiv = document.getElementById("status");
  statusDiv.textContent = pesan;
  statusDiv.style.color = error ? "red" : "green";
}

function simpanAbsensi(data) {
  let absensi = JSON.parse(localStorage.getItem("absensi")) || [];
  absensi.push(data);
  localStorage.setItem("absensi", JSON.stringify(absensi));
  tampilkanRiwayat();
}

function tampilkanRiwayat() {
  const list = document.getElementById("riwayatAbsensi");
  list.innerHTML = "";
  const absensi = JSON.parse(localStorage.getItem("absensi")) || [];
  absensi.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.waktu} - ${item.nama} (${item.nim}, ${item.kelas})`;
    list.appendChild(li);
  });
}

// Hitung jarak menggunakan rumus Haversine
function hitungJarak(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Radius bumi dalam meter
  const toRad = deg => deg * Math.PI / 180;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Tampilkan riwayat saat halaman dimuat
tampilkanRiwayat();

// Register Service Worker (jika ada)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log("Service Worker registered"))
    .catch(err => console.error("SW registration failed:", err));
}
