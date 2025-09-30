# Third_project - Hypothesis Tester   
  
一個結合 **AI + 統計分析 + 即時互動** 的 Web 工具。  
## 預期結果  
使用者只要上傳 CSV ，輸入問題（例如 *「男女平均分數有差嗎？」*），系統會：

1. **自動建議檢定方法**（Independent t-test / Paired t-test / One-way ANOVA / Pearson Correlation）
2. **執行統計計算**（p-value、95% CI、效果量、前提檢查）

---
  
##  技術棧
- **Frontend**：React (Vite + TS) + Tailwind
- **Backend**：Node.js (Express)
- **Statistics**：simple-statistics + jstat
- **AI**：OpenAI Responses API (解釋/方法建議)
  






