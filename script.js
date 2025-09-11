let fields = [];
for (let i = 1; i <= 6; i++) {
    fields.push({ id: i, type: "S5", name: `Sân 5 - ${i}`, price: 200000, status: "Trống" });
}


const san7Groups = [
    { id: 1, name: "Sân 7 - 1", price: 500000, group: [1, 2, 3] },
    { id: 2, name: "Sân 7 - 2", price: 500000, group: [4, 5, 6] }
];

const fieldList = document.getElementById("field-list");

function renderFields() {
    fieldList.innerHTML = "";


    fields.forEach(f => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
      <h3>${f.name}</h3>
      <p>Loại: ${f.type}</p>
      <p>Giá: ${f.price.toLocaleString()} VND/giờ</p>
      <p>Tình trạng: <b>${f.status}</b></p>
      <button class="btn-book" onclick="bookField(${f.id}, 'S5')">Đặt sân</button>
    `;
        fieldList.appendChild(card);
    });


    san7Groups.forEach(s7 => {
        const san5Group = fields.filter(f => s7.group.includes(f.id));
        const allTrong = san5Group.every(f => f.status === "Trống");
        const status = allTrong ? "Trống" : "Không khả dụng";

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
      <h3>${s7.name}</h3>
      <p>Loại: S7</p>
      <p>Giá: ${s7.price.toLocaleString()} VND/giờ</p>
      <p>Tình trạng: <b>${status}</b></p>
      <button class="btn-book" ${allTrong ? "" : "disabled"} onclick="bookField(${s7.id}, 'S7')">Đặt sân</button>
    `;
        fieldList.appendChild(card);
    });
}

let bookingTarget = null;

function bookField(id, type) {
    bookingTarget = { id, type };
    document.getElementById("bookingModal").style.display = "block";
    updateStartOptions();
}

function updateStartOptions() {
    const slot = document.getElementById("slotSelect").value;
    const startHourSelect = document.getElementById("startHour");
    startHourSelect.innerHTML = "";

    let start, end;
    if (slot === "1") { start = 6; end = 12; }
    else if (slot === "2") { start = 12; end = 18; }
    else { start = 18; end = 23; }

    for (let h = start; h < end; h++) {
        const opt = document.createElement("option");
        opt.value = h;
        opt.textContent = h + "h00";
        startHourSelect.appendChild(opt);
    }

    updateEndTime();
}

function updateEndTime() {
    const startHour = parseInt(document.getElementById("startHour").value);
    const durationMinutes = parseInt(document.getElementById("durationInput").value);

    if (!startHour || !durationMinutes) return;

    const totalMinutes = startHour * 60 + durationMinutes;
    const endHour = Math.floor(totalMinutes / 60);
    const endMin = totalMinutes % 60;

    const endTimeText = `${endHour}h${endMin.toString().padStart(2, "0")}`;
    document.getElementById("endTimeDisplay").innerText = "Kết thúc: " + endTimeText;
}


function changeDuration(change) {
    const input = document.getElementById("durationInput");
    let val = parseInt(input.value) || 60;
    val += change;
    if (val < 60) val = 60;
    input.value = val;
    updateEndTime();
}


function confirmBooking() {
    const slot = document.getElementById("slotSelect").value;
    const startHour = parseInt(document.getElementById("startHour").value);
    const durationMinutes = parseInt(document.getElementById("durationInput").value);

    let endHour;
    if (slot === "1") endHour = 12;
    else if (slot === "2") endHour = 18;
    else endHour = 23;

    if (isNaN(durationMinutes) || durationMinutes < 30) {
        alert(" Thời lượng không hợp lệ!");
        return;
    }

    const startTotalMin = startHour * 60;
    const endTotalMin = startTotalMin + durationMinutes;

    const endHourCalc = Math.floor(endTotalMin / 60);
    const endMinCalc = endTotalMin % 60;

    if (endHourCalc > endHour || (endHourCalc === endHour && endMinCalc > 0)) {
        alert(` Thời gian vượt quá khung giờ (${endHour}h)!`);
        return;
    }

    const startText = `${startHour}h00`;
    const endText = `${endHourCalc}h${endMinCalc.toString().padStart(2, "0")}`;

    const timeText = `${startText} - ${endText}`;

    if (bookingTarget.type === "S5") {
        const field = fields.find(f => f.id === bookingTarget.id);
        if (field.status === "Trống") {
            field.status = "Đã đặt (" + timeText + ")";
            alert(` Bạn đã đặt ${field.name} từ ${timeText}`);
        }
    } else if (bookingTarget.type === "S7") {
        const s7 = san7Groups.find(g => g.id === bookingTarget.id);
        const san5Group = fields.filter(f => s7.group.includes(f.id));
        if (san5Group.every(f => f.status === "Trống")) {
            san5Group.forEach(f => (f.status = "Đã đặt (" + timeText + ")"));
            alert(` Bạn đã đặt ${s7.name} từ ${timeText}`);
        }
    }

    closeModal();
    renderFields();
}



function closeModal() {
    document.getElementById("bookingModal").style.display = "none";
    bookingTarget = null;
}


renderFields();
