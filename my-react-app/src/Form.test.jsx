import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Form from './Form';

describe('Form Component', () => {
  // ... การทดสอบก่อนหน้า

  describe('handles API errors', () => {
    beforeEach(() => {
      window.alert = vi.fn(); // Mock window.alert ในทุกๆ test case
    });

    it('handles validation error (400 Bad Request)', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          json: () => Promise.resolve({ message: 'Validation Error' }),
        })
      );

      render(<Form />);

      // ... กรอกข้อมูลในแบบฟอร์ม

      // ส่งแบบฟอร์ม
      userEvent.click(screen.getByText('ส่งแบบสอบถาม'));

      // รอให้มีการเรียก window.alert
      await vi.waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(
          'ข้อมูลไม่ถูกต้อง: Validation Error'
        );
      });
    });

    it('handles internal server error (500 Internal Server Error)', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ message: 'Internal Server Error' }),
        })
      );

      render(<Form />);

      // ... กรอกข้อมูลในแบบฟอร์ม

      // ส่งแบบฟอร์ม
      userEvent.click(screen.getByText('ส่งแบบสอบถาม'));

      // รอให้มีการเรียก window.alert
      await vi.waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(
          'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ โปรดลองอีกครั้งภายหลัง'
        );
      });
    });

    it('handles network error (Failed to fetch)', async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error('Network Error')));

      render(<Form />);

      // ... กรอกข้อมูลในแบบฟอร์ม

      // ส่งแบบฟอร์ม
      userEvent.click(screen.getByText('ส่งแบบสอบถาม'));

      // รอให้มีการเรียก window.alert
      await vi.waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(
          'เกิดข้อผิดพลาดขณะประมวลผลคำขอของคุณ โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของคุณ'
        );
      });
    });
  });

  // ... การทดสอบอื่นๆ
});