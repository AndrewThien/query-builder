import { ReviewData } from "@/types";

export const PDFTemplate = ({
  printRef,
  reviewData,
}: {
  printRef: React.MutableRefObject<null>;
  reviewData: ReviewData;
}) => (
  <div ref={printRef} className="p-8 bg-white border border-gray-200">
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Data Request</h1>
        <p className="text-sm text-gray-600">
          {new Date().toLocaleTimeString()} {new Date().toLocaleDateString()}
        </p>
      </div>
      <div className="text-right">
        <h2 className="font-semibold">From:</h2>
        <p className="text-sm text-gray-600">
          {reviewData.requestor}
          <br />
          {reviewData.org}
        </p>
      </div>
    </div>

    <div className="mb-8">
      <h3 className="text-lg font-semibold">General information</h3>
      <p className="text-gray-700">
        Reason: {reviewData.general_reason}
        <br />
        Comment: {reviewData.comment}
        <br />
        Table: {reviewData.table}
      </p>
    </div>

    <table className="w-full mb-8 border-collapse">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2 text-left">Column</th>
          <th className="border p-2 text-center">Data Type</th>
          <th className="border p-2 text-center">Oper.</th>
          <th className="border p-2 text-center">Value</th>
          <th className="border p-2 text-center">Reason</th>
        </tr>
      </thead>
      <tbody>
        {reviewData.conditions?.map((condition, index) => (
          <tr key={index}>
            <td className="border p-2 text-left">{condition.column_name}</td>
            <td className="border p-2 text-center">
              {condition.data_type.toUpperCase()}
            </td>
            <td className="border p-2 text-center">{condition.operator}</td>
            <td className="border p-2 text-center">{condition.value}</td>
            <td className="border p-2 text-center">{condition.reason}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
