function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setTitle('บัญชีร้านเมนูไข่ 🍳');
}

function getSpreadsheetUrl() {
  return SpreadsheetApp.getActiveSpreadsheet().getUrl();
}

function saveData(formObject) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Transactions");
  
  var dateStr = formObject.date; 
  var parts = dateStr.split("-"); 
  var year = parseInt(parts[0]) + 543;
  var month = parts[1];
  var day = parts[2];
  var thaiDate = day + "/" + month + "/" + year;

  var rowData = [
    thaiDate,            
    formObject.type,
    formObject.category,
    formObject.detail,
    formObject.amount,
    Utilities.formatDate(new Date(), "GMT+7", "HH:mm:ss") 
  ];

  // ตรวจสอบว่าเป็นการแก้ไขหรือเพิ่มใหม่
  if (formObject.row_index && formObject.row_index !== "") {
    var rowIndex = parseInt(formObject.row_index) + 2; // +2 เพราะ index เริ่มจาก 0 และมี header
    sheet.getRange(rowIndex, 1, 1, 6).setValues([rowData]);
    return "อัปเดตข้อมูลเรียบร้อยแล้วค่า! 🍳";
  } else {
    sheet.appendRow(rowData);
    return "บันทึกยอดเรียบร้อยค่า! 🐣";
  }
}

function getDataForDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Transactions");
  var data = sheet.getDataRange().getDisplayValues();
  data.shift(); // เอา header ออก
  
  // เพิ่ม index เข้าไปในแต่ละแถวเพื่อให้ฝั่ง Client รู้ว่าอยู่แถวไหน
  return data.map(function(row, index) {
    return {
      values: row,
      index: index
    };
  });
}

function include(filename) {
  return HtmlService.createTemplateFromFile(filename)
    .evaluate()
    .getContent();
}
