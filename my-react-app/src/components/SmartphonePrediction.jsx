import React from "react";

const SmartphonePrediction = ({ prediction, handleNewPrediction }) => {
  const brandMapping = {
    0: { name: "Apple", description: "ผู้นำเทคโนโลยีและดีไซน์ล้ำสมัย", image: "/images/apple.png" },
    1: { name: "Samsung", description: "มีความหลากหลายในฟีเจอร์และนวัตกรรม", image: "/images/samsung.png" },
    2: { name: "Apple", description: "ผู้นำเทคโนโลยีและดีไซน์ล้ำสมัย", image: "/images/apple.png" },
    3: { name: "Vivo", description: "สมาร์ทโฟนราคาประหยัดพร้อมประสิทธิภาพที่ดี", image: "/images/vivo.png" },
    4: { name: "Xiaomi", description: "นวัตกรรมและคุณค่าที่เหนือชั้นในราคาที่จับต้องได้", image: "/images/xiaomi.png" },
    5: { name: "Oppo", description: "สมาร์ทโฟนที่เน้นการถ่ายภาพและดีไซน์", image: "/images/oppo.png" },
    6: { name: "Apple", description: "ผู้นำเทคโนโลยีและดีไซน์ล้ำสมัย", image: "/images/apple.png" },
    7: { name: "Samsung", description: "มีความหลากหลายในฟีเจอร์และนวัตกรรม", image: "/images/samsung.png" },
    8: { name: "Apple", description: "ผู้นำเทคโนโลยีและดีไซน์ล้ำสมัย", image: "/images/apple.png" },
    9: { name: "Huawei", description: "สมาร์ทโฟนจากจีนที่มาพร้อมกับเทคโนโลยีล้ำสมัย", image: "/images/huawei.png" },
    10: { name: "Apple", description: "ผู้นำเทคโนโลยีและดีไซน์ล้ำสมัย", image: "/images/apple.png" },
    11: { name: "Apple", description: "ผู้นำเทคโนโลยีและดีไซน์ล้ำสมัย", image: "/images/apple.png" },
    12: { name: "Infinix", description: "แบรนด์ที่มาพร้อมสมาร์ทโฟนราคาประหยัดและประสิทธิภาพสูง", image: "/images/infinix.png" },
  };

  return (
    <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
      <h2 className="text-xl font-bold">ผลการพยากรณ์:</h2>
      {prediction !== null ? (
        <div>
          <p>
            ยี่ห้อสมาร์ทโฟนที่ท่านควรเลือกคือ:{" "}
            <span className="font-bold">{brandMapping[prediction].name}</span>
          </p>
          <p>{brandMapping[prediction].description}</p>
          <img src={brandMapping[prediction].image} alt={brandMapping[prediction].name} className="my-4" />
        </div>
      ) : (
        <p>กำลังรอผลการทำนาย...</p>
      )}
      <button
        onClick={handleNewPrediction}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        พยากรณ์ใหม่
      </button>
    </div>
  );
};

export default SmartphonePrediction;