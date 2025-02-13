import { Blocks } from "lucide-react";
import TableView from "@/components/TableView";
import Invoice2 from "@/components/PDF-generation/demo";
import Invoice from "@/components/PDF-generation/demo";
import Link from "next/link";

const Page: React.FC = () => {
  return (
    <div className="container mx-auto my-5">
      <div className="flex justify-between items-center mb-6">
        <Link href={"/"}>
          <h1 className="text-xl font-extrabold text-blue-500 flex items-center">
            Query Builder <Blocks className="ml-2" />
          </h1>
        </Link>
      </div>
      <Invoice />
    </div>
  );
};

export default Page;
