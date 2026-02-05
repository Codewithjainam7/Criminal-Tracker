"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    HelpCircle,
    Search,
    Book,
    MessageCircle,
    Mail,
    Phone,
    ChevronDown,
    ChevronRight,
    ExternalLink,
    FileText,
    Shield,
    Briefcase,
    UserSearch,
    FileBox,
    BarChart3,
    Settings,
    Users,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FAQItem {
    id: string;
    question: string;
    answer: string;
    category: string;
}

const faqItems: FAQItem[] = [
    {
        id: "faq-1",
        question: "How do I create a new case?",
        answer: "Navigate to Cases > Click 'New Case' button > Fill in the required fields (title, description, category) > Assign team members > Click 'Create Case'. The case will be created with a unique case number.",
        category: "Cases",
    },
    {
        id: "faq-2",
        question: "How do I add a suspect to a case?",
        answer: "Open the case detail page > Go to the 'Suspects' tab > Click 'Link Suspect' > Search for existing suspects or create new > Confirm the link. The suspect will appear in the case's suspect list.",
        category: "Suspects",
    },
    {
        id: "faq-3",
        question: "How does evidence chain of custody work?",
        answer: "Every evidence item has a complete chain of custody history. When evidence is transferred, collected, or analyzed, a new entry is automatically logged with timestamp, handler, and location. This ensures complete traceability for court proceedings.",
        category: "Evidence",
    },
    {
        id: "faq-4",
        question: "What do the risk levels mean for suspects?",
        answer: "Risk levels indicate potential danger: LOW = Generally compliant, no violent history. MEDIUM = Some prior incidents. HIGH = Violent history, approach with caution. EXTREME = Armed/dangerous, specialized response required.",
        category: "Suspects",
    },
    {
        id: "faq-5",
        question: "How do I use the AI Suspect Matching feature?",
        answer: "Go to AI Matching > Select M.O. patterns from the dropdown > Optionally filter by location > Click 'Run AI Analysis'. The system will score suspects based on pattern matches, criminal history, location proximity, and risk profile.",
        category: "AI Features",
    },
    {
        id: "faq-6",
        question: "How do I generate reports?",
        answer: "Navigate to Reports > Select a template (Case Summary, Suspect Profile, Chain of Custody, etc.) > Choose the case/suspect > Select date range and options > Click 'Generate Report'. Download as PDF, DOCX, or XLSX.",
        category: "Reports",
    },
    {
        id: "faq-7",
        question: "What is witness protection status?",
        answer: "Witnesses marked as 'Protected' have their identity shielded. Their personal information is hidden from most users and replaced with 'PROTECTED IDENTITY'. Only administrators can view full details.",
        category: "Witnesses",
    },
    {
        id: "faq-8",
        question: "How do I enable two-factor authentication?",
        answer: "Go to Settings > Security tab > Enable 'Two-Factor Authentication' > Scan QR code with your authenticator app > Enter the verification code > 2FA is now active for your account.",
        category: "Security",
    },
];

const quickLinks = [
    { title: "Case Management Guide", icon: Briefcase, href: "#" },
    { title: "Evidence Handling Procedures", icon: FileBox, href: "#" },
    { title: "Suspect Database Manual", icon: UserSearch, href: "#" },
    { title: "Analytics Dashboard Guide", icon: BarChart3, href: "#" },
    { title: "Security Best Practices", icon: Shield, href: "#" },
    { title: "System Settings Help", icon: Settings, href: "#" },
];

