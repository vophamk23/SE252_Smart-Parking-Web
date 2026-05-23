// ============================================================
// USER HOME - Desktop Dashboard Overview
// ============================================================
import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { parkingService } from "../parking/parkingService";
import { dashboardService } from "./dashboardService";

const ZONE_LABEL = { zone_a1: "Khu A", zone_a2: "Khu A2", zone_b1: "Khu B1" };
const ZONE_DESC = {
  zone_a1: "Tòa A1, A2, A3",
  zone_a2: "Sân vận động",
  zone_b1: "Tòa A4, B1",
};

export default function UserHome() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [activeSession, setActiveSession] = useState(null);
  const [zones, setZones] = useState([]);
  const [fee, setFee] = useState(0);
  const [stats, setStats] = useState(null);

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12
      ? "Chào buổi sáng"
      : hour < 18
        ? "Chào buổi chiều"
        : "Chào buổi tối";

  useEffect(() => {
    async function loadData() {
      try {
        const [userStats, pricing] = await Promise.all([
          dashboardService.getUserStats(),
          parkingService.getPricing(),
        ]);
        setStats(userStats);
        setZones(userStats.zones);

        if (userStats.activeSession) {
          const session = userStats.activeSession;
          setActiveSession(session);
          const entryDate = new Date(session.entryTime);
          const hours = Math.max(
            1,
            Math.ceil((new Date() - entryDate) / (1000 * 60 * 60)),
          );
          const rolePricing = pricing[session.userRole] || pricing.guest;
          setFee(rolePricing.hourly * hours);
        } else {
          setActiveSession(null);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      }
    }
    loadData();
  }, [auth?.card]);

  const formatDuration = (entryIso) => {
    if (!entryIso) return "---";
    const ms = new Date() - new Date(entryIso);
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return h > 0 ? `${h}h ${m}p` : `${m} phút`;
  };

  const formatTime = (iso) => {
    if (!iso) return "-";
    const date = new Date(iso);
    const isToday = new Date().toDateString() === date.toDateString();
    const timeStr = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return isToday
      ? `Hôm nay, ${timeStr}`
      : `${date.toLocaleDateString("vi-VN")} ${timeStr}`;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        maxWidth: 1400,
        margin: "0 auto",
      }}
    >
      {/* Greeting Banner */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          background: "linear-gradient(135deg, #0f172a, #1e293b, #003d9b)",
          borderRadius: 20,
          padding: 32,
          color: "#fff",
          boxShadow: "0 10px 30px -10px rgba(0,61,155,0.4)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 40,
            top: "50%",
            transform: "translateY(-50%)",
            opacity: 0.1,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 160 }}>
            directions_car
          </span>
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2
            style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontSize: 28,
              fontWeight: 700,
              margin: "0 0 8px 0",
            }}
          >
            {greeting}, {auth?.name || "User"} 👋
          </h2>
          <p
            style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, margin: 0 }}
          >
            Chào mừng trở lại! Hôm nay bạn muốn quản lý gửi xe tại khu vực nào?
          </p>
        </div>
        <div
          style={{ position: "relative", zIndex: 1, display: "flex", gap: 12 }}
        >
          <button
            onClick={() => navigate("/user/map")}
            style={{
              padding: "12px 24px",
              background: "#fff",
              color: "#1e293b",
              border: "none",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "translateY(-2px)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 20 }}
            >
              map
            </span>
            Tìm chỗ đỗ xe
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: 24,
        }}
      >
        {/* Current Session or Debt Alert */}
        <div
          className="card"
          style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}
        >
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#0f172a",
              margin: "0",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ color: "#22c55e" }}
            >
              radio_button_checked
            </span>
            Phiên gửi xe hiện tại
          </h3>

          {/* Pending Debt Alert */}
          {stats?.debtCount > 0 && !activeSession && (
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1, justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 42, color: '#d97706', marginBottom: 12, fontVariationSettings: "'FILL' 1" }}>error</span>
              <p style={{ color: '#92400e', fontSize: 16, fontWeight: 700, margin: '0 0 4px 0' }}>Bạn có {stats.debtCount} khoản phí chưa thanh toán!</p>
              <p style={{ color: '#b45309', fontSize: 14, margin: '0 0 16px 0' }}>Tổng nợ: <strong style={{ fontSize: 18 }}>{stats.unpaidBalance.toLocaleString('vi-VN')} VNĐ</strong></p>
              <button
                onClick={() => navigate('/user/pay')}
                style={{ padding: '10px 24px', background: '#d97706', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(217,119,6,0.2)' }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Thanh toán ngay
              </button>
            </div>
          )}

          {activeSession && (
            <div
              style={{
                background: "#f8fafc",
                borderRadius: 16,
                padding: 20,
                border: "1px solid #e2e8f0",
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: "#eff6ff",
                      color: "#003d9b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: 24,
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >
                      {activeSession.vehicleType?.includes("máy")
                        ? "two_wheeler"
                        : "directions_car"}
                    </span>
                  </div>
                  <div>
                    <h4
                      style={{
                        fontFamily: "'Space Grotesk',sans-serif",
                        fontSize: 20,
                        fontWeight: 700,
                        margin: "0 0 2px 0",
                        color: "#1e293b",
                      }}
                    >
                      {activeSession.vehicle}
                    </h4>
                    <p
                      style={{
                        color: "#64748b",
                        fontSize: 13,
                        margin: 0,
                        fontWeight: 500,
                      }}
                    >
                      {activeSession.vehicleType} ·{" "}
                      {ZONE_LABEL[activeSession.zone] || activeSession.zone}
                    </p>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#22c55e",
                    background: "#dcfce7",
                    padding: "6px 12px",
                    borderRadius: 8,
                  }}
                >
                  Đang đỗ
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px dashed #cbd5e1",
                  borderBottom: "1px dashed #cbd5e1",
                  padding: "16px 0",
                  margin: "auto 0",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                      margin: "0 0 4px 0",
                    }}
                  >
                    Vào lúc
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#1e293b",
                      margin: 0,
                    }}
                  >
                    {formatTime(activeSession.entryTime)}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                      margin: "0 0 4px 0",
                    }}
                  >
                    Thời gian đã gửi
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#0ea5e9",
                      margin: 0,
                    }}
                  >
                    {formatDuration(activeSession.entryTime)}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  marginTop: 16,
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                      margin: "0 0 4px 0",
                    }}
                  >
                    Cước phí tạm tính
                  </p>
                  <p
                    style={{
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#0f172a",
                      margin: 0,
                    }}
                  >
                    {fee.toLocaleString("vi-VN")}{" "}
                    <span style={{ fontSize: 14, color: "#64748b" }}>VNĐ</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {(!stats || (stats?.debtCount === 0 && !activeSession)) && (
            <div
              style={{
                background: "#f8fafc",
                borderRadius: 16,
                padding: 30,
                border: "1px dashed #cbd5e1",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 48, color: "#94a3b8", marginBottom: 12 }}
              >
                no_crash
              </span>
              <p
                style={{
                  color: "#475569",
                  fontSize: 15,
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Không có phiên đỗ xe hiện tại
              </p>
              <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>
                Quẹt thẻ tại cổng để bắt đầu gửi xe.
              </p>
            </div>
          )}
        </div>

        {/* Zones Availability */}
        <div
          className="card"
          style={{ padding: 24, display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#0f172a",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ color: "#0ea5e9" }}
              >
                local_parking
              </span>
              Tình trạng bãi đỗ
            </h3>
            <button
              onClick={() => navigate("/user/map")}
              style={{
                background: "none",
                border: "none",
                color: "#003d9b",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Xem chi tiết
            </button>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              flex: 1,
            }}
          >
            {zones.map((item) => {
              const available = item.available ?? Math.max(0, item.capacity - (item.occupied || 0));
              const percent = ((item.capacity - available) / item.capacity) * 100;
              const color =
                percent < 50 ? "#22c55e" : percent < 80 ? "#f59e0b" : "#ef4444";

              return (
                <div
                  key={item.id}
                  onClick={() => navigate("/user/map")}
                  style={{
                    padding: "14px 18px",
                    background: "#f8fafc",
                    borderRadius: 14,
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = color;
                    e.currentTarget.style.background = "#fff";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.background = "#f8fafc";
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: `${color}18`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: color,
                        fontFamily: "'Space Grotesk',sans-serif",
                      }}
                    >
                      {item.id.replace("zone_", "").toUpperCase()}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        margin: "0 0 2px 0",
                        color: "#1e293b",
                      }}
                    >
                      {item.name}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "#64748b",
                        margin: "0 0 6px 0",
                      }}
                    >
                      {ZONE_DESC[item.id] || ""}
                    </p>
                    <div
                      style={{
                        height: 6,
                        background: "#e2e8f0",
                        borderRadius: 6,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${percent}%`,
                          height: "100%",
                          background: color,
                          borderRadius: 6,
                          transition: "width 0.5s",
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, width: 60 }}>
                    <p
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: color,
                        margin: 0,
                        fontFamily: "'Space Grotesk',sans-serif",
                      }}
                    >
                      {available}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: "#94a3b8",
                        margin: 0,
                        fontWeight: 500,
                      }}
                    >
                      trống ({item.capacity})
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
