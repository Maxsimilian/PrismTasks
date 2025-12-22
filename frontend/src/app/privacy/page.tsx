'use client';

import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-12">Last updated: 22 December 2025</p>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Introduction</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            Welcome to PrismTasks. We respect your privacy and are committed to protecting your personal data.
                            This privacy policy explains how we collect, use, and safeguard your information when you use our task management application.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Information We Collect</h2>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Account Information</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            When you create an account, we collect:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                            <li>Email address</li>
                            <li>Username</li>
                            <li>Password (encrypted using Argon2)</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Usage Data</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            We collect information about how you use PrismTasks, including:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                            <li>Tasks you create, edit, and complete</li>
                            <li>Categories and priorities you assign</li>
                            <li>Device and browser information</li>
                            <li>IP address and general location data</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How We Use Your Information</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            We use your personal data to:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                            <li>Provide and maintain our service</li>
                            <li>Authenticate your account securely</li>
                            <li>Store and sync your tasks across devices</li>
                            <li>Improve and optimise the application</li>
                            <li>Communicate important updates or changes</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Data Security</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            We implement industry-standard security measures to protect your data:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                            <li>Passwords are hashed using Argon2 encryption</li>
                            <li>Authentication uses HttpOnly cookies to prevent XSS attacks</li>
                            <li>All data transmission is encrypted using HTTPS</li>
                            <li>Regular security audits and updates</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Data Retention</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            We retain your personal data for as long as your account is active. If you delete your account,
                            we will permanently remove your data within 30 days, except where we are required to retain it by law.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Rights</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            Under UK GDPR, you have the right to:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                            <li>Access your personal data</li>
                            <li>Correct inaccurate data</li>
                            <li>Request deletion of your data</li>
                            <li>Object to processing of your data</li>
                            <li>Export your data in a portable format</li>
                            <li>Withdraw consent at any time</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Cookies</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            We use essential cookies to authenticate and maintain your session. These cookies are necessary
                            for the service to function and cannot be disabled. We do not use tracking or advertising cookies.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Third-Party Services</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            PrismTasks is a self-hosted application. We do not share your data with third-party services,
                            advertisers, or data brokers. Your task data remains private and under your control.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Children&apos;s Privacy</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            Our service is not directed to children under 13. We do not knowingly collect personal data from children.
                            If you believe we have collected data from a child, please contact us immediately.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Changes to This Policy</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            We may update this privacy policy from time to time. We will notify you of any significant changes
                            by email or through a notice on our application. Continued use of PrismTasks after changes constitutes
                            acceptance of the updated policy.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            If you have any questions about this privacy policy or wish to exercise your rights, please contact us at:
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
