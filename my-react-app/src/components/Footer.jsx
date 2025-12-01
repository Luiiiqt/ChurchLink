function Footer() {
  const lastUpdated = new Date().toLocaleString();

  return (
    <footer className="bg-gradient-to-r from-green-100 to-emerald-100 shadow-inner px-6 py-4 text-center text-emerald-700 text-sm font-medium select-none">
      &copy; {new Date().getFullYear()} ChurchLink Admin Dashboard. All rights reserved.
      <div className="mt-1 text-xs text-green-600 italic">
        Last updated: {lastUpdated}
      </div>
    </footer>
  );
}

export default Footer;
