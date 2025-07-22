import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

interface Appointment {
  date: string;
  status: string;
}

interface Patient {
  id: number;
  appointments?: Appointment[];
}

export function DashboardBarChart() {
  const [barData, setBarData] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("pacientes") || "[]";
    const pacientes: Patient[] = JSON.parse(stored);

    const allAppointments = pacientes.flatMap(p => p.appointments || []);
    const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const counts: { [key: string]: number } = {};

    allAppointments.forEach(appt => {
      const [year, month, day] = appt.date.split("-").map(Number);
      const date = new Date(year, month - 1, day); // Corrigido: data local
      const dayIndex = date.getDay();
      const dayName = weekDays[dayIndex];
      counts[dayName] = (counts[dayName] || 0) + 1;
    });

    const data = weekDays.map(day => ({
      day,
      realizadas: counts[day] || 0,
    }));

    setBarData(data);
  }, []);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart layout="vertical" data={barData}>
          <XAxis
            type="number"
            domain={[0, 10]}
            tickCount={11}
            tickFormatter={(value) => Number.isInteger(value) ? value : ''}
          />
          <YAxis dataKey="day" type="category" />
          <Tooltip />
          <Bar dataKey="realizadas" fill="#A8DADC" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
