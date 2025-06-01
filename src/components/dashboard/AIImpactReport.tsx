import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sparkles,
  Download,
  Share2,
  Copy,
  Check,
  Calendar,
} from "lucide-react";
import DatePickerWithRange from "@/components/ui/date-picker-with-range";
import { DateRange } from "react-day-picker";

interface AIImpactReportProps {
  organizationId?: string;
}

const AIImpactReport: React.FC<AIImpactReportProps> = ({ organizationId }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportType, setReportType] = useState("monthly");
  const [reportFormat, setReportFormat] = useState("executive");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });

  // Set up React state to work with the DatePickerWithRange component
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: dateRange.from,
    to: dateRange.to,
  });

  // Update dateRange when date changes
  React.useEffect(() => {
    if (date?.from && date?.to) {
      setDateRange({
        from: date.from,
        to: date.to,
      });
    }
  }, [date]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");

  // Sample generated report
  const generatedReport = `# Impact Report: ${reportFormat === "executive" ? "Executive Summary" : "Detailed Analysis"}
## ${new Date(dateRange.from).toLocaleDateString()} - ${new Date(dateRange.to).toLocaleDateString()}

### Overview
During this period, the organization has made significant progress in several key areas. Client engagement has increased by 23% compared to the previous period, with 156 new clients onboarded and 87 clients completing their support journey successfully.

### Key Metrics
- **Client Support**: 243 active clients supported
- **Events**: 30 events (12 in-person, 18 online) with 78% attendance rate
- **Assessments**: 156 assessments completed
- **Communication**: 342 phone calls and 1,204 text messages
- **Group Sessions**: 42 group sessions with 85% positive feedback

### Impact Highlights
- PHQ-9 scores improved by an average of 4.2 points across all clients
- GAD-7 scores improved by an average of 3.8 points across all clients
- 87% of clients reported improved well-being after completing the program
- 72% of clients achieved at least one of their primary goals

### Areas for Growth
- Increase engagement in the West District by 15%
- Expand peer support groups to reach underserved communities
- Enhance post-event follow-up processes to improve long-term engagement

### Recommendations
1. Implement targeted outreach in the West District
2. Develop additional peer support training materials
3. Create automated follow-up workflows for event attendees
4. Expand counseling capacity to meet growing demand

${
  reportFormat === "detailed"
    ? `
### Detailed Analysis by Area

#### North District
The North District continues to show strong performance with 87 active clients and 12 events hosted during this period. Client satisfaction rates remain high at 92%, with particularly positive feedback for the housing support services.

#### South District
The South District has seen a 15% increase in client engagement, largely due to the new community outreach program. The 8 events hosted in this area had an average attendance rate of 82%.

#### East District
The East District shows promising growth with 43 active clients, up from 36 in the previous period. The peer support groups in this area have been particularly successful, with 6 active groups meeting regularly.

#### West District
The West District remains our most challenging area with 48 active clients, showing only a 5% increase from the previous period. Additional resources and targeted strategies are recommended to improve engagement in this area.
`
    : ""
}

### Conclusion
The organization continues to make meaningful impact in the community, with clear evidence of improved client outcomes across multiple measures. Strategic focus on the identified growth areas will help expand this impact in the coming period.`;

  const handleGenerateReport = () => {
    setIsGenerating(true);

    // Simulate API call delay
    setTimeout(() => {
      setIsGenerating(false);
      setReportGenerated(true);
    }, 2000);
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(generatedReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReport = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedReport], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `impact-report-${new Date().toISOString().split("T")[0]}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShareReport = () => {
    // In a real implementation, this would open a dialog to share the report
    alert(
      "Share functionality would be implemented here, potentially integrating with email services like Brevo.",
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Impact Report Generator
        </CardTitle>
        <CardDescription>
          Generate comprehensive impact reports powered by AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!reportGenerated ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly Report</SelectItem>
                    <SelectItem value="quarterly">Quarterly Report</SelectItem>
                    <SelectItem value="annual">Annual Report</SelectItem>
                    <SelectItem value="custom">Custom Date Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Report Format</Label>
                <Select value={reportFormat} onValueChange={setReportFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="executive">Executive Summary</SelectItem>
                    <SelectItem value="detailed">Detailed Analysis</SelectItem>
                    <SelectItem value="presentation">
                      Presentation Ready
                    </SelectItem>
                    <SelectItem value="funder">Funder Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Date Range
              </Label>
              <DatePickerWithRange className="" />
            </div>

            <div className="space-y-2">
              <Label>Additional Instructions (Optional)</Label>
              <Textarea
                placeholder="Add any specific focus areas or metrics you'd like to highlight in the report..."
                className="min-h-[100px]"
              />
            </div>

            <Button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Generating Report...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Impact Report
                </>
              )}
            </Button>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="raw">Raw Markdown</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="pt-4">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <h1>
                  Impact Report:{" "}
                  {reportFormat === "executive"
                    ? "Executive Summary"
                    : "Detailed Analysis"}
                </h1>
                <h2>
                  {new Date(dateRange.from).toLocaleDateString()} -{" "}
                  {new Date(dateRange.to).toLocaleDateString()}
                </h2>

                <h3>Overview</h3>
                <p>
                  During this period, the organization has made significant
                  progress in several key areas. Client engagement has increased
                  by 23% compared to the previous period, with 156 new clients
                  onboarded and 87 clients completing their support journey
                  successfully.
                </p>

                <h3>Key Metrics</h3>
                <ul>
                  <li>
                    <strong>Client Support</strong>: 243 active clients
                    supported
                  </li>
                  <li>
                    <strong>Events</strong>: 30 events (12 in-person, 18 online)
                    with 78% attendance rate
                  </li>
                  <li>
                    <strong>Assessments</strong>: 156 assessments completed
                  </li>
                  <li>
                    <strong>Communication</strong>: 342 phone calls and 1,204
                    text messages
                  </li>
                  <li>
                    <strong>Group Sessions</strong>: 42 group sessions with 85%
                    positive feedback
                  </li>
                </ul>

                <h3>Impact Highlights</h3>
                <ul>
                  <li>
                    PHQ-9 scores improved by an average of 4.2 points across all
                    clients
                  </li>
                  <li>
                    GAD-7 scores improved by an average of 3.8 points across all
                    clients
                  </li>
                  <li>
                    87% of clients reported improved well-being after completing
                    the program
                  </li>
                  <li>
                    72% of clients achieved at least one of their primary goals
                  </li>
                </ul>

                <h3>Areas for Growth</h3>
                <ul>
                  <li>Increase engagement in the West District by 15%</li>
                  <li>
                    Expand peer support groups to reach underserved communities
                  </li>
                  <li>
                    Enhance post-event follow-up processes to improve long-term
                    engagement
                  </li>
                </ul>

                <h3>Recommendations</h3>
                <ol>
                  <li>Implement targeted outreach in the West District</li>
                  <li>Develop additional peer support training materials</li>
                  <li>
                    Create automated follow-up workflows for event attendees
                  </li>
                  <li>Expand counseling capacity to meet growing demand</li>
                </ol>

                {reportFormat === "detailed" && (
                  <>
                    <h3>Detailed Analysis by Area</h3>

                    <h4>North District</h4>
                    <p>
                      The North District continues to show strong performance
                      with 87 active clients and 12 events hosted during this
                      period. Client satisfaction rates remain high at 92%, with
                      particularly positive feedback for the housing support
                      services.
                    </p>

                    <h4>South District</h4>
                    <p>
                      The South District has seen a 15% increase in client
                      engagement, largely due to the new community outreach
                      program. The 8 events hosted in this area had an average
                      attendance rate of 82%.
                    </p>

                    <h4>East District</h4>
                    <p>
                      The East District shows promising growth with 43 active
                      clients, up from 36 in the previous period. The peer
                      support groups in this area have been particularly
                      successful, with 6 active groups meeting regularly.
                    </p>

                    <h4>West District</h4>
                    <p>
                      The West District remains our most challenging area with
                      48 active clients, showing only a 5% increase from the
                      previous period. Additional resources and targeted
                      strategies are recommended to improve engagement in this
                      area.
                    </p>
                  </>
                )}

                <h3>Conclusion</h3>
                <p>
                  The organization continues to make meaningful impact in the
                  community, with clear evidence of improved client outcomes
                  across multiple measures. Strategic focus on the identified
                  growth areas will help expand this impact in the coming
                  period.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="raw" className="pt-4">
              <div className="relative">
                <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[400px] text-sm">
                  {generatedReport}
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 flex items-center gap-1"
                  onClick={handleCopyReport}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>

      {reportGenerated && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setReportGenerated(false)}>
            Generate New Report
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleDownloadReport}
            >
              <Download className="h-4 w-4" /> Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleShareReport}
            >
              <Share2 className="h-4 w-4" /> Share
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default AIImpactReport;
