function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setTitle('บัญชีร้านเมนูไข่ 🍳'); // เปลี่ยนชื่อตรงนี้
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

  sheet.appendRow([
    thaiDate,            
    formObject.type,
    formObject.category,
    formObject.detail,
    formObject.amount,
    Utilities.formatDate(new Date(), "GMT+7", "HH:mm:ss") 
  ]);
  
  return "บันทึกยอด (พ.ศ. " + year + ") เรียบร้อยค่า! 🐣";
}

function getDataForDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Transactions");
  var data = sheet.getDataRange().getDisplayValues();
  data.shift(); 
  return data;
}

function include(filename) {
  return HtmlService.createTemplateFromFile(filename)
    .evaluate()
    .getContent();
}
