'use client';

import { NextPage } from "next";
import { Layout } from "@/components/layout";

const PrivacyPolicy: NextPage = () => {
  return (
    <Layout>
      <section className="flex justify-center items-start min-h-screen bg-gradient-to-br from-background to-default-100 px-4 md:px-8">
        <div className="w-full max-w-4xl">
          {/* Card replacement */}
          <div className="bg-white shadow rounded overflow-hidden">
            {/* Card Header replacement */}
            <div className="p-4 border-b">
              <h1 className="text-3xl font-bold text-center">Privacy Policy</h1>
              <p className="text-default-500 text-center">
                Welcome to Pharma-AI! Your privacy is critically important to us.
              </p>
            </div>
            {/* Card Body replacement */}
            <div className="p-4">
              {/* Scrollable container */}
              <div className="h-[600px] overflow-y-scroll pr-2">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-2">1. Information We Collect</h2>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <span className="font-semibold">Personal Information:</span>
                        <span>Name, email address, phone number, and financial details.</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-semibold">Non-Personal Information:</span>
                        <span>Browser type, operating system, and website usage data.</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold mb-2">2. How We Use Your Information</h2>
                    <ul className="list-disc list-inside space-y-1">
                      <li>To provide and improve our tax filing services</li>
                      <li>To comply with legal obligations</li>
                      <li>To communicate updates and promotional offers (if you opt-in)</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold mb-2">3. Data Security</h2>
                    <p>
                      We implement strict security measures to protect your information,
                      including encryption, firewalls, and secure access protocols.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold mb-2">4. Sharing Your Information</h2>
                    <p>
                      Your information is never sold. It may be shared with trusted
                      third-party services for processing or compliance purposes.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold mb-2">5. Your Rights</h2>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <span className="font-semibold">Access:</span>
                        <span>Request a copy of your data</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-semibold">Deletion:</span>
                        <span>Request the deletion of your personal information</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-semibold">Update:</span>
                        <span>Correct or update your information</span>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <hr className="my-4" />

                  <div className="text-center space-y-4">
                    <p>
                      If you have any questions about this Privacy Policy, please contact us at:
                    </p>
                    <div className="flex gap-4 justify-center">
                      <a
                        href="mailto:support@finseva.com"
                        className="text-primary underline hover:text-primary-dark transition-colors"
                      >
                        support@finseva.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End of Card replacement */}
        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPolicy;