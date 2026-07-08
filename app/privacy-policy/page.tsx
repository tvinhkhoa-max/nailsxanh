import React from 'react'

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-stone-50 dark:bg-zinc-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-2xl shadow-sm border border-stone-100 dark:border-zinc-800">
        
        {/* KHỐI TIÊU ĐỀ VÀ NGÀY (Tách riêng ra khỏi prose để kiểm soát khoảng cách tuyệt đối) */}
        <div className="border-b border-stone-100 dark:border-zinc-800 pb-6 mb-8 flex flex-col gap-2">
          <h5 className="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-white">
            CHÍNH SÁCH QUYỀN RIÊNG TƯ
          </h5>
          <p className="text-sm font-medium text-stone-400 dark:text-zinc-500">
            Cập nhật lần cuối: Ngày 08 tháng 07 năm 2026
          </p>
        </div>

        {/* KHỐI NỘI DUNG VĂN BẢN PHÁP LÝ CHẠY TYPOGRAPHY (prose) */}
        <article className="prose prose-stone dark:prose-invert max-w-none">
          
          <p>
            Chào mừng bạn đến với <strong>NailsXanh AR</strong>. Chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn. Chính sách quyền riêng tư này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin của bạn khi bạn tương tác với các chiến dịch quảng cáo trên Facebook (Meta) và khi sử dụng ứng dụng thử móng công nghệ thực tế ảo tăng cường (AR Try-on) trên hệ thống website của chúng tôi.
          </p>

          <h2>1. Thông Tin Chúng Tôi Thu Thập</h2>
          <p>Khi bạn tương tác với Form đăng ký khách hàng tiềm năng (Lead Form) trên Facebook hoặc sử dụng ứng dụng của chúng tôi, chúng tôi có thể thu thập các thông tin sau:</p>
          <ul>
            <li><strong>Thông tin cá nhân cơ bản:</strong> Họ và tên, số điện thoại, địa chỉ email do bạn chủ động cung cấp để đặt lịch hẹn hoặc nhận ưu đãi giảm giá.</li>
            <li>
              <strong>Dữ liệu Camera và Hình ảnh (Cho tính năng AR):</strong> Khi bạn sử dụng chức năng "Thử móng bằng AI/AR", hệ thống yêu cầu quyền truy cập vào Camera thiết bị của bạn.
              <br />
              <span className="text-stone-500 dark:text-zinc-400 font-medium">
                * Lưu ý quan trọng: Toàn bộ quá trình quét tay, nhận diện móng bằng công nghệ AI (MediaPipe/Shader) được xử lý trực tiếp theo thời gian thực (Realtime) trên trình duyệt của bạn (Client-side). Chúng tôi KHÔNG lưu trữ hình ảnh camera hay video bàn tay của bạn lên máy chủ của chúng tôi.
              </span>
            </li>
          </ul>

          <h2>2. Mục Đích Sử Dụng Thông Tin</h2>
          <p>Chúng tôi sử dụng thông tin thu thập được từ bạn cho các mục đích hợp pháp sau:</p>
          <ul>
            <li>Xác nhận lịch hẹn và liên hệ tư vấn dịch vụ nail nghệ thuật theo nhu cầu của bạn.</li>
            <li>Cung cấp trải nghiệm thử mẫu móng thực tế ảo (AR Try-on) chính xác và cá nhân hóa.</li>
            <li>Gửi các thông tin chương trình ưu đãi, mã giảm giá độc quyền (Flash Sale) từ NailsXanh AR mà bạn đã đăng ký nhận.</li>
            <li>Cải thiện hiệu năng và tối ưu hóa tính năng hiển thị công nghệ AR trên website.</li>
          </ul>

          <h2>3. Lưu Trữ và Bảo Mật Dữ Liệu</h2>
          <ul>
            <li><strong>Thông tin liên hệ:</strong> Được lưu trữ an toàn trên hệ thống cơ sở dữ liệu bảo mật (Supabase/Prisma) và chỉ có nhân viên có thẩm quyền được quyền tiếp cận để phục vụ cho việc chăm sóc khách hàng.</li>
            <li><strong>Biện pháp bảo mật:</strong> Chúng tôi áp dụng các tiêu chuẩn mã hóa dữ liệu truyền tải (SSL/HTTPS) để đảm bảo thông tin của bạn không bị rò rỉ hoặc can thiệp trái phép.</li>
            <li>Chúng tôi cam kết <strong>KHÔNG</strong> bán, trao đổi hoặc chia sẻ thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào vì mục đích thương mại độc lập.</li>
          </ul>

          <h2>4. Quyền Của Người Dùng (Khách Hàng)</h2>
          <p>Bạn hoàn toàn có các quyền sau đối với dữ liệu cá nhân của mình:</p>
          <ul>
            <li>Quyền yêu cầu kiểm tra, cập nhật hoặc sửa đổi thông tin liên hệ đã cung cấp.</li>
            <li>Quyền từ chối cấp quyền truy cập Camera (khi đó tính năng thử móng AR sẽ không hoạt động, nhưng bạn vẫn có thể xem danh mục ảnh tĩnh của các bộ sưu tập móng).</li>
            <li>Quyền yêu cầu xóa bỏ hoàn toàn dữ liệu thông tin liên hệ khỏi hệ thống của chúng tôi bất kỳ lúc nào bằng cách liên hệ với chúng tôi qua các kênh hỗ trợ chính thức.</li>
          </ul>

          <h2>5. Cam Kết Tuân Thủ Chính Sách Meta (Facebook)</h2>
          <p>
            Chính sách này được xây dựng nhằm tuân thủ nghiêm ngặt <strong>Điều khoản về Quảng cáo tìm kiếm khách hàng tiềm năng của Meta</strong>. Chúng tôi đảm bảo việc thu thập dữ liệu là hoàn toàn minh bạch, có sự đồng ý rõ ràng của người dùng tại thời điểm điền form và không sử dụng dữ liệu sai mục đích đã cam kết.
          </p>

          <h2>6. Thông Tin Liên Hệ</h2>
          <p>Nếu bạn có bất kỳ câu hỏi, khiếu nại hoặc yêu cầu nào liên quan đến Chính sách quyền riêng tư này, vui lòng liên hệ với chúng tôi qua:</p>
          <ul>
            <li><strong>Thương hiệu:</strong> NailsXanh AR - Studio Thử Móng Công Nghệ</li>
            <li><strong>Website:</strong> <a href="https://nailsxanh.ddns.net" target="_blank" rel="noopener noreferrer">https://nailsxanh.ddns.net</a></li>
            <li><strong>Email hỗ trợ:</strong> nailsxanh@gmail.com</li>
          </ul>

        </article>
      </div>
    </main>
  )
}