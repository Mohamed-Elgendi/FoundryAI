/**
 * Student Analytics
 *
 * Progress charts, time spent, and skills breakdown.
 */

import { ProgressRing } from "@/components/shared/progress-ring";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data
const TIME_SPENT = [
  { day: "Mon", minutes: 120 },
  { day: "Tue", minutes: 90 },
  { day: "Wed", minutes: 150 },
  { day: "Thu", minutes: 60 },
  { day: "Fri", minutes: 180 },
  { day: "Sat", minutes: 240 },
  { day: "Sun", minutes: 30 },
];

const SKILLS = [
  { name: "HTML/CSS", level: 85 },
  { name: "JavaScript", level: 72 },
  { name: "React", level: 58 },
  { name: "Python", level: 45 },
  { name: "Data Analysis", level: 30 },
];

const MAX_MINUTES = Math.max(...TIME_SPENT.map((d) => d.minutes));

export default function StudentAnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Completion</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-4">
            <ProgressRing size={80} percentage={68} strokeWidth={6} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">24.5h</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Assignments Done</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">8/12</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">91%</p>
          </CardContent>
        </Card>
      </div>

      {/* Time Spent Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Time Spent (This Week)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3 h-48">
            {TIME_SPENT.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs text-muted-foreground">{d.minutes}m</span>
                <div
                  className="w-full rounded-t bg-primary/80 transition-all"
                  style={{
                    height: `${(d.minutes / MAX_MINUTES) * 100}%`,
                  }}
                />
                <span className="text-xs text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Skills Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {SKILLS.map((skill) => (
            <div key={skill.name}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{skill.name}</span>
                <span className="font-medium">{skill.level}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
