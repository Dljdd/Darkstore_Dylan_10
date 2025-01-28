import React, { useState, useEffect } from "react";
import { ref, get, set } from "firebase/database";
import { database } from "@/firebase";
import { Calculator } from "lucide-react";

const PLATFORM_EARNINGS = {
  Swiggy: {
    baseRate: 200,
    peakBonus: 50,
    nightBonus: 30,
  },
  Blinkit: {
    baseRate: 180,
    peakBonus: 40,
    nightBonus: 35,
  },
  Zepto: {
    baseRate: 220,
    peakBonus: 45,
    nightBonus: 40,
  },
  BigBasket: {
    baseRate: 190,
    peakBonus: 35,
    nightBonus: 25,
  },
};

const MyApplicationsComponent = () => {
  const [applications, setApplications] = useState([
    {
      name: "Swiggy",
      status: "Apply",
      earnings: {
        base: PLATFORM_EARNINGS.Swiggy.baseRate,
        peak: PLATFORM_EARNINGS.Swiggy.baseRate + PLATFORM_EARNINGS.Swiggy.peakBonus,
        night: PLATFORM_EARNINGS.Swiggy.baseRate + PLATFORM_EARNINGS.Swiggy.nightBonus,
      },
    },
    {
      name: "Blinkit",
      status: "Apply",
      earnings: {
        base: PLATFORM_EARNINGS.Blinkit.baseRate,
        peak: PLATFORM_EARNINGS.Blinkit.baseRate + PLATFORM_EARNINGS.Blinkit.peakBonus,
        night: PLATFORM_EARNINGS.Blinkit.baseRate + PLATFORM_EARNINGS.Blinkit.nightBonus,
      },
    },
    {
      name: "Zepto",
      status: "Apply",
      earnings: {
        base: PLATFORM_EARNINGS.Zepto.baseRate,
        peak: PLATFORM_EARNINGS.Zepto.baseRate + PLATFORM_EARNINGS.Zepto.peakBonus,
        night: PLATFORM_EARNINGS.Zepto.baseRate + PLATFORM_EARNINGS.Zepto.nightBonus,
      },
    },
    {
      name: "BigBasket",
      status: "Apply",
      earnings: {
        base: PLATFORM_EARNINGS.BigBasket.baseRate,
        peak: PLATFORM_EARNINGS.BigBasket.baseRate + PLATFORM_EARNINGS.BigBasket.peakBonus,
        night: PLATFORM_EARNINGS.BigBasket.baseRate + PLATFORM_EARNINGS.BigBasket.nightBonus,
      },
    },
  ]);
  
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || "";
    setUserEmail(email);

    if (email) {
      fetchApplicationStatus(email);
    }
  }, []);

  const fetchApplicationStatus = async (email: string) => {
    const userRef = ref(database, `users/${email.replace(".", ",")}/applications`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userApplications = snapshot.val();
      setApplications(applications.map((app) => ({
        ...app,
        status: userApplications[app.name] || "Apply",
      })));
    }
  };

  const handleApply = async (platformName: string) => {
    const emailRef = ref(database, `users/${userEmail.replace(".", ",")}/applications/${platformName}`);
    
    await set(emailRef, "In Review");
    
    setApplications((prevApps) =>
      prevApps.map((app) =>
        app.name === platformName ? { ...app, status: "In Review" } : app
      )
    );
  };

  return (
    <div className="text-white">
      <h2 className="text-2xl font-semibold mb-6">My Applications</h2>
      <div className="mt-4 grid grid-cols-1 gap-4">
        {applications.map((app, index) => (
          <div key={index} className="bg-black/95 border border-neutral-800 rounded-lg shadow-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
              <div className="flex flex-col">
                <span className="text-lg font-medium text-white">{app.name}</span>
                <div className="flex flex-col text-sm text-neutral-400 mt-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    <span>Base: ₹{app.earnings.base}/hr</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-yellow-500" />
                    <span>Peak: ₹{app.earnings.peak}/hr</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-blue-500" />
                    <span>Night: ₹{app.earnings.night}/hr</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {app.status !== "Apply" && (
                  <span className={`text-sm px-4 py-2 rounded-full font-medium ${
                    app.status === "In Review"
                      ? "bg-yellow-900/20 text-yellow-400 border border-yellow-400/20"
                      : app.status === "Approved"
                      ? "bg-green-900/20 text-green-400 border border-green-400/20"
                      : app.status === "Rejected"
                      ? "bg-red-900/20 text-red-400 border border-red-400/20"
                      : ""
                  }`}>
                    {app.status}
                  </span>
                )}
                
                {app.status === "Apply" && (
                  <button
                    onClick={() => handleApply(app.name)}
                    className="bg-neutral-800 text-white px-6 py-2 rounded-lg hover:bg-neutral-700 transition-colors duration-200"
                  >
                    Apply
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-6 bg-black/95 border border-neutral-800 rounded-lg">
        <h3 className="text-lg font-medium mb-4 text-white">Earnings Information</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-neutral-400">
          <li>Base rates apply during standard hours (10 AM - 5 PM)</li>
          <li>Peak rates apply during rush hours (6 PM - 10 PM)</li>
          <li>Night rates apply for late hours (10 PM - 7 AM)</li>
          <li>Additional incentives may apply based on performance</li>
        </ul>
      </div>
    </div>
  );
};

export default MyApplicationsComponent;
