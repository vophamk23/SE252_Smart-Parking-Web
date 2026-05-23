// ============================================================
// USER HISTORY - Desktop Layout
// ============================================================
import { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext'
import { parkingService } from '../parking/parkingService'
import { paymentService } from '../payment/paymentService'

const ZONE_LABEL = { zone_a1: 'Khu A - A1', zone_a2: 'Khu A - A2', zone_b1: 'Khu B - B1' }

export default function UserHistory() {
  const { auth } = useAuth()
  const [history, setHistory] = useState([])
  const [stats, setStats] = useState({ totalSessions: 0, totalFee: 0, avgDuration: 0 })

  useEffect(() => {
    async function loadData() {
      if (!auth) return
      try {
        const [activeSession, completedSessions] = await Promise.all([
          auth.card ? parkingService.getActiveSession(auth.card) : Promise.resolve(null),
          auth.email ? paymentService.getPaymentHistory(auth.email) : Promise.resolve([])
        ])

        const allSessions = []
        if (activeSession) {
          allSessions.push({ ...activeSession, isMock: false })
        }
        allSessions.push(...completedSessions)

        const formatted = allSessions.map(s => {
          const entryDate = new Date(s.entryTime)
          const exitDate = s.exitTime ? new Date(s.exitTime) : new Date()
          
          const isToday = new Date().toDateString() === entryDate.toDateString()
          const dateStr = isToday ? 'Hôm nay' : entryDate.toLocaleDateString('vi-VN')
          
          const entryStr = entryDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          const exitStr = s.exitTime ? exitDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '...'
          
          const ms = exitDate - entryDate
          const h = Math.floor(ms / 3600000)
          const m = Math.floor((ms % 3600000) / 60000)
          const durationStr = h > 0 ? `${h}h ${m}p` : `${m}p`

          let status = 'Hoàn thành'
          let sc = '#3b82f6'
          let bg = '#dbeafe'
          if (s.status === 'active') {
            status = 'Đang gửi'
            sc = '#22c55e'
            bg = '#dcfce7'
          }

          let method = 'Chưa TT'
          if (s.paymentMethod === 'bkpay' || s.paymentMethod === 'paid') method = 'BKPay'
          else if (s.paymentMethod === 'cash') method = 'Tiền mặt'
          else if (s.paymentMethod === 'debt') method = 'Ghi nợ'

          return {
            id: s.id,
            date: dateStr,
            plate: s.vehicle || '---',
            zone: ZONE_LABEL[s.zone] || s.zone,
            entry: entryStr,
            exit: exitStr,
            duration: durationStr,
            fee: s.fee || 0,
            method,
            status,
            sc,
            bg,
            rawDurationMs: ms
          }
        })

        setHistory(formatted)

        // Calculate stats
        const completed = formatted.filter(s => s.status === 'Hoàn thành')
        const totalFee = completed.reduce((sum, s) => sum + s.fee, 0)
        const totalMs = completed.reduce((sum, s) => sum + s.rawDurationMs, 0)
        const avgHours = completed.length > 0 ? (totalMs / completed.length / 3600000).toFixed(1) : 0

        setStats({
          totalSessions: completed.length,
          totalFee,
          avgDuration: avgHours
        })

      } catch (err) {
        console.error('Failed to load history', err)
      }
    }
    loadData()
  }, [auth])

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>Lịch sử thanh toán & gửi xe</h2>
        <p style={{ color: '#64748b', fontSize: 15, margin: 0 }}>Quản lý chi tiết các giao dịch và biên lai của bạn qua các chu kỳ gửi xe.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 32 }}>
        {[
          { label:'Tổng số phiên', val: stats.totalSessions.toString(), unit:'phiên', icon:'receipt_long', color:'#0ea5e9' },
          { label:'Tổng chi phí', val: stats.totalFee.toLocaleString('vi-VN'), unit:'VNĐ', icon:'payments', color:'#f59e0b' },
          { label:'Thời gian gửi TB', val: stats.avgDuration.toString(), unit:'giờ/phiên', icon:'schedule', color:'#8b5cf6' }
        ].map(item => (
          <div key={item.label} className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
             <div style={{ width: 56, height: 56, borderRadius: 16, background: `${item.color}15`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
               <span className="material-symbols-outlined" style={{ fontSize: 28, fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
             </div>
             <div>
               <p style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</p>
               <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                 {item.val} <span style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8' }}>{item.unit}</span>
               </p>
             </div>
          </div>
        ))}
      </div>

      {/* History table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="material-symbols-outlined" style={{ color: '#003d9b', fontSize: 20 }}>list_alt</span>
              Chi tiết giao dịch
            </h3>
            <div style={{ display: 'flex', gap: 12 }}>
               <button style={{ padding: '8px 16px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#475569', cursor: 'pointer' }}>Xuất báo cáo</button>
            </div>
        </div>
        <div className="table-wrap">
          <table style={{ width: '100%', minWidth: 800 }}>
            <thead>
              <tr>
                <th style={{ padding: '16px 24px' }}>Mã GD</th>
                <th style={{ padding: '16px 24px' }}>Thời gian vào/ra</th>
                <th style={{ padding: '16px 24px' }}>Biển số</th>
                <th style={{ padding: '16px 24px' }}>Khu vực</th>
                <th style={{ padding: '16px 24px' }}>Tổng phí</th>
                <th style={{ padding: '16px 24px' }}>PTTT</th>
                <th style={{ padding: '16px 24px' }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>Không có giao dịch nào</td>
                </tr>
              ) : history.map((h, i) => (
                <tr key={i}>
                  <td style={{ padding: '16px 24px', fontWeight: 600, color: '#003d9b' }}>{h.id.slice(0, 16)}...</td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{h.date}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{h.entry} - {h.exit} ({h.duration})</div>
                  </td>
                  <td style={{ padding: '16px 24px', fontWeight: 600, color: '#1e293b' }}>{h.plate}</td>
                  <td style={{ padding: '16px 24px', color: '#475569' }}>{h.zone}</td>
                  <td style={{ padding: '16px 24px', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: '#f59e0b', fontSize: 16 }}>{h.fee.toLocaleString('vi-VN')}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: '#475569' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{h.method === 'BKPay' ? 'account_balance_wallet' : 'payments'}</span>
                      {h.method}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, background: h.bg, color: h.sc, padding: '4px 10px', borderRadius: 999 }}>{h.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
