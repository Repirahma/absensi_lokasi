const kampusLat = -6.2257438;
const kampusLng = 106.6171867;
const radiusMaks = 7; // Radius maksimal diubah menjadi 7 meter

document.getElementById("absenForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const nama = document.getElementById("nama").value;
  const nim = document.getElementById("nim").value;
  const kelas = document.getElementById("kelas").value;

  if (!navigator.geolocation) {
    alert("Geolocation tidak didukung.");
    return;
  }

  navigator.geolocation.getCurrentPosition(function (pos) {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const jarak = hitungJarak(lat, lng, kampusLat, kampusLng);

    if (jarak <= radiusMaks) {
      const waktu = new Date().toLocaleString();
      const data = { nama, nim, kelas, waktu, lokasi: `Lat: ${lat}, Lng: ${lng}` };
      simpanLocal(data);
      tampilkanData();
      document.getElementById("status").innerText = "✅ Absensi berhasil";
    } else {
      document.getElementById("status").innerText = `❌ Di luar area kampus (${jarak.toFixed(1)} m)`;
    }
  }, () => alert("Gagal mendapatkan lokasi"));
});

function hitungJarak(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function simpanLocal(data) {
  const semua = JSON.parse(localStorage.getItem("absensi")) || [];
  semua.push(data);
  localStorage.setItem("absensi", JSON.stringify(semua));
}

function tampilkanData() {
  const data = JSON.parse(localStorage.getItem("absensi")) || [];
  const list = document.getElementById("absenList");
  list.innerHTML = "";
  data.forEach(d => {
    const li = document.createElement("li");
    li.textContent = `${d.waktu} - ${d.nama} (${d.nim}, ${d.kelas}) @ ${d.lokasi}`;
    list.appendChild(li);
  });
}

tampilkanData();
