"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Download, Loader2, ShieldAlert, X, CheckCircle } from "lucide-react";
import Image from "next/image";

const ExtensionDownloadPage = () => {
  const [browser, setBrowser] = useState("unknown");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes("chrome") && !userAgent.includes("edg")) {
      setBrowser("chrome");
      setDownloadUrl("/extension.crx");
    } else if (userAgent.includes("firefox")) {
      setBrowser("firefox");
      setDownloadUrl("/extension.xpi");
    } else {
      setBrowser("unsupported");
    }
    setLoading(false);
  }, []);

  const handlePayment = () => {
    // Simulating payment process
    setTimeout(() => {
      setPaymentCompleted(true);
      setPaymentSuccess(true);
    }, 2000);
  };

  const handleDownload = () => {
    if (!paymentCompleted) {
      handlePayment();
    } else {
      setShowModal(true);
    }
  };

  const confirmDownload = () => {
    setShowModal(false);
    if (downloadUrl) {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", "");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      {/* Image at the top */}
      <Image src="/preview.jpg" width={500} height={300} alt="Preview" className="rounded-lg shadow-lg w-[60%]" />

      {/* Text below the image */}
      <div className="mt-6 text-center">
      <ShieldAlert className="mx-auto mb-2 text-yellow-500" size={32} />
        <h1 className="text-2xl font-bold">Stay ahead in your online exams with this seamless, undetectable extension!</h1>
      </div>

      {paymentSuccess && (
        <div className="mt-4 text-green-400 flex items-center space-x-1">
          <CheckCircle />
          <span>Payment Successful! You can now download the extension.</span>
        </div>
      )}

      {/* Button */}
      <div className="mt-6">
        {loading ? (
          <div className="flex items-center space-x-2 text-gray-400">
            <Loader2 className="animate-spin" />
            <span>Detecting browser...</span>
          </div>
        ) : browser === "unsupported" ? (
          <div className="text-red-500 flex items-center space-x-2">
            <AlertTriangle />
            <span>Unsupported browser. Unable to download extension.</span>
          </div>
        ) : paymentCompleted ? (
          <button
            onClick={handleDownload}
            className="px-6 py-3 bg-blue-500 rounded-lg flex items-center space-x-2 hover:bg-blue-600"
          >
            <Download />
            <span>Click here to use the extension</span>
          </button>
        ) : (
          <button
            onClick={handlePayment}
            className="px-6 py-3 bg-green-500 rounded-lg flex items-center space-x-2 hover:bg-green-600"
          >
            <span>Proceed to Payment</span>
          </button>
        )}
      </div>

      {/* Payment Success Message */}


      {/* Installation Instructions Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <div className="bg-gray-800 p-6 rounded-lg w-96 text-center relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-white" onClick={() => setShowModal(false)}>
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-white">Installation Instructions</h2>
            <p className="text-gray-300 mt-2">
              1. Click the download button below.
              <br /> 2. If prompted, allow the browser to download the extension.
              <br /> 3. Follow on-screen instructions to complete installation.
            </p>
            <button
              onClick={confirmDownload}
              className="mt-4 px-6 py-2 bg-green-500 rounded hover:bg-green-600"
            >
              Download Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtensionDownloadPage;