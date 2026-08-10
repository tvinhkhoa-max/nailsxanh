"use client";

import React, { useState, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import forge from "node-forge";
import {
  Download,
  Ticket,
  Phone,
  Calendar,
  Sparkles,
  Palette,
  RefreshCw,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

const cleanBase64 = (process.env.NEXT_PUBLIC_QR_PUBLIC_KEY_BASE64 || '').replace(/\s+/g, '');
const PUBLIC_KEY_PEM = atob(cleanBase64);

export default function VoucherQrGenerator() {
  const [loading, setLoading] = useState(true);
  // 1. States cho thông tin Voucher
  const [voucherCode, setVoucherCode] = useState(""); //"NAILVIP50"
  const [phone, setPhone] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toLocaleDateString('en-GB').split("T")[0]
  );
  const [expiryDate, setExpiryDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB').split("T")[0]
  );

  // 2. State cấu hình QR & Validation
  const [phoneError, setPhoneError] = useState("");
  const [qrType, setQrType] = useState<"dynamic" | "static">("static");
  const [fgColor, setFgColor] = useState("#1e1b4b");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string|null>(null);

  const qrRef = useRef<HTMLDivElement>(null);

  // Validate Số điện thoại (Chỉ cho phép nhập số & kiểm tra định dạng SĐT Việt Nam)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Chỉ cho phép gõ ký tự số
    if (value !== "" && !/^\d+$/.test(value)) {
      return;
    }

    setPhone(value);

    // Kiểm tra tính hợp lệ của SĐT
    if (!value) {
      setPhoneError("Số điện thoại là bắt buộc");
    } else if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(value)) {
      setPhoneError("Số điện thoại không hợp lệ (cần 10 chữ số, bắt đầu bằng 03, 05, 07, 08, 09)");
    } else {
      setPhoneError("");
    }
  };

  // Tạo URL/Nội dung mã QR dựa trên loại QR
  const domain = typeof window !== "undefined" ? window.location.origin : "https://nailsxanh.ddns.net";
  
  // Link quét/tra cứu Voucher: Trỏ đến API tra cứu kèm mã voucher và SĐT
  const dynamicUrl = `${domain}/api/voucher/verify?code=${encodeURIComponent(voucherCode)}&phone=${encodeURIComponent(phone)}`;

  // Dữ liệu JSON tĩnh (Nếu người dùng chọn QR Tĩnh)
  const staticPayload = JSON.stringify({
    code: voucherCode,
    phone: phone,
    created: startDate,
    expired: expiryDate,
  });

  const getEncryptedStaticPayload = () => {
    const rawJson = JSON.stringify({
      code: voucherCode,
      phone: phone,
      created: startDate,
      expired: expiryDate,
    });

    try {
      // Đọc public key từ định dạng PEM
      const publicKey = forge.pki.publicKeyFromPem(PUBLIC_KEY_PEM);
      
      // Mã hóa chuỗi JSON bằng thuật toán RSA-OAEP (Bảo mật cao)
      const encryptedBytes = publicKey.encrypt(rawJson, 'RSA-OAEP', {
        md: forge.md.sha256.create()
      });
      
      // Chuyển kết quả mã hóa sang dạng Base64 để nhét vào mã QR
      return forge.util.encode64(encryptedBytes);
    } catch (err) {
      console.error("Lỗi mã hóa RSA:", err);
      return "ERROR_ENCRYPTION_FAILED";
    }
  };

  // const finalQrValue = qrType === "dynamic" ? dynamicUrl : staticPayload;
  const finalQrValue = qrType === "dynamic" ? dynamicUrl : getEncryptedStaticPayload();

  // Xử lý Lưu DB & Download Ảnh
  const handleDownloadAndSave = async () => {
    // Re-validate Phone trước khi lưu
    if (!phone) {
      setPhoneError("Vui lòng nhập số điện thoại khách hàng");
      return;
    }
    if (phoneError) return;

    try {
      setIsSaving(true);

      // Lưu thông tin Voucher vào Cơ sở dữ liệu qua API Prisma
      if (qrType === "static")
      {
        const response = await fetch("/api/voucher/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: voucherCode,
            phone: phone,
            startDate: new Date(startDate),
            expiryDate: new Date(expiryDate),
          }),
        });

        if (!response.ok) {
          // throw new Error("Không thể lưu thông tin Voucher vào cơ sở dữ liệu!");
          setErrorMessage("Voucher đã hết, xin chờ dịp khác");
          return ;
        }
        
        const resJson = await response.json();
        const data = resJson.data;
        if (resJson.success === false) { console.log('Go');
          setErrorMessage("Voucher đã hết, xin chờ dịp khác");
          return;
        }

        if (data.error) {
          setErrorMessage(data.message);
          return;
        }
      }

      // Tải file QR PNG về máy
      const canvas = qrRef.current?.querySelector("canvas");
      if (canvas) {
        const image = canvas.toDataURL("image/png");
        const anchor = document.createElement("a");
        anchor.href = image;
        anchor.download = `Voucher-QR-${voucherCode}-${phone}.png`;
        anchor.click();
      }
    } catch (error) {
      console.error("Lỗi khi tạo Voucher QR:", error);
      alert("Đã xảy ra lỗi khi tạo hoặc lưu mã QR. Vui lòng thử lại!");
    } finally {
      setIsSaving(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (true) {
        const voucherRes = await fetch(`/api/voucher`);
        const voucherData = await voucherRes.json();

        setVoucherCode(voucherData?.data.name || null);
        setStartDate(new Date(voucherData?.data.start_at).toString())
        setExpiryDate(new Date(voucherData?.data.end_at).toString())
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-pink-100 text-pink-700 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Nails Xanh Voucher
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tặng QR Voucher
          </h1>
          <p className="mt-2 text-slate-600 max-w-xl mx-auto">
            Nâng niu đôi tay, nhận ngay quà khủng.
          </p>
        </div>

        {/* Main Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CỘT NHẬP THÔNG TIN VOUCHER (7 Cột) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-5">
            
            {/* Choose QR Type */}
            {/* <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Chế độ phát hành</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setQrType("dynamic")}
                  className={`p-3 text-left border rounded-xl transition-all ${
                    qrType === "dynamic"
                      ? "border-pink-500 bg-pink-50/50 ring-2 ring-pink-500/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="font-semibold text-sm text-slate-900">QR Động (Tra cứu DB)</div>
                  <div className="text-xs text-slate-500 mt-1">Lưu Database, quét để check hạn & SĐT</div>
                </button>

                <button
                  type="button"
                  onClick={() => setQrType("static")}
                  className={`p-3 text-left border rounded-xl transition-all ${
                    qrType === "static"
                      ? "border-pink-500 bg-pink-50/50 ring-2 ring-pink-500/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="font-semibold text-sm text-slate-900">QR Tĩnh (Chứa Text/JSON)</div>
                  <div className="text-xs text-slate-500 mt-1">Ghi trực tiếp SĐT và Hạn dùng vào ảnh</div>
                </button>
              </div>
            </div> */}

            {/* Input: Mã Voucher */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mã Voucher / Giảm Giá <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Ticket className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                  placeholder="VD: NAILVIP50"
                  disabled
                  className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm font-mono font-semibold text-slate-800 uppercase focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
            </div>

            {/* Input: Số điện thoại khách hàng (Bắt buộc & Validate) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Số Điện Thoại Khách Hàng <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  maxLength={10}
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="Nhập 10 chữ số (VD: 0901234567)"
                  className={`block w-full pl-9 pr-10 py-2 border rounded-lg text-sm font-mono focus:ring-pink-500 focus:border-pink-500 ${
                    phoneError
                      ? "border-red-400 bg-red-50/30 text-red-900 focus:border-red-500"
                      : phone && !phoneError
                      ? "border-emerald-400 bg-emerald-50/20 text-slate-900"
                      : "border-slate-300"
                  }`}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {phoneError && <AlertCircle className="w-4 h-4 text-red-500" />}
                  {phone && !phoneError && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                </div>
              </div>
              {phoneError && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  {phoneError}
                </p>
              )}
            </div>

            {/* Input: Ngày tạo & Ngày hết hạn */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ngày Phát Hành</label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={(new Date(startDate).toLocaleDateString('en-GB')).toString()}
                    placeholder="dd/mm/yyyy"
                    disabled
                    onChange={(e) => setStartDate(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Ngày Hết Hạn <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={(new Date(expiryDate).toLocaleDateString('en-GB')).toString()}
                    placeholder="dd/mm/yyyy"
                    disabled
                    min={startDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
              </div>
            </div>

            {/* Color Customization */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Palette className="w-4 h-4 text-slate-500" /> Tùy chỉnh màu sắc QR
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Màu Mã QR</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="h-8 w-8 rounded border border-slate-300 cursor-pointer p-0.5"
                    />
                    <span className="text-xs font-mono text-slate-600">{fgColor}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-500 block mb-1">Màu Nền</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="h-8 w-8 rounded border border-slate-300 cursor-pointer p-0.5"
                    />
                    <span className="text-xs font-mono text-slate-600">{bgColor}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* CỘT PREVIEW LIVE & ĐỒ HỌA THẺ VOUCHER (5 Cột) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Xem Trước Thẻ Voucher
              </h3>

              {/* Khung thẻ Voucher Thẩm Mỹ */}
              <div className="w-full bg-gradient-to-br from-pink-500 to-rose-600 p-5 rounded-2xl text-white shadow-xl relative overflow-hidden mb-5">
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-pink-200">Voucher Ưu Đãi</span>
                    <h4 className="text-xl font-extrabold font-mono tracking-wide">{voucherCode || "VOUCHER"}</h4>
                  </div>
                  <Sparkles className="w-5 h-5 text-pink-200" />
                </div>

                {/* QR Canvas Container */}
                <div
                  ref={qrRef}
                  className="p-3 bg-white rounded-xl shadow-inner inline-block my-2"
                  style={{ backgroundColor: bgColor }}
                >
                  <QRCodeCanvas
                    value={finalQrValue}
                    size={180}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                {/* 2. COMPONENT ẨN ĐỂ PHỤC VỤ DOWNLOAD FILE 512PX (Không hiển thị trên màn hình) */}
                <div ref={qrRef} style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                  <QRCodeCanvas 
                    value={finalQrValue} 
                    size={512} // Kích thước siêu lớn, siêu nét khi tải về máy
                    level="H" 
                    fgColor={fgColor} 
                    bgColor={bgColor} 
                  />
                </div>

                {/* Thông tin hiển thị trên thẻ */}
                <div className="mt-3 pt-3 border-t border-white/20 text-xs space-y-1 text-pink-100 text-left">
                  <p><span className="font-medium text-white">SĐT Khách:</span> {phone || "Chưa nhập"}</p>
                  <p><span className="font-medium text-white">Hạn dùng:</span> {(new Date(startDate).toLocaleDateString('en-GB')).toString()} đến {(new Date(expiryDate).toLocaleDateString('en-GB')).toString()}</p>
                  {errorMessage && (
                    <p><span className="font-medium !text-green"><strong>Thông báo: {errorMessage}</strong></span></p>
                  )}
                </div>
              </div>

              {/* Nút Download & Gọi API */}
              <button
                type="button"
                onClick={handleDownloadAndSave}
                disabled={isSaving || !phone || !!phoneError}
                className="w-full py-3 px-4 bg-pink-600 hover:bg-pink-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-pink-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Đang Lưu & Tạo Mã...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" /> Tải Xuống QR Voucher (.PNG)
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-400 mt-3">
                {!phone
                  ? "⚠️ Vui lòng nhập số điện thoại để kích hoạt nút Tải xuống."
                  : phoneError
                  ? "⚠️ SĐT chưa đúng định dạng."
                  : "✓ Sẵn sàng xuất Voucher QR."}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}