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

const CARTESIA_COLOR = "#22d3ee";
const ELEVENLABS_COLOR = "#a78bfa";
const REGULAR_COLOR = "#f472b6";
const CX_COLOR = "#facc15";

export function SummaryCharts({ voices, votes }: Props) {
  const providerTotals: Record<Voice["provider"], number> = {
    cartesia: 0,
    elevenlabs: 0,
  };
  for (const v of voices) providerTotals[v.provider] += votes[v.id] ?? 0;

  const providerData = [
    { name: "Cartesia", total: providerTotals.cartesia, fill: CARTESIA_COLOR },
    {
      name: "ElevenLabs",
      total: providerTotals.elevenlabs,
      fill: ELEVENLABS_COLOR,
    },
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
    { name: "Regular", total: regularMaxSum, fill: REGULAR_COLOR },
    { name: "CX", total: cxMaxSum, fill: CX_COLOR },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ChartCard
        title="Upvotes by provider"
        subtitle="Total across every voice"
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
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-sm">
      <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-slate-300">
        {title}
      </h3>
      <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
      <div className="mt-3 h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="2 4" stroke="#ffffff14" />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#ffffff14" }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              allowDecimals={false}
              tickLine={false}
              axisLine={{ stroke: "#ffffff14" }}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(10, 10, 18, 0.95)",
                color: "#e2e8f0",
                fontSize: 12,
              }}
              labelStyle={{ color: "#94a3b8" }}
            />
            <Bar dataKey="total" radius={[4, 4, 0, 0]}>
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
