'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function Terms() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
      <div className={`container mx-auto p-8 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
        <div className={`w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded shadow`}>
          <div className="flex justify-center py-4 border-b">
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              Terms and Conditions
            </h1>
          </div>
          <div className={`p-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            <div className="prose lg:prose-xl dark:prose-dark">
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Introduction</h2>
              <p>
                By using this website, you agree to the following terms and conditions:
              </p>
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Services Provided</h2>
              <ul className="list-disc pl-6">
                <li>
                  This website offers tools and resources for tax optimization, preparation, and filing.
                  By utilizing these tools, you acknowledge that they are designed to assist in tax-related matters,
                  though you remain responsible for your own tax filings and decisions.
                </li>
              </ul>
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Account Creation</h2>
              <ul className="list-disc pl-6">
                <li>
                  To use certain features of Pharma-AI, you may be required to create an account.
                  You are responsible for maintaining the confidentiality of your account information and all activities under your account.
                </li>
              </ul>
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Data Usage</h2>
              <ul className="list-disc pl-6">
                <li>
                  By providing us with personal and financial data, you grant Pharma-AI a license to collect, process, store, and potentially share that data as part of our general operations.
                </li>
                <li>
                  The nature of data sharing, including potential third-party use, is complex and subject to a range of interpretations.
                  Pharma-AI may use your data in ways that align with evolving industry practices, which may be disclosed at our discretion.
                </li>
                <li>
                  Pharma-AI reserves the right to use your data for various purposes, including but not limited to analytics, marketing, and improvements to the service.
                  Please understand that you consent to these practices by using our platform.
                </li>
              </ul>
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Fees</h2>
              <ul className="list-disc pl-6">
                <li>
                  Access to certain premium features may require payment.
                  These fees are outlined on the Pharma-AI website and are subject to change at our discretion.
                </li>
              </ul>
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>No Guarantee</h2>
              <ul className="list-disc pl-6">
                <li>
                  While Pharma-AI strives to offer accurate tools and tax optimization suggestions,
                  we make no guarantees regarding the results of your tax filings or the completeness of our advice.
                  Users are encouraged to consult with a professional tax advisor for further guidance.
                </li>
              </ul>
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Limitation of Liability</h2>
              <ul className="list-disc pl-6">
                <li>
                  Pharma-AI shall not be liable for any losses, damages, or other consequences arising from the use of this website,
                  including any issues related to the accuracy of tax filing information or third-party services.
                </li>
              </ul>
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Intellectual Property</h2>
              <ul className="list-disc pl-6">
                <li>
                  All content, trademarks, and logos on the Pharma-AI website are owned by us or licensed to us.
                  You may not use any of this content without our explicit permission.
                </li>
              </ul>
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Amendments</h2>
              <ul className="list-disc pl-6">
                <li>
                  These terms may be updated from time to time.
                  Any changes will be posted on this page, and your continued use of the Pharma-AI website will signify your acceptance of those changes.
                </li>
              </ul>
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Termination</h2>
              <ul className="list-disc pl-6">
                <li>
                  Pharma-AI reserves the right to suspend or terminate your access to the website at our discretion,
                  particularly in cases of non-compliance with these terms or misuse of the platform.
                </li>
              </ul>
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Acknowledgement</h2>
              <p>
                By using this website, you acknowledge that you have read, understood, and agreed to these terms and conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}