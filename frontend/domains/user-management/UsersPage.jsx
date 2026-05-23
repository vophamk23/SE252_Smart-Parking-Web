// ============================================================
// USERS - User management
// ============================================================
import { useState, useEffect } from 'react'
import { userManagementService } from './userManagementService'

export default function Users() {
  const [filter, setFilter] = useState('Tất cả')
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const roles = ['Tất cả','user','admin','staff']
  const ROLE_LABEL = { user: 'Sinh viên', admin: 'Quản trị', staff: 'Nhân viên' }
  const ROLE_COLOR = {
    user: { rc:'#dbeafe', rt:'#1d4ed8' },
    admin: { rc:'#ede9fe', rt:'#7c3aed' },
    staff: { rc:'#ffedd5', rt:'#9a3412' }
  }

  useEffect(() => {
    async function loadData() {
      try {
        const data = await userManagementService.getUsers()
        setUsers(data)
        
        // Calculate basic stats manually if getUserStats isn't available
        const activeUsers = data.length // For mock purposes, all are active
        setStats({
          total: data.length,
          active: activeUsers,
          new: Math.min(342, data.length) // Mock new users
        })
      } catch (error) {
        console.error('Failed to load users:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading || !stats) {
    return <div style={{ padding: 28, color: '#64748b' }}>Đang tải dữ liệu...</div>
  }

  const filteredUsers = filter === 'Tất cả' ? users : users.filter(u => u.role === filter)

  return (
    <div style={{ padding: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#003d9b', margin: '0 0 6px 0' }}>Danh mục người dùng</h2>
          <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>Quản lý truy cập khuôn viên tập trung và phân quyền vai trò.</p>
        </div>
        <button className="btn btn-primary">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person_add</span>Đăng ký người dùng
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, marginBottom: 24 }}>
        <div className="card card-hover" style={{ padding: 22, borderLeft: '4px solid #003d9b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#64748b', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px 0' }}>Tổng người dùng</p>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 34, fontWeight: 700, margin: 0 }}>{stats.total.toLocaleString()}</p>
            </div>
            <div style={{ width: 46, height: 46, background: 'rgba(0,61,155,0.06)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 24, color: '#003d9b' }}>groups</span>
            </div>
          </div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, color: '#16a34a', fontSize: 12, fontWeight: 600 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>trending_up</span>Tăng trưởng thực tế
          </div>
        </div>

        <div className="card card-hover" style={{ padding: 22, borderLeft: '4px solid #a33500' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#64748b', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px 0' }}>Đăng ký mới</p>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 34, fontWeight: 700, margin: 0 }}>{stats.new}</p>
            </div>
            <div style={{ width: 46, height: 46, background: 'rgba(163,53,0,0.06)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 24, color: '#a33500' }}>how_to_reg</span>
            </div>
          </div>
          <div style={{ marginTop: 12, fontSize: 12, fontWeight: 600, color: '#a33500' }}>Chờ xác minh: 0</div>
        </div>

        <div className="card" style={{ padding: 22, background: 'linear-gradient(135deg,#003d9b,#0052cc)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ color: 'rgba(196,210,255,0.9)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px 0' }}>Đang hoạt động</p>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 34, fontWeight: 700, color: '#fff', margin: 0 }}>{stats.active.toLocaleString()}</p>
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>
              <span className="material-symbols-outlined pulse" style={{ fontSize: 16 }}>sensors</span>Đã đồng bộ hệ thống
            </div>
          </div>
          <div style={{ position: 'absolute', right: -10, bottom: -10, opacity: 0.1 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 80, color: '#fff' }}>hub</span>
          </div>
        </div>
      </div>

      {/* Filters + Table */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {roles.map(r => (
            <button key={r} onClick={() => setFilter(r)} style={{ padding: '7px 16px', borderRadius: 999, fontSize: 12.5, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s', background: filter===r?'#003d9b':'#e6e8eb', color: filter===r?'#fff':'#475569', textTransform: 'capitalize' }}>
              {ROLE_LABEL[r] || r}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: 12 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>filter_list</span>Thêm bộ lọc
          </button>
          <button className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: 12 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>Xuất CSV
          </button>
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-wrap">
          <table>
            <thead><tr>
              {['Hồ sơ người dùng','Mã định danh (Thẻ)','Vai trò','Trạng thái','Thông tin khác','Thao tác'].map(h => <th key={h}>{h}</th>)}
            </tr></thead>
            <tbody>
              {filteredUsers.map(u => {
                const roleColor = ROLE_COLOR[u.role] || ROLE_COLOR.user
                return (
                  <tr key={u.email}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=1e3a8a&color=fff`} alt={u.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }} />
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>{u.name}</p>
                          <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      {u.card ? <span style={{ fontFamily: 'monospace', fontSize: 11, background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: 6 }}>{u.card}</span> : <span style={{ fontSize: 11, color: '#94a3b8' }}>Chưa có thẻ</span>}
                    </td>
                    <td><span style={{ padding: '3px 12px', background: roleColor.rc, color: roleColor.rt, borderRadius: 999, fontSize: 11, fontWeight: 700 }}>{ROLE_LABEL[u.role] || u.role}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
                        <span style={{ fontSize: 12, fontWeight: 500 }}>Đang hoạt động</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: '#64748b' }}>
                      <div style={{ fontWeight: 600, color: '#475569' }}>{u.title}</div>
                      {u.vehicle && <div>Xe: <span style={{ color: '#0f172a' }}>{u.vehicle}</span></div>}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button style={{ padding: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', borderRadius: 8, transition: 'all 0.2s' }}
                        onMouseOver={e => { e.currentTarget.style.color='#003d9b'; e.currentTarget.style.background='#eff6ff' }}
                        onMouseOut={e => { e.currentTarget.style.color='#94a3b8'; e.currentTarget.style.background='none' }}>
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8' }}>Không tìm thấy người dùng phù hợp.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '13px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Hiển thị {filteredUsers.length} người dùng</p>
          <div style={{ display: 'flex', gap: 4 }}>
            <button style={{ width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, background: '#003d9b', color: '#fff' }}>1</button>
          </div>
        </div>
      </div>
    </div>
  )
}
