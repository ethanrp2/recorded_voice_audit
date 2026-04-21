"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Voice } from "@/lib/voices";

interface Props {
  voices: Voice[];
  votes: Record<string, number>;
}

export function SummaryCharts({ voices, votes }: Props) {
  const providerTotals: Record<Voice["provider"], number> = {
    cartesia: 0,
    elevenlabs: 0,
  };
  for (const v of voices) providerTotals[v.provider] += votes[v.id] ?? 0;

  const providerData = [
    { name: "Cartesia", total: providerTotals.cartesia, fill: "#10b981" },
    { name: "ElevenLabs", total: providerTotals.elevenlabs, fill: "#6366f1" },
  ];

  const byPerson = new Map<string, Voice[]>();
  for (const v of voices) {
    const list = byPerson.get(v.person) ?? [];
    list.push(v);
    byPerson.set(v.person, list);
  }

  let regularMaxSum = 0;
  let cxMaxSum = 0;
  for (const list of byPerson.values()) {
    const regs = list
      .filter((v) => v.variant === "regular")
      .map((v) => votes[v.id] ?? 0);
    const cxs = list
      .filter((v) => v.variant === "cx")
      .map((v) => votes[v.id] ?? 0);
    regularMaxSum += regs.length ? Math.max(...regs) : 0;
    cxMaxSum += cxs.length ? Math.max(...cxs) : 0;
  }

  const variantData = [
    { name: "Regular", total: regularMaxSum, fill: "#f59e0b" },
    { name: "CX", total: cxMaxSum, fill: "#ef4444" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ChartCard
        title="Upvotes by provider"
        subtitle="Total upvotes across every voice"
        data={providerData}
      />
      <ChartCard
        title="Preferred recording style"
        subtitle="Sum of each person's best voice per variant"
        data={variantData}
      />
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  data,
}: {
  title: string;
  subtitle: string;
  data: { name: string; total: number; fill: string }[];
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 mb-3">{subtitle}</p>
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} allowDecimals={false} />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
              contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
            />
            <Bar dataKey="total" radius={[6, 6, 0, 0]}>
              {data.map((d) => (
                <Cell key={d.name} fill={d.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
