import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, TrendingUp, Users, Heart, Brain } from "lucide-react";

interface OrganizationImpactReportProps {
  dateRange?: { from: Date; to: Date };
  filterArea?: string;
}

const OrganizationImpactReport: React.FC<OrganizationImpactReportProps> = ({
  dateRange,
  filterArea,
}) => {
  // In a real implementation, this would fetch data from Supabase
  // For now, we'll use mock data
  const impactData = React.useMemo(() => {
    return {
      // Mental health improvements
      phq9Improvement: 32,
      gad7Improvement: 28,
      wellbeingImprovement: 41,

      // Service delivery metrics
      clientsServed: 156,
      sessionsDelivered: 843,
      groupSessionsHosted: 24,

      // Outcome metrics
      employmentGain: 18,
      housingStability: 22,
      communityEngagement: 35,

      // Overall impact
      overallImpactScore: 78,
      costEffectiveness: 83,
      socialReturnOnInvestment: 4.2,

      // Client demographics
      demographics: {
        ageGroups: [
          { name: "18-24", value: 22 },
          { name: "25-34", value: 38 },
          { name: "35-44", value: 25 },
          { name: "45-54", value: 10 },
          { name: "55+", value: 5 },
        ],
        genders: [
          { name: "Female", value: 58 },
          { name: "Male", value: 39 },
          { name: "Non-binary/Other", value: 3 },
        ],
        ethnicities: [
          { name: "White", value: 62 },
          { name: "Black", value: 15 },
          { name: "Asian", value: 12 },
          { name: "Mixed", value: 8 },
          { name: "Other", value: 3 },
        ],
      },

      // Presenting issues
      presentingIssues: [
        { name: "Anxiety", value: 72 },
        { name: "Depression", value: 68 },
        { name: "Relationship Issues", value: 45 },
        { name: "Trauma", value: 38 },
        { name: "Substance Use", value: 22 },
        { name: "Housing", value: 18 },
        { name: "Employment", value: 15 },
      ],
    };
  }, [dateRange, filterArea]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Organization Impact Report
        </h2>
        <p className="text-muted-foreground">
          Comprehensive analysis of service delivery outcomes and client
          improvements
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Impact Score
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <Award className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {impactData.overallImpactScore}%
            </div>
            <div className="mt-2">
              <Progress value={impactData.overallImpactScore} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Combined measure of all outcome indicators
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mental Health Improvement
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <Brain className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {impactData.phq9Improvement}%
            </div>
            <div className="mt-2">
              <Progress value={impactData.phq9Improvement} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Average reduction in depression symptoms (PHQ-9)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Clients Served
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{impactData.clientsServed}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total unique clients receiving services
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Social ROI</CardTitle>
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              £{impactData.socialReturnOnInvestment}:1
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Social return for every £1 invested
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mental Health Outcomes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Depression (PHQ-9)</span>
                <span className="text-sm font-medium">
                  {impactData.phq9Improvement}% improvement
                </span>
              </div>
              <Progress value={impactData.phq9Improvement} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Anxiety (GAD-7)</span>
                <span className="text-sm font-medium">
                  {impactData.gad7Improvement}% improvement
                </span>
              </div>
              <Progress value={impactData.gad7Improvement} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Overall Wellbeing</span>
                <span className="text-sm font-medium">
                  {impactData.wellbeingImprovement}% improvement
                </span>
              </div>
              <Progress
                value={impactData.wellbeingImprovement}
                className="h-2"
              />
            </div>

            <div className="pt-2 border-t mt-4">
              <h4 className="text-sm font-medium mb-2">Sessions Delivered</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="text-2xl font-bold">
                    {impactData.sessionsDelivered}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total sessions
                  </div>
                </div>
                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="text-2xl font-bold">
                    {impactData.groupSessionsHosted}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Group sessions
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Outcomes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Employment Gains</span>
                <span className="text-sm font-medium">
                  {impactData.employmentGain}%
                </span>
              </div>
              <Progress value={impactData.employmentGain} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Clients reporting improved employment status
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Housing Stability</span>
                <span className="text-sm font-medium">
                  {impactData.housingStability}%
                </span>
              </div>
              <Progress value={impactData.housingStability} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Clients reporting improved housing situation
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">
                  Community Engagement
                </span>
                <span className="text-sm font-medium">
                  {impactData.communityEngagement}%
                </span>
              </div>
              <Progress
                value={impactData.communityEngagement}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Clients reporting increased community participation
              </p>
            </div>

            <div className="pt-2 border-t mt-4">
              <h4 className="text-sm font-medium mb-2">Cost Effectiveness</h4>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-background border flex items-center justify-center">
                  <span className="text-xl font-bold">
                    {impactData.costEffectiveness}%
                  </span>
                </div>
                <div>
                  <div className="text-sm">
                    £{impactData.socialReturnOnInvestment}:1 social return
                  </div>
                  <div className="text-xs text-muted-foreground">
                    For every £1 invested
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Demographics & Presenting Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium mb-3">Age Groups</h4>
              <div className="space-y-2">
                {impactData.demographics.ageGroups.map((group) => (
                  <div key={group.name}>
                    <div className="flex justify-between text-xs">
                      <span>{group.name}</span>
                      <span>{group.value}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted mt-1">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${group.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Gender</h4>
              <div className="space-y-2">
                {impactData.demographics.genders.map((gender) => (
                  <div key={gender.name}>
                    <div className="flex justify-between text-xs">
                      <span>{gender.name}</span>
                      <span>{gender.value}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted mt-1">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${gender.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">
                Top Presenting Issues
              </h4>
              <div className="space-y-2">
                {impactData.presentingIssues.slice(0, 5).map((issue) => (
                  <div key={issue.name}>
                    <div className="flex justify-between text-xs">
                      <span>{issue.name}</span>
                      <span>{issue.value}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted mt-1">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${issue.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationImpactReport;
