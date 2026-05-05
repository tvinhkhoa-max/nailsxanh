// src/app/actions/sendBooking.ts
"use server"

export async function sendWhatsAppBookingPhone(formData: any) {
  const { name, phone, date, time, service } = formData;

  // Thông tin CallMeBot của bạn
  const PHONE = "84xxxxxxxxx"; // Số điện thoại của bạn (đầu 84)
  const API_KEY = "YOUR_API_KEY";
  
  const message = `
    🌟 *CÓ LỊCH HẸN MỚI - NAILSXANH* 🌟
    ---------------------------
    👤 *Khách hàng:* ${name}
    📞 *Số điện thoại:* ${phone}
    📅 *Ngày:* ${date}
    ⏰ *Giờ:* ${time}
    💅 *Dịch vụ:* ${service || "Tư vấn tại tiệm"}
    ---------------------------
    _Vui lòng xác nhận với khách sớm nhé!_`;

  const url = `https://api.callmebot.com/whatsapp.php?phone=${PHONE}&text=${encodeURIComponent(message)}&apikey=${API_KEY}`;

  try {
    const res = await fetch(url);
    if (res.ok) return { success: true };
    return { success: false };
  } catch (error) {
    console.error("Lỗi gửi WhatsApp:", error);
    return { success: false };
  }
}

export async function sendWhatsAppBookingGroup(formDataInput: any) {
  const GROUPID = '120363408407193729@g.us';
  const PHONEID = '0908794005';
  const { name, phone, date, time, service } = JSON.parse(formDataInput);
  
  const message = `
    🌟 *CÓ LỊCH HẸN MỚI - NAILSXANH* 🌟
    ---------------------------
    👤 *Khách:* ${name}
    📞 *Số điện thoại:* ${phone}
    📅 *Ngày:* ${date}
    ⏰ *Giờ:* ${time}
    💅 *Dịch vụ:* ${service || "Tư vấn"}
    ---------------------------
    _Team kiểm tra lịch và confirm nhé!_`;
  const data = {
    name,
    phone,
    date,
    time,
    message: message
  }

  // THAY ĐỔI Ở ĐÂY: Dùng tham số "group" thay cho "phone"
  // const url = `https://api.callmebot.com/whatsapp.php?group=${GROUP_ID}&text=${encodeURIComponent(message)}&apikey=${API_KEY}`;
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/bookings/reserve`;

  try {
    const res = await fetch(url, { 
      method: 'POST', 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        // 'x-csrf-token': csrfToken, // Gửi kèm token ở đây
      },
      body: JSON.stringify(data)
    });

    if (res.ok)
      return { success: true };
    return { success: false };
  } catch (error) {
    console.error("Lỗi gửi vào Group:", error);
    return { success: false };
  }
}

export async function sendBooking(formDataInput: any) {
  const { name, phone, date, time, service } = JSON.parse(formDataInput);
  const message = `
    🌟 *CÓ LỊCH HẸN MỚI - NAILSXANH* 🌟
    ---------------------------
    👤 *Khách:* ${name}
    📞 *Số điện thoại:* ${phone}
    📅 *Ngày:* ${date}
    ⏰ *Giờ:* ${time}
    💅 *Dịch vụ:* ${service || "Tư vấn"}
    ---------------------------
    _Team kiểm tra lịch và confirm nhé!_`;
  const data = {
    name,
    phone,
    date,
    time,
    service,
    message: message
  }

  // THAY ĐỔI Ở ĐÂY: Dùng tham số "group" thay cho "phone"
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/bookings/reserve`;
  try {
    const res = await fetch(url, { 
      method: 'POST', 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        // 'x-csrf-token': csrfToken, // Gửi kèm token ở đây
      },
      body: JSON.stringify(data)
    });

    if (res.ok)
      return { success: true };
    return { success: false };
  } catch (error) {
    console.error("Lỗi gửi vào Group:", error);
    return { success: false };
  }
}

//https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm/vision_wasm_internal.js