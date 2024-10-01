import React from "react";

const SmartphonePrediction = ({ prediction, handleNewPrediction }) => {
  const brandMapping = {
    0: "Apple",
    1: "Samsung",
    2: "Oppo",
    3: "Vivo",
    4: "Xiaomi",
    5: "Oppo",
    6: "Vivo", 
    7: "Vivo",
    8: "Apple",
    9: "Huawei",
    10: "Infinix",
    11: "Huawei",
    12: "Infinix",
  };
  

  return (
    <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
      <h2 className="text-xl font-bold">ผลการพยากรณ์:</h2>
      {prediction !== null ? (
        <div>
          <p>
            ยี่ห้อสมาร์ทโฟนที่ท่านควรเลือกคือ:{" "}
            <span className="font-bold">{brandMapping[prediction]}</span>
          </p>
          {/* สามารถเพิ่มรูปภาพหรือรายละเอียดเพิ่มเติมเกี่ยวกับยี่ห้อที่นี่ */}
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
