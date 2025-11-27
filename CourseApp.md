---
title: Bài tập lớn
---
---

**ĐỀ TÀI 7. KHOÁ HỌC TRỰC TUYẾN**

Hệ thống được xây dựng nhằm hỗ trợ việc đăng ký, quản lý và tham gia các khóa học trực tuyến. Người dùng hệ thống gồm ba vai trò chính: quản trị viên, giảng viên và sinh viên. Khi đăng ký, tất cả người dùng cần cung cấp đầy đủ thông tin cá nhân và avatar để định danh. Với vai trò giảng viên, tài khoản cần được quản trị viên duyệt và xác minh trước khi được phép tạo và quản lý khóa học. Hệ thống phải cho phép người dùng đăng nhập, phân quyền theo từng vai trò, và bảo đảm tính bảo mật thông tin tài khoản.

Sau khi được phê duyệt, giảng viên có thể tạo mới khóa học bằng cách cung cấp thông tin như tên khóa học, mô tả chi tiết, hình ảnh minh họa, video giới thiệu, học phí (nếu có) và thời lượng học. Giảng viên có thể cập nhật, chỉnh sửa, xóa khóa học và quản lý danh sách sinh viên đã đăng ký. Ngoài ra, hệ thống cần cho phép giảng viên theo dõi tiến độ học tập của từng sinh viên, qua đó cải thiện chất lượng giảng dạy.

Sinh viên có thể tìm kiếm các khóa học theo nhiều tiêu chí linh hoạt như tên khóa học, giảng viên phụ trách hoặc mức học phí. Hệ thống hỗ trợ sắp xếp kết quả tìm kiếm theo tên hoặc chi phí, đồng thời hiển thị kết quả dưới dạng phân trang với tối đa 20 khóa học mỗi trang.

---

# Người dùng hệ thống
- Quản trị viên
- Giảng viên
- Sinh viên
# Nghiệp vụ
## Đăng ký
- Tất cả người dùng cần cung cấp đầy đủ thông tin cá nhân và avatar để định danh
- Sepcific case: Giảng viên cần được quản trị viên xác minh và xét duyệt trước khi cho phép tạo và quản lý lớp học
## Đăng nhập
- Dùng Outh-2 kết hợp với đó cho phép đăng nhập bằng facebook, gmail, và email + password.
## Tích hợp Firebase Realtime Database 
- Cho phép giảng viên và sinh viên chat theo thời gian thực
# Giảng viên
## Tạo mới khóa học
- Cung cấp thông tin về khóa học
	- Tên khóa học
	- Mô tả chi tiết
	- Hình ảnh minh họa
	- Video giới thiệu
	- Học phí (nếu không thì sẽ để free để người dùng có thể enroll)
	- Thời gian học (theo dõi tiến độ học của Sinh Viên - dành cho Giảng viên)
	- Trạng thái khóa học
## Quản lý khóa học
- Cập nhật
- Chỉnh sửa
- Xóa
- Lưu ý: Chỉ giảng viên sở hữu khóa học mới được quản lý, Admin vẫn có quyền xóa nếu có vi phạm
## Quản lý danh sách sinh viên
- Tìm và theo dõi tiến độ học của sinh viên trên khóa học
# Sinh viên
## Tìm khóa học - dựa trên vài tiêu chí
- Tên khóa học
- Giảng viên phụ trách
- Chi phí
- Hệ thống có hỗ trợ sắp xếp và hiện kết quả dưới dạng phân trang cho tối đa 20 khóa
## Enroll khóa học
- Sinh viên đủ điều kiện sẽ được enroll khóa học

## Thanh toán - đối với khóa học có trả phí
- Cho phép sinh viên thực hiện thanh toán từ nhiều nguồn khác nhau
- Mọi giao dịch cần được ghi nhận và lưu trữ lại trong hệ thống

## Quản lý các khóa học đã enroll về
- Có lịch sử tra cứu thanh toán khóa học