function FAQAccordion({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
    return (
        <div className="border-b border-bureau-700 last:border-0">
            <button
                className="w-full flex items-center justify-between py-4 text-left hover:bg-bureau-800/50 transition-colors px-4 -mx-4"
                onClick={onToggle}
            >
                <span className="font-medium text-bureau-100">{item.question}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="h-5 w-5 text-bureau-500" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="pb-4 text-bureau-400 text-sm leading-relaxed">
                            {item.answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [openFAQs, setOpenFAQs] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const categories = ["all", ...Array.from(new Set(faqItems.map((f) => f.category)))];

    const filteredFAQs = faqItems.filter((faq) => {
        const matchesSearch = searchQuery === "" ||
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const toggleFAQ = (id: string) => {
        setOpenFAQs((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-primary/20 mb-4">
                        <HelpCircle className="h-8 w-8 text-accent-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-bureau-100">
                        How can we help you?
                    </h1>
                    <p className="text-bureau-400 mt-2 max-w-xl mx-auto">
                        Find answers to common questions or get in touch with our support team
                    </p>

                    {/* Search */}
                    <div className="max-w-lg mx-auto mt-6 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-bureau-500" />
                        <Input
                            placeholder="Search for help..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 py-3 text-lg"
                        />
                    </div>
                </div>

                {/* Quick Links */}
                <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
                    {quickLinks.map((link) => (
                        <Card key={link.title} hover className="p-4 text-center cursor-pointer">
                            <link.icon className="h-6 w-6 text-accent-primary mx-auto mb-2" />
                            <p className="text-sm text-bureau-200 font-medium">{link.title}</p>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* FAQ Section */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Book className="h-5 w-5" />
                                        Frequently Asked Questions
                                    </CardTitle>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={cn(
                                                "px-3 py-1 rounded-full text-sm transition-colors",
                                                selectedCategory === cat
                                                    ? "bg-accent-primary text-white"
                                                    : "bg-bureau-800 text-bureau-400 hover:bg-bureau-700"
                                            )}
                                        >
                                            {cat === "all" ? "All" : cat}
                                        </button>
                                    ))}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {filteredFAQs.length > 0 ? (
                                    <div className="divide-bureau-700">
                                        {filteredFAQs.map((faq) => (
                                            <FAQAccordion
                                                key={faq.id}
                                                item={faq}
                                                isOpen={openFAQs.includes(faq.id)}
                                                onToggle={() => toggleFAQ(faq.id)}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <HelpCircle className="h-10 w-10 text-bureau-600 mx-auto mb-3" />
                                        <p className="text-bureau-400">No matching questions found</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Support */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageCircle className="h-5 w-5" />
                                    Contact Support
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-bureau-400">
                                    Can't find what you're looking for? Our support team is here to help.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="p-2 bg-bureau-800 rounded-lg">
                                            <Mail className="h-4 w-4 text-accent-primary" />
                                        </div>
                                        <div>
                                            <p className="text-bureau-500">Email</p>
                                            <p className="text-bureau-200">support@cit.gov</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="p-2 bg-bureau-800 rounded-lg">
                                            <Phone className="h-4 w-4 text-accent-primary" />
                                        </div>
                                        <div>
                                            <p className="text-bureau-500">Phone</p>
                                            <p className="text-bureau-200">1-800-CIT-HELP</p>
                                        </div>
                                    </div>
                                </div>
                                <Button className="w-full" leftIcon={<MessageCircle className="h-4 w-4" />}>
                                    Open Support Ticket
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Documentation
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <a href="#" className="flex items-center justify-between p-2 hover:bg-bureau-800 rounded-lg transition-colors">
                                    <span className="text-sm text-bureau-300">User Manual</span>
                                    <ExternalLink className="h-4 w-4 text-bureau-500" />
                                </a>
                                <a href="#" className="flex items-center justify-between p-2 hover:bg-bureau-800 rounded-lg transition-colors">
                                    <span className="text-sm text-bureau-300">API Documentation</span>
                                    <ExternalLink className="h-4 w-4 text-bureau-500" />
                                </a>
                                <a href="#" className="flex items-center justify-between p-2 hover:bg-bureau-800 rounded-lg transition-colors">
                                    <span className="text-sm text-bureau-300">Training Videos</span>
                                    <ExternalLink className="h-4 w-4 text-bureau-500" />
                                </a>
                                <a href="#" className="flex items-center justify-between p-2 hover:bg-bureau-800 rounded-lg transition-colors">
                                    <span className="text-sm text-bureau-300">Release Notes</span>
                                    <ExternalLink className="h-4 w-4 text-bureau-500" />
                                </a>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-accent-primary/20 to-accent-secondary/10 border-accent-primary/20">
                            <CardContent className="py-6 text-center">
                                <Users className="h-8 w-8 text-accent-primary mx-auto mb-3" />
                                <h3 className="font-semibold text-bureau-100">Need Training?</h3>
                                <p className="text-sm text-bureau-400 mt-1">
                                    Schedule a live training session with our team
                                </p>
                                <Button variant="outline" size="sm" className="mt-4">
                                    Request Training
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
