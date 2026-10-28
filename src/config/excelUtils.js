import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

/**
 * Updates columns across all sheets with unique, auto-incrementing sequential values.
 * @param {string} fileName - File name or path relative to project root
 * @param {string[]} columnVariants - Array of runtime column names, e.g., ['Loan No', 'Loan_Number']
 * @param {string} prefix - Base string prefix for unique sequential generation, e.g., 'AN'
 */
export function updateExcelDataDebtPool(fileName, columnVariants, prefix = '') {
  let filePath = path.resolve(process.cwd(), fileName);

  if (!fs.existsSync(filePath)) {
    filePath = path.resolve(process.cwd(), 'src', 'payloads', fileName);
  }
  if (!fs.existsSync(filePath)) {
    throw new Error(`❌ Excel File Missing! Attempted Path: ${filePath}`);
  }

  const variants = Array.isArray(columnVariants) ? columnVariants : [columnVariants];
  const workbook = XLSX.readFile(filePath);

  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
    if (data.length === 0) return;

    data.forEach((row, rowIndex) => {
      for (const columnName of variants) {
        if (row[columnName] !== undefined) {

          const random3Digit = Math.floor(10 + Math.random() * 999);
          const paddedSeq = String(rowIndex + 1).padStart(3, '0');
          const uniqueID = `${prefix}${paddedSeq}${random3Digit}`;
          row[columnName] = uniqueID;
          break;
        }
      }
    });
    workbook.Sheets[sheetName] = XLSX.utils.json_to_sheet(data);
  });

  XLSX.writeFile(workbook, filePath);
}


export function updateExcelDataApplication(fileName, columnVariants = ['Loan No', 'LOAN_NUMBER']) {
  try {
    const workbook = XLSX.readFile(fileName);
    const cleanVariants = columnVariants.map(v => String(v).trim().toLowerCase());

    let maxRows = 0;
    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      if (worksheet && worksheet['!ref']) {
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        if (range.e.r > maxRows) {
          maxRows = range.e.r;
        }
      }
    });

    const masterLoanNumbers = [];
    for (let i = 0; i <= maxRows; i++) {

      const generateRandomAlphanumeric = () => {
      const randomNumber = Math.floor(100000 + Math.random() * 900000); 
      return `LoanId${randomNumber}`; 
      };
      masterLoanNumbers.push(generateRandomAlphanumeric());
    }

    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet || !worksheet['!ref']) return;

      const range = XLSX.utils.decode_range(worksheet['!ref']);
      const targetCols = [];

      const R = range.s.r; 
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = worksheet[cellAddress];
        
        if (cell && cell.v) {
          const cleanHeader = String(cell.v).trim().toLowerCase();
          if (cleanVariants.includes(cleanHeader)) {
            targetCols.push(C);
          }
        }
      }

      if (targetCols.length > 0) {
        for (let r = R + 1; r <= range.e.r; ++r) {
          targetCols.forEach((c) => {
            const cellAddress = XLSX.utils.encode_cell({ r: r, c: c });
            let cell = worksheet[cellAddress];

            if (!cell) {
              cell = { t: 's', v: '' };
              worksheet[cellAddress] = cell;
            }

            cell.v = masterLoanNumbers[r];
            cell.t = 's'; 
            
            if (cell.w) delete cell.w; 
          });
        }
      }
    });

    XLSX.writeFile(workbook, fileName);
    //console.log(`Successfully updated identical loan numbers across all tabs in: ${fileName}`);

  } catch (error) {
    console.error("Error updating excel file:", error);
  }
}

export const excelUtils = {
  updateExcelDataDebtPool: updateExcelDataDebtPool,
  updateExcelDataApplication: updateExcelDataApplication
}