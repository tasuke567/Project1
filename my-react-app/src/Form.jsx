import React, { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Modal from "react-modal";

Modal.setAppElement("#root");

function Form() {
  const [formData, setFormData] = useState({
    gender: "",
    ageRange: "",
    maritalStatus: "",
    occupation: "",
    income: "",
    apps: [],
    activities: [],
    dailyUsage: "",
    importance: "",
    purchaseFactors: "",
    satisfaction: "",
    onlinePurchaseIssues: "",
    currentBrand: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
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

    try {
      const response = await fetch(
        "https://project1-l0cx.onrender.com/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([data]), // Send data as an array
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setPrediction(result.prediction[0]); // Update to handle the response correctly
      setFormSubmitted(true);
      setModalIsOpen(true);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing your request.");
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleNewPrediction = () => {
    setFormSubmitted(false); // Reset form submission state
    setPrediction(null); // Clear the previous prediction
    setModalIsOpen(false);
  };
  const brandMapping = {
    0: "Apple",
    1: "Samsung",
    2: "Oppo",
    3: "Vivo",
    4: "Xiaomi",
    5: "Other",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {!formSubmitted && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-lg w-full max-w-md"
        >
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <div className="mt-10 space-y-10">
                <fieldset>
                  <legend className="text-sm font-semibold leading-6 text-gray-900">
                    แบบสอบถามเกี่ยวกับสมาร์ทโฟน
                  </legend>
                  <div className="mt-6 space-y-6">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      เพศ *
                    </label>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="gender"
                        value="ชาย"
                        checked={formData.gender === "ชาย"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      ชาย
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="gender"
                        value="หญิง"
                        checked={formData.gender === "หญิง"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      หญิง
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="gender"
                        value="อื่นๆ"
                        checked={formData.gender === "อื่นๆ"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      อื่นๆ
                    </div>
                  </div>

                  <div className="mt-6 space-y-6">
                    <label className="block text-gray-700 mb-2">
                      ช่วงอายุ *
                    </label>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="ageRange"
                        value="18-25 ปี"
                        checked={formData.ageRange === "18-25 ปี"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      18-25 ปี
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="ageRange"
                        value="26-32 ปี"
                        checked={formData.ageRange === "26-32 ปี"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      26-32 ปี
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="ageRange"
                        value="33-40 ปี"
                        checked={formData.ageRange === "33-40 ปี"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      33-40 ปี
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="ageRange"
                        value="41-50 ปี"
                        checked={formData.ageRange === "41-50 ปี"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      41-50 ปี
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="ageRange"
                        value="50-60 ปี"
                        checked={formData.ageRange === "50-60 ปี"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      50-60 ปี
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="ageRange"
                        value="60 ปีขึ้นไป"
                        checked={formData.ageRange === "60 ปีขึ้นไป"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      60 ปีขึ้นไป
                    </div>
                  </div>

                  <div className="mt-6 space-y-6">
                    <label className="block text-gray-700 mb-2">
                      สถานภาพ *
                    </label>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="maritalStatus"
                        value="โสด"
                        checked={formData.maritalStatus === "โสด"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      โสด
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="maritalStatus"
                        value="สมรส"
                        checked={formData.maritalStatus === "สมรส"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      สมรส
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="maritalStatus"
                        value="หย่าร้าง"
                        checked={formData.maritalStatus === "หย่าร้าง"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      หย่าร้าง
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="maritalStatus"
                        value="แยกกันอยู่"
                        checked={formData.maritalStatus === "แยกกันอยู่"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      แยกกันอยู่
                    </div>
                  </div>

                  <div className="mt-6 space-y-6">
                    <label className="block text-gray-700 mb-2">อาชีพ *</label>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="occupation"
                        value="นักเรียน / นักศึกษา"
                        checked={formData.occupation === "นักเรียน / นักศึกษา"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      นักเรียน / นักศึกษา
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="occupation"
                        value="พนักงานบริษัทเอกชน"
                        checked={formData.occupation === "พนักงานบริษัทเอกชน"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      พนักงานบริษัทเอกชน
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="occupation"
                        value="พนักงานข้าราชการ"
                        checked={formData.occupation === "พนักงานข้าราชการ"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      พนักงานข้าราชการ
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="occupation"
                        value="พนักงานรัฐวิสาหกิจ"
                        checked={formData.occupation === "พนักงานรัฐวิสาหกิจ"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      พนักงานรัฐวิสาหกิจ
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="occupation"
                        value="พนักงานโรงงานอุตสาหกรรม"
                        checked={
                          formData.occupation === "พนักงานโรงงานอุตสาหกรรม"
                        }
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      พนักงานโรงงานอุตสาหกรรม
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="occupation"
                        value="เจ้าของธุรกิจ/ธุรกิจส่วนตัว"
                        checked={
                          formData.occupation === "เจ้าของธุรกิจ/ธุรกิจส่วนตัว"
                        }
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      เจ้าของธุรกิจ/ธุรกิจส่วนตัว
                    </div>
                  </div>

                  <div className="mt-6 space-y-6">
                    <label className="block text-gray-700 mb-2">
                      รายได้ต่อเดือน *
                    </label>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="income"
                        value="น้อยกว่า 15,000 บาท"
                        checked={formData.income === "น้อยกว่า 15,000 บาท"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      น้อยกว่า 15,000 บาท
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="income"
                        value="15,001 - 20,000 บาท"
                        checked={formData.income === "15,001 - 20,000 บาท"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      15,001 - 20,000 บาท
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="income"
                        value="20,001 - 30,000 บาท"
                        checked={formData.income === "20,001 - 30,000 บาท"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      20,001 - 30,000 บาท
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="income"
                        value="30,001 - 40,000 บาท"
                        checked={formData.income === "30,001 - 40,000 บาท"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      30,001 - 40,000 บาท
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="income"
                        value="40,001 - 50,000 บาท"
                        checked={formData.income === "40,001 - 50,000 บาท"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      40,001 - 50,000 บาท
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="income"
                        value="มากกว่า 50,001 บาทขึ้นไป"
                        checked={formData.income === "มากกว่า 50,001 บาทขึ้นไป"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      มากกว่า 50,001 บาทขึ้นไป
                    </div>
                  </div>

                  <div className="mt-6 space-y-6">
                    <label className="block text-gray-700 mb-2">
                      ท่านใช้งานแอปพลิเคชันใดบ้างเป็นประจำ? *
                    </label>
                    <div className="flex flex-wrap items-center gap-x-3">
                      <label className="inline-flex items-center mr-4">
                        <input
                          type="checkbox"
                          name="apps"
                          value="Instagram"
                          checked={formData.apps.includes("Instagram")}
                          onChange={handleChange}
                          className="form-checkbox"
                        />
                        <span className="ml-2">Instagram</span>
                      </label>
                      <label className="inline-flex items-center mr-4">
                        <input
                          type="checkbox"
                          name="apps"
                          value="Facebook"
                          checked={formData.apps.includes("Facebook")}
                          onChange={handleChange}
                          className="form-checkbox"
                        />
                        <span className="ml-2">Facebook</span>
                      </label>
                      <label className="inline-flex items-center mr-4">
                        <input
                          type="checkbox"
                          name="apps"
                          value="YouTube"
                          checked={formData.apps.includes("YouTube")}
                          onChange={handleChange}
                          className="form-checkbox"
                        />
                        <span className="ml-2">YouTube</span>
                      </label>
                      <label className="inline-flex items-center mr-4">
                        <input
                          type="checkbox"
                          name="apps"
                          value="Snapchat"
                          checked={formData.apps.includes("Snapchat")}
                          onChange={handleChange}
                          className="form-checkbox"
                        />
                        <span className="ml-2">Snapchat</span>
                      </label>
                      <label className="inline-flex items-center mr-4">
                        <input
                          type="checkbox"
                          name="apps"
                          value="Facebook Messenger"
                          checked={formData.apps.includes("Facebook Messenger")}
                          onChange={handleChange}
                          className="form-checkbox"
                        />
                        <span className="ml-2">Facebook Messenger</span>
                      </label>
                      <label className="inline-flex items-center mr-4">
                        <input
                          type="checkbox"
                          name="apps"
                          value="Spotify"
                          checked={formData.apps.includes("Spotify")}
                          onChange={handleChange}
                          className="form-checkbox"
                        />
                        <span className="ml-2">Spotify</span>
                      </label>
                      <label className="inline-flex items-center mr-4">
                        <input
                          type="checkbox"
                          name="apps"
                          value="WhatsApp"
                          checked={formData.apps.includes("WhatsApp")}
                          onChange={handleChange}
                          className="form-checkbox"
                        />
                        <span className="ml-2">WhatsApp</span>
                      </label>
                      <label className="inline-flex items-center mr-4">
                        <input
                          type="checkbox"
                          name="apps"
                          value="TikTok"
                          checked={formData.apps.includes("TikTok")}
                          onChange={handleChange}
                          className="form-checkbox"
                        />
                        <span className="ml-2">TikTok</span>
                      </label>
                      <label className="inline-flex items-center mr-4">
                        <input
                          type="checkbox"
                          name="apps"
                          value="Telegram"
                          checked={formData.apps.includes("Telegram")}
                          onChange={handleChange}
                          className="form-checkbox"
                        />
                        <span className="ml-2">Telegram</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          name="apps"
                          value="Other"
                          checked={formData.apps.includes("Other")}
                          onChange={handleChange}
                          className="form-checkbox"
                        />
                        <span className="ml-2">Other</span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-6 space-y-6">
                    <label className="block text-gray-700 mb-2">
                      กิจกรรมที่ใช้สมาร์ทโฟนมากที่สุด 3 อันดับ *
                    </label>
                    <div className="flex flex-wrap items-center gap-x-3">
                      <label className="inline-flex items-center mr-4">
                        <input
                          type="checkbox"
                          name="activities"
                          value="ดูหนัง / ฟังเพลง"
                          checked={formData.activities.includes(
                            "ดูหนัง / ฟังเพลง"
                          )}
                          onChange={handleChange}
                          className="form-checkbox"
                        />
                        <span className="ml-2">ดูหนัง / ฟังเพลง</span>
                      </label>
                      <label className="inline-flex items-center mr-4">
                        <input
                          type="checkbox"
                          name="activities"
                          value="เล่นเกม"
                          checked={formData.activities.includes("เล่นเกม")}
                          onChange={handleChange}
                          className="form-checkbox"
                        />
                        <span className="ml-2">เล่นเกม</span>
                      </label>
                      <label className="inline-flex items-center mr-4">
                        <input
                          type="checkbox"
                          name="activities"
                          value="ถ่ายรูป / ถ่ายวิดีโอ"
                          checked={formData.activities.includes(
                            "ถ่ายรูป / ถ่ายวิดีโอ"
                          )}
                          onChange={handleChange}
                          className="form-checkbox"
                        />
                        <span className="ml-2">ถ่ายรูป / ถ่ายวิดีโอ</span>
                      </label>
                      <label className="inline-flex items-center mr-4">
                        <input
                          type="checkbox"
                          name="activities"
                          value="Application บน cloud"
                          checked={formData.activities.includes(
                            "Application บน cloud"
                          )}
                          onChange={handleChange}
                          className="form-checkbox"
                        />
                        <span className="ml-2">Application บน cloud</span>
                      </label>
                      <label className="inline-flex items-center mr-4">
                        <input
                          type="checkbox"
                          name="activities"
                          value="ติดต่อสื่อสาร / ประชุมงาน"
                          checked={formData.activities.includes(
                            "ติดต่อสื่อสาร / ประชุมงาน"
                          )}
                          onChange={handleChange}
                          className="form-checkbox"
                        />
                        <span className="ml-2">ติดต่อสื่อสาร / ประชุมงาน</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          name="activities"
                          value="โซเชียลมีเดีย"
                          checked={formData.activities.includes(
                            "โซเชียลมีเดีย"
                          )}
                          onChange={handleChange}
                          className="form-checkbox"
                        />
                        <span className="ml-2">โซเชียลมีเดีย</span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-6 space-y-6">
                    <label className="block text-gray-700 mb-2">
                      ท่านใช้สมาร์ทโฟนนานเท่าใดในหนึ่งวัน *
                    </label>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="dailyUsage"
                        value="0 - 1 ชั่วโมง"
                        checked={formData.dailyUsage === "0 - 1 ชั่วโมง"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      0 - 1 ชั่วโมง
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="dailyUsage"
                        value="1 - 3 ชั่วโมง"
                        checked={formData.dailyUsage === "1 - 3 ชั่วโมง"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      1 - 3 ชั่วโมง
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="dailyUsage"
                        value="3 - 5 ชั่วโมง"
                        checked={formData.dailyUsage === "3 - 5 ชั่วโมง"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      3 - 5 ชั่วโมง
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="dailyUsage"
                        value="มากกว่า 5 ชั่วโมง"
                        checked={formData.dailyUsage === "มากกว่า 5 ชั่วโมง"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      มากกว่า 5 ชั่วโมง
                    </div>
                  </div>

                  <div className="mt-6 space-y-6">
                    <label className="block text-gray-700 mb-2">
                      สมาร์ทโฟนสำคัญในชีวิตประจำวันอย่างไร *
                    </label>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="importance"
                        value="จำเป็นมากที่สุด"
                        checked={formData.importance === "จำเป็นมากที่สุด"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      จำเป็นมากที่สุด
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="importance"
                        value="จำเป็น"
                        checked={formData.importance === "จำเป็น"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      จำเป็น
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="importance"
                        value="ไม่จำเป็น"
                        checked={formData.importance === "ไม่จำเป็น"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      ไม่จำเป็น
                    </div>
                  </div>

                  <div className="mt-6 space-y-6">
                    <label className="block text-gray-700 mb-2">
                      ปัจจัยที่พิจารณาเมื่อซื้อสมาร์ทโฟนออนไลน์มากที่สุด *
                    </label>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="purchaseFactors"
                        value="ราคา"
                        checked={formData.purchaseFactors === "ราคา"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      ราคา
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="purchaseFactors"
                        value="รีวิวสินค้า"
                        checked={formData.purchaseFactors === "รีวิวสินค้า"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      รีวิวสินค้า
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="purchaseFactors"
                        value="ฟีเจอร์สินค้า"
                        checked={formData.purchaseFactors === "ฟีเจอร์สินค้า"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      ฟีเจอร์สินค้า
                    </div>
                  </div>

                  <div className="mt-6 space-y-6">
                    <label className="block text-gray-700 mb-2">
                      ความพึงพอใจจากยี่ห้อสมาร์ทโฟนที่ใช้งานในปัจจุบัน *
                    </label>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="satisfaction"
                        value="1"
                        checked={formData.satisfaction === "1"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      1
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="satisfaction"
                        value="2"
                        checked={formData.satisfaction === "2"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      2
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="satisfaction"
                        value="3"
                        checked={formData.satisfaction === "3"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      3
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="satisfaction"
                        value="4"
                        checked={formData.satisfaction === "4"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      4
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="satisfaction"
                        value="5"
                        checked={formData.satisfaction === "5"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      5
                    </div>
                  </div>

                  <div className="mt-6 space-y-6">
                    <label className="block text-gray-700 mb-2">
                      ปัญหาในการซื้อสมาร์ทโฟนออนไลน์ *
                    </label>
                    <div className="flex items-center gap-x-3">
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
                    </div>
                    <div className="flex items-center gap-x-3">
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
                    </div>
                    <div className="flex items-center gap-x-3">
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
                    </div>
                    <div className="flex items-center gap-x-3">
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
                    </div>
                  </div>

                  <div className="mt-6 space-y-6">
                    <label className="block text-gray-700 mb-2">
                      ยี่ห้อสมาร์ทโฟนที่ใช้งานในปัจจุบัน *
                    </label>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="currentBrand"
                        value="Apple"
                        checked={formData.currentBrand === "Apple"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      Apple
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="currentBrand"
                        value="Samsung"
                        checked={formData.currentBrand === "Samsung"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      Samsung
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="currentBrand"
                        value="Oppo"
                        checked={formData.currentBrand === "Oppo"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      Oppo
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="currentBrand"
                        value="Vivo"
                        checked={formData.currentBrand === "Vivo"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      Vivo
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="currentBrand"
                        value="Xiaomi"
                        checked={formData.currentBrand === "Xiaomi"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      Xiaomi
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        type="radio"
                        name="currentBrand"
                        value="Other"
                        checked={formData.currentBrand === "Other"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      Other
                    </div>
                  </div>
                </fieldset>
                {!formSubmitted ? (
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    ส่งแบบสอบถาม
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
              </div>
            </div>
          </div>
        </form>
      )}

      {loading && (
        <div className="flex justify-center m-1">
          <ClipLoader color="#3498db" loading={loading} size={50} />
        </div>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleNewPrediction}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
          {prediction !== null && (
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">ผลการพยากรณ์:</h2>
              <p>
                ยี่ห้อสมาร์ทโฟนที่ท่านควรเลือกคือ: {brandMapping[prediction]}
              </p>
            </div>
          )}
          <button
            onClick={handleNewPrediction}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            พยากรณ์ใหม่
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Form;
