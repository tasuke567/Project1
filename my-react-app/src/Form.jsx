import React, { useState } from "react";

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
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing your request.");
    }
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
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">แบบสอบถามเกี่ยวกับสมาร์ทโฟน</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">เพศ *</label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="gender"
              value="ชาย"
              checked={formData.gender === "ชาย"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">ชาย</span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="gender"
              value="หญิง"
              checked={formData.gender === "หญิง"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">หญิง</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="gender"
              value="อื่นๆ"
              checked={formData.gender === "อื่นๆ"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">อื่นๆ</span>
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">ช่วงอายุ *</label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="ageRange"
              value="18-25 ปี"
              checked={formData.ageRange === "18-25 ปี"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">18-25 ปี</span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="ageRange"
              value="26-32 ปี"
              checked={formData.ageRange === "26-32 ปี"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">26-32 ปี</span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="ageRange"
              value="33-40 ปี"
              checked={formData.ageRange === "33-40 ปี"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">33-40 ปี</span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="ageRange"
              value="41-50 ปี"
              checked={formData.ageRange === "41-50 ปี"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">41-50 ปี</span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="ageRange"
              value="50-60 ปี"
              checked={formData.ageRange === "50-60 ปี"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">50-60 ปี</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="ageRange"
              value="60 ปีขึ้นไป"
              checked={formData.ageRange === "60 ปีขึ้นไป"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">60 ปีขึ้นไป</span>
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">สถานภาพ *</label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="maritalStatus"
              value="โสด"
              checked={formData.maritalStatus === "โสด"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">โสด</span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="maritalStatus"
              value="สมรส"
              checked={formData.maritalStatus === "สมรส"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">สมรส</span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="maritalStatus"
              value="หย่าร้าง"
              checked={formData.maritalStatus === "หย่าร้าง"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">หย่าร้าง</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="maritalStatus"
              value="แยกกันอยู่"
              checked={formData.maritalStatus === "แยกกันอยู่"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">แยกกันอยู่</span>
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">อาชีพ *</label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="occupation"
              value="นักเรียน / นักศึกษา"
              checked={formData.occupation === "นักเรียน / นักศึกษา"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">นักเรียน / นักศึกษา</span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="occupation"
              value="พนักงานบริษัทเอกชน"
              checked={formData.occupation === "พนักงานบริษัทเอกชน"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">พนักงานบริษัทเอกชน</span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="occupation"
              value="พนักงานข้าราชการ"
              checked={formData.occupation === "พนักงานข้าราชการ"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">พนักงานข้าราชการ</span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="occupation"
              value="พนักงานรัฐวิสาหกิจ"
              checked={formData.occupation === "พนักงานรัฐวิสาหกิจ"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">พนักงานรัฐวิสาหกิจ</span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="occupation"
              value="พนักงานโรงงานอุตสาหกรรม"
              checked={formData.occupation === "พนักงานโรงงานอุตสาหกรรม"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">พนักงานโรงงานอุตสาหกรรม</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="occupation"
              value="เจ้าของธุรกิจ/ธุรกิจส่วนตัว"
              checked={formData.occupation === "เจ้าของธุรกิจ/ธุรกิจส่วนตัว"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">เจ้าของธุรกิจ/ธุรกิจส่วนตัว</span>
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">รายได้ต่อเดือน *</label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="income"
              value="น้อยกว่า 15,000 บาท"
              checked={formData.income === "น้อยกว่า 15,000 บาท"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">น้อยกว่า 15,000 บาท</span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="income"
              value="15,001 - 20,000 บาท"
              checked={formData.income === "15,001 - 20,000 บาท"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">15,001 - 20,000 บาท</span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="income"
              value="20,001 - 30,000 บาท"
              checked={formData.income === "20,001 - 30,000 บาท"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">20,001 - 30,000 บาท</span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="income"
              value="30,001 - 40,000 บาท"
              checked={formData.income === "30,001 - 40,000 บาท"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">30,001 - 40,000 บาท</span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="income"
              value="40,001 - 50,000 บาท"
              checked={formData.income === "40,001 - 50,000 บาท"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">40,001 - 50,000 บาท</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="income"
              value="มากกว่า 50,001 บาทขึ้นไป"
              checked={formData.income === "มากกว่า 50,001 บาทขึ้นไป"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">มากกว่า 50,001 บาทขึ้นไป</span>
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            ท่านใช้งานแอปพลิเคชันใดบ้างเป็นประจำ? *
          </label>
          <div className="flex flex-wrap">
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

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            กิจกรรมที่ใช้สมาร์ทโฟนมากที่สุด 3 อันดับ *
          </label>
          <div className="flex flex-wrap">
            <label className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                name="activities"
                value="ดูหนัง / ฟังเพลง"
                checked={formData.activities.includes("ดูหนัง / ฟังเพลง")}
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
                checked={formData.activities.includes("ถ่ายรูป / ถ่ายวิดีโอ")}
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
                checked={formData.activities.includes("Application บน cloud")}
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
                checked={formData.activities.includes("โซเชียลมีเดีย")}
                onChange={handleChange}
                className="form-checkbox"
              />
              <span className="ml-2">โซเชียลมีเดีย</span>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            ท่านใช้สมาร์ทโฟนนานเท่าใดในหนึ่งวัน *
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="dailyUsage"
              value="0 - 1 ชั่วโมง"
              checked={formData.dailyUsage === "0 - 1 ชั่วโมง"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">0 - 1 ชั่วโมง</span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="dailyUsage"
              value="1 - 3 ชั่วโมง"
              checked={formData.dailyUsage === "1 - 3 ชั่วโมง"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">1 - 3 ชั่วโมง</span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="dailyUsage"
              value="3 - 5 ชั่วโมง"
              checked={formData.dailyUsage === "3 - 5 ชั่วโมง"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">3 - 5 ชั่วโมง</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="dailyUsage"
              value="มากกว่า 5 ชั่วโมง"
              checked={formData.dailyUsage === "มากกว่า 5 ชั่วโมง"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">มากกว่า 5 ชั่วโมง</span>
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            สมาร์ทโฟนสำคัญในชีวิตประจำวันอย่างไร *
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="importance"
              value="จำเป็นมากที่สุด"
              checked={formData.importance === "จำเป็นมากที่สุด"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">จำเป็นมากที่สุด</span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="importance"
              value="จำเป็น"
              checked={formData.importance === "จำเป็น"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">จำเป็น</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="importance"
              value="ไม่จำเป็น"
              checked={formData.importance === "ไม่จำเป็น"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">ไม่จำเป็น</span>
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            ปัจจัยที่พิจารณาเมื่อซื้อสมาร์ทโฟนออนไลน์มากที่สุด *
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="purchaseFactors"
              value="ราคา"
              checked={formData.purchaseFactors === "ราคา"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">ราคา</span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="purchaseFactors"
              value="รีวิวสินค้า"
              checked={formData.purchaseFactors === "รีวิวสินค้า"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">รีวิวสินค้า</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="purchaseFactors"
              value="ฟีเจอร์สินค้า"
              checked={formData.purchaseFactors === "ฟีเจอร์สินค้า"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">ฟีเจอร์สินค้า</span>
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            ความพึงพอใจจากยี่ห้อสมาร์ทโฟนที่ใช้งานในปัจจุบัน *
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="satisfaction"
              value="1"
              checked={formData.satisfaction === "1"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">1</span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="satisfaction"
              value="2"
              checked={formData.satisfaction === "2"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">2</span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="satisfaction"
              value="3"
              checked={formData.satisfaction === "3"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">3</span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="satisfaction"
              value="4"
              checked={formData.satisfaction === "4"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">4</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="satisfaction"
              value="5"
              checked={formData.satisfaction === "5"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">5</span>
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            ปัญหาในการซื้อสมาร์ทโฟนออนไลน์ *
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="onlinePurchaseIssues"
              value="ความกังวลเกี่ยวกับความปลอดภัยของการชำระเงิน"
              checked={
                formData.onlinePurchaseIssues ===
                "ความกังวลเกี่ยวกับความปลอดภัยของการชำระเงิน"
              }
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">
              ความกังวลเกี่ยวกับความปลอดภัยของการชำระเงิน
            </span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="onlinePurchaseIssues"
              value="ไม่สามารถสัมผัสหรือลองสินค้าได้จริง"
              checked={
                formData.onlinePurchaseIssues ===
                "ไม่สามารถสัมผัสหรือลองสินค้าได้จริง"
              }
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">ไม่สามารถสัมผัสหรือลองสินค้าได้จริง</span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="onlinePurchaseIssues"
              value="ความไม่แน่นอนเกี่ยวกับการรับประกันและการบริการหลังการขาย"
              checked={
                formData.onlinePurchaseIssues ===
                "ความไม่แน่นอนเกี่ยวกับการรับประกันและการบริการหลังการขาย"
              }
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">
              ความไม่แน่นอนเกี่ยวกับการรับประกันและการบริการหลังการขาย
            </span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="onlinePurchaseIssues"
              value="ความล่าช้าในการจัดส่งหรือปัญหาในการจัดส่ง"
              checked={
                formData.onlinePurchaseIssues ===
                "ความล่าช้าในการจัดส่งหรือปัญหาในการจัดส่ง"
              }
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">
              ความล่าช้าในการจัดส่งหรือปัญหาในการจัดส่ง
            </span>
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            ยี่ห้อสมาร์ทโฟนที่ใช้งานในปัจจุบัน *
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="currentBrand"
              value="Apple"
              checked={formData.currentBrand === "Apple"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">Apple</span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="currentBrand"
              value="Samsung"
              checked={formData.currentBrand === "Samsung"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">Samsung</span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="currentBrand"
              value="Oppo"
              checked={formData.currentBrand === "Oppo"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">Oppo</span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="currentBrand"
              value="Vivo"
              checked={formData.currentBrand === "Vivo"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">Vivo</span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="currentBrand"
              value="Xiaomi"
              checked={formData.currentBrand === "Xiaomi"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">Xiaomi</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="currentBrand"
              value="Other"
              checked={formData.currentBrand === "Other"}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">Other</span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          ส่งแบบสอบถาม
        </button>

        {prediction !== null && (
          <div className="mt-6 p-4 bg-green-100 text-green-800 rounded">
            <h2 className="text-xl font-bold">ผลการพยากรณ์:</h2>
            <p>ยี่ห้อสมาร์ทโฟนที่ท่านควรเลือกคือ: {brandMapping[prediction]}</p>
          </div>
        )}
      </form>
    </div>
  );
}

export default Form;
