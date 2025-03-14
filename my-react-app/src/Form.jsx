import React, { useState, useEffect, memo } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Modal from "react-modal";
import SmartphonePrediction from "./components/SmartphonePrediction";
import styles from "./style/Loading.module.css";

const API_URL = import.meta.env.VITE_API_URL;
function Form() {
  const [formData, setFormData] = useState({
    gender: "ชาย", // ค่าเริ่มต้น
    ageRange: "18-25 ปี",
    maritalStatus: "โสด",
    occupation: "นักเรียน / นักศึกษา",
    income: "น้อยกว่า 15,000 บาท",
    apps: ["Facebook", "YouTube", "Instagram"], // ค่าเริ่มต้นเลือกแอป
    activities: ["โซเชียลมีเดีย", "ดูหนัง / ฟังเพลง", "เล่นเกม"],
    dailyUsage: "1 - 3 ชั่วโมง",
    importance: "จำเป็น",
    purchaseFactors: "ราคา",
    satisfaction: "3",
    onlinePurchaseIssues: "ไม่สามารถสัมผัสหรือลองสินค้าได้จริง",
    currentBrand: "Apple",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === "checkbox") {
      setFormData((prevFormData) => {
        const newValues = checked
          ? [...prevFormData[name], value]
          : prevFormData[name].filter((item) => item !== value);
        return { ...prevFormData, [name]: newValues };
      });
    } else {
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }
  };

  const validateForm = () => {
    if (
      !formData.gender ||
      !formData.ageRange ||
      !formData.maritalStatus ||
      !formData.occupation ||
      !formData.apps ||
      !formData.income ||
      !formData.activities ||
      !formData.dailyUsage ||
      !formData.importance ||
      !formData.purchaseFactors ||
      !formData.satisfaction ||
      !formData.onlinePurchaseIssues ||
      !formData.currentBrand
    ) {
      setErrorMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
      return false;
    }
    return true;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      เพศ_1: formData.gender === "ชาย" ? 1 : 0,
      เพศ_2: formData.gender === "หญิง" ? 1 : 0,
      เพศ_3: formData.gender === "อื่นๆ" ? 1 : 0,
      ช่วงอายุ_1: formData.ageRange === "18-25 ปี" ? 1 : 0,
      ช่วงอายุ_2: formData.ageRange === "26-32 ปี" ? 1 : 0,
      ช่วงอายุ_3: formData.ageRange === "33-40 ปี" ? 1 : 0,
      ช่วงอายุ_4: formData.ageRange === "41-50 ปี" ? 1 : 0,
      ช่วงอายุ_5: formData.ageRange === "50-60 ปี" ? 1 : 0,
      ช่วงอายุ_6: formData.ageRange === "60 ปีขึ้นไป" ? 1 : 0,
      สถานภาพ_1: formData.maritalStatus === "โสด" ? 1 : 0,
      สถานภาพ_2: formData.maritalStatus === "สมรส" ? 1 : 0,
      สถานภาพ_3: formData.maritalStatus === "หย่าร้าง" ? 1 : 0,
      สถานภาพ_4: formData.maritalStatus === "แยกกันอยู่" ? 1 : 0,
      อาชีพ_1: formData.occupation === "นักเรียน / นักศึกษา" ? 1 : 0,
      อาชีพ_2: formData.occupation === "พนักงานบริษัทเอกชน" ? 1 : 0,
      อาชีพ_3: formData.occupation === "พนักงานข้าราชการ" ? 1 : 0,
      อาชีพ_4: formData.occupation === "พนักงานรัฐวิสาหกิจ" ? 1 : 0,
      อาชีพ_5: formData.occupation === "พนักงานโรงงานอุตสาหกรรม" ? 1 : 0,
      อาชีพ_6: formData.occupation === "เจ้าของธุรกิจ/ธุรกิจส่วนตัว" ? 1 : 0,
      รายได้ต่อเดือน_1: formData.income === "น้อยกว่า 15,000 บาท" ? 1 : 0,
      รายได้ต่อเดือน_2: formData.income === "15,001 - 20,000 บาท" ? 1 : 0,
      รายได้ต่อเดือน_3: formData.income === "20,001 - 30,000 บาท" ? 1 : 0,
      รายได้ต่อเดือน_4: formData.income === "30,001 - 40,000 บาท" ? 1 : 0,
      รายได้ต่อเดือน_5: formData.income === "40,001 - 50,000 บาท" ? 1 : 0,
      รายได้ต่อเดือน_6: formData.income === "มากกว่า 50,001 บาทขึ้นไป" ? 1 : 0,
      "ท่านใช้แอปพลิเคชันใดบ้างเป็นประจำ?_1": formData.apps.includes(
        "Instagram"
      )
        ? 1
        : 0,
      "ท่านใช้แอปพลิเคชันใดบ้างเป็นประจำ?_2": formData.apps.includes("Facebook")
        ? 1
        : 0,
      "ท่านใช้แอปพลิเคชันใดบ้างเป็นประจำ?_3": formData.apps.includes("YouTube")
        ? 1
        : 0,
      "ท่านใช้แอปพลิเคชันใดบ้างเป็นประจำ?_4": formData.apps.includes("Snapchat")
        ? 1
        : 0,
      "ท่านใช้แอปพลิเคชันใดบ้างเป็นประจำ?_5": formData.apps.includes(
        "Facebook Messenger"
      )
        ? 1
        : 0,
      "ท่านใช้แอปพลิเคชันใดบ้างเป็นประจำ?_6": formData.apps.includes("Spotify")
        ? 1
        : 0,
      "ท่านใช้แอปพลิเคชันใดบ้างเป็นประจำ?_7": formData.apps.includes("WhatsApp")
        ? 1
        : 0,
      "ท่านใช้แอปพลิเคชันใดบ้างเป็นประจำ?_8": formData.apps.includes("TikTok")
        ? 1
        : 0,
      "ท่านใช้แอปพลิเคชันใดบ้างเป็นประจำ?_9": formData.apps.includes("Telegram")
        ? 1
        : 0,
      "ท่านใช้แอปพลิเคชันใดบ้างเป็นประจำ?_10": formData.apps.includes("Other")
        ? 1
        : 0,
      "กิจกรรมที่ใช้สมาร์ทโฟนมากที่สุด 3 อันดับ_1":
        formData.activities.includes("ดูหนัง / ฟังเพลง") ? 1 : 0,
      "กิจกรรมที่ใช้สมาร์ทโฟนมากที่สุด 3 อันดับ_2":
        formData.activities.includes("เล่นเกม") ? 1 : 0,
      "กิจกรรมที่ใช้สมาร์ทโฟนมากที่สุด 3 อันดับ_3":
        formData.activities.includes("ถ่ายรูป / ถ่ายวิดีโอ") ? 1 : 0,
      "กิจกรรมที่ใช้สมาร์ทโฟนมากที่สุด 3 อันดับ_4":
        formData.activities.includes("Application บน cloud") ? 1 : 0,
      "กิจกรรมที่ใช้สมาร์ทโฟนมากที่สุด 3 อันดับ_5":
        formData.activities.includes("ติดต่อสื่อสาร / ประชุมงาน") ? 1 : 0,
      "กิจกรรมที่ใช้สมาร์ทโฟนมากที่สุด 3 อันดับ_6":
        formData.activities.includes("โซเชียลมีเดีย") ? 1 : 0,
      ท่านใช้สมาร์ทโฟนนานเท่าใดในหนึ่งวัน_1:
        formData.dailyUsage === "0 - 1 ชั่วโมง" ? 1 : 0,
      ท่านใช้สมาร์ทโฟนนานเท่าใดในหนึ่งวัน_2:
        formData.dailyUsage === "1 - 3 ชั่วโมง" ? 1 : 0,
      ท่านใช้สมาร์ทโฟนนานเท่าใดในหนึ่งวัน_3:
        formData.dailyUsage === "3 - 5 ชั่วโมง" ? 1 : 0,
      ท่านใช้สมาร์ทโฟนนานเท่าใดในหนึ่งวัน_4:
        formData.dailyUsage === "มากกว่า 5 ชั่วโมง" ? 1 : 0,
      สมาร์ทโฟนสำคัญในชีวิตประจำวันอย่างไร_1:
        formData.importance === "จำเป็นมากที่สุด" ? 1 : 0,
      สมาร์ทโฟนสำคัญในชีวิตประจำวันอย่างไร_2:
        formData.importance === "จำเป็น" ? 1 : 0,
      สมาร์ทโฟนสำคัญในชีวิตประจำวันอย่างไร_3:
        formData.importance === "ไม่จำเป็น" ? 1 : 0,
      ปัจจัยที่พิจารณาเมื่อซื้อสมาร์ทโฟนออนไลน์มากที่สุด_1:
        formData.purchaseFactors === "ราคา" ? 1 : 0,
      ปัจจัยที่พิจารณาเมื่อซื้อสมาร์ทโฟนออนไลน์มากที่สุด_2:
        formData.purchaseFactors === "รีวิวสินค้า" ? 1 : 0,
      ปัจจัยที่พิจารณาเมื่อซื้อสมาร์ทโฟนออนไลน์มากที่สุด_3:
        formData.purchaseFactors === "ฟีเจอร์สินค้า" ? 1 : 0,
      ความพึงพอใจจากยี่ห้อสมาร์ทโฟนที่ใช้ในปัจจุบัน_1:
        parseInt(formData.satisfaction) === 1 ? 1 : 0,
      ความพึงพอใจจากยี่ห้อสมาร์ทโฟนที่ใช้ในปัจจุบัน_2:
        parseInt(formData.satisfaction) === 2 ? 1 : 0,
      ความพึงพอใจจากยี่ห้อสมาร์ทโฟนที่ใช้ในปัจจุบัน_3:
        parseInt(formData.satisfaction) === 3 ? 1 : 0,
      ความพึงพอใจจากยี่ห้อสมาร์ทโฟนที่ใช้ในปัจจุบัน_4:
        parseInt(formData.satisfaction) === 4 ? 1 : 0,
      ความพึงพอใจจากยี่ห้อสมาร์ทโฟนที่ใช้ในปัจจุบัน_5:
        parseInt(formData.satisfaction) === 5 ? 1 : 0,
      ปัญหาในการซื้อสมาร์ทโฟนออนไลน์_1:
        formData.onlinePurchaseIssues ===
        "ความกังวลเกี่ยวกับความปลอดภัยของการชำระเงิน"
          ? 1
          : 0,
      ปัญหาในการซื้อสมาร์ทโฟนออนไลน์_2:
        formData.onlinePurchaseIssues === "ไม่สามารถสัมผัสหรือลองสินค้าได้จริง"
          ? 1
          : 0,
      ปัญหาในการซื้อสมาร์ทโฟนออนไลน์_3:
        formData.onlinePurchaseIssues ===
        "ความไม่แน่นอนเกี่ยวกับการรับประกันและการบริการหลังการขาย"
          ? 1
          : 0,
      ปัญหาในการซื้อสมาร์ทโฟนออนไลน์_4:
        formData.onlinePurchaseIssues ===
        "ความล่าช้าในการจัดส่งหรือปัญหาในการจัดส่ง"
          ? 1
          : 0,
      ยี่ห้อสมาร์ทโฟนที่ใช้งานในปัจจุบัน_1:
        formData.currentBrand === "Apple" ? 1 : 0,
      ยี่ห้อสมาร์ทโฟนที่ใช้งานในปัจจุบัน_2:
        formData.currentBrand === "Samsung" ? 1 : 0,
      ยี่ห้อสมาร์ทโฟนที่ใช้งานในปัจจุบัน_3:
        formData.currentBrand === "Oppo" ? 1 : 0,
      ยี่ห้อสมาร์ทโฟนที่ใช้งานในปัจจุบัน_4:
        formData.currentBrand === "Vivo" ? 1 : 0,
      ยี่ห้อสมาร์ทโฟนที่ใช้งานในปัจจุบัน_5:
        formData.currentBrand === "Xiaomi" ? 1 : 0,
      ยี่ห้อสมาร์ทโฟนที่ใช้งานในปัจจุบัน_6:
        formData.currentBrand === "Other" ? 1 : 0,
    };
    if (!validateForm()) {
      return;
    }
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([data]), // Send data as an array
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setPrediction(result.prediction[0]); // Update to handle the response correctly
      setFormSubmitted(true);
      setModalIsOpen(true); // Open modal
    } catch (error) {
      setErrorMessage("เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง");
      console.error("Error:", error);
      // ตรวจสอบชนิดของข้อผิดพลาดและแสดงข้อความที่เหมาะสม
      if (error.response && error.response.status === 400) {
        // ข้อผิดพลาดจากการตรวจสอบความถูกต้องของข้อมูล
        const errorData = await error.response.json();
        alert("ข้อมูลไม่ถูกต้อง: " + errorData.message);
      } else if (error.response && error.response.status === 500) {
        // ข้อผิดพลาดจากเซิร์ฟเวอร์
        alert("เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ โปรดลองอีกครั้งภายหลัง");
      } else {
        // ข้อผิดพลาดอื่นๆ เช่น เครือข่ายขัดข้อง
        alert(
          "เกิดข้อผิดพลาดขณะประมวลผลคำขอของคุณ โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของคุณ"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewPrediction = () => {
    setFormSubmitted(false); // Reset form submission state
    setPrediction(null); // Clear the previous prediction
    setModalIsOpen(false); // Close modal
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="p-6 max-w-sm mx-auto bg-white rounded shadow-lg">
        {!formSubmitted ? (
          <form onSubmit={handleSubmit} aria-label="แบบฟอร์มการพยากรณ์">
            <div className="space-y-12 ">
              <div className="border-b border-gray-900/10 pb-12">
                <div className="mt-10 space-y-10">
                  <fieldset>
                    <legend className="text-xl font-semibold leading-6 text-gray-900">
                      แบบสอบถามเกี่ยวกับสมาร์ทโฟน
                    </legend>
                    <div className="mt-6 space-y-6">
                      <label
                        className="block text-sm font-medium leading-6 text-gray-900"
                        htmlFor="gender"
                      >
                        เพศ *
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="">เลือกเพศ</option>
                        <option value="ชาย">ชาย</option>
                        <option value="หญิง">หญิง</option>
                        <option value="อื่นๆ">อื่นๆ</option>
                      </select>
                    </div>

                    <div className="mt-6 space-y-6">
                      <label className="block text-gray-700 mb-2">
                        ช่วงอายุ *
                      </label>
                      <div className="space-y-4">
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="ageRange"
                              value="18-25 ปี"
                              checked={formData.ageRange === "18-25 ปี"}
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            18-25 ปี
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="ageRange"
                              value="26-32 ปี"
                              checked={formData.ageRange === "26-32 ปี"}
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            26-32 ปี
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="ageRange"
                              value="33-40 ปี"
                              checked={formData.ageRange === "33-40 ปี"}
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            33-40 ปี
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="ageRange"
                              value="41-50 ปี"
                              checked={formData.ageRange === "41-50 ปี"}
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            41-50 ปี
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="ageRange"
                              value="50-60 ปี"
                              checked={formData.ageRange === "50-60 ปี"}
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            50-60 ปี
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="ageRange"
                              value="60 ปีขึ้นไป"
                              checked={formData.ageRange === "60 ปีขึ้นไป"}
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            60 ปีขึ้นไป
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 space-y-6">
                      <label className="block text-gray-700 mb-2">
                        สถานภาพ *
                      </label>
                      <div className="space-y-4">
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="maritalStatus"
                              value="โสด"
                              checked={formData.maritalStatus === "โสด"}
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            โสด
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="maritalStatus"
                              value="สมรส"
                              checked={formData.maritalStatus === "สมรส"}
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            สมรส
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="maritalStatus"
                              value="หย่าร้าง"
                              checked={formData.maritalStatus === "หย่าร้าง"}
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            หย่าร้าง
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="maritalStatus"
                              value="แยกกันอยู่"
                              checked={formData.maritalStatus === "แยกกันอยู่"}
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            แยกกันอยู่
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 space-y-6">
                      <label className="block text-gray-700 mb-2">
                        อาชีพ *
                      </label>
                      <div className="space-y-4">
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="occupation"
                              value="นักเรียน / นักศึกษา"
                              checked={
                                formData.occupation === "นักเรียน / นักศึกษา"
                              }
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            นักเรียน / นักศึกษา
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="occupation"
                              value="พนักงานบริษัทเอกชน"
                              checked={
                                formData.occupation === "พนักงานบริษัทเอกชน"
                              }
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            พนักงานบริษัทเอกชน
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="occupation"
                              value="พนักงานข้าราชการ"
                              checked={
                                formData.occupation === "พนักงานข้าราชการ"
                              }
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            พนักงานข้าราชการ
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="occupation"
                              value="พนักงานรัฐวิสาหกิจ"
                              checked={
                                formData.occupation === "พนักงานรัฐวิสาหกิจ"
                              }
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            พนักงานรัฐวิสาหกิจ
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="occupation"
                              value="พนักงานโรงงานอุตสาหกรรม"
                              checked={
                                formData.occupation ===
                                "พนักงานโรงงานอุตสาหกรรม"
                              }
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            พนักงานโรงงานอุตสาหกรรม
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="occupation"
                              value="เจ้าของธุรกิจ/ธุรกิจส่วนตัว"
                              checked={
                                formData.occupation ===
                                "เจ้าของธุรกิจ/ธุรกิจส่วนตัว"
                              }
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            เจ้าของธุรกิจ/ธุรกิจส่วนตัว
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 space-y-6">
                      <label className="block text-gray-700 mb-2">
                        รายได้ต่อเดือน *
                      </label>
                      <div className="space-y-4">
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="income"
                              value="น้อยกว่า 15,000 บาท"
                              checked={
                                formData.income === "น้อยกว่า 15,000 บาท"
                              }
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            น้อยกว่า 15,000 บาท
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="income"
                              value="15,001 - 20,000 บาท"
                              checked={
                                formData.income === "15,001 - 20,000 บาท"
                              }
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            15,001 - 20,000 บาท
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="income"
                              value="20,001 - 30,000 บาท"
                              checked={
                                formData.income === "20,001 - 30,000 บาท"
                              }
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            20,001 - 30,000 บาท
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="income"
                              value="30,001 - 40,000 บาท"
                              checked={
                                formData.income === "30,001 - 40,000 บาท"
                              }
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            30,001 - 40,000 บาท
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="income"
                              value="40,001 - 50,000 บาท"
                              checked={
                                formData.income === "40,001 - 50,000 บาท"
                              }
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            40,001 - 50,000 บาท
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="income"
                              value="มากกว่า 50,001 บาทขึ้นไป"
                              checked={
                                formData.income === "มากกว่า 50,001 บาทขึ้นไป"
                              }
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            มากกว่า 50,001 บาทขึ้นไป
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 space-y-6">
                      <label className="block text-gray-700 mb-2">
                        ท่านใช้งานแอปพลิเคชันใดบ้างเป็นประจำ? *
                      </label>
                      <div className="flex flex-wrap gap-x-4 gap-y-2">
                        <label className="flex items-center gap-x-3">
                          <input
                            type="checkbox"
                            name="apps"
                            value="Instagram"
                            checked={formData.apps.includes("Instagram")}
                            onChange={handleChange}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          Instagram
                        </label>
                        <label className="flex items-center gap-x-3">
                          <input
                            type="checkbox"
                            name="apps"
                            value="Facebook"
                            checked={formData.apps.includes("Facebook")}
                            onChange={handleChange}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          Facebook
                        </label>
                        <label className="flex items-center gap-x-3">
                          <input
                            type="checkbox"
                            name="apps"
                            value="YouTube"
                            checked={formData.apps.includes("YouTube")}
                            onChange={handleChange}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          YouTube
                        </label>
                        <label className="flex items-center gap-x-3">
                          <input
                            type="checkbox"
                            name="apps"
                            value="Snapchat"
                            checked={formData.apps.includes("Snapchat")}
                            onChange={handleChange}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          Snapchat
                        </label>
                        <label className="flex items-center gap-x-3">
                          <input
                            type="checkbox"
                            name="apps"
                            value="Facebook Messenger"
                            checked={formData.apps.includes(
                              "Facebook Messenger"
                            )}
                            onChange={handleChange}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          Facebook Messenger
                        </label>
                        <label className="flex items-center gap-x-3">
                          <input
                            type="checkbox"
                            name="apps"
                            value="Spotify"
                            checked={formData.apps.includes("Spotify")}
                            onChange={handleChange}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          Spotify
                        </label>
                        <label className="flex items-center gap-x-3">
                          <input
                            type="checkbox"
                            name="apps"
                            value="WhatsApp"
                            checked={formData.apps.includes("WhatsApp")}
                            onChange={handleChange}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          WhatsApp
                        </label>
                        <label className="flex items-center gap-x-3">
                          <input
                            type="checkbox"
                            name="apps"
                            value="TikTok"
                            checked={formData.apps.includes("TikTok")}
                            onChange={handleChange}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          TikTok
                        </label>
                        <label className="flex items-center gap-x-3">
                          <input
                            type="checkbox"
                            name="apps"
                            value="Telegram"
                            checked={formData.apps.includes("Telegram")}
                            onChange={handleChange}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          Telegram
                        </label>
                        <label className="flex items-center gap-x-3">
                          <input
                            type="checkbox"
                            name="apps"
                            value="Other"
                            checked={formData.apps.includes("Other")}
                            onChange={handleChange}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          Other
                        </label>
                      </div>
                    </div>
                    <div className="mt-6 space-y-6">
                      <label className="block text-gray-700 mb-2">
                        กิจกรรมที่ใช้สมาร์ทโฟนมากที่สุด 3 อันดับ *
                      </label>
                      <div className="flex flex-wrap gap-x-4 gap-y-2">
                        <label className="flex items-center gap-x-3">
                          <input
                            type="checkbox"
                            name="activities"
                            value="ดูหนัง / ฟังเพลง"
                            checked={formData.activities.includes(
                              "ดูหนัง / ฟังเพลง"
                            )}
                            onChange={handleChange}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          ดูหนัง / ฟังเพลง
                        </label>
                        <label className="flex items-center gap-x-3">
                          <input
                            type="checkbox"
                            name="activities"
                            value="เล่นเกม"
                            checked={formData.activities.includes("เล่นเกม")}
                            onChange={handleChange}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          เล่นเกม
                        </label>
                        <label className="flex items-center gap-x-3">
                          <input
                            type="checkbox"
                            name="activities"
                            value="ถ่ายรูป / ถ่ายวิดีโอ"
                            checked={formData.activities.includes(
                              "ถ่ายรูป / ถ่ายวิดีโอ"
                            )}
                            onChange={handleChange}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          ถ่ายรูป / ถ่ายวิดีโอ
                        </label>
                        <label className="flex items-center gap-x-3">
                          <input
                            type="checkbox"
                            name="activities"
                            value="Application บน cloud"
                            checked={formData.activities.includes(
                              "Application บน cloud"
                            )}
                            onChange={handleChange}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          Application บน cloud
                        </label>
                        <label className="flex items-center gap-x-3">
                          <input
                            type="checkbox"
                            name="activities"
                            value="ติดต่อสื่อสาร / ประชุมงาน"
                            checked={formData.activities.includes(
                              "ติดต่อสื่อสาร / ประชุมงาน"
                            )}
                            onChange={handleChange}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          ติดต่อสื่อสาร / ประชุมงาน
                        </label>
                        <label className="flex items-center gap-x-3">
                          <input
                            type="checkbox"
                            name="activities"
                            value="โซเชียลมีเดีย"
                            checked={formData.activities.includes(
                              "โซเชียลมีเดีย"
                            )}
                            onChange={handleChange}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          โซเชียลมีเดีย
                        </label>
                      </div>
                    </div>
                    <div className="mt-6 space-y-6">
                      <label className="block text-gray-700 mb-2">
                        ท่านใช้สมาร์ทโฟนนานเท่าใดในหนึ่งวัน *
                      </label>
                      <div className="space-y-4">
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="dailyUsage"
                              value="0 - 1 ชั่วโมง"
                              checked={formData.dailyUsage === "0 - 1 ชั่วโมง"}
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            0 - 1 ชั่วโมง
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="dailyUsage"
                              value="1 - 3 ชั่วโมง"
                              checked={formData.dailyUsage === "1 - 3 ชั่วโมง"}
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            1 - 3 ชั่วโมง
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="dailyUsage"
                              value="3 - 5 ชั่วโมง"
                              checked={formData.dailyUsage === "3 - 5 ชั่วโมง"}
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            3 - 5 ชั่วโมง
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="dailyUsage"
                              value="มากกว่า 5 ชั่วโมง"
                              checked={
                                formData.dailyUsage === "มากกว่า 5 ชั่วโมง"
                              }
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            มากกว่า 5 ชั่วโมง
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 space-y-6">
                      <label className="block text-gray-700 mb-2">
                        สมาร์ทโฟนสำคัญในชีวิตประจำวันอย่างไร *
                      </label>
                      <div className="space-y-4">
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="importance"
                              value="จำเป็นมากที่สุด"
                              checked={
                                formData.importance === "จำเป็นมากที่สุด"
                              }
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            จำเป็นมากที่สุด
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="importance"
                              value="จำเป็น"
                              checked={formData.importance === "จำเป็น"}
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            จำเป็น
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="importance"
                              value="ไม่จำเป็น"
                              checked={formData.importance === "ไม่จำเป็น"}
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            ไม่จำเป็น
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 space-y-6">
                      <label className="block text-gray-700 mb-2">
                        ปัจจัยที่พิจารณาเมื่อซื้อสมาร์ทโฟนออนไลน์มากที่สุด *
                      </label>
                      <div className="space-y-4">
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="purchaseFactors"
                              value="ราคา"
                              checked={formData.purchaseFactors === "ราคา"}
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            ราคา
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="purchaseFactors"
                              value="รีวิวสินค้า"
                              checked={
                                formData.purchaseFactors === "รีวิวสินค้า"
                              }
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            รีวิวสินค้า
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="purchaseFactors"
                              value="ฟีเจอร์สินค้า"
                              checked={
                                formData.purchaseFactors === "ฟีเจอร์สินค้า"
                              }
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            ฟีเจอร์สินค้า
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 space-y-6">
                      <label className="block text-gray-700 mb-2">
                        ความพึงพอใจจากยี่ห้อสมาร์ทโฟนที่ใช้งานในปัจจุบัน *
                      </label>
                      <div className="space-y-4">
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="satisfaction"
                              value="1"
                              checked={formData.satisfaction === "1"}
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            1
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="satisfaction"
                              value="2"
                              checked={formData.satisfaction === "2"}
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            2
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="satisfaction"
                              value="3"
                              checked={formData.satisfaction === "3"}
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            3
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="satisfaction"
                              value="4"
                              checked={formData.satisfaction === "4"}
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            4
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="satisfaction"
                              value="5"
                              checked={formData.satisfaction === "5"}
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            5
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 space-y-6">
                      <label className="block text-gray-700 mb-2">
                        ปัญหาในการซื้อสมาร์ทโฟนออนไลน์ *
                      </label>
                      <div className="space-y-4">
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="onlinePurchaseIssues"
                              value="ความกังวลเกี่ยวกับความปลอดภัยของการชำระเงิน"
                              checked={
                                formData.onlinePurchaseIssues ===
                                "ความกังวลเกี่ยวกับความปลอดภัยของการชำระเงิน"
                              }
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            ความกังวลเกี่ยวกับความปลอดภัยของการชำระเงิน
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="onlinePurchaseIssues"
                              value="ไม่สามารถสัมผัสหรือลองสินค้าได้จริง"
                              checked={
                                formData.onlinePurchaseIssues ===
                                "ไม่สามารถสัมผัสหรือลองสินค้าได้จริง"
                              }
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            ไม่สามารถสัมผัสหรือลองสินค้าได้จริง
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="onlinePurchaseIssues"
                              value="ความไม่แน่นอนเกี่ยวกับการรับประกันและการบริการหลังการขาย"
                              checked={
                                formData.onlinePurchaseIssues ===
                                "ความไม่แน่นอนเกี่ยวกับการรับประกันและการบริการหลังการขาย"
                              }
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            ความไม่แน่นอนเกี่ยวกับการรับประกันและการบริการหลังการขาย
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="onlinePurchaseIssues"
                              value="ความล่าช้าในการจัดส่งหรือปัญหาในการจัดส่ง"
                              checked={
                                formData.onlinePurchaseIssues ===
                                "ความล่าช้าในการจัดส่งหรือปัญหาในการจัดส่ง"
                              }
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            ความล่าช้าในการจัดส่งหรือปัญหาในการจัดส่ง
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 space-y-6">
                      <label className="block text-gray-700 mb-2">
                        ยี่ห้อสมาร์ทโฟนที่ใช้งานในปัจจุบัน *
                      </label>
                      <div className="space-y-4">
                        {["Apple", "Samsung", "Oppo", "Vivo", "Xiaomi"].map(
                          (brand) => (
                            <div
                              key={brand}
                              className="flex items-center gap-x-3"
                            >
                              <label className="flex items-center gap-x-3">
                                <input
                                  type="radio"
                                  name="currentBrand"
                                  value={brand}
                                  checked={formData.currentBrand === brand}
                                  onChange={handleChange}
                                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                />
                                {brand}
                              </label>
                            </div>
                          )
                        )}
                        <div className="flex items-center gap-x-3">
                          <label className="flex items-center gap-x-3">
                            <input
                              type="radio"
                              name="currentBrand"
                              value="Other"
                              checked={formData.currentBrand === "Other"}
                              onChange={handleChange}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            Other
                          </label>
                          {formData.currentBrand === "Other" && (
                            <input
                              type="text"
                              name="otherBrand"
                              value={formData.otherBrand || ""}
                              onChange={handleChange}
                              placeholder="โปรดระบุยี่ห้อ"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </fieldset>
                  {/* แสดงข้อความข้อผิดพลาด */}
                  {errorMessage && (
                    <p style={{ color: "red" }}>{errorMessage}</p>
                  )}
                  {!formSubmitted ? (
                    <button
                      type="submit"
                      disabled={loading}
                      aria-disabled={loading}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      {loading ? "กำลังส่ง..." : "ส่งแบบสอบถาม"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNewPrediction}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      พยากรณ์ใหม่
                    </button>
                  )}
                  {loading && (
                    <div className="flex items-center justify-center">
                      <ClipLoader color="#3498db" loading={loading} size={50} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        ) : null}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleNewPrediction}
        
      >
        <SmartphonePrediction
          prediction={prediction}
          handleNewPrediction={handleNewPrediction}
        />
      </Modal>
    </div>
  );
}

export default memo(Form);
