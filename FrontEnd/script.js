let fields = [
    { id: 1, type: "S5", name: "Sân 5 - 1", price: 250000, status: "Trống", image: "images/field5.jpg" },
    { id: 2, type: "S5", name: "Sân 5 - 2", price: 250000, status: "Trống", image: "images/field5.jpg" },
    { id: 3, type: "S5", name: "Sân 5 - 3", price: 250000, status: "Trống", image: "images/field5.jpg" },
    { id: 4, type: "S5", name: "Sân 5 - 4", price: 250000, status: "Trống", image: "images/field5.jpg" },
    { id: 5, type: "S5", name: "Sân 5 - 5", price: 250000, status: "Trống", image: "images/field5.jpg" },
    { id: 6, type: "S5", name: "Sân 5 - 6", price: 250000, status: "Trống", image: "images/field5.jpg" },
    { id: 7, type: "S7", name: "Sân 7 - 1", price: 500000, status: "Trống", image: "SAN7-1.jpg" },
    { id: 8, type: "S7", name: "Sân 7 - 2", price: 500000, status: "Trống", image: "SAN7-2.jpg" }
];

let tournaments = [
    { name: "Giải bóng đá sinh viên 2025", date: "2025-09-10", location: "Sân 5 - 1,2,3" },
    { name: "Giải phong trào quận 1", date: "2025-10-05", location: "Sân 5 - 1,2,3" },
    { name: "Giải hằng năm", date: "2025-11-01", location: "Sân 7 - 1,2" }
];

const extraServices = {
    "Trọng tài": 150000,
    "Livestream": 200000,
};

const timeSlots = [];
for (let h = 6; h < 23; h++) {
    const start = `${h}h00`;
    const end = `${h + 1}h00`;
    timeSlots.push(`${start} - ${end}`);
}

let schedule7Days = {};

function generateFullSchedule() {
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = date.toISOString().split("T")[0];

        schedule7Days[dateStr] = timeSlots.map(t => {
            return {
                time: t,
                fields: fields.map(f => ({
                    field: f.name,
                    status: "Trống",
                    bookingInfo: null
                }))
            };
        });
    }
}


let selectedBooking = {};

function bookFieldFromSchedule(date, time, fieldName) {
    selectedBooking = { date, time, fieldName };

    document.getElementById("modalField").innerText = fieldName;
    document.getElementById("modalDate").innerText = date;
    document.getElementById("modalTime").innerText = time;

    // Reset form
    document.getElementById("bookingForm").reset();

    // Lấy giá sân
    const fieldObj = fields.find(f => f.name === fieldName);
    let totalPrice = fieldObj ? fieldObj.price : 0;
    document.getElementById("totalPrice").innerText = totalPrice.toLocaleString("vi-VN") + " VND";

    document.getElementById("bookingModal").style.display = "block";
}

function closeModal() {
    document.getElementById("bookingModal").style.display = "none";
}

document.getElementById("bookingForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let request = document.getElementById("request").value;

    const fieldObj = fields.find(f => f.name === selectedBooking.fieldName);
    let totalPrice = fieldObj ? fieldObj.price : 0;

    alert(
        `✅ Đặt sân thành công!\n` +
        `Tên: ${name}\n` +
        `SĐT: ${phone}\n` +
        `Sân: ${selectedBooking.fieldName}\n` +
        `Ngày: ${selectedBooking.date}\n` +
        `Giờ: ${selectedBooking.time}\n` +
        `Yêu cầu: ${request}\n` +
        `💰 Tổng tiền: ${totalPrice.toLocaleString("vi-VN")} VND`
    );

    // Cập nhật trạng thái trong schedule
    const slot = schedule7Days[selectedBooking.date].find(s => s.time === selectedBooking.time);
    const target = slot.fields.find(f => f.field === selectedBooking.fieldName);
    target.status = "Đã đặt";
    target.bookingInfo = { name, phone, request, totalPrice };

    fieldObj.status = "Đã đặt";

    renderFullSchedule();
    closeModal();
});


// ==========================
// RENDER GIẢI ĐẤU
// ==========================
function renderTournaments() {
    const tournamentList = document.getElementById("tournament-list");
    tournamentList.innerHTML = "";

    tournaments.forEach(t => {
        const card = document.createElement("div");
        card.className = "tournament-card";
        card.innerHTML = `
            <h3>${t.name}</h3>
            <p><b>Ngày:</b> ${t.date}</p>
            <p><b>Địa điểm:</b> ${t.location}</p>
        `;
        tournamentList.appendChild(card);
    });
}

// ==========================
// RENDER LỊCH 7 NGÀY
// ==========================
function renderFullSchedule() {
    const headerRow = document.getElementById("schedule-header");
    const body = document.getElementById("schedule-body");

    headerRow.innerHTML = "<th>Khung giờ</th>";
    const dates = Object.keys(schedule7Days);
    dates.forEach(d => {
        const dateObj = new Date(d);
        const label = dateObj.toLocaleDateString("vi-VN", {
            weekday: "short",
            day: "2-digit",
            month: "2-digit"
        });
        headerRow.innerHTML += `<th>${label}</th>`;
    });

    body.innerHTML = "";
    timeSlots.forEach(slot => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td><b>${slot}</b></td>`;

        dates.forEach(d => {
            const slotData = schedule7Days[d].find(s => s.time === slot);
            let cellContent = "";
            slotData.fields.forEach(f => {
                if (f.status === "Trống") {
                    cellContent += `
                        <div class="free">
                          ${f.field}: ${f.status}
                          <button onclick="bookFieldFromSchedule('${d}','${slot}','${f.field}')">Đặt</button>
                        </div>`;
                } else {
                    let detail = "";
                    if (f.bookingInfo) {
                        detail =
                            ` (Người đặt: ${f.bookingInfo.name}, ` +
                            `SĐT: ${f.bookingInfo.phone}, ` +
                            `Tổng tiền: ${f.bookingInfo.totalPrice.toLocaleString("vi-VN")} VND)`;
                    }
                    cellContent += `<div class="booked">${f.field}: ${f.status}${detail}</div>`;
                }
            });
            tr.innerHTML += `<td>${cellContent}</td>`;
        });

        body.appendChild(tr);
    });
}

// ==========================
// KHỞI TẠO
// ==========================
document.addEventListener("DOMContentLoaded", () => {
    generateFullSchedule();
    renderTournaments();
    renderFullSchedule();
});
