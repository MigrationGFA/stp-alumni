// app/faq/page.tsx (Interactive version)
"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, ChevronDown, ChevronRight } from "lucide-react"
import NavFooterWrapper from "@/components/Nav-Footer"

export default function FAQ() {
  const [expandedIndex, setExpandedIndex] = useState(0)

  const faqItems = [
    {
      question: "How does it work?",
      answer: "Dormire uses Internet to provide you with additional phone numbers on top of your existing devices. Download OpenPhone on your mobile or use it on the web to make and receive calls and messages."
    },
    {
      question: "What devices do you support?",
      subItems: [
        "Does dormire use my phone plan's minutes?"
      ]
    },
    {
      question: "How good is the call quality?",
      subItems: [
        "What countries can I call and text?"
      ]
    },
    {
      question: "Can I use Dormire with my team?",
      subItems: [
        "Can I distinguish between business and personal calls?"
      ]
    },
    {
      question: "What if I want to cancel my subscription?",
      subItems: [
        "What number will my customers see when I call?"
      ]
    },
    {
      question: "Can I use my dormire number to receive two factor authentication (2FA) codes?",
      subItems: []
    }
  ]

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <NavFooterWrapper>
        
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">
            Frequently asked questions
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Can&apos;t find the answer here? Check out our Support.
          </p>
          <Button variant="outline" className="gap-2">
            Visit Support
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        {/* Divider */}
        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <Card 
              key={index} 
              className="border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => toggleExpand(index)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {item.question}
                    </h3>
                    
                    {/* Main Answer (expanded) */}
                    {item.answer && expandedIndex === index && (
                      <p className="text-gray-600 leading-relaxed mt-4 animate-in fade-in">
                        {item.answer}
                      </p>
                    )}
                    
                    {/* Sub-items with checkboxes (expanded) */}
                    {item.subItems && item.subItems.length > 0 && expandedIndex === index && (
                      <ul className="space-y-3 mt-4 animate-in fade-in">
                        {item.subItems.map((subItem, subIndex) => (
                          <li key={subIndex} className="flex items-center gap-3">
                            <div className="flex h-5 w-5 items-center justify-center">
                              <div className="h-4 w-4 border-2 border-gray-300 rounded" />
                            </div>
                            <span className="text-gray-700">{subItem}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    {/* Empty checkbox for last item (expanded) */}
                    {item.subItems && item.subItems.length === 0 && expandedIndex === index && (
                      <div className="flex items-center gap-3 mt-4 animate-in fade-in">
                        <div className="flex h-5 w-5 items-center justify-center">
                          <div className="h-4 w-4 border-2 border-gray-300 rounded" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Expand/Collapse Icon */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleExpand(index)
                    }}
                  >
                    {expandedIndex === index ? (
                      <ChevronDown className="h-5 w-5 text-gray-500 transition-transform" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500 transition-transform" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
    </NavFooterWrapper>

  )
}