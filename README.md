# Third_project - Hypothesis Tester   
  
一個結合 **AI + 統計分析 + 即時互動** 的 Web 工具。  
## 預期結果  
使用者只要上傳 CSV ，輸入問題（例如 *「男女平均分數有差嗎？」*），系統會：

1. **自動建議檢定方法**（t-test / Welch / ANOVA / χ² / z-test）
2. **執行統計計算**（p-value、95% CI、效果量、前提檢查）
3. **AI 白話解釋**（中/英文、商務/論文語氣切換）
4. **即時回饋**：Socket.IO 推送進度條、AI 串流文字、多用戶留言協作

---
  
##  技術棧
- **Frontend**：React (Vite + TS) + Tailwind
- **Backend**：Node.js (Express)
- **Statistics**：simple-statistics + jstat
- **AI**：OpenAI Responses API (解釋/方法建議)
  





