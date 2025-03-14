import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Form from "./Form";

test("แสดง error message เมื่อส่งฟอร์มที่ไม่ครบถ้วน", async () => {
  render(<Form />);
  fireEvent.click(screen.getByText("ส่งแบบสอบถาม"));
  expect(
    await screen.findByText("กรุณากรอกข้อมูลให้ครบถ้วน")
  ).toBeInTheDocument();
});

test("เมื่อกรอกข้อมูลครบถ้วน, ส่งฟอร์มสำเร็จและเปิด modal ด้วยผลลัพธ์ที่ได้", async () => {
  // จำลอง API Response ด้วย vi.spyOn
  const fakeResponse = { prediction: [0] }; // ตัวอย่างใช้ 0 แทนผลลัพธ์
  vi.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(fakeResponse),
    })
  );

  render(<Form />);

  // จำลองการกรอกข้อมูลให้ครบถ้วนตาม validateForm:
  // 1. gender
  fireEvent.change(screen.getByRole("combobox", { name: /เพศ/i }), {
    target: { value: "ชาย" },
  });
  // 2. ageRange
  fireEvent.click(screen.getByLabelText("18-25 ปี"));
  // 3. maritalStatus
  fireEvent.click(screen.getByLabelText("โสด"));
  // 4. occupation
  fireEvent.click(screen.getByLabelText("นักเรียน / นักศึกษา"));
  // 5. income
  fireEvent.click(screen.getByLabelText("น้อยกว่า 15,000 บาท"));
  // 6. apps (เลือก Instagram)
  fireEvent.click(screen.getByLabelText("Instagram"));
  // 7. activities (เลือก ดูหนัง / ฟังเพลง)
  fireEvent.click(screen.getByLabelText("ดูหนัง / ฟังเพลง"));
  // 8. dailyUsage
  fireEvent.click(screen.getByLabelText("0 - 1 ชั่วโมง"));
  // 9. importance
  fireEvent.click(screen.getByLabelText("จำเป็นมากที่สุด"));
  // 10. purchaseFactors
  fireEvent.click(screen.getByLabelText("ราคา"));
  // 11. satisfaction
  fireEvent.click(screen.getByLabelText("1"));
  // 12. onlinePurchaseIssues
  fireEvent.click(screen.getByLabelText("ความกังวลเกี่ยวกับความปลอดภัยของการชำระเงิน"));
  // 13. currentBrand
  fireEvent.click(screen.getByLabelText("Apple"));

  // ส่งฟอร์ม
  fireEvent.click(screen.getByText("ส่งแบบสอบถาม"));

  // รอให้ modal เปิดขึ้น: query หาด้วย role "heading" ของ modal
  expect(
    await screen.findByRole("heading", { name: /ผลการพยากรณ์/i })
  ).toBeInTheDocument();

  // ตรวจสอบว่าข้อความแสดงผลลัพธ์ (เช่น ชื่อยี่ห้อ) ถูก render
  expect(screen.getByText(/Apple/)).toBeInTheDocument();

  global.fetch.mockRestore();
});

