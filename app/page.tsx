"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import jsPDF from "jspdf";

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);

  const [repairName, setRepairName] = useState("");
  const [deviceType, setDeviceType] = useState("iPhone");
  const [repairType, setRepairType] = useState("Screen Repair");
  const [notes, setNotes] = useState("");

  const [partCost, setPartCost] = useState("");
  const [laborCharge, setLaborCharge] = useState("");
  const [shippingCost, setShippingCost] = useState("");
  const [customerPaid, setCustomerPaid] = useState("");

  const [profit, setProfit] = useState(0);
  const [margin, setMargin] = useState("0");
  const [totalExpenses, setTotalExpenses] = useState(0);

  const [repairHistory, setRepairHistory] =
    useState<any[]>([]);

  const [toast, setToast] = useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  useEffect(() => {
    const savedHistory =
      localStorage.getItem("repairHistory");

    if (savedHistory) {
      setRepairHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    autoCalculate();
  }, [
    partCost,
    laborCharge,
    shippingCost,
    customerPaid,
  ]);

  const showToast = (message: string) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2500);
  };

  const autoCalculate = () => {
    const expenses =
      Number(partCost) +
      Number(shippingCost);

    const calculatedProfit =
      Number(customerPaid) - expenses;

    const calculatedMargin =
      Number(customerPaid) > 0
        ? (
            (calculatedProfit /
              Number(customerPaid)) *
            100
          ).toFixed(1)
        : "0";

    setTotalExpenses(expenses);
    setProfit(calculatedProfit);
    setMargin(calculatedMargin);
  };

  const saveRepairJob = () => {
  if (!repairName || !customerPaid) {
    showToast(
      "Repair name and customer paid required"
    );

    return;
  }

  const newRepair = {
    repairName,
    deviceType,
    repairType,
    notes,

    partCost,
    laborCharge,
    shippingCost,

    customerPaid,

    totalExpenses,
    profit,
    margin,

    date: new Date().toLocaleString(),
  };

  const updatedHistory = [
    newRepair,
    ...repairHistory,
  ];

  setRepairHistory(updatedHistory);

  localStorage.setItem(
    "repairHistory",
    JSON.stringify(updatedHistory)
  );

  showToast("Repair saved");
};

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);

    doc.text(
      "RepairCalc Pro Report",
      20,
      20
    );

    doc.setFontSize(12);

    doc.text(
      `Repair: ${repairName}`,
      20,
      40
    );

    doc.text(
      `Device: ${deviceType} • ${repairType}`,
      20,
      50
    );

    doc.text(
      `Customer Paid: $${Number(
        customerPaid
      ).toFixed(2)}`,
      20,
      60
    );

    doc.text(
      `Expenses: $${totalExpenses.toFixed(
        2
      )}`,
      20,
      70
    );

    doc.text(
      `Net Profit: $${profit.toFixed(2)}`,
      20,
      80
    );

    doc.text(
      `Profit Margin: ${margin}%`,
      20,
      90
    );

    doc.text(
      `Notes: ${notes}`,
      20,
      110
    );

    doc.save("repair-report.pdf");

    showToast("PDF exported");
  };

  const filteredHistory =
    repairHistory.filter((repair) => {
      const matchesSearch =
        repair.repairName
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      if (filter === "profitable") {
        return (
          matchesSearch &&
          repair.profit > 0
        );
      }

      if (filter === "loss") {
        return (
          matchesSearch &&
          repair.profit <= 0
        );
      }

      return matchesSearch;
    });

  const totalRepairs =
    repairHistory.length;

  const totalProfit =
    repairHistory.reduce(
      (acc, repair) =>
        acc + Number(repair.profit),
      0
    );

  const averageMargin =
    repairHistory.length > 0
      ? (
          repairHistory.reduce(
            (acc, repair) =>
              acc +
              Number(repair.margin),
            0
          ) / repairHistory.length
        ).toFixed(1)
      : "0";

  return (
    <main
      className={`min-h-screen p-4 ${
        darkMode
          ? "bg-black text-white"
          : "bg-gray-100 text-black"
      }`}
    >
      <div className="max-w-md mx-auto">

        {toast && (
          <div className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-3 rounded-xl shadow-xl z-50">
            {toast}
          </div>
        )}

        <div className="bg-[#081225] border border-gray-700 p-8 rounded-3xl shadow-2xl">

          <div className="flex justify-between items-center mb-6">

            <div>
              <div className="flex items-center gap-4 mb-6">
  <Image
    src="/logo2.png"
    alt="RepairCalc Pro Logo"
    width={200}
    height={200}
    className="rounded-2xl"
  />

  <div>
    <h1 className="text-5xl font-bold text-white">
      RepairCalc Pro
    </h1>

    <p className="text-gray-300 mt-1">
      Know your real profit on every repair.
    </p>
  </div>
</div>
<button
              onClick={() =>
                setDarkMode(!darkMode)
              }
              className="bg-gray-800 border border-gray-600 px-3 py-2 rounded-xl ml-[190px] mb-4"
            >
              {darkMode ? "☀️" : "🌙"}
            </button> 
              <button 
  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl mt-6 transition"
>
  Calculate Repair Profit
</button>
            </div>

            

          </div>

          <div className="space-y-4">

            <input
              type="text"
              placeholder="Repair Name"
              value={repairName}
              onChange={(e) =>
                setRepairName(
                  e.target.value
                )
              }
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-400 p-4 rounded-2xl"
            />

            <select
              value={deviceType}
              onChange={(e) =>
                setDeviceType(
                  e.target.value
                )
              }
              className="w-full bg-gray-800 border border-gray-700 text-white p-4 rounded-2xl"
            > 
              <option>iPhone</option>
              <option>Samsung</option>
              <option>Computer</option>
              <option>Console</option>
              <option>Appliance</option>
            </select><select
  className="w-full bg-gray-800 border border-gray-700 text-white p-4 rounded-2xl mt-4"
>
  <option>Screen Repair</option>
  <option>Battery Replacement</option>
  <option>Charging Port Repair</option>
  <option>Back Glass Repair</option>
  <option>Water Damage</option>
  <option>HDMI Repair</option>
  <option>Console Repair</option>
</select>

            <textarea
              placeholder="Repair notes..."
              value={notes}
              onChange={(e) =>
                setNotes(
                  e.target.value
                )
              }
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-400 p-4 rounded-2xl"
            />

            {[
              {
                label: "Part Cost",
                value: partCost,
                setter: setPartCost,
              },
              {
                label:
                  "Optional Labor Charge",
                value: laborCharge,
                setter:
                  setLaborCharge,
              },
              {
                label: "Shipping Cost",
                value: shippingCost,
                setter:
                  setShippingCost,
              },
              {
                label: "Customer Paid",
                value: customerPaid,
                setter:
                  setCustomerPaid,
              },
            ].map((field, index) => (
              <input
                key={index}
                type="number"
                placeholder={
                  field.label
                }
                value={field.value}
                onChange={(e) =>
                  field.setter(
                    e.target.value
                  )
                }
                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-400 p-4 rounded-2xl"
              />
            ))}

            <button
              onClick={saveRepairJob}
              className="w-full bg-green-600 hover:bg-green-700 p-4 rounded-2xl font-bold"
            >
              Save Repair Job
            </button>

            <button
              onClick={exportPDF}
              className="w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-2xl font-bold"
            >
              Export PDF
            </button>

            <div className="space-y-4 pt-4">

              <div className="bg-gray-200 text-black p-5 rounded-2xl text-center">
                <p>Total Expenses</p>

                <h2 className="text-4xl font-bold">
                  $
                  {totalExpenses.toFixed(
                    2
                  )}
                </h2>
              </div>

              <div
                className={`p-5 rounded-2xl text-center ${
                  profit >= 0
                    ? "bg-green-200 text-black"
                    : "bg-red-300 text-black"
                }`}
              >
                <p>Net Profit</p>
<p className="mt-2 text-sm font-semibold">
  {profit >= 100
    ? "Excellent Profit"
    : profit >= 50
    ? "Healthy Margin"
    : profit > 0
    ? "Low Margin Warning"
    : "Losing Money"}
</p>
                <h2 className="text-5xl font-bold">
                  ${profit.toFixed(2)}
                </h2>
              </div>

              <div className="bg-blue-200 text-black p-5 rounded-2xl text-center">
                <p>Profit Margin</p>

                <h2 className="text-4xl font-bold">
                  {margin}%
                </h2>
                <div className="w-full bg-gray-300 rounded-full h-4 mt-4 overflow-hidden">
  <div
    className={`h-4 ${
      Number(margin) >= 50
        ? "bg-green-500"
        : Number(margin) >= 25
        ? "bg-yellow-500"
        : "bg-red-500"
    }`}
    style={{ width: `${Math.min(Number(margin), 100)}%` }}
  ></div>
</div>
              </div>

            </div>

          </div>
        </div>

        <div className="bg-[#081225] border border-gray-700 p-6 rounded-3xl shadow-xl mt-6">

          <h2 className="text-3xl font-bold mb-4">
            Dashboard
          </h2>

          <div className="space-y-4">

            <div className="bg-purple-200 text-black p-5 rounded-2xl">
              <p>Total Repairs</p>

              <h3 className="text-4xl font-bold">
                {totalRepairs}
              </h3>
            </div>

            <div className="bg-yellow-200 text-black p-5 rounded-2xl">
              <p>Total Profit</p>

              <h3 className="text-4xl font-bold">
                $
                {totalProfit.toFixed(
                  2
                )}
              </h3>
            </div>

            <div className="bg-pink-200 text-black p-5 rounded-2xl">
              <p>Average Margin</p>

              <h3 className="text-4xl font-bold">
                {averageMargin}%
              </h3>
            </div>

          </div>
        </div>

        <div className="bg-[#081225] border border-gray-700 p-6 rounded-3xl shadow-xl mt-6">

          <h2 className="text-3xl font-bold mb-4">
            Repair History
          </h2>

          <input
            type="text"
            placeholder="Search repairs..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
            className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-400 p-4 rounded-2xl mb-4"
          />

          <select
            value={filter}
            onChange={(e) =>
              setFilter(
                e.target.value
              )
            }
            className="w-full bg-gray-800 border border-gray-700 text-white p-4 rounded-2xl mb-4"
          >
            <option value="all">
              All Repairs
            </option>

            <option value="profitable">
              Profitable
            </option>

            <option value="loss">
              Losses
            </option>
          </select>

          <div className="space-y-4">

            {filteredHistory.map(
              (repair, index) => (
                <div
                  key={index}
                  className="bg-gray-800 border border-gray-700 p-5 rounded-2xl"
                >
                  <div className="flex justify-between">

                    <div>
                      <h3 className="text-xl font-bold">
                        {
                          repair.repairName
                        }
                      </h3>

                      <p className="text-gray-300 mt-1">
                        {
                          repair.deviceType
                        }
                      </p>

                      <p
  className={`inline-block mt-2 px-3 py-1 rounded-full font-semibold ${
    Number(repair.profit) >= 0
      ? "bg-green-600 text-white"
      : "bg-red-600 text-white"
  }`}
>
  Profit: $
  {Number(repair.profit).toFixed(2)}
</p>
                      <p>
                        Margin:
                        {
                          repair.margin
                        }
                        %
                      </p>

                      <p className="text-sm text-gray-400 mt-2">
                        {repair.date}
                      </p>

                      {repair.notes && (
                        <p className="text-sm text-gray-300 mt-2">
                          Notes:{" "}
                          {
                            repair.notes
                          }
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        deleteRepair(
                          index
                        )
                      }
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl h-fit"
                    >
                      Delete
                    </button>

                  </div>
                </div>
              )
            )}

          </div>
        </div>

      </div>
    </main>
  );
}