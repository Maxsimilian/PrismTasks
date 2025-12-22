'use client';

import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <Link
                    href="/"
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Terms of Service</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-12">Last updated: 22 December 2025</p>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Agreement to Terms</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            By accessing or using PrismTasks, you agree to be bound by these Terms of Service and our Privacy Policy.
                            If you do not agree with any part of these terms, you may not use our service.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Description of Service</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            PrismTasks is a task management application that helps you organise, prioritise, and track your to-dos.
                            The service is provided free of charge and is open source.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">User Accounts</h2>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Account Creation</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            To use PrismTasks, you must create an account. You agree to:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                            <li>Provide accurate and complete information</li>
                            <li>Maintain the security of your password</li>
                            <li>Notify us immediately of any unauthorised access</li>
                            <li>Be responsible for all activity under your account</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Account Termination</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            You may delete your account at any time. We reserve the right to suspend or terminate accounts that
                            violate these terms or engage in abusive behaviour.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Acceptable Use</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            You agree not to:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                            <li>Use the service for any illegal purpose</li>
                            <li>Attempt to gain unauthorised access to our systems</li>
                            <li>Interfere with or disrupt the service</li>
                            <li>Upload malicious code or harmful content</li>
                            <li>Scrape or harvest user data without permission</li>
                            <li>Impersonate others or misrepresent your affiliation</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Content</h2>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Ownership</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            You retain all ownership rights to the tasks, notes, and content you create in PrismTasks.
                            We do not claim any ownership over your content.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Licence</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            By using PrismTasks, you grant us a limited licence to store, process, and display your content
                            solely for the purpose of providing the service to you.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Responsibility</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            You are solely responsible for the content you create. We do not monitor or review user content,
                            but we may remove content that violates these terms.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Intellectual Property</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            PrismTasks is open source software. The source code is available under the MIT Licence.
                            The PrismTasks name, logo, and branding are our property and may not be used without permission.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Service Availability</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            We strive to provide reliable service, but we do not guarantee that:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                            <li>The service will be available at all times</li>
                            <li>The service will be error-free or secure</li>
                            <li>Any defects will be corrected</li>
                            <li>The service will meet your specific requirements</li>
                        </ul>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            We may modify, suspend, or discontinue the service at any time without notice.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Disclaimers</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            PrismTasks is provided &quot;as is&quot; without warranties of any kind, either express or implied.
                            We disclaim all warranties, including but not limited to merchantability, fitness for a particular purpose,
                            and non-infringement.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Limitation of Liability</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            To the maximum extent permitted by law, PrismTasks shall not be liable for any indirect, incidental,
                            special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly
                            or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                            <li>Your use or inability to use the service</li>
                            <li>Unauthorised access to or alteration of your content</li>
                            <li>Any conduct or content of third parties on the service</li>
                            <li>Service interruptions or errors</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Indemnification</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            You agree to indemnify and hold harmless PrismTasks and its affiliates from any claims, damages, losses,
                            liabilities, and expenses arising from your use of the service or violation of these terms.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Governing Law</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            These Terms shall be governed by and construed in accordance with the laws of England and Wales,
                            without regard to its conflict of law provisions. Any disputes arising from these terms shall be
                            subject to the exclusive jurisdiction of the courts of England and Wales.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Changes to Terms</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            We reserve the right to modify these terms at any time. We will notify users of any material changes
                            by email or through the application. Your continued use of PrismTasks after changes constitutes
                            acceptance of the updated terms.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Severability</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            If any provision of these terms is found to be unenforceable or invalid, that provision shall be
                            limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            If you have any questions about these Terms of Service, please contact us at:
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            <strong>Email:</strong> arwock@protonmail.com
                        </p>
                    </section>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-16 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0 font-medium">© 2025 PrismTasks. Built for details.</p>
                    <div className="flex space-x-8">
                        <Link href="/privacy" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors font-medium">Privacy</Link>
                        <Link href="/terms" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors font-medium">Terms</Link>
                        <Link href="https://github.com/Maxsimilian" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors font-medium">Github</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
