export const teamPageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  body { font-family: 'Inter', Arial, sans-serif; }
  .font-display { font-family: 'Inter', Arial, sans-serif; }

  .nav-glass { background: #111827; border-bottom: 1px solid #243041; }
  .team-page { min-height: 100vh; background: #0f1f3d; color: white; }
  .team-page-white { background: white; color: #111827; }
  .team-wrap { max-width: 1120px; margin: 0 auto; padding: 104px 18px 56px; }
  .team-hero { text-align: center; margin-bottom: 26px; }
  .team-kicker { display: none; }
  .team-kicker-dot { display: none; }
  .team-title { margin: 0 0 10px; color: white; font-size: clamp(1.65rem, 3vw, 2.3rem); line-height: 1.15; letter-spacing: 3px; text-transform: uppercase; font-weight: 700; }
  .team-page-white .team-title { color: #111827; }
  .team-title span { color: inherit; }
  .team-subtitle { max-width: 640px; margin: 0 auto; color: rgba(255,255,255,0.82); font-size: 0.95rem; line-height: 1.6; }
  .team-page-white .team-subtitle { color: #4b5563; }
  .team-card { max-width: 460px; margin: 0 auto; background: #1d4ed8; border-radius: 6px; border: 1px solid #1e40af; box-shadow: 0 12px 26px rgba(30, 64, 175, 0.18); padding: 24px; text-align: center; }
  .team-card-wide { max-width: 980px; background: transparent; border: 0; box-shadow: none; padding: 0; text-align: left; }
  .team-card-title { margin: 0 0 12px; font-size: 1.05rem; color: white; font-weight: 800; }
  .team-card-wide .team-card-title { color: white; font-size: 1.4rem; }
  .team-page-white .team-card-wide .team-card-title { color: #111827; }
  .team-card-copy { margin: 0 0 18px; color: rgba(255,255,255,0.9); line-height: 1.55; }
  .team-card-wide .team-card-copy { color: rgba(255,255,255,0.78); }
  .team-page-white .team-card-wide .team-card-copy { color: #6b7280; }
  .team-actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .team-action-btn, .team-submit-btn { border: 0; border-radius: 4px; background: #0d6efd; color: white; font-family: 'Inter', Arial, sans-serif; font-size: 0.82rem; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease; text-decoration: none; text-transform: uppercase; letter-spacing: 0; }
  .team-action-btn { min-height: 54px; padding: 12px; background: white; color: #111827; text-transform: none; font-size: 0.98rem; }
  .team-action-btn.secondary { background: white; color: #111827; }
  .team-action-btn:hover, .team-submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 18px rgba(13, 110, 253, 0.22); }
  .team-panel { max-width: 520px; margin: 0 auto; background: white; border: 1px solid #e5e7eb; box-shadow: 0 8px 24px rgba(17, 24, 39, 0.08); padding: 22px; }
  .team-panel-title { margin: 0 0 18px; color: #0d6efd; font-size: clamp(1.4rem, 2.6vw, 2rem); line-height: 1.2; letter-spacing: 1px; text-transform: uppercase; font-weight: 700; text-align: center; }
  .team-form { display: grid; gap: 14px; }
  .team-form-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
  .team-field-full { grid-column: 1 / -1; }
  .team-field label { display: none; }
  .team-input, .team-textarea { width: 100%; box-sizing: border-box; border-radius: 0; border: 1px solid #e5e7eb; background: white; color: #111827; font-family: 'Inter', Arial, sans-serif; font-size: 0.92rem; outline: none; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
  .team-input { padding: 10px 12px; min-height: 40px; }
  .team-input[type="file"] { padding: 8px 10px; color: #4b5563; }
  .team-file-picker { display: flex; align-items: stretch; min-height: 40px; border: 1px solid #e5e7eb; background: white; box-sizing: border-box; }
  .team-file-picker .team-file-input { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
  .team-file-picker .team-file-button { display: inline-flex; align-items: center; justify-content: center; min-height: 38px; padding: 0 14px; border-right: 1px solid #e5e7eb; background: #f9fafb; color: #111827; font-size: 0.86rem; font-weight: 700; cursor: pointer; white-space: nowrap; }
  .team-file-picker .team-file-name { flex: 1; min-width: 0; display: flex; align-items: center; padding: 0 12px; color: #6b7280; font-size: 0.88rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .team-textarea { min-height: 78px; padding: 10px 12px; resize: vertical; }
  .team-input::placeholder, .team-textarea::placeholder { color: #6b7280; }
  .team-input:focus, .team-textarea:focus { border-color: #0d6efd; box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.08); }
  .team-submit-btn { width: 100%; padding: 11px 18px; min-height: 40px; }
  .team-submit-btn:disabled { opacity: 0.72; cursor: not-allowed; }
  .team-alert { padding: 10px 12px; border-radius: 4px; margin-bottom: 14px; font-size: 0.9rem; line-height: 1.5; background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; }
  .team-alert-error { background: #fef2f2; border-color: #fecaca; color: #b91c1c; }
  .team-alert-success { background: #f0fdf4; border-color: #bbf7d0; color: #166534; }
  .member-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; align-items: start; }
  .member-card { overflow: hidden; border: 1px solid #e5e7eb; border-radius: 2px; background: white; box-shadow: 0 8px 20px rgba(17, 24, 39, 0.08); text-align: center; }
  .member-image { width: 100%; aspect-ratio: 4 / 3; background: #f8fafc; object-fit: contain; display: block; }
  .member-image-placeholder { width: 100%; aspect-ratio: 4 / 3; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #bfdbfe, #eff6ff); color: #1d4ed8; font-weight: 800; font-size: 2.4rem; }
  .member-card-body { padding: 12px 14px 14px; }
  .member-name { margin: 0 0 6px; color: #111827; font-size: 1rem; line-height: 1.25; font-weight: 800; }
  .member-meta { margin: 0 0 12px; color: #6b7280; font-size: 0.88rem; line-height: 1.45; }
  .member-card .team-submit-btn { width: auto; min-height: 34px; padding: 9px 14px; font-size: 0.76rem; }
  .member-profile { display: grid; grid-template-columns: 300px 1fr; gap: 22px; background: white; border: 1px solid #e5e7eb; box-shadow: 0 8px 24px rgba(17, 24, 39, 0.08); padding: 18px; }
  .member-profile-photo { width: 100%; aspect-ratio: 1 / 1; object-fit: cover; background: #dbeafe; border: 1px solid #e5e7eb; }
  .member-profile-placeholder { width: 100%; aspect-ratio: 1 / 1; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #bfdbfe, #eff6ff); color: #1d4ed8; font-weight: 800; font-size: 4rem; border: 1px solid #e5e7eb; }
  .member-simple-card { max-width: 470px; margin: 0 auto; overflow: hidden; background: white; border: 1px solid #e5e7eb; box-shadow: 0 10px 28px rgba(17, 24, 39, 0.1); }
  .member-simple-photo { width: 100%; aspect-ratio: 4 / 3; object-fit: contain; display: block; background: #f8fafc; }
  .member-simple-placeholder { width: 100%; aspect-ratio: 4 / 3; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #bfdbfe, #eff6ff); color: #1d4ed8; font-weight: 800; font-size: 3.2rem; }
  .member-simple-body { padding: 12px 18px 18px; }
  .member-simple-name { margin: 0; text-align: center; color: #111827; font-size: 1rem; font-weight: 800; text-transform: lowercase; }
  .member-simple-degree { margin: 4px 0 18px; text-align: center; color: #6b7280; font-size: 0.82rem; }
  .member-simple-list { border-top: 1px solid #eef2f7; }
  .member-simple-row { margin: 0; padding: 9px 0; border-bottom: 1px solid #eef2f7; color: #111827; font-size: 0.88rem; line-height: 1.45; }
  .member-simple-row strong { font-weight: 800; }
  .member-hobbies { margin-top: 14px; }
  .member-hobbies h3 { margin: 0 0 8px; color: #111827; font-size: 0.9rem; font-weight: 800; }
  .member-hobby-tags { display: flex; flex-wrap: wrap; gap: 7px; }
  .member-hobby-tag { display: inline-flex; align-items: center; min-height: 25px; padding: 5px 9px; border-radius: 3px; background: #0d6efd; color: white; font-size: 0.74rem; font-weight: 700; }
  .member-image-link { width: max-content; margin-top: 14px; border-radius: 4px; background: #0d6efd; color: white; text-decoration: none; padding: 9px 12px; display: inline-flex; align-items: center; gap: 7px; font-size: 0.78rem; font-weight: 800; text-transform: uppercase; }
  .member-detail-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .member-detail-item { border-radius: 2px; background: #f9fafb; border: 1px solid #e5e7eb; padding: 12px; }
  .member-detail-item.full { grid-column: 1 / -1; }
  .member-detail-label { display: block; color: #6b7280; font-size: 0.74rem; font-weight: 800; text-transform: uppercase; margin-bottom: 5px; }
  .member-detail-value { color: #111827; line-height: 1.55; word-break: break-word; }
  .team-back-link { color: white; font-weight: 800; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; margin-bottom: 18px; }
  .team-page-white .team-back-link { color: #111827; }
  .team-page-heading-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 22px; }
  @media (max-width: 900px) { .member-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .member-profile { grid-template-columns: 1fr; } }
  @media (max-width: 700px) { .team-wrap { padding: 92px 12px 38px; } .team-title { letter-spacing: 2px; } .team-card { padding: 20px 16px; } .team-actions, .member-detail-grid { grid-template-columns: 1fr; } .member-grid { grid-template-columns: 1fr; gap: 18px; } .team-page-heading-row { align-items: stretch; flex-direction: column; } }
`;
