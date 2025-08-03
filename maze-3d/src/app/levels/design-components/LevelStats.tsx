import { useGetTop10StatsByLevelId } from '@/app/player/services/save-level-stats'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'

const LevelStats = ({ levelId }: { levelId: string }) => {
  const { data, isLoading, isError } = useGetTop10StatsByLevelId(levelId)

  return (
    <Card className="w-full max-w-md mx-auto mt-6 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">🏆 Top 10 Players</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-4">
            {[...Array(5)].map((_, idx) => (
              <Skeleton key={idx} className="h-6 w-full rounded-md" />
            ))}
          </div>
        )}

        {isError && (
          <div className="flex items-center space-x-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <span>Error fetching stats</span>
          </div>
        )}

        {!isLoading && data && data.length > 0 && (
          <ul className="space-y-3">
            {data.map((stat, index) => (
              <li
                key={stat.createdAt + stat.playerName}
                className="flex items-center justify-between bg-muted p-3 rounded-lg shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-muted-foreground">{index + 1}.</span>
                  <span className="text-sm font-medium">{stat.playerName}</span>
                </div>
                <span className="text-sm font-mono text-right text-foreground">
                  ⏱ {stat.completionTime ?? '—'}s
                </span>
              </li>
            ))}
          </ul>
        )}

        {!isLoading && data && data.length === 0 && (
          <p className="text-muted-foreground text-center">No stats available yet.</p>
        )}
      </CardContent>
    </Card>
  )
}

export default LevelStats
