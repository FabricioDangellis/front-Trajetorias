import { PieChart, Pie, Cell } from "recharts";
import { useEffect, useState } from "react";
import "./DashboardCircleChart.css";

interface Appointment {
  status: string;
}

interface Patient {
  appointments?: Appointment[];
}

export function DashboardCircleChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("pacientes") || "[]";
    const pacientes: Patient[] = JSON.parse(stored);
    const allAppointments = pacientes.flatMap(p => p.appointments || []);

    const statusCounts = {
      Realizadas: 0,
      Marcadas: 0,
      Canceladas: 0,
    };

    allAppointments.forEach(appt => {
      if (appt.status === "Finalizada") statusCounts.Realizadas += 1;
      else if (appt.status === "Marcada") statusCounts.Marcadas += 1;
      else if (appt.status === "Cancelada") statusCounts.Canceladas += 1;
    });

    const updatedData = [
      { name: "Finalizadas", value: statusCounts.Realizadas, color: "#457B9D" },
      { name: "Marcadas", value: statusCounts.Marcadas, color: "#FFD166" },
      { name: "Canceladas", value: statusCounts.Canceladas, color: "#FFB6B9" },
    ];

    setData(updatedData);
  }, []);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const realizadas = data.find((d) => d.name === "Finalizadas")?.value || 0;
  const percentRealizadas = total > 0 ? Math.round((realizadas / total) * 100) : 0;

  return (
    <div className="chart-container">
      <div className="chart-wrapper">
        <PieChart width={180} height={180}>
          <Pie
            data={data}
            innerRadius={65}
            outerRadius={75}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            cornerRadius={50}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
        <div className="center-label">
          {percentRealizadas}%
        </div>
      </div>

      <div className="custom-legend">
        {data.map((item) => (
          <div key={item.name} className="legend-item">
            <div className="legend-color" style={{ backgroundColor: item.color }} />
            <span className="legend-value">{item.value}</span>
            <span className="legend-label">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
