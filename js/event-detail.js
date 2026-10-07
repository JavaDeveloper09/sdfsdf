import { events } from "./data.js";

// URL'den etkinlik ID'sini al
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// İlgili etkinliği bul
const event = events.find(e => e.id === id);

const detayKapsayici = document.querySelector("#etkinlik-detay");

if (detayKapsayici) {
  if (event) {
    const [yil, ay, gun] = event.date.split("-");
    const formatliTarih = new Date(`${yil}-${ay}-${gun}`).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    detayKapsayici.innerHTML = `
      <h1>${event.title}</h1>
      <span class="kategori-etiket">${event.category}</span>
      <p><strong>Tarih:</strong> ${formatliTarih}, ${event.time}</p>
      <p><strong>Yer:</strong> ${event.location}</p>
      ${event.capacity ? `<p><strong>Kontenjan:</strong> ${event.capacity} kişi</p>` : ""}
      <p><strong>Açıklama:</strong> ${event.description}</p>
      
      <div style="margin-top: 20px; display: flex; gap: 10px; align-items: center;">
        <a href="etkinlikler.html">&larr; Etkinliklere Geri Dön</a>
        <a href="etkinlik-ekle.html?id=${event.id}" style="padding: 6px 12px; background: #ffc107; color: #000; text-decoration: none; border-radius: 4px; font-weight: bold;">Etkinliği Güncelle</a>
      </div>
    `;
  } else {
    detayKapsayici.innerHTML = `
      <h2>Etkinlik Bulunamadı</h2>
      <p>Aradığınız etkinlik silinmiş veya mevcut değil.</p>
      <a href="etkinlikler.html">&larr; Etkinliklere Geri Dön</a>
    `;
  }
}