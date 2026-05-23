import { useAuth } from './AuthContext'

export default function Profile() {
  const { auth } = useAuth()
  const isAdmin = auth?.role === 'admin'

  return (
    <div style={{ padding: 28, maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#1e293b', margin: '0 0 8px 0', fontFamily: "'Space Grotesk',sans-serif" }}>
          Hồ sơ cá nhân
        </h2>
        <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Quản lý thông tin định danh và dữ liệu xác thực.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, alignItems: 'stretch' }}>
        {/* Cột trái: Avatar & Quick Info */}
        <div className="card" style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: 120, height: 120, borderRadius: '50%', overflow: 'hidden', border: '4px solid #eff6ff', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', marginBottom: 20 }}>
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(auth?.name || 'User')}&background=${isAdmin ? '0284c7' : '1e3a8a'}&color=fff&size=256`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px 0', color: '#0f172a' }}>{auth?.name || 'Người dùng'}</h3>
          <span style={{ background: isAdmin ? '#fef2f2' : '#eff6ff', color: isAdmin ? '#ef4444' : '#2563eb', padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
            {auth?.title?.split('·')[0]?.trim() || (isAdmin ? 'Quản trị viên Hệ thống' : 'Thành viên')}
          </span>
          
          <div style={{ width: '100%', height: 1, background: '#f1f5f9', margin: '24px 0' }} />
          
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
               <span className="material-symbols-outlined" style={{ color: '#94a3b8', fontSize: 20 }}>badge</span>
               <span style={{ fontSize: 14, fontWeight: 600, color: '#475569' }}>Mã định danh: {auth?.card || (isAdmin ? 'ADMIN' : '---')}</span>
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
               <span className="material-symbols-outlined" style={{ color: '#94a3b8', fontSize: 20 }}>domain</span>
               <span style={{ fontSize: 14, fontWeight: 600, color: '#475569' }}>{auth?.title?.split('·')[1]?.trim() || 'Đại học Bách Khoa HCM'}</span>
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
               <span className="material-symbols-outlined" style={{ color: '#94a3b8', fontSize: 20 }}>mail</span>
               <span style={{ fontSize: 14, fontWeight: 600, color: '#475569' }}>{auth?.email || 'email@hcmut.edu.vn'}</span>
             </div>
          </div>
        </div>

        {/* Cột phải: Detailed Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
           {/* Thong tin chung */}
           <div className="card" style={{ padding: 28 }}>
             <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 24px 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: 8 }}>
               <span className="material-symbols-outlined" style={{ color: '#3b82f6' }}>account_circle</span>
               Sơ yếu lý lịch
             </h4>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
               <div>
                  <label style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Căn cước công dân</label>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginTop: 6 }}>07920301XXXX</div>
               </div>
               <div>
                  <label style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Ngày sinh</label>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginTop: 6 }}>--/--/----</div>
               </div>
               <div>
                  <label style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Số điện thoại liên lạc</label>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginTop: 6 }}>090x.xxx.xxx</div>
               </div>
               <div>
                  <label style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Ngày tham gia hệ thống</label>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginTop: 6 }}>01/09/2021</div>
               </div>
             </div>
             <div style={{ borderTop: '1px solid #f1f5f9', marginTop: 24, paddingTop: 20, textAlign: 'right' }}>
                <button className="btn btn-ghost" style={{ fontSize: 13, padding: '10px 20px', border: '1px solid #e2e8f0' }}>Yêu cầu cập nhật</button>
             </div>
           </div>

           {/* Phương tiện & Thẻ */}
           {!isAdmin && auth?.vehicle && (
           <div className="card" style={{ padding: 28 }}>
             <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 20px 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: 8 }}>
               <span className="material-symbols-outlined" style={{ color: '#10b981' }}>directions_car</span>
               Quản lý Phương tiện & Thẻ nhận diện
             </h4>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ padding: 18, border: '1px solid #e2e8f0', borderRadius: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                     <div style={{ width: 44, height: 44, background: '#f8fafc', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <span className="material-symbols-outlined" style={{ color: '#64748b', fontSize: 24 }}>directions_car</span>
                     </div>
                     <div>
                       <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Phương tiện đã đăng ký</div>
                       <div style={{ fontSize: 13, color: '#64748b', marginTop: 2, fontWeight: 500 }}>Biển số: <span style={{ color: '#1e293b', fontWeight: 700 }}>{auth.vehicle}</span></div>
                     </div>
                   </div>
                   <span style={{ border: '1px solid #bbf7d0', background: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>Biển số xe hợp lệ</span>
                </div>

                <div style={{ padding: 18, border: '1px solid #e2e8f0', borderRadius: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                     <div style={{ width: 44, height: 44, background: '#eff6ff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <span className="material-symbols-outlined" style={{ color: '#3b82f6', fontSize: 24 }}>nfc</span>
                     </div>
                     <div>
                       <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Thẻ nhận diện định danh</div>
                       <div style={{ fontSize: 13, color: '#64748b', marginTop: 2, fontWeight: 500 }}>Mã thẻ: <span style={{ color: '#1e293b', fontWeight: 700 }}>{auth.card}</span></div>
                     </div>
                   </div>
                   <span style={{ border: '1px solid #bbf7d0', background: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>Đang hoạt động</span>
                </div>
             </div>
           </div>
           )}
        </div>
      </div>
    </div>
  )
}
