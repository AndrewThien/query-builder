export const HowItWork = () => {
  return (
    <div className="w-full flex flex-col justify-top">
      <h1 className="flex justify-center text-lg font-bold">How it works:</h1>
      <ul>
        <li>
          - Choose the Table you would like to query among available ones.
        </li>
        <li>
          - Choose the Column name, then fill out the reason for requesting data
          from this column. You can add the optional filter by adding its
          operator and value. Click &quot;Add to query&quot; to add to the
          proposed query.
        </li>
        <li>
          - Fill out some general information about the request, then click
          &quot;Generate query&quot; . You will be presented with your query in
          PDF format. Have a final review then download the PDF and the SQL
          query to send to responsible people.
        </li>
      </ul>
    </div>
  );
};
