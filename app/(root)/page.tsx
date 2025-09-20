import ProductList from "@/components/shared/product/product-list";
import sampleData from "@/db/sample-data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

const HomePage = () => {
  return (
    <>
      <ProductList
        data={sampleData.products}
        title="Newest Arrivals"
        limit={4}
      />
    </>
  );
};

export default HomePage;
