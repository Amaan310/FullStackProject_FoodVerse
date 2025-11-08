import React from "react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 sm:pt-28 pb-16 px-6 sm:px-12 lg:px-20">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 sm:p-12">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 text-center">
          Terms of Service
        </h1>
        <p className="text-gray-600 text-center text-sm sm:text-base mb-10">
          <strong></strong>
        </p>

        {/* Content */}
        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using <strong>FoodVerse</strong>, you agree to be
              bound by these Terms of Service and our Privacy Policy. If you do
              not agree, you must stop using our website immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              2. User Responsibilities
            </h2>
            <p>
              You agree to use FoodVerse responsibly. You must not post spam,
              offensive content, or misleading recipes. We reserve the right to
              remove content that violates these rules.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              3. Intellectual Property
            </h2>
            <p>
              All recipes, logos, and visuals on FoodVerse are owned by their
              respective creators. You may not copy, modify, or redistribute
              content without permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              4. Account and Security
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials. FoodVerse is not liable for any unauthorized
              access caused by your failure to secure your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              5. Limitation of Liability
            </h2>
            <p>
              FoodVerse provides recipe content “as is.” We make no guarantees
              regarding accuracy, nutritional value, or health effects of any
              recipe shared on the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              6. Changes to Terms
            </h2>
            <p>
              We may update these Terms occasionally. Continued use of
              FoodVerse after any changes indicates your acceptance of the new
              terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              7. Contact Us
            </h2>
            <p>
              If you have questions about these Terms, please contact us at{" "}
              <a
                href="mailto:foodverse.support@gmail.com"
                className="text-red-600 font-medium hover:underline"
              >
                foodverse.support@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
