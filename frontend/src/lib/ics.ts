import type { Gap, RoadmapTask } from "../store/session";
import { TOTAL_DAYS } from "./roadmap";

const DEFAULT_HOUR = 9;
const DEFAULT_DURATION_MIN = 60;

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

// Escape conforme RFC 5545: barra, ponto-e-vírgula, vírgula e quebra de linha.
function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

// Data-hora "flutuante" (sem timezone) no formato YYYYMMDDTHHMMSS.
function formatLocalDateTime(d: Date): string {
  return (
    `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}` +
    `T${pad2(d.getHours())}${pad2(d.getMinutes())}${pad2(d.getSeconds())}`
  );
}

// DTSTAMP precisa ser UTC (com sufixo Z).
function formatUtcStamp(d: Date): string {
  return (
    `${d.getUTCFullYear()}${pad2(d.getUTCMonth() + 1)}${pad2(d.getUTCDate())}` +
    `T${pad2(d.getUTCHours())}${pad2(d.getUTCMinutes())}${pad2(d.getUTCSeconds())}Z`
  );
}

function gapDescription(task: RoadmapTask, gapById: Map<string, Gap>): string {
  const gap = gapById.get(task.gap_id);
  if (!gap) return task.task;
  return gap.skill ? `${gap.skill}: ${gap.reason}` : gap.reason;
}

/**
 * Gera uma string .ics com um evento por dia do roadmap (dias 1..7),
 * começando amanhã às 09:00. SUMMARY = título(s) da(s) tarefa(s) do dia,
 * DESCRIPTION = descrição do(s) gap(s) associado(s).
 */
export function buildRoadmapIcs(
  tasksByDay: Map<number, RoadmapTask[]>,
  gaps: Gap[],
): string {
  const gapById = new Map(gaps.map((g) => [g.id, g]));
  const now = new Date();
  const stamp = formatUtcStamp(now);

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PrepOS//Roadmap//PT-BR",
    "CALSCALE:GREGORIAN",
  ];

  for (let day = 1; day <= TOTAL_DAYS; day++) {
    const dayTasks = tasksByDay.get(day) ?? [];
    if (dayTasks.length === 0) continue;

    // Dia 1 = amanhã, para nunca cair em horário já passado.
    const start = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + day,
      DEFAULT_HOUR,
      0,
      0,
    );
    const totalMinutes =
      dayTasks.reduce((sum, t) => sum + (t.minutes || 0), 0) ||
      DEFAULT_DURATION_MIN;
    const end = new Date(start.getTime() + totalMinutes * 60_000);

    const summary = dayTasks.map((t) => t.task).join(" / ");
    const description = dayTasks
      .map((t) => gapDescription(t, gapById))
      .join("\n");

    lines.push(
      "BEGIN:VEVENT",
      `UID:prepos-roadmap-dia${day}-${now.getTime()}@prepos`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${formatLocalDateTime(start)}`,
      `DTEND:${formatLocalDateTime(end)}`,
      `SUMMARY:${escapeIcsText(`Dia ${day}: ${summary}`)}`,
      `DESCRIPTION:${escapeIcsText(description)}`,
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

/**
 * Versão em texto puro do roadmap, usada como fallback de cópia para a área
 * de transferência quando o download do .ics não é possível.
 */
export function buildRoadmapPlainText(
  tasksByDay: Map<number, RoadmapTask[]>,
  gaps: Gap[],
): string {
  const gapById = new Map(gaps.map((g) => [g.id, g]));
  const lines: string[] = ["Roadmap de Estudo (7 dias) — PrepOS", ""];

  for (let day = 1; day <= TOTAL_DAYS; day++) {
    const dayTasks = tasksByDay.get(day) ?? [];
    if (dayTasks.length === 0) continue;

    lines.push(`Dia ${day} — 09:00`);
    for (const t of dayTasks) {
      lines.push(`  • ${t.task} (${gapDescription(t, gapById)})`);
    }
    lines.push("");
  }

  return lines.join("\n").trimEnd();
}
