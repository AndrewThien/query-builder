import { Blocks } from "lucide-react";
import TableView from "@/components/TableView";

const Page: React.FC = () => {
  return (
    <div className="container mx-auto my-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-extrabold text-blue-500 flex items-center">
          Query Builder <Blocks className="ml-2" />
        </h1>
      </div>
      <TableView />
    </div>
  );
};

export default Page;
