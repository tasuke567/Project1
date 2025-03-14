import React, { useState } from "react";
import PropTypes from "prop-types";
import ResponseTimeChart from "./ResponseTimeChart";

const SmartphonePrediction = ({ prediction, handleNewPrediction }) => {
  const brandMapping = {
    0: {
      name: "Apple",
      description: "ผู้นำเทคโนโลยีและดีไซน์ล้ำสมัย",
      image: "/images/apple.png",
    },
    1: {
      name: "Samsung",
      description: "มีความหลากหลายในฟีเจอร์และนวัตกรรม",
      image: "/images/samsung.png",
    },
    2: {
      name: "Apple",
      description: "สมาร์ทโฟนจากจีนที่มาพร้อมกับเทคโนโลยีล้ำสมัย",
      image: "/images/apple.png",
    },
    3: {
      name: "Vivo",
      description: "สมาร์ทโฟนราคาประหยัดพร้อมประสิทธิภาพที่ดี",
      image: "/images/vivo.png",
    },
    4: {
      name: "Xiaomi",
      description: "นวัตกรรมและคุณค่าที่เหนือชั้นในราคาที่จับต้องได้",
      image: "/images/xiaomi.png",
    },
    5: {
      name: "Oppo",
      description: "สมาร์ทโฟนที่เน้นการถ่ายภาพและดีไซน์",
      image: "/images/oppo.png",
    },
    6: {
      name: "Infinix",
      description: "สมาร์ทโฟนราคาประหยัดและประสิทธิภาพสูง",
      image: "/images/infinix.png",
    },
  };

  const brand = brandMapping[prediction];

  const [uiuxScores, setUiuxScores] = useState({
    usability: 4.5,
    satisfaction: 4.2,
    speed: 4.0,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleScoreChange = (category, value) => {
    setUiuxScores((prevScores) => ({ ...prevScores, [category]: value }));
  };

  const handleSubmitSurvey = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    // ฉากหลังยืดเต็มหน้าจอ วางให้อยู่กลางจอ
    <div className="bg-white bg-opacity-90 flex flex-col items-center justify-center min-h-screen w-full p-4">
      {/* กล่องเนื้อหาที่จำกัดความกว้าง แต่อย่างน้อยเต็มจอมือถือ */}
      <div className="bg-white rounded-md shadow-md w-full max-w-md mx-auto p-4 sm:w-full">
        <h2
          role="heading"
          aria-label="ผลการพยากรณ์"
          className="text-xl font-bold text-center"
        >
          ผลการพยากรณ์:
        </h2>

        {/* แสดงข้อมูลแบรนด์ถ้าทำนายเสร็จ */}
        {brand ? (
          <div className="text-center mt-4">
            <p>
              ยี่ห้อสมาร์ทโฟนที่ท่านควรเลือกคือ:{" "}
              <span className="font-bold">{brand.name}</span>
            </p>
            <p className="mt-1">{brand.description}</p>
            <img
              src={brand.image}
              alt={brand.name}
              className="my-4 mx-auto rounded-md w-full max-w-[8rem] h-auto object-contain"
            />
          </div>
        ) : (
          <p className="text-center mt-4">กำลังรอผลการทำนาย...</p>
        )}

        {/* ส่วนของกราฟ: ให้กว้างเต็มภาชนะ */}
        <div className="w-full h-64">
          <ResponseTimeChart />
        </div>

        <button
          onClick={handleNewPrediction}
          className="w-full mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          พยากรณ์ใหม่
        </button>

        {/* โซนแบบสอบถาม UI/UX */}
        <div className="mt-6 bg-gray-100 p-4 rounded-md">
          <h3 className="text-lg font-semibold text-center">แบบสอบถาม UI/UX</h3>
          {[
            { label: "ความง่ายในการใช้งาน", key: "usability" },
            { label: "ความพึงพอใจต่อผลการแนะนำ", key: "satisfaction" },
            { label: "การโหลดข้อมูลเร็วพอหรือไม่", key: "speed" },
          ].map(({ label, key }) => (
            <div key={key} className="mt-4">
              <label className="block text-sm font-medium text-gray-700 text-center">
                {label} <span className="font-bold">({uiuxScores[key]})</span>
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={uiuxScores[key]}
                onChange={(e) =>
                  handleScoreChange(key, parseFloat(e.target.value))
                }
                className="w-full mt-2 cursor-pointer accent-blue-500"
              />
              <div
                className="bg-blue-500 h-2 rounded-md mt-1"
                style={{ width: `${(uiuxScores[key] / 5) * 100}%` }}
              ></div>
            </div>
          ))}

          <button
            className="w-full mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            onClick={handleSubmitSurvey}
          >
            ส่งแบบสอบถาม
          </button>

          {submitted && (
            <p className="text-green-600 text-center mt-2">
              ✅ ส่งแบบสอบถามเรียบร้อย!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

SmartphonePrediction.propTypes = {
  prediction: PropTypes.number,
  handleNewPrediction: PropTypes.func.isRequired,
};

export default SmartphonePrediction;
