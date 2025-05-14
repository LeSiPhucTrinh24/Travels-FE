// Mock data for tours
export const tourImages = {
  halong: "https://pixabay.com/get/ge4973f85cd106a8a173163f1242a1073aef3798a97bc1bfd23a4503edf015394c990cf64bbaa4a2cf537934519f0e7759150ed3bb0c552b963022009083d4eee_1280.jpg",
  hoian: "https://images.unsplash.com/photo-1555921015-5532091f6026?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
  sapa: "https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
  danang: "https://images.unsplash.com/photo-1559628233-100c798642d4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
  phuquoc: "https://images.unsplash.com/photo-1582650406001-2a25e70c6f0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
  dalat: "https://images.unsplash.com/photo-1565363887214-8884347e6fa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
  hanoi: "https://images.unsplash.com/photo-1573655349936-de6bed86f613?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
  nhatrang: "https://images.unsplash.com/photo-1594393873350-c9cd9517f910?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
};

// Tour guide images
export const guideImages = {
  guide1: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80",
  guide2: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80",
  guide3: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80",
};

// Hotel room images
export const hotelImages = {
  room1: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
  room2: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
  room3: "https://images.unsplash.com/photo-1551776235-dde6c3615a30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
  room4: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
};

// Helper function to initialize tours with images
export const initializeTourWithImage = (tour) => {
  // Set default image based on location keywords
  let imageUrl = "";

  if (tour.location.toLowerCase().includes("hạ long")) {
    imageUrl = tourImages.halong;
  } else if (tour.location.toLowerCase().includes("hội an")) {
    imageUrl = tourImages.hoian;
  } else if (tour.location.toLowerCase().includes("sapa") || tour.location.toLowerCase().includes("lào cai")) {
    imageUrl = tourImages.sapa;
  } else if (tour.location.toLowerCase().includes("đà nẵng")) {
    imageUrl = tourImages.danang;
  } else if (tour.location.toLowerCase().includes("phú quốc")) {
    imageUrl = tourImages.phuquoc;
  } else if (tour.location.toLowerCase().includes("đà lạt")) {
    imageUrl = tourImages.dalat;
  } else if (tour.location.toLowerCase().includes("hà nội")) {
    imageUrl = tourImages.hanoi;
  } else if (tour.location.toLowerCase().includes("nha trang")) {
    imageUrl = tourImages.nhatrang;
  } else {
    // Default image if no match
    const allImages = Object.values(tourImages);
    const randomIndex = Math.floor(Math.random() * allImages.length);
    imageUrl = allImages[randomIndex];
  }

  return {
    ...tour,
    imageUrl,
  };
};

// Sample tours data (for initializing storage)
export const sampleTours = [
  {
    id: 1,
    name: "Vịnh Hạ Long 2 ngày 1 đêm",
    description: "Khám phá kỳ quan thiên nhiên thế giới với hành trình 2 ngày 1 đêm tại Vịnh Hạ Long. Tham quan hang động kỳ vĩ, tắm biển tại bãi biển hoang sơ, thưởng thức hải sản tươi ngon và ngắm hoàng hôn tuyệt đẹp trên vịnh.",
    price: 2990000,
    duration: "2 ngày 1 đêm",
    location: "Hạ Long, Quảng Ninh",
    featured: true,
  },
  {
    id: 2,
    name: "Phố cổ Hội An - Đà Nẵng",
    description: "Hành trình khám phá phố cổ Hội An - di sản văn hóa thế giới UNESCO và thành phố biển Đà Nẵng xinh đẹp. Tham quan cầu Rồng, bán đảo Sơn Trà, bãi biển Mỹ Khê và đặc biệt là phố lồng đèn Hội An về đêm.",
    price: 3500000,
    duration: "3 ngày 2 đêm",
    location: "Hội An, Đà Nẵng",
    featured: true,
  },
  {
    id: 3,
    name: "Sapa - Thung lũng Mường Hoa",
    description: "Hành trình chinh phục Sapa và trải nghiệm cuộc sống của đồng bào dân tộc thiểu số. Tham quan ruộng bậc thang Mường Hoa, chinh phục đỉnh Fansipan, thăm bản Cát Cát và thưởng thức ẩm thực vùng cao.",
    price: 2790000,
    duration: "3 ngày 2 đêm",
    location: "Sapa, Lào Cai",
    featured: true,
  },
  {
    id: 4,
    name: "Đà Lạt thành phố ngàn hoa",
    description: "Hành trình khám phá thành phố ngàn hoa Đà Lạt với khí hậu se lạnh quanh năm. Tham quan vườn hoa thành phố, hồ Tuyền Lâm, thung lũng Tình Yêu, và thưởng thức cà phê đặc sản tại thành phố sương mù.",
    price: 3100000,
    duration: "3 ngày 2 đêm",
    location: "Đà Lạt, Lâm Đồng",
    featured: true,
  },
  {
    id: 5,
    name: "Phú Quốc - Đảo Ngọc",
    description: "Hành trình khám phá Đảo Ngọc Phú Quốc với những bãi biển cát trắng tuyệt đẹp. Tham quan Vinpearl Safari, làng chài Hàm Ninh, vườn tiêu Phú Quốc, và thưởng thức hải sản tươi ngon nhất Việt Nam.",
    price: 4200000,
    duration: "4 ngày 3 đêm",
    location: "Phú Quốc, Kiên Giang",
    featured: true,
  },
  {
    id: 6,
    name: "Nha Trang biển xanh cát trắng",
    description: "Hành trình khám phá thành phố biển Nha Trang xinh đẹp. Tham quan Vinpearl Land, tháp bà Ponagar, chùa Long Sơn, và đặc biệt là trải nghiệm tour 4 đảo tuyệt vời với các hoạt động lặn biển.",
    price: 3700000,
    duration: "4 ngày 3 đêm",
    location: "Nha Trang, Khánh Hòa",
    featured: true,
  },
];
