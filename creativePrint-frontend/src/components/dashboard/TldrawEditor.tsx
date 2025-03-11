import { useCallback } from "react";

declare global {
  interface Window {
    app: any;
  }
}
import { Tldraw } from "@tldraw/tldraw";
// import '@tldraw/tldraw/dist/tldraw.css';
import { ArrowLeft, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const TldrawEditor = () => {
  const navigate = useNavigate();

  // Handle tool selection
  const handleMount = useCallback((app: any) => {
    window.app = app;

    // Setup custom export button
    const exportButton = document.getElementById("export-button");
    if (exportButton) {
      exportButton.addEventListener("click", () => {
        try {
          app.exportImage("png", { scale: 2, quality: 1 });
          toast.success("Design exported as PNG");
        } catch (error) {
          toast.error("Failed to export design");
        }
      });
    }
  }, []);

  return (
    <div className='flex flex-col h-[93vh] overflow-hidden'>
      {/* Tool bar */}
      <div className='bg-white p-4 border-b flex items-center justify-between z-10'>
        <div className='flex items-center'>
          <button
            onClick={() => navigate("/dashboard/designs")}
            className='p-2 mr-4 rounded-full hover:bg-gray-100'>
            <ArrowLeft className='h-5 w-5 text-gray-600' />
          </button>
          <h1 className='text-xl font-semibold'>Design Editor</h1>
        </div>

        <div className='flex space-x-2'>
          <button
            id='export-button'
            className='px-3 py-2 flex items-center bg-green-50 text-green-600 rounded-md hover:bg-green-100'>
            <Download className='w-4 h-4 mr-2' />
            <span>Export as PNG</span>
          </button>
        </div>
      </div>

      {/*  Canvas */}
      <div className='flex-1 relative ' >
        <Tldraw
          showMenu={true}
          showStyles={true}
          showZoom={true}
          onMount={handleMount}
        />
      </div>
    </div>
  );
};

export default TldrawEditor;
