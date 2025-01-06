// src/components/Investments.jsx

import React, { useState } from "react";
import { Navigation } from "./navigation";
import { Header } from "./header";
import { Contact } from "./contact";
import { Credito } from "./credito";
import { Inversion } from "./inversion";
import { Preguntas } from "./preguntas";

export const Simulators = ({ data }) => {
  const [activeTab, setActiveTab] = useState("credit");

  return (
    <div>
      <Navigation />
      <Header data={data.HeaderSim} />

      <div className="tabs-container">
        <div className="tabs">
          <button
            className={activeTab === "credit" ? "active" : ""}
            onClick={() => setActiveTab("credit")}
          >
            Créditos
          </button>
          <button
            className={activeTab === "investment" ? "active" : ""}
            onClick={() => setActiveTab("investment")}
          >
            Inversiones
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "credit" && <Credito />}
          {activeTab === "investment" && <Inversion />}
        </div>
      </div>
      <Preguntas />
      <Contact data={data.Contact} />
    </div>
  );
};