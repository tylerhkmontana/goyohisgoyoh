import TopNav from "@/components/top-nav";

export default function SiteLayout({ children }) {
  return (
    <>
      <TopNav />
      {children}
    </>
  );
}
