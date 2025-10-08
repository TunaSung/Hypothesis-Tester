import { parse } from "csv-parse";
import { createReadStream } from "fs";

/**
 * 非同步讀取 CSV 檔案
 * @param path - 檔案路徑
 * @returns 陣列，每列是 {欄位名str: 字串str} 的物件
 */

export async function readCSV(path: string): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    // 供後續 await
    const rows: Record<string, string>[] = [];

    // 建立檔案讀取串流，傳給 csv-parse 解析器
    createReadStream(path)
      .pipe(
        // 把檔案串流導到 csv-parse 解析器裡
        parse({
          columns: true, // 解析時自動用第一列當欄位名稱
          trim: true, // 去掉欄位值的前後空白
          skip_empty_lines: true,
        })
      )
      // 每讀到一列資料，就 push 到 rows 陣列
      .on("data", (row) => rows.push(row))
      // 全部讀完後，resolve 解析完成的陣列
      .on("end", () => resolve(rows))
      // 如果讀檔或解析過程發生錯誤，reject promise
      .on("error", reject);
  });
}

/**
 * 從資料列陣列取得欄位名稱
 * @param rows - readCSV 回傳的資料列
 * @returns 欄位名稱字串陣列
 */
export function getColumns(rows: Record<string, string>[]): string[] {
  // 如果有資料，就取第一列的 key 當作欄位名稱；否則回傳空陣列
  return rows.length && rows[0] ? Object.keys(rows[0]) : [];
}
