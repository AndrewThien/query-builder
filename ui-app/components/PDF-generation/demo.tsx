import {
  Page,
  Text,
  View,
  Document,
  PDFViewer,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { InvoicePDF } from "./PDFTemplate";

export default function Invoice2() {
  return (
    <div className="max-w-2xl mx-auto my-10">
      {/* <div className="w-full h-[500px]">
        <PDFViewer width="100%" height="100%">
          <InvoicePDF />
        </PDFViewer>
      </div> */}
      <div className="mt-6 flex justify-center">
        <PDFDownloadLink document={<InvoicePDF />} fileName="invoice.pdf">
          <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300">
            Download PDF
          </button>
        </PDFDownloadLink>
      </div>
    </div>
  );
}
