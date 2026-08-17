import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { ValueType } from 'recharts/types/component/DefaultTooltipContent'
import { useAppData } from '../context/AppDataContext'
import { Card, StatCard, Button } from '../components/ui'
import { calcCurrentStreak, calcLongestStreak, totalCompletedWorkouts, weeklyAggregates } from '../lib/stats'
import { allBadgeDefs } from '../lib/badges'
import { todayISO, formatHuShort } from '../lib/date'

export default function Progress() {
  const { profile, logs, bodyMetrics, badges, addBodyMetric } = useAppData()
  const [weightInput, setWeightInput] = useState('')

  if (!profile) return null

  const streak = calcCurrentStreak(logs)
  const longest = calcLongestStreak(logs)
  const total = totalCompletedWorkouts(logs)
  const weekly = weeklyAggregates(logs, 8)
  const unlockedIds = new Set(badges.map((b) => b.id))

  const weightSeries = bodyMetrics
    .filter((m) => m.weightKg)
    .map((m) => ({ label: formatHuShort(m.date), weight: m.weightKg }))

  const saveWeight = () => {
    const w = Number(weightInput)
    if (!w || w <= 0) return
    addBodyMetric({ date: todayISO(), weightKg: w })
    setWeightInput('')
  }

  return (
    <div className="px-5 pt-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Haladásod</h1>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <StatCard label="Jelenlegi sorozat" value={`${streak}`} sub="nap" />
        <StatCard label="Leghosszabb" value={`${longest}`} sub="nap" />
        <StatCard label="Összes edzés" value={`${total}`} />
      </div>

      <Card className="mt-5 p-4">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Heti edzésszám</p>
        <div className="mt-3 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-100 dark:text-white/5" />
              <XAxis dataKey="weekLabel" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} width={24} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }}
                labelFormatter={(l) => `Hét: ${l}`}
                formatter={(v: ValueType | undefined) => [`${v} edzés`, '']}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="mt-4 p-4">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Heti terhelés (kg × ismétlés)</p>
        <div className="mt-3 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-100 dark:text-white/5" />
              <XAxis dataKey="weekLabel" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis width={32} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} formatter={(v: ValueType | undefined) => [`${v} kg`, 'Volumen']} />
              <Line type="monotone" dataKey="volume" stroke="#d946ef" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="mt-4 p-4">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Testsúly követése</p>
        <div className="mt-3 flex gap-2">
          <input
            type="number"
            inputMode="decimal"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            placeholder="Mai testsúly (kg)"
            className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400 dark:border-white/10 dark:bg-slate-900 dark:text-white"
          />
          <Button variant="secondary" onClick={saveWeight}>
            Mentés
          </Button>
        </div>
        {weightSeries.length > 1 && (
          <div className="mt-4 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightSeries}>
                <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis width={32} domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} formatter={(v: ValueType | undefined) => [`${v} kg`, 'Testsúly']} />
                <Line type="monotone" dataKey="weight" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <div className="mt-5">
        <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Jelvények</p>
        <div className="grid grid-cols-3 gap-3">
          {allBadgeDefs().map((b) => {
            const unlocked = unlockedIds.has(b.id)
            return (
              <Card key={b.id} className={`flex flex-col items-center p-3 text-center ${!unlocked ? 'opacity-40' : ''}`}>
                <span className="text-2xl">{b.icon}</span>
                <span className="mt-1 text-[11px] font-medium leading-tight text-slate-600 dark:text-slate-300">{b.title}</span>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
