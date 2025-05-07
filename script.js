const UCA_LAT = -6.2281268800691;
const UCA_LNG = 106.61653522160745;
const MAX_DISTANCE = 200; // Radius 200 meter

function distance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Radius bumi dalam meter
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function tampilkanAbsensi() {
    const absensiList = JSON.parse(localStorage.getItem("absensi")) || [];
    const listElement = document.getElementById("absensiList");
    listElement.innerHTML = absensiList.map(absen => 
        `<li>${absen.nama} - ${absen.nim} - ${absen.kelas} - ${absen.tanggal}</li>`
    ).join("");
}

document.getElementById("absenForm").addEventListener("submit", (e) => {
    e.preventDefault();

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const jarak = distance(UCA_LAT, UCA_LNG, lat, lng);

                if (jarak <= MAX_DISTANCE) {
                    const nama = document.getElementById("nama").value;
                    const nim = document.getElementById("nim").value;
                    const kelas = document.getElementById("kelas").value;
                    const tanggal = new Date().toLocaleString();

                    const absensi = { nama, nim, kelas, tanggal };
                    const absensiList = JSON.parse(localStorage.getItem("absensi")) || [];
                    absensiList.push(absensi);
                    localStorage.setItem("absensi", JSON.stringify(absensiList));

                    document.getElementById("message").innerHTML = `<span style="color: green;">✅ Absen berhasil!</span>`;
                    tampilkanAbsensi();
                } else {
                    document.getElementById("message").innerHTML = `<span style="color: red;">❌ Kamu berada di luar lokasi kampus!</span>`;
                }
            },
            (error) => {
                document.getElementById("message").innerHTML = `<span style="color: red;">❌ Gagal mendapatkan lokasi: ${error.message}</span>`;
            }
        );
    } else {
        document.getElementById("message").innerHTML = `<span style="color: red;">❌ Browser tidak mendukung geolocation.</span>`;
    }
});

tampilkanAbsensi();
