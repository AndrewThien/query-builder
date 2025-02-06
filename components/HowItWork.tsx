export const HowItWork = () => {
  return (
    <div className="w-full flex flex-col justify-top">
      <h1 className="flex justify-center text-lg font-bold">How it works:</h1>
      <ul>
        <li>- Choose the table you want to query among available ones</li>
        <li>
          - Choose the Column name, then fill out the operator and value for the
          filter
        </li>
        <li>- Click &quot;Push&quot; to add to the query</li>
      </ul>
    </div>
  );
};
