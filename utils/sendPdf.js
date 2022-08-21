const fs = require("fs");
const PDFDocument = require("pdfkit");

function createBookingPdf(booking, details,path) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc);
  generateCustomerInformation(doc, booking);
  generateBookingTable(doc, booking);
  generateFooter(doc);

  doc.end();
  doc.pipe(fs.createWriteStream(details,path));
}

function generateHeader(doc) {
  doc
  .image('D:\\working_projects\\ayuh-phr-backend\\controllers\\logo.png', 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text("Ayuh", 110, 57)
    .fontSize(10)
    .text("Ayuh", 200, 50, { align: "right" })
    .text("Kathmandu,Nepal", 200, 65, { align: "right" })
    .moveDown();
}

function generateCustomerInformation(doc, booking) {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Booking Confirmation", 50, 160, { align: "center" });

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Booking Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .font("Helvetica")
    .text("Booking Date:", 50, customerInformationTop + 15)
    .text("Total Amount Paid:", 50, customerInformationTop + 30)
    .text(
      booking.doctorFeesPerSession,
      150,
      customerInformationTop + 30
    )

    .font("Helvetica-Bold")
    .text("Dr "+booking.doctorName +", "+booking.doctorContact_no, 300, customerInformationTop)
    .font("Helvetica")
    .text("Email: "+booking.doctorEmail, 300, customerInformationTop + 15)
    .text(
      booking.NMC + ", "+
		booking.doctorExperience +
        ", " +
        booking.doctorSpecialization,
      300,
      customerInformationTop + 30
    )
    .moveDown();

  generateHr(doc, 252);
}

function generateBookingTable(doc, booking) {
  const bookingTableTop = 420;
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Booking Details", 50, 350, { align: "center" });

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    bookingTableTop,
    "Name",
    "Phone",
    "Reason For Visit",
    "Date",
    "Alloted Slot",
    "Total Amount Paid"
  );
  generateHr(doc, bookingTableTop + 20);
  doc.font("Helvetica");

    const position = bookingTableTop + 30;
    generateTableRow(
      doc,
      position,
      booking.patientName,
      booking.patientContact_no,
      booking.patientReasonForVisit,
      booking.date,
      booking.slotTime,
      "Nrs "+booking.doctorFeesPerSession
      
    );

    generateHr(doc, position + 20);
  }

function generateFooter(doc,booking) {
  doc
    .fontSize(10)
    .text(
      "Please arrive 10 minutes before the alloted slot time and Follow up is free for 7 days.",
      50,
      500,
      { align: "center", width: 500 }
    )
    .text("Hope you get well soon and Thank you for choosing Ayuh.", 50, 540, { align: "center" })
}


function generateTableRow(
  doc,
  y,
  patientName,
  patientContact_no,
  patientReasonForVisit,
  date,
  slotTime,
  doctorFeesPerSession
  
) {
  doc
    .fontSize(10)
    .text(patientName, 50, y)
    .text(patientContact_no,100, y)
    .text(patientReasonForVisit,170, y)
    .text(date, 300, y)
    .text(slotTime,370, y)
    .text(doctorFeesPerSession, 450, y);
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}


module.exports = {
	createBookingPdf
};