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
    purchaseFactors: [],
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

 const handleSubmit = (event) => {
   event.preventDefault();
   const formData = new FormData(event.target);
   const data = {
     occupation: formData.get("occupation"),
     income: formData.get("income"),
     apps: formData.getAll("apps"), // Collect all selected apps
     activities: formData.getAll("activities"), // Collect all selected activities
     dailyUsage: formData.get("dailyUsage"),
     importance: formData.get("importance"),
     purchaseFactors: formData.getAll("purchaseFactors"), // Ensure this collects an array
     satisfaction: formData.get("satisfaction"),
     onlinePurchaseIssues: formData.get("onlinePurchaseIssues"),
     currentBrand: formData.get("currentBrand"),
   };
   console.log("Form data:", data); // Debugging log

   fetch("https://young-fjord-99605-f7d115ccd553.herokuapp.com/predict", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(data),
   })
     .then((response) => response.json())
     .then((result) => console.log(result))
     .catch((error) => console.error("Error:", error));
 };


  const brandMapping = {
    0: "Apple",
    1: "Samsung",
    2: "Oppo",
    3: "Vivo",
    4: "Xiaomi",
    5: "Other",
  };
if (prediction !== null) {
  return (
    <div>
      <h2>ผลการพยากรณ์:</h2>
      <p>ยี่ห้อสมาร์ทโฟนที่ท่านควรเลือกคือ: {brandMapping[prediction]}</p>
    </div>
  );
}
  return (
    <form onSubmit={handleSubmit}>
      <h1>แบบสอบถามเกี่ยวกับสมาร์ทโฟน</h1>
      <p>เพศ *</p>
      <label>
        <input
          type="radio"
          name="gender"
          value="ชาย"
          checked={formData.gender === "ชาย"}
          onChange={handleChange}
        />{" "}
        ชาย
      </label>
      <label>
        <input
          type="radio"
          name="gender"
          value="หญิง"
          checked={formData.gender === "หญิง"}
          onChange={handleChange}
        />{" "}
        หญิง
      </label>

      <p>ช่วงอายุ *</p>
      <label>
        <input
          type="radio"
          name="ageRange"
          value="18-25 ปี"
          checked={formData.ageRange === "18-25 ปี"}
          onChange={handleChange}
        />{" "}
        18-25 ปี
      </label>
      <label>
        <input
          type="radio"
          name="ageRange"
          value="26-32 ปี"
          checked={formData.ageRange === "26-32 ปี"}
          onChange={handleChange}
        />{" "}
        26-32 ปี
      </label>
      <label>
        <input
          type="radio"
          name="ageRange"
          value="33-40 ปี"
          checked={formData.ageRange === "33-40 ปี"}
          onChange={handleChange}
        />{" "}
        33-40 ปี
      </label>
      <label>
        <input
          type="radio"
          name="ageRange"
          value="41-50 ปี"
          checked={formData.ageRange === "41-50 ปี"}
          onChange={handleChange}
        />{" "}
        41-50 ปี
      </label>
      <label>
        <input
          type="radio"
          name="ageRange"
          value="50-60 ปี"
          checked={formData.ageRange === "50-60 ปี"}
          onChange={handleChange}
        />{" "}
        50-60 ปี
      </label>
      <label>
        <input
          type="radio"
          name="ageRange"
          value="60 ปีขึ้นไป"
          checked={formData.ageRange === "60 ปีขึ้นไป"}
          onChange={handleChange}
        />{" "}
        60 ปีขึ้นไป
      </label>

      <p>สถานภาพ *</p>
      <label>
        <input
          type="radio"
          name="maritalStatus"
          value="โสด"
          checked={formData.maritalStatus === "โสด"}
          onChange={handleChange}
        />{" "}
        โสด
      </label>
      <label>
        <input
          type="radio"
          name="maritalStatus"
          value="สมรส"
          checked={formData.maritalStatus === "สมรส"}
          onChange={handleChange}
        />{" "}
        สมรส
      </label>
      <label>
        <input
          type="radio"
          name="maritalStatus"
          value="หย่าร้าง"
          checked={formData.maritalStatus === "หย่าร้าง"}
          onChange={handleChange}
        />{" "}
        หย่าร้าง
      </label>
      <label>
        <input
          type="radio"
          name="maritalStatus"
          value="แยกกันอยู่"
          checked={formData.maritalStatus === "แยกกันอยู่"}
          onChange={handleChange}
        />{" "}
        แยกกันอยู่
      </label>

      <p>อาชีพ *</p>
      <label>
        <input
          type="radio"
          name="occupation"
          value="นักเรียน / นักศึกษา"
          checked={formData.occupation === "นักเรียน / นักศึกษา"}
          onChange={handleChange}
        />{" "}
        นักเรียน / นักศึกษา
      </label>
      <label>
        <input
          type="radio"
          name="occupation"
          value="พนักงานบริษัทเอกชน"
          checked={formData.occupation === "พนักงานบริษัทเอกชน"}
          onChange={handleChange}
        />{" "}
        พนักงานบริษัทเอกชน
      </label>
      <label>
        <input
          type="radio"
          name="occupation"
          value="พนักงานข้าราชการ"
          checked={formData.occupation === "พนักงานข้าราชการ"}
          onChange={handleChange}
        />{" "}
        พนักงานข้าราชการ
      </label>
      <label>
        <input
          type="radio"
          name="occupation"
          value="พนักงานรัฐวิสาหกิจ"
          checked={formData.occupation === "พนักงานรัฐวิสาหกิจ"}
          onChange={handleChange}
        />{" "}
        พนักงานรัฐวิสาหกิจ
      </label>
      <label>
        <input
          type="radio"
          name="occupation"
          value="พนักงานโรงงานอุตสาหกรรม"
          checked={formData.occupation === "พนักงานโรงงานอุตสาหกรรม"}
          onChange={handleChange}
        />{" "}
        พนักงานโรงงานอุตสาหกรรม
      </label>
      <label>
        <input
          type="radio"
          name="occupation"
          value="เจ้าของธุรกิจ/ธุรกิจส่วนตัว"
          checked={formData.occupation === "เจ้าของธุรกิจ/ธุรกิจส่วนตัว"}
          onChange={handleChange}
        />{" "}
        เจ้าของธุรกิจ/ธุรกิจส่วนตัว
      </label>

      <p>รายได้ต่อเดือน *</p>
      <label>
        <input
          type="radio"
          name="income"
          value="น้อยกว่า 15,000 บาท"
          checked={formData.income === "น้อยกว่า 15,000 บาท"}
          onChange={handleChange}
        />{" "}
        น้อยกว่า 15,000 บาท
      </label>
      <label>
        <input
          type="radio"
          name="income"
          value="15,001 - 20,000 บาท"
          checked={formData.income === "15,001 - 20,000 บาท"}
          onChange={handleChange}
        />{" "}
        15,001 - 20,000 บาท
      </label>
      <label>
        <input
          type="radio"
          name="income"
          value="20,001 - 30,000 บาท"
          checked={formData.income === "20,001 - 30,000 บาท"}
          onChange={handleChange}
        />{" "}
        20,001 - 30,000 บาท
      </label>
      <label>
        <input
          type="radio"
          name="income"
          value="30,001 - 40,000 บาท"
          checked={formData.income === "30,001 - 40,000 บาท"}
          onChange={handleChange}
        />{" "}
        30,001 - 40,000 บาท
      </label>
      <label>
        <input
          type="radio"
          name="income"
          value="40,001 - 50,000 บาท"
          checked={formData.income === "40,001 - 50,000 บาท"}
          onChange={handleChange}
        />{" "}
        40,001 - 50,000 บาท
      </label>
      <label>
        <input
          type="radio"
          name="income"
          value="มากกว่า 50,001 บาทขึ้นไป"
          checked={formData.income === "มากกว่า 50,001 บาทขึ้นไป"}
          onChange={handleChange}
        />{" "}
        มากกว่า 50,001 บาทขึ้นไป
      </label>

      <p>ท่านใช้งานแอปพลิเคชันใดบ้างเป็นประจำ? *</p>
      <label>
        <input
          type="checkbox"
          name="apps"
          value="Instagram"
          checked={formData.apps.includes("Instagram")}
          onChange={handleChange}
        />{" "}
        Instagram
      </label>
      <label>
        <input
          type="checkbox"
          name="apps"
          value="Facebook"
          checked={formData.apps.includes("Facebook")}
          onChange={handleChange}
        />{" "}
        Facebook
      </label>
      <label>
        <input
          type="checkbox"
          name="apps"
          value="YouTube"
          checked={formData.apps.includes("YouTube")}
          onChange={handleChange}
        />{" "}
        YouTube
      </label>
      <label>
        <input
          type="checkbox"
          name="apps"
          value="Snapchat"
          checked={formData.apps.includes("Snapchat")}
          onChange={handleChange}
        />{" "}
        Snapchat
      </label>
      <label>
        <input
          type="checkbox"
          name="apps"
          value="Facebook Messenger"
          checked={formData.apps.includes("Facebook Messenger")}
          onChange={handleChange}
        />{" "}
        Facebook Messenger
      </label>
      <label>
        <input
          type="checkbox"
          name="apps"
          value="Spotify"
          checked={formData.apps.includes("Spotify")}
          onChange={handleChange}
        />{" "}
        Spotify
      </label>
      <label>
        <input
          type="checkbox"
          name="apps"
          value="WhatsApp"
          checked={formData.apps.includes("WhatsApp")}
          onChange={handleChange}
        />{" "}
        WhatsApp
      </label>
      <label>
        <input
          type="checkbox"
          name="apps"
          value="TikTok"
          checked={formData.apps.includes("TikTok")}
          onChange={handleChange}
        />{" "}
        TikTok
      </label>
      <label>
        <input
          type="checkbox"
          name="apps"
          value="Telegram"
          checked={formData.apps.includes("Telegram")}
          onChange={handleChange}
        />{" "}
        Telegram
      </label>
      <label>
        <input
          type="checkbox"
          name="apps"
          value="Other"
          checked={formData.apps.includes("Other")}
          onChange={handleChange}
        />{" "}
        Other
      </label>

      <p>กิจกรรมที่ใช้สมาร์ทโฟนมากที่สุด 3 อันดับ *</p>
      <label>
        <input
          type="checkbox"
          name="activities"
          value="ดูหนัง / ฟังเพลง"
          checked={formData.activities.includes("ดูหนัง / ฟังเพลง")}
          onChange={handleChange}
        />{" "}
        ดูหนัง / ฟังเพลง
      </label>
      <label>
        <input
          type="checkbox"
          name="activities"
          value="เล่นเกม"
          checked={formData.activities.includes("เล่นเกม")}
          onChange={handleChange}
        />{" "}
        เล่นเกม
      </label>
      <label>
        <input
          type="checkbox"
          name="activities"
          value="ถ่ายรูป / ถ่ายวิดีโอ"
          checked={formData.activities.includes("ถ่ายรูป / ถ่ายวิดีโอ")}
          onChange={handleChange}
        />{" "}
        ถ่ายรูป / ถ่ายวิดีโอ
      </label>
      <label>
        <input
          type="checkbox"
          name="activities"
          value="Application บน cloud"
          checked={formData.activities.includes("Application บน cloud")}
          onChange={handleChange}
        />{" "}
        Application บน cloud
      </label>
      <label>
        <input
          type="checkbox"
          name="activities"
          value="ติดต่อสื่อสาร / ประชุมงาน"
          checked={formData.activities.includes("ติดต่อสื่อสาร / ประชุมงาน")}
          onChange={handleChange}
        />{" "}
        ติดต่อสื่อสาร / ประชุมงาน
      </label>
      <label>
        <input
          type="checkbox"
          name="activities"
          value="โซเชียลมีเดีย"
          checked={formData.activities.includes("โซเชียลมีเดีย")}
          onChange={handleChange}
        />{" "}
        โซเชียลมีเดีย
      </label>

      <p>ท่านใช้สมาร์ทโฟนนานเท่าใดในหนึ่งวัน *</p>
      <label>
        <input
          type="radio"
          name="dailyUsage"
          value="0 - 1 ชั่วโมง"
          checked={formData.dailyUsage === "0 - 1 ชั่วโมง"}
          onChange={handleChange}
        />{" "}
        0 - 1 ชั่วโมง
      </label>
      <label>
        <input
          type="radio"
          name="dailyUsage"
          value="1 - 3 ชั่วโมง"
          checked={formData.dailyUsage === "1 - 3 ชั่วโมง"}
          onChange={handleChange}
        />{" "}
        1 - 3 ชั่วโมง
      </label>
      <label>
        <input
          type="radio"
          name="dailyUsage"
          value="3 - 5 ชั่วโมง"
          checked={formData.dailyUsage === "3 - 5 ชั่วโมง"}
          onChange={handleChange}
        />{" "}
        3 - 5 ชั่วโมง
      </label>
      <label>
        <input
          type="radio"
          name="dailyUsage"
          value="มากกว่า 5 ชั่วโมง"
          checked={formData.dailyUsage === "มากกว่า 5 ชั่วโมง"}
          onChange={handleChange}
        />{" "}
        มากกว่า 5 ชั่วโมง
      </label>

      <p>สมาร์ทโฟนสำคัญในชีวิตประจำวันอย่างไร *</p>
      <label>
        <input
          type="radio"
          name="importance"
          value="จำเป็นมากที่สุด"
          checked={formData.importance === "จำเป็นมากที่สุด"}
          onChange={handleChange}
        />{" "}
        จำเป็นมากที่สุด
      </label>
      <label>
        <input
          type="radio"
          name="importance"
          value="จำเป็น"
          checked={formData.importance === "จำเป็น"}
          onChange={handleChange}
        />{" "}
        จำเป็น
      </label>
      <label>
        <input
          type="radio"
          name="importance"
          value="ไม่จำเป็น"
          checked={formData.importance === "ไม่จำเป็น"}
          onChange={handleChange}
        />{" "}
        ไม่จำเป็น
      </label>

      <p>ปัจจัยที่พิจารณาเมื่อซื้อสมาร์ทโฟนออนไลน์มากที่สุด *</p>
      <label>
        <input
          type="radio"
          name="purchaseFactors"
          value="ราคา"
          checked={formData.purchaseFactors === "ราคา"}
          onChange={handleChange}
        />{" "}
        ราคา
      </label>
      <label>
        <input
          type="radio"
          name="purchaseFactors"
          value="รีวิวสินค้า"
          checked={formData.purchaseFactors === "รีวิวสินค้า"}
          onChange={handleChange}
        />{" "}
        รีวิวสินค้า
      </label>
      <label>
        <input
          type="radio"
          name="purchaseFactors"
          value="ฟีเจอร์สินค้า"
          checked={formData.purchaseFactors === "ฟีเจอร์สินค้า"}
          onChange={handleChange}
        />{" "}
        ฟีเจอร์สินค้า
      </label>

      <p>ความพึงพอใจจากยี่ห้อสมาร์ทโฟนที่ใช้งานในปัจจุบัน *</p>
      <label>
        <input
          type="radio"
          name="satisfaction"
          value="1"
          checked={formData.satisfaction === "1"}
          onChange={handleChange}
        />{" "}
        1
      </label>
      <label>
        <input
          type="radio"
          name="satisfaction"
          value="2"
          checked={formData.satisfaction === "2"}
          onChange={handleChange}
        />{" "}
        2
      </label>
      <label>
        <input
          type="radio"
          name="satisfaction"
          value="3"
          checked={formData.satisfaction === "3"}
          onChange={handleChange}
        />{" "}
        3
      </label>
      <label>
        <input
          type="radio"
          name="satisfaction"
          value="4"
          checked={formData.satisfaction === "4"}
          onChange={handleChange}
        />{" "}
        4
      </label>
      <label>
        <input
          type="radio"
          name="satisfaction"
          value="5"
          checked={formData.satisfaction === "5"}
          onChange={handleChange}
        />{" "}
        5
      </label>

      <p>ปัญหาในการซื้อสมาร์ทโฟนออนไลน์ *</p>
      <label>
        <input
          type="radio"
          name="onlinePurchaseIssues"
          value="ความกังวลเกี่ยวกับความปลอดภัยของการชำระเงิน"
          checked={
            formData.onlinePurchaseIssues ===
            "ความกังวลเกี่ยวกับความปลอดภัยของการชำระเงิน"
          }
          onChange={handleChange}
        />{" "}
        ความกังวลเกี่ยวกับความปลอดภัยของการชำระเงิน
      </label>
      <label>
        <input
          type="radio"
          name="onlinePurchaseIssues"
          value="ไม่สามารถสัมผัสหรือลองสินค้าได้จริง"
          checked={
            formData.onlinePurchaseIssues ===
            "ไม่สามารถสัมผัสหรือลองสินค้าได้จริง"
          }
          onChange={handleChange}
        />{" "}
        ไม่สามารถสัมผัสหรือลองสินค้าได้จริง
      </label>
      <label>
        <input
          type="radio"
          name="onlinePurchaseIssues"
          value="ความไม่แน่นอนเกี่ยวกับการรับประกันและการบริการหลังการขาย"
          checked={
            formData.onlinePurchaseIssues ===
            "ความไม่แน่นอนเกี่ยวกับการรับประกันและการบริการหลังการขาย"
          }
          onChange={handleChange}
        />{" "}
        ความไม่แน่นอนเกี่ยวกับการรับประกันและการบริการหลังการขาย
      </label>
      <label>
        <input
          type="radio"
          name="onlinePurchaseIssues"
          value="ความล่าช้าในการจัดส่งหรือปัญหาในการจัดส่ง"
          checked={
            formData.onlinePurchaseIssues ===
            "ความล่าช้าในการจัดส่งหรือปัญหาในการจัดส่ง"
          }
          onChange={handleChange}
        />{" "}
        ความล่าช้าในการจัดส่งหรือปัญหาในการจัดส่ง
      </label>

      <p>ยี่ห้อสมาร์ทโฟนที่ใช้งานในปัจจุบัน *</p>
      <label>
        <input
          type="radio"
          name="currentBrand"
          value="Apple"
          checked={formData.currentBrand === "Apple"}
          onChange={handleChange}
        />{" "}
        Apple
      </label>
      <label>
        <input
          type="radio"
          name="currentBrand"
          value="Samsung"
          checked={formData.currentBrand === "Samsung"}
          onChange={handleChange}
        />{" "}
        Samsung
      </label>
      <label>
        <input
          type="radio"
          name="currentBrand"
          value="Oppo"
          checked={formData.currentBrand === "Oppo"}
          onChange={handleChange}
        />{" "}
        Oppo
      </label>
      <label>
        <input
          type="radio"
          name="currentBrand"
          value="Vivo"
          checked={formData.currentBrand === "Vivo"}
          onChange={handleChange}
        />{" "}
        Vivo
      </label>
      <label>
        <input
          type="radio"
          name="currentBrand"
          value="XIAOMI"
          checked={formData.currentBrand === "XIAOMI"}
          onChange={handleChange}
        />{" "}
        XIAOMI
      </label>
      <label>
        <input
          type="radio"
          name="currentBrand"
          value="Other"
          checked={formData.currentBrand === "Other"}
          onChange={handleChange}
        />{" "}
        Other
      </label>

      <button type="submit">ส่งแบบสอบถาม</button>
      {prediction !== null && (
        <div>
          <h2>ผลการพยากรณ์:</h2>
          <p>ยี่ห้อสมาร์ทโฟนที่ท่านควรเลือกคือ: {brandMapping[prediction]}</p>
        </div>
      )}
    </form>
  );
}

export default Form;
