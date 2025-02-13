"use client";
import { Blocks } from "lucide-react";
import Link from "next/link";
import Review from "@/components/PDF-generation/Review";
import { useEffect, useState } from "react";

const Page: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);
  return (
    <>
      {loaded && (
        <div className="container mx-auto my-5">
          <div className="flex justify-between items-center mb-6">
            <Link href={"/"}>
              <h1 className="text-xl font-extrabold text-blue-500 flex items-center">
                Query Builder <Blocks className="ml-2" />
              </h1>
            </Link>
          </div>
          <Review />
        </div>
      )}
    </>
  );
};

export default Page;
