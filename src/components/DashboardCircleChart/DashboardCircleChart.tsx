import { PieChart, Pie, Cell } from "recharts";
import "./DashboardCircleChart.css";

const data = [
  { name: "Realizadas", value: 86, color: "#457B9D" },
  { name: "Marcadas", value: 20, color: "#FFD166" },
  { name: "Canceladas", value: 15, color: "#FFB6B9" },
];

export function DashboardCircleChart() {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const realizadas = data.find((d) => d.name === "Realizadas")?.value || 0;
  const percentRealizadas = Math.round((realizadas / total) * 100);

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
            cornerRadius={50} // arredondamento da borda
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
            <div
              className="legend-color"
              style={{ backgroundColor: item.color }}
            />
            <span className="legend-value">{item.value}</span>
            <span className="legend-label">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
