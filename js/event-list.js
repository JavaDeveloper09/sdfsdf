import { events } from "./data.js";

// Her bir etkinlikten bir HTML kartı üreten fonksiyon
function createCard(event) {
  const [yil, ay, gun] = event.date.split("-");
  const formatliTarih = new Date(`${yil}-${ay}-${gun}`).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return `
    <article class="kart">
      <h2>${event.title}</h2>
      <span class="kategori-etiket">${event.category}</span>
      <p><strong>Tarih:</strong> ${formatliTarih}, ${event.time}</p>
      <p><strong>Yer:</strong> ${event.location}</p>
      ${event.capacity ? `<p><strong>Kontenjan:</strong> ${event.capacity} kişi</p>` : ""}
      <p>${event.description}</p>
      <a href="etkinlik-detay.html?id=${event.id}">Detayları gör</a>
    </article>
  `;
}

const list = document.querySelector("#etkinlik-listesi");

export function render(dizi) {
  if (!list) return;
  list.innerHTML = dizi.map(createCard).join("");
}

// Ana sayfa veya liste sayfası kontrolü (data-limit varsa sadece 2 tane gösterir)
if (list) {
  if (list.dataset.limit) {
    const yaklasan = [...events]
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, Number(list.dataset.limit));
    render(yaklasan);
  } else {
    render(events);
  }
}

// Kategorileri otomatik doldurma
const kategoriSelect = document.querySelector("#kategori-filtre");
if (kategoriSelect) {
  const kategoriler = [...new Set(events.map(e => e.category))];
  kategoriler.forEach(kat => {
    kategoriSelect.innerHTML += `<option value="${kat}">${kat}</option>`;
  });
}

// Arama ve filtreleme fonksiyonu
const aramaInput = document.querySelector("#arama");
const sonucYazisi = document.querySelector("#sonuc");

function filtrele() {
  const arananKelime = aramaInput ? aramaInput.value.toLocaleLowerCase("tr-TR").trim() : "";
  const secilenKategori = kategoriSelect ? kategoriSelect.value : "";

  const filtrelenmis = events.filter(event => {
    const metinUyuyor = event.title.toLocaleLowerCase("tr-TR").includes(arananKelime) ||
                        event.description.toLocaleLowerCase("tr-TR").includes(arananKelime);
    const kategoriUyuyor = secilenKategori === "" || event.category === secilenKategori;
    
    return metinUyuyor && kategoriUyuyor;
  });

  render(filtrelenmis);

  if (sonucYazisi) {
    if (filtrelenmis.length === 0) {
      sonucYazisi.textContent = "Aramanıza uygun etkinlik bulunamadı.";
    } else {
      sonucYazisi.textContent = `${filtrelenmis.length} etkinlik listeleniyor.`;
    }
  }
}

if (aramaInput) aramaInput.addEventListener("input", filtrele);
if (kategoriSelect) kategoriSelect.addEventListener("change", filtrele);

if (sonucYazisi && list && !list.dataset.limit) {
  sonucYazisi.textContent = `${events.length} etkinlik listeleniyor.`;
}