import { useEffect, useRef } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import { getFullStaticImageUrl, getFullCDNUrl } from "@/src/lib/utils";

export function useHandAR({
  videoRef,
  canvasRef,
  fingerNails,
  modelSample,
}: any) {
  const landmarkerRef = useRef<any>(null);
  const lastDetectionRef = useRef<any>(null);
  const frameRef = useRef<number | null>(null);
  const startedRef = useRef(false);
  const fingerNailsRef = useRef(fingerNails);
  const nailImagesRef = useRef<Record<string, HTMLImageElement>>({});
  const prevPointsRef = useRef<Record<string, { x: number; y: number }>>({});
  const canvasInitRef = useRef(false);
  const watermarkImgRef = useRef<HTMLImageElement | null>(null);

  // 👉 sync state (tránh stale closure)
  useEffect(() => {
    fingerNailsRef.current = fingerNails;
  }, [fingerNails]);

  // 👉 preload images
  useEffect(() => {

    if (!modelSample?.length) return;

    const map: Record<string, HTMLImageElement> = {};

    modelSample.forEach((nail: any) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; // THÊM DÒNG NÀY
      img.src = getFullStaticImageUrl(nail.img);
      map[String(nail.id)] = img;
    });

    nailImagesRef.current = map;
  }, [modelSample]);

  // 👉 init engine (chạy 1 lần duy nhất)
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    loadWatermark();

    let stream: MediaStream;
    const init = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "/wasm/mediapipe" // https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.10/wasm
      );

      // 2. Kiểm tra nếu landmarker đã tồn tại thì đóng trước khi tạo mới
      if (landmarkerRef.current) {
        await landmarkerRef.current.close();
      }

      landmarkerRef.current = await HandLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              "/assets/cdn/hand_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 1,
        }
      );

      stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      startLoop();
    };

    init();

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      landmarkerRef.current?.close();
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // =========================
  // SHAPE CONFIG
  // =========================
  function getShapeConfig(shape: string) {
    switch (shape) {
      case "square":
        return { scaleX: 1, scaleY: 0.9, offsetY: 0.55 };
      case "coffin":
        return { scaleX: 0.85, scaleY: 1.1, offsetY: 0.65 };
      case "oval":
      default:
        return { scaleX: 0.9, scaleY: 1, offsetY: 0.6 };
    }
  }

  // =========================
  // SHAPE MASK (FIX MẤT PHẦN DƯỚI)
  // =========================
  function createNailPath(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    shape: string
  ) {
    ctx.beginPath();
    const offset_bottom = h * 0.35;

    // offset_top_extra: Phần móng mở rộng ra phía ngoài ngọn ngón tay -> CẦN TĂNG LÊN
    // Trước đây ta vẽ đến -h + offset_bottom. 
    // Giờ ta cho phép vẽ vượt qua đỉnh móng 1 khoảng (ví dụ h * 0.1)
    const offset_top_extra = h * 0.93; // Mở rộng vùng Mask thêm 15% chiều cao

    if (shape === "square") {
      // ctx.moveTo(-w / 2, 0);
      // ctx.lineTo(w / 2, 0);
      // ctx.lineTo(w / 2, -h);
      // ctx.lineTo(-w / 2, -h);

      // ctx.rect(-w / 2, -h + offset_bottom, w, h);
      ctx.rect(
        -w / 2, 
        -h + offset_bottom - offset_top_extra, // Kéo đỉnh Mask lên cao hơn
        w, 
        h + offset_top_extra // Tăng tổng chiều cao Mask
      );
    }

    else if (shape === "coffin") {
      const topW = w * 0.6;

      // ctx.moveTo(-w / 2, 0);
      // ctx.lineTo(w / 2, 0);
      // ctx.lineTo(topW / 2, -h);
      // ctx.lineTo(-topW / 2, -h);

      ctx.moveTo(-w / 2, offset_bottom);
      ctx.lineTo(w / 2, offset_bottom);
      // ctx.lineTo(topW / 2, -h + offset_bottom);
      // ctx.lineTo(-topW / 2, -h + offset_bottom);
      // Kéo đỉnh Mask lên cao hơn
      ctx.lineTo(topW / 2, -h + offset_bottom - offset_top_extra);
      ctx.lineTo(-topW / 2, -h + offset_bottom - offset_top_extra);
    }

    else { // oval (default)
      // ctx.moveTo(-w / 2, 0);
      // ctx.quadraticCurveTo(0, -h * 1.1, w / 2, 0);
      // ctx.quadraticCurveTo(0, -h * 0.3, -w / 2, 0);

      ctx.moveTo(-w / 2, offset_bottom);
      // ctx.quadraticCurveTo(0, -h * 1.2 + offset_bottom, w / 2, offset_bottom);
      // ctx.quadraticCurveTo(0, offset_bottom + h * 0.2, -w / 2, offset_bottom);
      ctx.quadraticCurveTo(0, -h * 1.35 + offset_bottom - offset_top_extra, w / 2, offset_bottom);
      ctx.quadraticCurveTo(0, offset_bottom + h * 0.25, -w / 2, offset_bottom);
    }

    ctx.closePath();
  }

  // =========================
  // DRAW
  // =========================
  function drawNail(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    cx: number,
    cy: number,
    w: number,
    h: number,
    angle: number,
    z: number,
    shape: string
  ) {
    const cfg = getShapeConfig(shape);
    ctx.save();

    // Di chuyển đến đầu ngón tay
    ctx.translate(cx, cy);
    
    // Xoay: atan2 cho ra hướng vector, ta cần cộng thêm PI/2 để móng dọc theo ngón
    ctx.rotate(angle + Math.PI / 2);

    // Giả lập 3D nhẹ dựa trên tọa độ Z của Mediapipe
    const perspectiveScale = 1 - (z * 1.5); 
    ctx.scale(perspectiveScale, perspectiveScale * cfg.scaleY);

    // Tạo Mask theo hình dáng móng (Square/Oval/Coffin)
    createNailPath(ctx, w, h, shape);
    ctx.clip();

    // 5. Vẽ ảnh - QUAN TRỌNG NHẤT:
    // Chúng ta dịch chuyển Y sao cho điểm "thịt móng" nằm đúng cx, cy
    // Thử điều chỉnh 0.65 -> 0.8 tùy vào ảnh mẫu của bạn dài hay ngắn
    const anchorOffset = 0.65;

    ctx.drawImage(img, -w / 2, -h * anchorOffset, w, h); // -h * cfg.offsetY, // Thường là -h * 0.7 để gốc móng nằm dưới đầu ngón tay
    ctx.restore();
  }

  function drawNailPerspective(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    cx: number, cy: number,
    w: number, h: number,
    angle: number,
    tiltX: number, // Độ co dọc (chúi)
    tiltY: number, // Độ co ngang (nghiêng bên)
    shape: string
  ) {
    const cfg = getShapeConfig(shape);
    ctx.save();

    // 1. Di chuyển đến điểm neo (Đầu ngón)
    ctx.translate(cx, cy);
    
    // 2. Xoay theo hướng ngón tay
    ctx.rotate(angle);

    // ==========================================
    // [BƯỚC QUAN TRỌNG] ÁP DỤNG PERSPECTIVE MATRIX
    // ==========================================
    
    // Tinh chỉnh Scale dựa trên tilt
    // Math.max(0.1, ...) để đảm bảo móng không bị biến mất
    const scaleX = Math.max(0.2, 1 - Math.abs(tiltY)); 
    const scaleY = Math.max(0.5, cfg.scaleY - tiltX); 
    
    // tiltY * 0.5: Tạo độ xiên nhẹ khi nghiêng
    const skewX = tiltY * 0.5; 
    const skewY = 0; // Ít dùng cho móng

    // ctx.transform(a, b, c, d, e, f)
    // Ta không dùng translate ở đây nữa vì đã dùng ctx.translate
    ctx.transform(scaleX, skewY, skewX, scaleY, 0, 0);

    // Bóng đổ nhẹ cho thật
    ctx.shadowColor = "rgba(0,0,0,0.15)";
    ctx.shadowBlur = 4;

    // 3. Tạo Mask theo Shape (Giữ nguyên)
    createNailPath(ctx, w, h, shape);
    ctx.clip();

    // 4. Vẽ ảnh (Căn chỉnh Anchor như bước trước đã sửa)
    // Tùy vào ảnh của bạn, điều chỉnh anchorOffset (0.6 - 0.8)
    const anchorOffset = 0.70; 
    ctx.drawImage(
      img,
      -w / 2,
      -h * anchorOffset, 
      w,
      h
    );

    ctx.restore();
  }

  // =========================
  // OCCLUSION
  // =========================
  function drawFingerMask(
    ctx: CanvasRenderingContext2D,
    base: any,
    tip: any,
    width: number
  ) {
    ctx.save();

    ctx.beginPath();
    ctx.moveTo(base.x, base.y);
    ctx.lineTo(tip.x + width * 0.5, tip.y);
    ctx.lineTo(tip.x - width * 0.5, tip.y);
    ctx.closePath();

    ctx.globalCompositeOperation = "destination-out";
    ctx.fill();

    ctx.restore();
  }

  // Thêm hàm này vào trong useHandAR, TRƯỚC startLoop
  const renderFrame = (
    ctx: CanvasRenderingContext2D, 
    video: HTMLVideoElement, 
    canvas: HTMLCanvasElement,
    landmarker: any,
    time: number
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const isMirror = true;

    // 1. Clear & Draw Video
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    // 2. Detect & Draw Nails
    const res = landmarker.detectForVideo(video, time);
    if (res.landmarks?.[0]) {
      const lm = res.landmarks[0];
      const handedness = res.handedness?.[0]?.[0]?.categoryName;
      const isLeftHand = handedness === "Left";

      const toCanvas = (pt: any) => ({
        x: isMirror ? (1 - pt.x) * canvas.width : pt.x * canvas.width,
        y: pt.y * canvas.height,
      });

      // Check Palm (Giữ nguyên logic của bạn)
      const p0 = toCanvas(lm[0]);
      const p5 = toCanvas(lm[5]);
      const p17 = toCanvas(lm[17]);
      const isPalm = isLeftHand ? 
        ((p5.x - p0.x) * (p17.y - p0.y) - (p5.y - p0.y) * (p17.x - p0.x)) < 0 : 
        ((p5.x - p0.x) * (p17.y - p0.y) - (p5.y - p0.y) * (p17.x - p0.x)) > 0;

      if (!isPalm) {
        [4, 8, 12, 16, 20].forEach((i) => {
          const tip = toCanvas(lm[i]);
        const dip = toCanvas(lm[i - 1]); // Khớp ngay dưới đầu ngón
        const base = toCanvas(lm[i - 2]);

        // const dx = tip.x - base.x;
        // const dy = tip.y - base.y;
        const dx = tip.x - dip.x;
        const dy = tip.y - dip.y;

        const len = Math.hypot(dx, dy);
        if (len < 1) return;

        const nx = dx / len;
        const ny = dy / len;

        // =========================
        // POSITION
        // =========================
        const forward = 20;
        const inward = 10;
        const dir = isLeftHand ? 1 : -1;

        const px = tip.x + nx * forward * dir - nx * inward * dir;
        const py = tip.y + ny * forward * dir - ny * inward * dir;

        // smooth
        const key = `f-${i}`;
        const prev = prevPointsRef.current[key] || { x: px, y: py };

        const smoothed = {
          x: prev.x * 0.7 + px * 0.3,
          y: prev.y * 0.7 + py * 0.3,
        };

        prevPointsRef.current[key] = smoothed;

        // surface offset
        const perpX = isLeftHand ? -ny : ny;
        const perpY = isLeftHand ? nx : -nx;

        const finalX = smoothed.x + perpX * 5;
        const finalY = smoothed.y + perpY * 5;

        // =========================
        // ROTATION
        // =========================
        const angle = Math.atan2(dy, dx);
        // const rotation = isLeftHand
        //   ? angle + Math.PI / 2
        //   : angle + Math.PI / 2;

        // =========================
        // IMAGE
        // =========================
        const nailId = fingerNailsRef.current[i];
        const img = nailImagesRef.current[nailId];
        if (!img?.complete) return;

        // scale theo finger
        const fingerWidth = len * 0.7;
        const aspect = img.height / img.width;
        const shape = modelSample?.find((n: any) => n.id == nailId)?.shape || "oval";

        // 1. Lấy tọa độ Z chuẩn hóa (Mediapipe Z thường nằm trong khoảng -0.1 đến 0.1)
        const zTip = lm[i].z;
        const zDip = lm[i - 1].z;

        // 2. Tính độ chênh lệch Z để biết ngón chúi xuống hay ngửa lên
        // dz > 0: Đầu ngón xa camera hơn khớp (ngón chúi xuống)
        // dz < 0: Đầu ngón gần camera hơn khớp (ngón ngửa lên)
        const dz = zTip - zDip;

        // 3. Giả lập độ xoay trục Y (nghiêng sang bên) 
        // Cái này khó tính chính xác chỉ bằng Z, ta sẽ dùng dz để giả lập độ co ngang
        const tiltY = dz * 5; // Hệ số giả lập co ngang, thử điều chỉnh 3-7

        // 4. Giả lập độ xoay trục X (chúi xuống) -> Dùng để co chiều cao
        const tiltX = Math.abs(dz) * 2; // Hệ số giả lập co dọc, thử điều chỉnh 1-3

          // Sau đó gọi drawNail(...) như cũ
          // const nailId = fingerNailsRef.current[i];
          // const img = nailImagesRef.current[nailId];
          if (img?.complete) {
            const fingerWidth = Math.hypot(toCanvas(lm[i]).x - toCanvas(lm[i-1]).x, toCanvas(lm[i]).y - toCanvas(lm[i-1]).y) * 0.7;
            const aspect = img.height / img.width;
            const shape = modelSample?.find((n: any) => n.id == nailId)?.shape || "oval";
            
            drawNail(ctx, img, smoothed.x, smoothed.y, fingerWidth, fingerWidth * aspect, Math.atan2(dy, dx), lm[i].z, shape);
          }
        });
      }
    }
  };

  const renderFrameFromData = (
    ctx: CanvasRenderingContext2D, 
    video: HTMLVideoElement, 
    canvas: HTMLCanvasElement,
    detectionResult: any // Truyền kết quả đã có vào đây
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const isMirror = true;

    // 1. Vẽ Video
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    // 2. Nếu có dữ liệu bàn tay thì vẽ móng
    if (detectionResult?.landmarks?.[0]) {
      const lm = detectionResult.landmarks[0];
      const handedness = detectionResult.handedness?.[0]?.[0]?.categoryName;
      const isLeftHand = handedness === "Left";

      const toCanvas = (pt: any) => ({
        x: isMirror ? (1 - pt.x) * canvas.width : pt.x * canvas.width,
        y: pt.y * canvas.height,
      });

      // Check Palm (Giữ nguyên logic của bạn)
      const p0 = toCanvas(lm[0]);
      const p5 = toCanvas(lm[5]);
      const p17 = toCanvas(lm[17]);
      const isPalm = isLeftHand ? 
        ((p5.x - p0.x) * (p17.y - p0.y) - (p5.y - p0.y) * (p17.x - p0.x)) < 0 : 
        ((p5.x - p0.x) * (p17.y - p0.y) - (p5.y - p0.y) * (p17.x - p0.x)) > 0;

      if (!isPalm) {
        [4, 8, 12, 16, 20].forEach((i) => {
          const tip = toCanvas(lm[i]);
        const dip = toCanvas(lm[i - 1]); // Khớp ngay dưới đầu ngón
        const base = toCanvas(lm[i - 2]);

        // const dx = tip.x - base.x;
        // const dy = tip.y - base.y;
        const dx = tip.x - dip.x;
        const dy = tip.y - dip.y;

        const len = Math.hypot(dx, dy);
        if (len < 1) return;

        const nx = dx / len;
        const ny = dy / len;

        // =========================
        // POSITION
        // =========================
        const forward = 20;
        const inward = 10;
        const dir = isLeftHand ? 1 : -1;

        const px = tip.x + nx * forward * dir - nx * inward * dir;
        const py = tip.y + ny * forward * dir - ny * inward * dir;

        // smooth
        const key = `f-${i}`;
        const prev = prevPointsRef.current[key] || { x: px, y: py };

        const smoothed = {
          x: prev.x * 0.7 + px * 0.3,
          y: prev.y * 0.7 + py * 0.3,
        };

        prevPointsRef.current[key] = smoothed;

        // surface offset
        const perpX = isLeftHand ? -ny : ny;
        const perpY = isLeftHand ? nx : -nx;

        const finalX = smoothed.x + perpX * 5;
        const finalY = smoothed.y + perpY * 5;

        // =========================
        // ROTATION
        // =========================
        const angle = Math.atan2(dy, dx);
        // const rotation = isLeftHand
        //   ? angle + Math.PI / 2
        //   : angle + Math.PI / 2;

        // =========================
        // IMAGE
        // =========================
        const nailId = fingerNailsRef.current[i];
        const img = nailImagesRef.current[nailId];
        if (!img?.complete) return;

        // scale theo finger
        const fingerWidth = len * 0.7;
        const aspect = img.height / img.width;
        const shape = modelSample?.find((n: any) => n.id == nailId)?.shape || "oval";

        // 1. Lấy tọa độ Z chuẩn hóa (Mediapipe Z thường nằm trong khoảng -0.1 đến 0.1)
        const zTip = lm[i].z;
        const zDip = lm[i - 1].z;

        // 2. Tính độ chênh lệch Z để biết ngón chúi xuống hay ngửa lên
        // dz > 0: Đầu ngón xa camera hơn khớp (ngón chúi xuống)
        // dz < 0: Đầu ngón gần camera hơn khớp (ngón ngửa lên)
        const dz = zTip - zDip;

        // 3. Giả lập độ xoay trục Y (nghiêng sang bên) 
        // Cái này khó tính chính xác chỉ bằng Z, ta sẽ dùng dz để giả lập độ co ngang
        const tiltY = dz * 5; // Hệ số giả lập co ngang, thử điều chỉnh 3-7

        // 4. Giả lập độ xoay trục X (chúi xuống) -> Dùng để co chiều cao
        const tiltX = Math.abs(dz) * 2; // Hệ số giả lập co dọc, thử điều chỉnh 1-3

          // Sau đó gọi drawNail(...) như cũ
          // const nailId = fingerNailsRef.current[i];
          // const img = nailImagesRef.current[nailId];
          if (img?.complete) {
            const fingerWidth = Math.hypot(toCanvas(lm[i]).x - toCanvas(lm[i-1]).x, toCanvas(lm[i]).y - toCanvas(lm[i-1]).y) * 0.7;
            const aspect = img.height / img.width;
            const shape = modelSample?.find((n: any) => n.id == nailId)?.shape || "oval";
            
            drawNail(ctx, img, smoothed.x, smoothed.y, fingerWidth, fingerWidth * aspect, Math.atan2(dy, dx), lm[i].z, shape);
          }
        });
      }
    }
  }

  // =========================
  // LOOP
  // =========================
  const startLoop = () => {
    const loop = (time: number) => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const dpr = window.devicePixelRatio || 1;
      
      const ctx = canvas?.getContext("2d");
      const landmarker = landmarkerRef.current;
      const isMirror = true; // PC/Mobile camera trước thường là true

      if (!video || !canvas || !ctx || !landmarker) {
        frameRef.current = requestAnimationFrame(loop);
        return;
      }

      if (video.readyState !== 4) {
        frameRef.current = requestAnimationFrame(loop);
        return;
      }

      // init canvas size
      if (!canvasInitRef.current) {
        canvas.width = video.videoWidth * dpr;
        canvas.height = video.videoHeight * dpr;
        canvasInitRef.current = true;
      }

      // clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // draw video (mirror)
      ctx.save();
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      const res = landmarker.detectForVideo(video, time);
      lastDetectionRef.current = res; // Lưu lại kết quả này

      if (!res.landmarks?.[0]) {
        frameRef.current = requestAnimationFrame(loop);
        return;
      }

      const lm = res.landmarks[0];


      // 👉 detect left/right Hand
      const handedness = res.handedness?.[0]?.[0]?.categoryName;
      const isLeftHand = handedness === "Left";

      // 👉 convert helper
      const toCanvas = (pt: any) => ({
        // x: (1 - pt.x) * canvas.width,
        x: isMirror ? (1 - pt.x) * canvas.width : pt.x * canvas.width,
        y: pt.y * canvas.height,
      });

      // =========================
      // PALM DETECT (1 lần)
      // =========================
      const p0 = toCanvas(lm[0]);
      const p5 = toCanvas(lm[5]);
      const p17 = toCanvas(lm[17]);

      const cross =
        (p5.x - p0.x) * (p17.y - p0.y) -
        (p5.y - p0.y) * (p17.x - p0.x);

      const isPalm = isLeftHand ? cross < 0 : cross > 0;
      if (isPalm) {
        frameRef.current = requestAnimationFrame(loop);
        return;
      }

      const fingers = [4, 8, 12, 16, 20];

      fingers.forEach((i) => {
        const tip = toCanvas(lm[i]);
        const dip = toCanvas(lm[i - 1]); // Khớp ngay dưới đầu ngón
        const base = toCanvas(lm[i - 2]);

        // const dx = tip.x - base.x;
        // const dy = tip.y - base.y;
        const dx = tip.x - dip.x;
        const dy = tip.y - dip.y;

        const len = Math.hypot(dx, dy);
        if (len < 1) return;

        const nx = dx / len;
        const ny = dy / len;

        // =========================
        // POSITION
        // =========================
        const forward = 20;
        const inward = 10;
        const dir = isLeftHand ? 1 : -1;

        const px = tip.x + nx * forward * dir - nx * inward * dir;
        const py = tip.y + ny * forward * dir - ny * inward * dir;

        // smooth
        const key = `f-${i}`;
        const prev = prevPointsRef.current[key] || { x: px, y: py };

        const smoothed = {
          x: prev.x * 0.7 + px * 0.3,
          y: prev.y * 0.7 + py * 0.3,
        };

        prevPointsRef.current[key] = smoothed;

        // surface offset
        const perpX = isLeftHand ? -ny : ny;
        const perpY = isLeftHand ? nx : -nx;

        const finalX = smoothed.x + perpX * 5;
        const finalY = smoothed.y + perpY * 5;

        // =========================
        // ROTATION
        // =========================
        const angle = Math.atan2(dy, dx);
        // const rotation = isLeftHand
        //   ? angle + Math.PI / 2
        //   : angle + Math.PI / 2;

        // =========================
        // IMAGE
        // =========================
        const nailId = fingerNailsRef.current[i];
        const img = nailImagesRef.current[nailId];
        if (!img?.complete) return;

        // scale theo finger
        const fingerWidth = len * 0.7;
        const aspect = img.height / img.width;
        const shape = modelSample?.find((n: any) => n.id == nailId)?.shape || "oval";

        // 1. Lấy tọa độ Z chuẩn hóa (Mediapipe Z thường nằm trong khoảng -0.1 đến 0.1)
        const zTip = lm[i].z;
        const zDip = lm[i - 1].z;

        // 2. Tính độ chênh lệch Z để biết ngón chúi xuống hay ngửa lên
        // dz > 0: Đầu ngón xa camera hơn khớp (ngón chúi xuống)
        // dz < 0: Đầu ngón gần camera hơn khớp (ngón ngửa lên)
        const dz = zTip - zDip;

        // 3. Giả lập độ xoay trục Y (nghiêng sang bên) 
        // Cái này khó tính chính xác chỉ bằng Z, ta sẽ dùng dz để giả lập độ co ngang
        const tiltY = dz * 5; // Hệ số giả lập co ngang, thử điều chỉnh 3-7

        // 4. Giả lập độ xoay trục X (chúi xuống) -> Dùng để co chiều cao
        const tiltX = Math.abs(dz) * 2; // Hệ số giả lập co dọc, thử điều chỉnh 1-3

        // =========================
        // DRAW
        // =========================
        drawNail(
          ctx, img, 
          smoothed.x, smoothed.y, 
          fingerWidth, (fingerWidth * aspect), 
          angle, lm[i].z, shape
        );
        // drawNailPerspective(
        //   ctx, img, 
        //   smoothed.x, smoothed.y, 
        //   fingerWidth, (fingerWidth * aspect), 
        //   angle, tiltX, tiltY, shape
        // )
      });

      frameRef.current = requestAnimationFrame(loop);
    };

    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(loop);
  };

    // ==========================================
  // 👉 DRAW WATERMARK (Logo NailsXanh)
  // ==========================================
  const drawWatermark = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const logo = watermarkImgRef.current;
    if (!logo || !logo.complete) return;

    const dpr = window.devicePixelRatio || 1;
    const desiredWidthCSS = 150; 
    const aspect = logo.height / logo.width;
    const paddingCSS = 20;

    // Tọa độ tính theo Logical Pixel (CSS)
    const x = (canvas.width / dpr) - desiredWidthCSS - paddingCSS;
    const y = (canvas.height / dpr) - (desiredWidthCSS * aspect) - paddingCSS;

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // Quan trọng: Reset scale để vẽ chính xác
    ctx.globalAlpha = 0.8;
    ctx.drawImage(logo, x, y, desiredWidthCSS, desiredWidthCSS * aspect);
    ctx.restore();
  };

  // 👉 Load Logo Watermark
  const loadWatermark = () => {
    const img = new Image();
    // Thay đường dẫn này bằng đường dẫn thực tế đến file logo của bạn
    img.src = '/assets/images/logo_nailsxanh.png'; 
    img.onload = () => {
      watermarkImgRef.current = img;
    };
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const landmarker = landmarkerRef.current;

    if (!canvas || !video || !landmarker) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // SỬ DỤNG DỮ LIỆU CUỐI CÙNG ĐÃ LƯU
    const lastRes = lastDetectionRef.current;
    // 1. Vẽ móng hoàn chỉnh lên frame hiện tại
    // renderFrame(ctx, video, canvas, landmarker, performance.now());
    renderFrameFromData(ctx, video, canvas, lastRes)

    // 2. Vẽ Watermark đè lên trên
    if (watermarkImgRef.current && watermarkImgRef.current.complete) {
      drawWatermark(ctx, canvas);
    } else {
      console.warn("Watermark logo not ready yet");
    }

    // 3. Xuất ảnh chất lượng cao
    return canvas.toDataURL("image/png", 1.0);
  };

  return {
    // ... các giá trị khác
    captureImage, // Expose hàm này ra ngoài

    landmarker: landmarkerRef.current,
  };
}