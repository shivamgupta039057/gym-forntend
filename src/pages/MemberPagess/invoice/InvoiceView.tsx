import React, { useEffect, useState, useRef } from 'react'
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb.js'
import { Apiservice } from '../../../service/apiservice.js';
import apiEndPoints from '../../../constant/apiendpoints.js';
import localStorageKeys from '../../../constant/localStorageKeys.js';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import AddMembersModal from '../AddMemberRegistration.js';
import AddRenewModel from '../AddRenewModel.js';

// --- custom date formatter ---
function formatDate(dateValue: string | Date | undefined | null): string {
  if (!dateValue) return 'N/A';
  let dateObj: Date;
  if (typeof dateValue === 'string') {
    dateObj = new Date(dateValue);
  } else {
    dateObj = dateValue;
  }
  if (isNaN(dateObj.getTime())) return 'N/A';
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
}

// Update this URL (absolute, public internet URL or base64) as per your HIT FIT GYM genuine stamp asset
const STAMP_IMAGE_URL =
  'https://res.cloudinary.com/dbkamrwb1/image/upload/v1780331032/gqjtdyckocr7bysrvqb5.png'; // Example image url: replace with real one

// Generate Invoice HTML (react -> static html string)
function generateInvoiceHTML(invoice) {
  const member = invoice?.memberId || {};
  const plan = member?.planId || {};
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HIT FIT GYM Invoice</title>
  <style>
  *{margin:0;padding:0;box-sizing:border-box;font-family:Arial, Helvetica, sans-serif;}
  body{background:#f4f4f4;padding:30px;}
  .invoice-container{max-width:900px;margin:auto;background:#fff;padding:30px;border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,.1);}
  .header{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #000;padding-bottom:15px;margin-bottom:20px;}
  .logo-section h1{font-size:32px;color:#111;}
  .logo-section p{color:#666;margin-top:5px;}
  .invoice-details{text-align:right;}
  .invoice-details h2{color:#111;}
  .member-details{display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:25px;}
  .detail-box{border:1px solid #ddd;padding:12px;border-radius:6px;}
  .detail-box strong{display:block;margin-bottom:5px;}
  table{width:100%;border-collapse:collapse;margin-top:20px;}
  table th{background:#111;color:#fff;padding:12px;text-align:left;}
  table td{border:1px solid #ddd;padding:12px;}
  .total-section{margin-top:20px;width:350px;margin-left:auto;}
  .total-section table{width:100%;}
  .total-section td{font-weight:bold;}
  .notes{margin-top:30px;}
  .notes h3{margin-bottom:10px;}
  .footer{margin-top:50px;display:flex;justify-content:space-between;position:relative;}
  .signature{text-align:center;position:relative;}
  .signature .line{margin-top:60px;border-top:1px solid #000;width:220px;padding-top:5px;}
  .stamp-genuine{
    position:absolute;
    left:50%;
    top:10px;
    transform: translate(-50%, 0) rotate(-8deg);
    width:110px;
    height:auto;
    opacity:0.85;
    z-index:2;
    pointer-events:none;
    user-select:none;
    filter: drop-shadow(3px 4px 5px rgba(0,0,0,0.15));
  }
  .contact{margin-top:40px;text-align:center;border-top:2px solid #ddd;padding-top:15px;color:#666;}
  @media print{
    body{background:#fff;padding:0;}
    .invoice-container{box-shadow:none;border:none;}
    .stamp-genuine{opacity:0.85;}
  }
  </style>
  </head>
  <body>
  <div class="invoice-container" id="print-area">
      <div class="header">
          <div class="logo-section">
              <h1>HIT FIT GYM</h1>
              <p>Membership Invoice</p>
          </div>
          <div class="invoice-details">
              <h2>INVOICE</h2>
              <p><strong>Date:</strong> ${formatDate(invoice?.createdAt)}</p>
          </div>
      </div>
      <div class="member-details">
          <div class="detail-box"><strong>Member Name</strong>${member?.fullName || ''}</div>
          <div class="detail-box"><strong>Mobile Number</strong>${member?.phone || ''}</div>
          <div class="detail-box"><strong>Membership Plan</strong>${plan?.planName || ''}</div>
          <div class="detail-box"><strong>Duration</strong>${plan?.duration ? `${plan.duration} Month${plan.duration > 1 ? 's' : ''}` : ''}</div>
          <div class="detail-box"><strong>Join Date</strong>${formatDate(member?.joinDate)}</div>
          <div class="detail-box"><strong>Expiry Date</strong>${formatDate(member?.expiryDate)}</div>
      </div>
      <table>
          <thead>
              <tr>
                  <th>Description</th>
                  <th width="200">Amount (₹)</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td>${plan?.planName ? `${plan.planName} Membership Fee` : 'Membership Fee'}</td>
                  <td>${invoice?.amount || 0}</td>
              </tr>
              ${
                invoice?.admissionFee ? `<tr><td>Admission Fee</td><td>${invoice.admissionFee}</td></tr>` : ``
              }
              ${
                invoice?.lockerCharges ? `<tr><td>Locker Charges</td><td>${invoice.lockerCharges}</td></tr>` : ``
              }
          </tbody>
      </table>
      <div class="total-section">
          <table>
              <tr>
                  <td>Total Amount</td>
                  <td>₹${invoice?.totalAmount ?? (Number(invoice?.amount || 0) 
                    + (invoice?.admissionFee || 0) 
                    + (invoice?.lockerCharges || 0))}</td>
              </tr>
              <tr>
                  <td>Amount Paid</td>
                  <td>₹${invoice?.paidAmount ?? invoice?.amount ?? 0}</td>
              </tr>
              <tr>
                  <td>Pending Amount</td>
                  <td>₹${invoice?.pendingAmount ?? ( (invoice?.totalAmount ?? (Number(invoice?.amount || 0) 
                    + (invoice?.admissionFee || 0) + (invoice?.lockerCharges || 0))) - (invoice?.paidAmount ?? 0) ) }</td>
              </tr>
          </table>
      </div>
      <div class="notes">
          <h3>Notes</h3>
          <p>Thank you for choosing HIT FIT GYM. Please keep this invoice for future reference.</p>
      </div>
      <div class="footer">
          <div class="signature">

          </div>
          <div class="signature" style="position: relative; min-height: 130px;">
              <!-- HIT FIT GYM GENUINE STAMP -->
              <img class="stamp-genuine" src="${STAMP_IMAGE_URL}" alt="Genuine Stamp" />
              <div class="line">Authorized Signature</div>
          </div>
      </div>
      <div class="contact">
          <h3>HIT FIT GYM</h3>
          <p>📞 +91 9057280563</p>
          <p>17, Amer Rd, Ganesh Colony, Jaipur, Rajasthan 302002</p>
          <p>✉️ info@hitfitgym.com</p>
      </div>
  </div>
  <script>window.printAreaId='print-area';</script>
  </body>
  </html>
  `
}

// For printing only the invoice area, not whole page
function printInvoiceArea(invoice) {
  const myWindow = window.open('', '', 'width=900,height=950');
  if (!myWindow) return;
  myWindow.document.write(generateInvoiceHTML(invoice));
  myWindow.document.close();
  myWindow.focus();
  setTimeout(() => myWindow.print(), 350);
}


const InvoiceView: React.FC = () => {
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [AddOpenModal , setAddOpenModal] = useState<boolean>(false);
  const [AddRenewOpenModal , setAddRenewOpenModal] = useState<boolean>(false);
  const [addPatientsId, setAddPatientsId] = useState<string>("");
  const { paymentID:invoiceId } = useParams();

  const token = localStorage.getItem(localStorageKeys.token);

  useEffect(() => {
    async function fetchInvoice() {
      setLoading(true);
      try {
        if (!token) throw new Error("Token is missing.");
        const res = await Apiservice.getAuth(`${apiEndPoints.member.payment_detials}/${invoiceId}`, token);
        if (res && res.data.status === 200 && res.data.data) {
          setInvoiceData(res.data.data);
        } else {
          setInvoiceData(null);
        }
      } catch (error: any) {
        setInvoiceData(null);
        toast.error(error?.response?.data?.message || "Error fetching invoice");
      }
      setLoading(false);
    }
    fetchInvoice();
  }, [invoiceId, token]);


  const handleDownloadPDF = async () => {
    // For actual HTML to PDF: You must create a backend endpoint using html-pdf-node to convert HTML string to PDF.
    // Here we'll show "Download" by opening the print dialog as a workaround.
    printInvoiceArea(invoiceData);
    // For real PDF: Call your backend endpoint with HTML -> receive PDF blob -> trigger download in browser.
  };

  return (
    <>
      <div className="flex justify-between items-start sm:items-center mb-6 gap-3 flex-col sm:flex-row">
        <Breadcrumb pageName="Invoice View" />
        {invoiceData && (
          <button
            className="px-5 py-2 text-sm rounded bg-blue-600 text-white shadow"
            onClick={handleDownloadPDF}
            title="Download Invoice"
          >
            Download / Print Invoice
          </button>
        )}
      </div>

      <div className="capitalize w-full flex flex-col items-center">
        {loading ? (
          <p className="py-10">Loading invoice...</p>
        ) : (
          invoiceData ? (
            <div
              className="invoice-preview-container"
              style={{
                background: "#fff",
                boxShadow: "0 2px 10px rgba(0,0,0,.1)",
                borderRadius: 10,
                padding: 30,
                maxWidth: 900,
                margin: "auto"
              }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: generateInvoiceHTML(invoiceData),
                }}
              />
              {/* The above renders the invoice in the browser; download button opens print dialog for PDF download */}
            </div>
          ) : (
            <p className="py-10 text-red-500">Invoice not found.</p>
          )
        )}
      </div>

      <AddMembersModal
        openModal={AddOpenModal}
        setOpenAddModal={setAddOpenModal}
        getFunction={() => {}}
        addPatientsId={addPatientsId}
      />

      <AddRenewModel
        openModal={AddRenewOpenModal}
        setOpenAddModal={setAddRenewOpenModal}
        getFunction={() => {}}
        addPatientsId={addPatientsId}
      />
    </>
  )
}

export default InvoiceView;
