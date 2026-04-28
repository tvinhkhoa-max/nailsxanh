export const questions = [
  {
    key: "style",
    question: "Phong cách bạn thích?",
    options: ["Nhẹ nhàng", "Sang chảnh", "Cute", "Cá tính"],
  },
  {
    key: "occasion",
    question: "Bạn làm nail để?",
    options: ["Đi làm", "Đi tiệc", "Hẹn hò"],
  },
  {
    key: "color",
    question: "Bạn thích tone màu?",
    options: ["Nude", "Đỏ", "Trắng", "Đen", "Xanh dương", "Hồng phấn"],
  },
];

export const nailStyles = [
  {
    id: 1,
    style: "Nhẹ nhàng",
    occasion: "Đi làm",
    label: "Nhẹ nhàng đi làm",
  },
  {
    id: 2,
    style: "Sang chảnh",
    occasion: "Đi tiệc",
    label: "Sang chảnh dự tiệc",
  },
  {
    id: 3,
    style: "Cute",
    occasion: "Hẹn hò",
    label: "Cute hẹn hò",
  },
];

export const nails = [
  {
    id: 1,
    type: 1,
    style: 1,
    occasion: "Đi làm",
    color: ["Trắng", "Xanh dương"],
    image: "/nails/nail1.png",
    name: "Ombre Trắng Xanh",
  },
  {
    id: 2,
    // type: 2,
    style: 2,
    occasion: "Đi tiệc",
    color: ["Hồng phấn"],
    image: "/nails/nail2.png",
    name: "Ombre Hồng Nơ",
  },
  {
    id: 3,
    // type: 3,
    style: 3,
    occasion: "Hẹn hò",
    color: ["Hồng phấn"],
    image: "/nails/nail3.png",
    name: "Ombre Hồng Phấn",
  },
  {
    id: 4,
    // type: 3,
    style: 3,
    occasion: "Hẹn hò",
    color: ["Xanh dương"],
    image: "/nails/z7707188504173_BGRemoved.png",
    name: "Sơn Thạch Đính Đá",
  },
];