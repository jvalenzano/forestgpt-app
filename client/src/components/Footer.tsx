export default function Footer() {
  return (
    <footer className="bg-forest-900 text-white py-4 mt-auto">
      <div className="container mx-auto px-4 text-center text-sm">
        <p>
          ForestGPT provides information based solely on content from{" "}
          <a 
            href="https://www.fs.usda.gov/" 
            className="underline hover:text-forest-100" 
            target="_blank"
            rel="noopener noreferrer"
          >
            fs.usda.gov
          </a>.
        </p>
        <p className="mt-1 text-forest-200">
          This is a prototype application for demonstration purposes.
        </p>
      </div>
    </footer>
  );
}
