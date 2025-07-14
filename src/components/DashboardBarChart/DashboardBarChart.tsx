import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const barData = [
  { day: "Seg", realizadas: 5 },
  { day: "Ter", realizadas: 3 },
  { day: "Qua", realizadas: 7 },
  { day: "Qui", realizadas: 4 },
  { day: "Sex", realizadas: 6 },
];

export function DashboardBarChart() {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart layout="vertical" data={barData}>
          <XAxis type="number" />
          <YAxis dataKey="day" type="category" />
          <Tooltip />
          <Bar dataKey="realizadas" fill="#2575fc" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
