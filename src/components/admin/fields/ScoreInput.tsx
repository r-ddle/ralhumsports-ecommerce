'use client'

import React, { useState, useEffect } from 'react'
import { useField } from '@payloadcms/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Trophy, Target, Clock, Plus, Minus } from 'lucide-react'

interface ScoreData {
  team1?: {
    name: string
    score: number
    players?: string[]
  }
  team2?: {
    name: string
    score: number
    players?: string[]
  }
  sport?: string
  matchType?: string
  duration?: string
  winner?: 'team1' | 'team2' | 'draw'
  sets?: Array<{
    team1Score: number
    team2Score: number
  }>
}

export default function ScoreInput({ path, label, required }: any) {
  const { value, setValue } = useField<ScoreData>({ path })
  const [scoreData, setScoreData] = useState<ScoreData>(
    value || {
      team1: { name: '', score: 0, players: [] },
      team2: { name: '', score: 0, players: [] },
      sport: '',
      matchType: '',
      duration: '',
      sets: [],
    },
  )

  useEffect(() => {
    setValue(scoreData)
  }, [scoreData, setValue])

  const updateTeamData = (team: 'team1' | 'team2', field: string, newValue: any) => {
    setScoreData((prev) => ({
      ...prev,
      [team]: {
        ...prev[team],
        [field]: newValue,
      },
    }))
  }

  const updateScore = (team: 'team1' | 'team2', increment: boolean) => {
    setScoreData((prev) => {
      const currentScore = prev[team]?.score || 0
      const newScore = increment ? currentScore + 1 : Math.max(0, currentScore - 1)

      return {
        ...prev,
        [team]: {
          ...prev[team],
          score: newScore,
        },
      }
    })
  }

  const addSet = () => {
    setScoreData((prev) => ({
      ...prev,
      sets: [
        ...(prev.sets || []),
        {
          team1Score: prev.team1?.score || 0,
          team2Score: prev.team2?.score || 0,
        },
      ],
    }))
  }

  const determineWinner = () => {
    const team1Score = scoreData.team1?.score || 0
    const team2Score = scoreData.team2?.score || 0

    if (team1Score > team2Score) {
      setScoreData((prev) => ({ ...prev, winner: 'team1' }))
    } else if (team2Score > team1Score) {
      setScoreData((prev) => ({ ...prev, winner: 'team2' }))
    } else {
      setScoreData((prev) => ({ ...prev, winner: 'draw' }))
    }
  }

  const sports = [
    'Cricket',
    'Rugby',
    'Football',
    'Basketball',
    'Volleyball',
    'Tennis',
    'Badminton',
    'Hockey',
    'Table Tennis',
  ]

  const matchTypes = ['Friendly', 'League', 'Cup', 'Championship', 'Tournament', 'Practice']

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-brand-primary" />
        <Label className="text-lg font-semibold text-text-primary">
          {label || 'Match Score'}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      </div>

      {/* Match Information */}
      <Card className="bg-white border-brand-border">
        <CardHeader>
          <CardTitle className="text-sm text-text-primary flex items-center gap-2">
            <Target className="w-4 h-4" />
            Match Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-text-primary">Sport</Label>
              <select
                value={scoreData.sport || ''}
                onChange={(e) => setScoreData((prev) => ({ ...prev, sport: e.target.value }))}
                className="w-full mt-1 px-3 py-2 border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="">Select Sport</option>
                {sports.map((sport) => (
                  <option key={sport} value={sport}>
                    {sport}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-sm font-medium text-text-primary">Match Type</Label>
              <select
                value={scoreData.matchType || ''}
                onChange={(e) => setScoreData((prev) => ({ ...prev, matchType: e.target.value }))}
                className="w-full mt-1 px-3 py-2 border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="">Select Type</option>
                {matchTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-sm font-medium text-text-primary">Duration</Label>
              <Input
                type="text"
                placeholder="e.g., 90 minutes, 3 sets"
                value={scoreData.duration || ''}
                onChange={(e) => setScoreData((prev) => ({ ...prev, duration: e.target.value }))}
                className="mt-1 border-brand-border focus:ring-brand-primary"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Input */}
      <Card className="bg-white border-brand-border">
        <CardHeader>
          <CardTitle className="text-sm text-text-primary flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Live Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Team 1 */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-text-primary">Team 1 Name</Label>
                <Input
                  type="text"
                  placeholder="Enter team name"
                  value={scoreData.team1?.name || ''}
                  onChange={(e) => updateTeamData('team1', 'name', e.target.value)}
                  className="mt-1 border-brand-border focus:ring-brand-primary"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-text-primary">Score</Label>
                <div className="flex items-center gap-3 mt-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => updateScore('team1', false)}
                    className="p-2"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <div className="text-3xl font-bold text-brand-primary min-w-[60px] text-center">
                    {scoreData.team1?.score || 0}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => updateScore('team1', true)}
                    className="p-2"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* VS Divider */}
            <div className="flex items-center justify-center md:col-span-2 md:col-start-1 md:row-start-1">
              <div className="hidden md:flex items-center justify-center w-full">
                <Separator className="flex-1" />
                <Badge
                  variant="secondary"
                  className="mx-4 bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20"
                >
                  VS
                </Badge>
                <Separator className="flex-1" />
              </div>
            </div>

            {/* Team 2 */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-text-primary">Team 2 Name</Label>
                <Input
                  type="text"
                  placeholder="Enter team name"
                  value={scoreData.team2?.name || ''}
                  onChange={(e) => updateTeamData('team2', 'name', e.target.value)}
                  className="mt-1 border-brand-border focus:ring-brand-primary"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-text-primary">Score</Label>
                <div className="flex items-center gap-3 mt-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => updateScore('team2', false)}
                    className="p-2"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <div className="text-3xl font-bold text-brand-secondary min-w-[60px] text-center">
                    {scoreData.team2?.score || 0}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => updateScore('team2', true)}
                    className="p-2"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={addSet}
              className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
            >
              Add Set/Round
            </Button>
            <Button
              type="button"
              onClick={determineWinner}
              className="bg-brand-secondary text-white hover:bg-brand-secondary/90"
            >
              Determine Winner
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sets/Rounds History */}
      {scoreData.sets && scoreData.sets.length > 0 && (
        <Card className="bg-white border-brand-border">
          <CardHeader>
            <CardTitle className="text-sm text-text-primary flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Sets/Rounds History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {scoreData.sets.map((set, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-brand-background rounded-lg"
                >
                  <span className="text-sm font-medium text-text-primary">Set {index + 1}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-text-primary">
                      {scoreData.team1?.name || 'Team 1'}: {set.team1Score}
                    </span>
                    <span className="text-text-secondary">-</span>
                    <span className="text-sm text-text-primary">
                      {scoreData.team2?.name || 'Team 2'}: {set.team2Score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Winner Display */}
      {scoreData.winner && (
        <Card className="bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 border-brand-primary">
          <CardContent className="p-6 text-center">
            <Trophy className="w-8 h-8 text-brand-primary mx-auto mb-2" />
            <h3 className="text-lg font-bold text-text-primary">
              {scoreData.winner === 'draw'
                ? 'Match Drawn!'
                : `${scoreData.winner === 'team1' ? scoreData.team1?.name || 'Team 1' : scoreData.team2?.name || 'Team 2'} Wins!`}
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              Final Score: {scoreData.team1?.score || 0} - {scoreData.team2?.score || 0}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
