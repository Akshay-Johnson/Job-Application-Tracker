"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";

export default function ImageTabs() {
    const [activeTab, setActiveTab] = useState("Organize");
    return (
      <>
        <section className="border-t bg-white py-16">
          <div className="container mx-auto px-4 ">
            <div className="mx-auto max-w-6xl ">
              {/* Tabs */}
              <div className="flex gap-2 justify-center mb-8">
                <Button
                  onClick={() => setActiveTab("Organize")}
                  className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${activeTab === "Organize" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  Organize Applications
                </Button>
                <Button
                  onClick={() => setActiveTab("Get Hired")}
                  className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${activeTab === "Get Hired" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  Get Hired
                </Button>
                <Button
                  onClick={() => setActiveTab("Manage Boards")}
                  className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${activeTab === "Manage Boards" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  Manage Boards
                </Button>
              </div>
              {/* Image */}
              <div className="relative mx-auto max-w-5xl overflow-hidden rounded-lg border border-gray-200 shadow-xl">
                {activeTab === "Organize" && (
                  <Image
                    src="/hero-images/hero1.png"
                    alt="Organize Applications"
                    width={1200}
                    height={800}
                  />
                )}
                {activeTab === "Get Hired" && (
                  <Image
                    src="/hero-images/hero2.png"
                    alt="Get Hired"
                    width={1200}
                    height={800}
                  />
                )}
                {activeTab === "Manage Boards" && (
                  <Image
                    src="/hero-images/hero3.png"
                    alt="Manage Boards"
                    width={1200}
                    height={800}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      </>
    );
}