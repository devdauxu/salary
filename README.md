# Công cụ tính lương Gross - Net

Công cụ tính toán lương Gross/Net theo quy định thuế thu nhập cá nhân (TNCN) của Việt Nam, hỗ trợ cả chính sách hiện hành (2025) và dự thảo (2026).

## Tính năng

- ✅ Tính toán **Gross → Net** và **Net → Gross**
- ✅ Hỗ trợ chính sách **2025** (Hiện hành) và **2026** (Dự thảo)
- ✅ **2 giai đoạn 2026**: Trước 1/7/2026 và Từ 1/7/2026
- ✅ **So sánh 3 giai đoạn**: 2025, Trước 1/7/2026, Từ 1/7/2026
- ✅ Tính toán bảo hiểm (BHXH, BHYT, BHTN) theo vùng
- ✅ Giảm trừ gia cảnh cho người phụ thuộc
- ✅ Chi tiết thuế TNCN theo bậc thang
- ✅ Giao diện thân thiện, responsive
- ✅ Dark mode

## Demo

Mở file `index.html` trong trình duyệt để sử dụng.

## Cách sử dụng

### 1. Chọn chế độ tính toán
- **GROSS → NET**: Nhập lương Gross để tính lương Net
- **NET → GROSS**: Nhập lương Net để tính lương Gross cần thiết

### 2. Chọn năm áp dụng
- **Hiện hành (2025)**: Chính sách thuế hiện tại
- **Dự thảo (2026)**: Chọn giai đoạn áp dụng:
  - *Trước 1/7/2026*: Giảm trừ mới, biểu thuế 7 bậc cũ
  - *Từ 1/7/2026*: Giảm trừ mới + biểu thuế 5 bậc mới
- **So sánh**: Xem chênh lệch giữa 3 giai đoạn

### 3. Nhập thông tin
- Thu nhập (Gross hoặc Net tùy chế độ)
- Số người phụ thuộc
- Mức lương đóng bảo hiểm
- Vùng (I, II, III, IV)

### 4. Xem kết quả
- Lương Gross, Net, Thuế TNCN
- Chi tiết các khoản bảo hiểm
- Bảng phân tích thuế theo bậc thang

## Chính sách thuế

### Giảm trừ gia cảnh

| Năm | Bản thân | Người phụ thuộc |
|-----|----------|-----------------|
| 2025 | 11 triệu/tháng | 4.4 triệu/tháng |
| 2026 | 15.5 triệu/tháng | 6.2 triệu/tháng |

### Lương tối thiểu vùng

| Vùng | 2025 | 2026 |
|------|------|------|
| I | 4,960,000 | 5,310,000 |
| II | 4,410,000 | 4,730,000 |
| III | 3,860,000 | 4,140,000 |
| IV | 3,250,000 | 3,700,000 |

### Bậc thuế TNCN

#### Hiện hành (2025) - 7 bậc
| Bậc | Thu nhập chịu thuế | Thuế suất |
|-----|-------------------|-----------|
| 1   | Đến 5 triệu       | 5%        |
| 2   | Trên 5 - 10 triệu | 10%       |
| 3   | Trên 10 - 18 triệu| 15%       |
| 4   | Trên 18 - 32 triệu| 20%       |
| 5   | Trên 32 - 52 triệu| 25%       |
| 6   | Trên 52 - 80 triệu| 30%       |
| 7   | Trên 80 triệu     | 35%       |

#### Trước 1/7/2026 - 7 bậc (giữ nguyên biểu thuế cũ)
Áp dụng giảm trừ gia cảnh mới (15.5tr/6.2tr) nhưng giữ biểu thuế 7 bậc như 2025.

#### Từ 1/7/2026 - 5 bậc (biểu thuế mới)
| Bậc | Thu nhập chịu thuế  | Thuế suất |
|-----|---------------------|-----------|
| 1   | Đến 10 triệu        | 5%        |
| 2   | Trên 10 - 30 triệu  | 10%       |
| 3   | Trên 30 - 60 triệu  | 20%       |
| 4   | Trên 60 - 100 triệu | 30%       |
| 5   | Trên 100 triệu      | 35%       |

## Công thức tính toán

### Lương Net
```
Net = Gross - BHXH - BHYT - BHTN - Thuế TNCN
```

### Bảo hiểm
- **BHXH**: 8% (tối đa 20 × lương cơ sở = 46,800,000đ)
- **BHYT**: 1.5% (tối đa 20 × lương cơ sở = 46,800,000đ)
- **BHTN**: 1% (tối đa 20 × lương tối thiểu vùng)

### Thu nhập chịu thuế
```
Thu nhập chịu thuế = (Gross - Bảo hiểm) - Giảm trừ bản thân - Giảm trừ người phụ thuộc
```

## Cấu trúc dự án

```
tncn/
├── index.html      # Giao diện chính
├── style.css       # Styling
├── script.js       # Logic tính toán
├── README.md       # Tài liệu
└── .gitignore      # Git ignore
```

## Công nghệ sử dụng

- HTML5
- CSS3 (Vanilla CSS)
- JavaScript (ES6+)
- Google Fonts (Inter)

## Tham khảo pháp lý

- Nghị quyết 954/2020/UBTVQH14 về giảm trừ gia cảnh
- Lương cơ sở: 2.340.000đ (Từ 01/07/2024)
- Luật Bảo hiểm xã hội 2014
- Nghị định về lương tối thiểu vùng 2025, 2026
- Dự thảo Luật Thuế TNCN sửa đổi 2026

## License

MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng tạo issue hoặc pull request.

## Liên hệ

Nếu có câu hỏi hoặc góp ý, vui lòng tạo issue trên GitHub.
