import { events } from "./data.js";

const form = document.querySelector("#etkinlik-formu");

if (form) {
  // 1. URL'de ID var mı kontrol et (Güncelleme modu mu?)
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (id) {
    const mevcutEtkinlik = events.find(e => e.id === id);
    if (mevcutEtkinlik) {
      // Sayfa başlığını güncelle
      const baslikEl = document.querySelector(".form-kutusu h2");
      if (baslikEl) baslikEl.textContent = "Etkinliği Güncelle";

      // Form alanlarını mevcut bilgilerle doldur
      document.querySelector("#baslik").value = mevcutEtkinlik.title || "";
      document.querySelector("#kategori").value = mevcutEtkinlik.category || "Seminer";
    

      if (mevcutEtkinlik.date) {
  const parcalar = mevcutEtkinlik.date.split("-");
  if (parcalar[0].length === 2) {
    document.querySelector("#tarih").value = `${parcalar[2]}-${parcalar[1]}-${parcalar[0]}`;
  } else {
    document.querySelector("#tarih").value = mevcutEtkinlik.date;
  }
}
      document.querySelector("#saat").value = mevcutEtkinlik.time || "";
      document.querySelector("#yer").value = mevcutEtkinlik.location || "";
      document.querySelector("#kontenjan").value = mevcutEtkinlik.capacity || "";
      document.querySelector("#aciklama").value = mevcutEtkinlik.description || "";
    }
  }

  // 2. Form gönderildiğinde (Kaydet veya Güncelle)
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const yeniEtkinlik = {
      id: id ? id : "event-" + (events.length + 1),
      title: document.querySelector("#baslik").value.trim(),
      category: document.querySelector("#kategori").value.trim(),
      date: document.querySelector("#tarih").value,
      time: document.querySelector("#saat").value,
      location: document.querySelector("#yer").value.trim(),
      capacity: Number(document.querySelector("#kontenjan")?.value) || 0,
      description: document.querySelector("#aciklama").value.trim()
    };

    if (id) {
      // Güncelleme işlemi
      const index = events.findIndex(e => e.id === id);
      if (index !== -1) {
        events[index] = yeniEtkinlik;
      }
    } else {
      // Yeni ekleme işlemi
      events.push(yeniEtkinlik);
    }

    // Başarı mesajı ve JSON çıktısı
    let jsonKutusu = document.querySelector("#json-ciktisi");
    if (!jsonKutusu) {
      jsonKutusu = document.createElement("div");
      jsonKutusu.id = "json-ciktisi";
      form.after(jsonKutusu);
    }

    jsonKutusu.innerHTML = `
      <div style="margin-top: 20px; padding: 15px; background: #e9ecef; border-radius: 8px;">
        <p style="color: green; font-weight: bold;">Etkinlik başarıyla ${id ? "güncellendi" : "eklendi"}!</p>
        <h3>İşlem Gören Etkinlik (JSON Formatı):</h3>
        <pre style="background: #ffffff; padding: 10px; border-radius: 5px; overflow-x: auto;">${JSON.stringify(yeniEtkinlik, null, 2)}</pre>
      </div>
    `;

    if (!id) {
      form.reset();
    }
  });
}