import html2pdf from "html2pdf.js";

/**
 * Generates a PDF from assessment data
 * @param assessment The assessment data to include in the PDF
 * @returns Promise that resolves when PDF generation is complete
 */
export const generateAssessmentPDF = async (assessment: any) => {
  // Mock assessment results based on assessment type
  const assessmentResults = generateMockResults(assessment);

  // Create a temporary div to render the assessment content
  const element = document.createElement("div");
  element.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h1 style="color: #333; margin: 0;">Assessment Report</h1>
        <div style="text-align: right;">
          <p style="margin: 0; font-size: 14px;">Generated: ${new Date().toLocaleDateString()}</p>
          <p style="margin: 0; font-size: 14px;">Reference: #${assessment.id}</p>
        </div>
      </div>
      
      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
        <h2 style="margin-top: 0;">${assessment.clientName}</h2>
        <div style="display: flex; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 200px;">
            <p><strong>Assessment Date:</strong> ${new Date(assessment.date).toLocaleDateString()}</p>
            <p><strong>Assessment Type:</strong> ${assessment.type.charAt(0).toUpperCase() + assessment.type.slice(1)}</p>
          </div>
          <div style="flex: 1; min-width: 200px;">
            <p><strong>Completed By:</strong> ${assessment.completedBy}</p>
            <p><strong>Overall Score:</strong> <span style="font-size: 16px; font-weight: bold;">${assessment.score ? assessment.score.toFixed(1) : "N/A"}/10</span></p>
          </div>
        </div>
      </div>
      
      <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 8px;">Assessment Results</h3>
      
      <div style="margin-bottom: 20px;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">Category</th>
              <th style="text-align: center; padding: 10px; border-bottom: 1px solid #ddd;">Score</th>
              <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">Notes</th>
            </tr>
          </thead>
          <tbody>
            ${assessmentResults.categories
              .map(
                (category) => `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${category.name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
                  <div style="display: inline-block; background-color: ${getScoreColor(category.score)}; color: white; border-radius: 12px; padding: 2px 8px;">
                    ${category.score}/10
                  </div>
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${category.notes}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
      
      <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 8px;">Summary</h3>
      <p>${assessmentResults.summary}</p>
      
      <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 8px;">Recommendations</h3>
      <ul>
        ${assessmentResults.recommendations.map((rec) => `<li>${rec}</li>`).join("")}
      </ul>
      
      <div style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; font-size: 12px; color: #666;">
        <p>This assessment was conducted as part of the client's journey through our support program. The results are confidential and should be used only for the purpose of supporting the client's progress.</p>
      </div>
    </div>
  `;

  document.body.appendChild(element);

  const opt = {
    margin: 10,
    filename: `${assessment.clientName.replace(/\s+/g, "_")}_Assessment_${new Date(assessment.date).toISOString().split("T")[0]}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } finally {
    document.body.removeChild(element);
  }
};

/**
 * Generate mock assessment results based on assessment type
 */
function generateMockResults(assessment: any) {
  // Different results based on assessment type
  if (assessment.type === "introduction") {
    return {
      categories: [
        {
          name: "Financial Wellbeing",
          score: 3,
          notes: "Client has significant financial challenges",
        },
        {
          name: "Mental Health",
          score: 4,
          notes: "Some anxiety reported, generally stable",
        },
        {
          name: "Physical Health",
          score: 5,
          notes: "Regular health checkups, minor concerns",
        },
        {
          name: "Information Access",
          score: 2,
          notes: "Limited knowledge of available resources",
        },
        {
          name: "Local Support Network",
          score: 3,
          notes: "Few local connections, recently moved to area",
        },
        {
          name: "Emotional Wellbeing",
          score: 4,
          notes: "Coping well considering circumstances",
        },
      ],
      summary:
        "Client is new to our services and presents with several areas requiring support. Primary concerns are around financial stability and access to information about available resources. Client shows good resilience despite challenges.",
      recommendations: [
        "Enroll in Financial Literacy Workshop series",
        "Schedule meeting with benefits advisor",
        "Provide resource guide for local support services",
        "Consider referral to community support group",
      ],
    };
  } else if (assessment.type === "progress") {
    return {
      categories: [
        {
          name: "Financial Wellbeing",
          score: 6,
          notes: "Improvement in budgeting skills, still some challenges",
        },
        {
          name: "Mental Health",
          score: 7,
          notes: "Reduced anxiety, using coping strategies effectively",
        },
        {
          name: "Physical Health",
          score: 7,
          notes: "Regular exercise routine established",
        },
        {
          name: "Information Access",
          score: 8,
          notes: "Good understanding of available resources",
        },
        {
          name: "Local Support Network",
          score: 6,
          notes: "Building connections through community events",
        },
        {
          name: "Emotional Wellbeing",
          score: 7,
          notes: "Improved outlook and resilience",
        },
      ],
      summary:
        "Client has shown significant progress since the initial assessment. Particularly strong improvements in information access and emotional wellbeing. Financial situation remains an area for continued focus.",
      recommendations: [
        "Continue with advanced financial management workshops",
        "Maintain regular check-ins with support worker",
        "Encourage participation in community leadership program",
        "Review and update personal development goals",
      ],
    };
  } else {
    // exit assessment
    return {
      categories: [
        {
          name: "Financial Wellbeing",
          score: 8,
          notes: "Stable income, good budgeting practices",
        },
        {
          name: "Mental Health",
          score: 8,
          notes: "Effective management of previous concerns",
        },
        {
          name: "Physical Health",
          score: 7,
          notes: "Consistent health maintenance",
        },
        {
          name: "Information Access",
          score: 9,
          notes: "Excellent knowledge of resources and how to access them",
        },
        {
          name: "Local Support Network",
          score: 8,
          notes: "Strong community connections established",
        },
        {
          name: "Emotional Wellbeing",
          score: 8,
          notes: "Positive outlook and good coping strategies",
        },
      ],
      summary:
        "Client has successfully completed the program with substantial improvements across all assessment areas. They have developed strong self-sufficiency skills and built a reliable support network.",
      recommendations: [
        "Transition to quarterly check-ins",
        "Consider mentor role for new program participants",
        "Continue engagement with community support group",
        "Schedule 6-month follow-up assessment",
      ],
    };
  }
}

/**
 * Get color based on score value
 */
function getScoreColor(score: number): string {
  if (score <= 3) return "#ef4444"; // red
  if (score <= 5) return "#f97316"; // orange
  if (score <= 7) return "#3b82f6"; // blue
  return "#22c55e"; // green
}

/**
 * Generates a comprehensive PDF report for the Organization Dashboard
 * @param options Configuration options including date range and filters
 * @returns Promise that resolves when PDF generation is complete
 */
export const generateOrganizationDashboardPDF = async (options: {
  dateRange: { from: Date; to: Date };
  filterArea: string;
  organizationName: string;
}) => {
  const { dateRange, filterArea, organizationName } = options;

  // Get all data from localStorage with date filtering
  const clientsData = JSON.parse(localStorage.getItem("clients") || "[]");
  const assessmentsData = JSON.parse(
    localStorage.getItem("assessments") || "[]",
  );
  const eventsData = JSON.parse(localStorage.getItem("events") || "[]");
  const feedbackData = JSON.parse(localStorage.getItem("feedback") || "[]");
  const areasData = JSON.parse(localStorage.getItem("areas") || "[]");

  // Filter data by date range
  const isWithinDateRange = (dateStr: string) => {
    const date = new Date(dateStr);
    return date >= dateRange.from && date <= dateRange.to;
  };

  const filteredClients = clientsData.filter((client: any) => {
    const matchesArea = filterArea === "all" || client.area === filterArea;
    const matchesDate = client.joinDate
      ? isWithinDateRange(client.joinDate)
      : true;
    return matchesArea && matchesDate;
  });

  const filteredEvents = eventsData.filter((event: any) => {
    const matchesArea = filterArea === "all" || event.area === filterArea;
    const matchesDate = event.date ? isWithinDateRange(event.date) : true;
    return matchesArea && matchesDate;
  });

  const filteredAssessments = assessmentsData.filter((assessment: any) => {
    const matchesDate = assessment.date
      ? isWithinDateRange(assessment.date)
      : true;
    return matchesDate;
  });

  const filteredFeedback = feedbackData.filter((feedback: any) => {
    const matchesDate = feedback.date ? isWithinDateRange(feedback.date) : true;
    return matchesDate;
  });

  // Get all interactions across filtered clients
  let allInteractions: any[] = [];
  filteredClients.forEach((client: any) => {
    const clientInteractions = JSON.parse(
      localStorage.getItem(`interactions_${client.id}`) || "[]",
    );
    const filteredInteractions = clientInteractions.filter(
      (interaction: any) =>
        interaction.date ? isWithinDateRange(interaction.date) : true,
    );
    allInteractions = [...allInteractions, ...filteredInteractions];
  });

  // Calculate metrics
  const metrics = {
    totalClients: filteredClients.length,
    activeClients: filteredClients.filter((c: any) => c.status === "active")
      .length,
    phoneCalls: allInteractions.filter((i: any) => i.type === "phone_call")
      .length,
    textMessages: allInteractions.filter((i: any) => i.type === "text_message")
      .length,
    facilitatedGroups: filteredEvents.filter(
      (e: any) => e.type === "group_session" || e.type === "support",
    ).length,
    assessmentsCompleted: filteredAssessments.filter(
      (a: any) => a.status === "completed",
    ).length,
    inPersonEvents: filteredEvents.filter(
      (e: any) => e.location && !e.location.toLowerCase().includes("online"),
    ).length,
    onlineEvents: filteredEvents.filter(
      (e: any) => e.location && e.location.toLowerCase().includes("online"),
    ).length,
    postEventEngagements: allInteractions.filter(
      (i: any) => i.isPostEventEngagement,
    ).length,
    counsellingSessions: allInteractions.filter(
      (i: any) => i.isCounsellingSession,
    ).length,
  };

  // Calculate satisfaction metrics
  const avgSatisfaction =
    filteredFeedback.length > 0
      ? (
          filteredFeedback.reduce(
            (sum: number, f: any) => sum + f.overallSatisfaction,
            0,
          ) / filteredFeedback.length
        ).toFixed(1)
      : "N/A";

  const avgStaffHelpfulness =
    filteredFeedback.length > 0
      ? (
          filteredFeedback.reduce(
            (sum: number, f: any) => sum + f.staffHelpfulness,
            0,
          ) / filteredFeedback.length
        ).toFixed(1)
      : "N/A";

  const avgServiceQuality =
    filteredFeedback.length > 0
      ? (
          filteredFeedback.reduce(
            (sum: number, f: any) => sum + f.serviceQuality,
            0,
          ) / filteredFeedback.length
        ).toFixed(1)
      : "N/A";

  // Calculate PHQ-9 and GAD-7 averages
  const counsellingInteractions = allInteractions.filter(
    (i: any) => i.isCounsellingSession,
  );
  const phq9Scores = counsellingInteractions
    .map((i: any) => i.phq9Score)
    .filter((score: any) => score !== null && score !== undefined);
  const gad7Scores = counsellingInteractions
    .map((i: any) => i.gad7Score)
    .filter((score: any) => score !== null && score !== undefined);

  const avgPhq9 =
    phq9Scores.length > 0
      ? (
          phq9Scores.reduce((sum: number, score: number) => sum + score, 0) /
          phq9Scores.length
        ).toFixed(1)
      : "N/A";

  const avgGad7 =
    gad7Scores.length > 0
      ? (
          gad7Scores.reduce((sum: number, score: number) => sum + score, 0) /
          gad7Scores.length
        ).toFixed(1)
      : "N/A";

  // Calculate journey completion metrics
  let naturalCompletions = 0;
  let earlyCompletions = 0;
  let totalJourneyDuration = 0;
  let completedJourneys = 0;

  filteredClients.forEach((client: any) => {
    const journeyProgress = JSON.parse(
      localStorage.getItem(`journey_progress_${client.id}`) || "null",
    );
    if (journeyProgress) {
      if (journeyProgress.journeyStatus === "completed_early") {
        earlyCompletions++;
        completedJourneys++;
        if (journeyProgress.completionDate && client.joinDate) {
          const duration =
            new Date(journeyProgress.completionDate).getTime() -
            new Date(client.joinDate).getTime();
          totalJourneyDuration += duration / (1000 * 60 * 60 * 24);
        }
      } else if (journeyProgress.journeyStatus === "completed") {
        naturalCompletions++;
        completedJourneys++;
        if (journeyProgress.updatedAt && client.joinDate) {
          const duration =
            new Date(journeyProgress.updatedAt).getTime() -
            new Date(client.joinDate).getTime();
          totalJourneyDuration += duration / (1000 * 60 * 60 * 24);
        }
      }
    }
  });

  const avgJourneyDuration =
    completedJourneys > 0
      ? Math.round(totalJourneyDuration / completedJourneys)
      : 0;
  const completionRate =
    filteredClients.length > 0
      ? Math.round((completedJourneys / filteredClients.length) * 100)
      : 0;

  // Area breakdown data
  const areaBreakdown = areasData.map((area: any) => {
    const areaClients = filteredClients.filter(
      (c: any) => c.area === area.name,
    );
    const areaEvents = filteredEvents.filter((e: any) => e.area === area.name);
    return {
      name: area.name,
      clients: areaClients.length,
      events: areaEvents.length,
      color: area.color,
    };
  });

  // Create the PDF content
  const element = document.createElement("div");
  element.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif; line-height: 1.4;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px;">
        <div>
          <h1 style="color: #1f2937; margin: 0; font-size: 28px; font-weight: bold;">${organizationName}</h1>
          <h2 style="color: #6b7280; margin: 5px 0 0 0; font-size: 20px; font-weight: normal;">Organization Dashboard Report</h2>
        </div>
        <div style="text-align: right;">
          <p style="margin: 0; font-size: 14px; color: #6b7280;">Report Period</p>
          <p style="margin: 0; font-size: 16px; font-weight: bold;">${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}</p>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #9ca3af;">Generated: ${new Date().toLocaleDateString()}</p>
          ${filterArea !== "all" ? `<p style="margin: 5px 0 0 0; font-size: 12px; color: #9ca3af;">Area Filter: ${filterArea}</p>` : ""}
        </div>
      </div>

      <!-- Executive Summary -->
      <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
        <h3 style="margin-top: 0; color: #1f2937; font-size: 18px;">Executive Summary</h3>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;">
          <div style="text-align: center;">
            <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${metrics.activeClients}</div>
            <div style="font-size: 12px; color: #6b7280;">Active Clients</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 24px; font-weight: bold; color: #10b981;">${metrics.assessmentsCompleted}</div>
            <div style="font-size: 12px; color: #6b7280;">Assessments Completed</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 24px; font-weight: bold; color: #f59e0b;">${metrics.facilitatedGroups}</div>
            <div style="font-size: 12px; color: #6b7280;">Facilitated Groups</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 24px; font-weight: bold; color: #ef4444;">${completionRate}%</div>
            <div style="font-size: 12px; color: #6b7280;">Journey Completion Rate</div>
          </div>
        </div>
      </div>

      <!-- Key Metrics -->
      <div style="margin-bottom: 30px;">
        <h3 style="border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; color: #1f2937;">Key Performance Metrics</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 20px;">
          <div>
            <h4 style="color: #374151; margin-bottom: 15px;">Communication & Engagement</h4>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; color: #6b7280;">Phone Calls</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${metrics.phoneCalls}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; color: #6b7280;">Text Messages</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${metrics.textMessages}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; color: #6b7280;">Post-Event Engagements</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${metrics.postEventEngagements}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Counselling Sessions</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${metrics.counsellingSessions}</td>
              </tr>
            </table>
          </div>
          <div>
            <h4 style="color: #374151; margin-bottom: 15px;">Events & Programs</h4>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; color: #6b7280;">In-Person Events</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${metrics.inPersonEvents}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; color: #6b7280;">Online Events</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${metrics.onlineEvents}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; color: #6b7280;">Facilitated Groups</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${metrics.facilitatedGroups}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Total Events</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${metrics.inPersonEvents + metrics.onlineEvents}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <!-- Client Satisfaction -->
      <div style="margin-bottom: 30px;">
        <h3 style="border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; color: #1f2937;">Client Satisfaction Metrics</h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 20px;">
          <div style="text-align: center; padding: 15px; background-color: #f0f9ff; border-radius: 8px;">
            <div style="font-size: 20px; font-weight: bold; color: #0369a1;">${avgSatisfaction}/5</div>
            <div style="font-size: 12px; color: #6b7280;">Overall Satisfaction</div>
          </div>
          <div style="text-align: center; padding: 15px; background-color: #f0fdf4; border-radius: 8px;">
            <div style="font-size: 20px; font-weight: bold; color: #166534;">${avgStaffHelpfulness}/5</div>
            <div style="font-size: 12px; color: #6b7280;">Staff Helpfulness</div>
          </div>
          <div style="text-align: center; padding: 15px; background-color: #fefce8; border-radius: 8px;">
            <div style="font-size: 20px; font-weight: bold; color: #a16207;">${avgServiceQuality}/5</div>
            <div style="font-size: 12px; color: #6b7280;">Service Quality</div>
          </div>
        </div>
        <p style="text-align: center; margin-top: 10px; font-size: 12px; color: #6b7280;">Based on ${filteredFeedback.length} feedback submissions</p>
      </div>

      <!-- Mental Health Metrics -->
      <div style="margin-bottom: 30px;">
        <h3 style="border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; color: #1f2937;">Mental Health Assessment Metrics</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 20px;">
          <div style="padding: 15px; background-color: #fef2f2; border-radius: 8px;">
            <h4 style="margin: 0 0 10px 0; color: #991b1b;">PHQ-9 Depression Scale</h4>
            <div style="font-size: 18px; font-weight: bold; color: #dc2626;">${avgPhq9}/27</div>
            <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">Average score across ${phq9Scores.length} assessments</div>
          </div>
          <div style="padding: 15px; background-color: #f0f9ff; border-radius: 8px;">
            <h4 style="margin: 0 0 10px 0; color: #1e40af;">GAD-7 Anxiety Scale</h4>
            <div style="font-size: 18px; font-weight: bold; color: #2563eb;">${avgGad7}/21</div>
            <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">Average score across ${gad7Scores.length} assessments</div>
          </div>
        </div>
      </div>

      <!-- Journey Completion -->
      <div style="margin-bottom: 30px;">
        <h3 style="border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; color: #1f2937;">Journey Completion Analysis</h3>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-top: 20px;">
          <div style="text-align: center; padding: 15px; background-color: #f0fdf4; border-radius: 8px;">
            <div style="font-size: 20px; font-weight: bold; color: #166534;">${naturalCompletions}</div>
            <div style="font-size: 12px; color: #6b7280;">Natural Completions</div>
          </div>
          <div style="text-align: center; padding: 15px; background-color: #eff6ff; border-radius: 8px;">
            <div style="font-size: 20px; font-weight: bold; color: #1d4ed8;">${earlyCompletions}</div>
            <div style="font-size: 12px; color: #6b7280;">Early Completions</div>
          </div>
          <div style="text-align: center; padding: 15px; background-color: #fefce8; border-radius: 8px;">
            <div style="font-size: 20px; font-weight: bold; color: #a16207;">${completionRate}%</div>
            <div style="font-size: 12px; color: #6b7280;">Completion Rate</div>
          </div>
          <div style="text-align: center; padding: 15px; background-color: #f3f4f6; border-radius: 8px;">
            <div style="font-size: 20px; font-weight: bold; color: #374151;">${avgJourneyDuration}</div>
            <div style="font-size: 12px; color: #6b7280;">Avg Duration (days)</div>
          </div>
        </div>
      </div>

      ${
        areaBreakdown.length > 0
          ? `
      <!-- Area Breakdown -->
      <div style="margin-bottom: 30px;">
        <h3 style="border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; color: #1f2937;">Area Performance Breakdown</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #f9fafb;">
              <th style="text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb;">Area</th>
              <th style="text-align: center; padding: 12px; border-bottom: 1px solid #e5e7eb;">Clients</th>
              <th style="text-align: center; padding: 12px; border-bottom: 1px solid #e5e7eb;">Events</th>
            </tr>
          </thead>
          <tbody>
            ${areaBreakdown
              .map(
                (area) => `
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #f3f4f6;">
                <div style="display: flex; align-items: center;">
                  <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${area.color}; margin-right: 8px;"></div>
                  ${area.name}
                </div>
              </td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #f3f4f6; text-align: center; font-weight: bold;">${area.clients}</td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #f3f4f6; text-align: center; font-weight: bold;">${area.events}</td>
            </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
      `
          : ""
      }

      <!-- Recent Feedback -->
      ${
        filteredFeedback.length > 0
          ? `
      <div style="margin-bottom: 30px;">
        <h3 style="border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; color: #1f2937;">Recent Client Feedback</h3>
        <div style="margin-top: 20px;">
          ${filteredFeedback
            .slice(0, 5)
            .map(
              (feedback: any) => `
          <div style="border-left: 3px solid #3b82f6; padding-left: 15px; margin-bottom: 15px; background-color: #f8fafc; padding: 15px; border-radius: 0 8px 8px 0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="font-weight: bold; color: #1f2937;">${feedback.clientName}</span>
              <span style="font-size: 12px; color: #6b7280;">${new Date(feedback.date).toLocaleDateString()}</span>
            </div>
            ${feedback.eventName ? `<div style="font-size: 12px; color: #6b7280; margin-bottom: 5px;">Event: ${feedback.eventName}</div>` : ""}
            <div style="font-size: 14px; color: #374151; margin-bottom: 8px;">&quot;${feedback.comments}&quot;</div>
            <div style="font-size: 12px; color: #6b7280;">Rating: ${feedback.overallSatisfaction}/5</div>
          </div>
          `,
            )
            .join("")}
        </div>
      </div>
      `
          : ""
      }

      <!-- Footer -->
      <div style="margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px; font-size: 12px; color: #6b7280; text-align: center;">
        <p>This report was generated automatically from your organization's data management system.</p>
        <p>Report covers the period from ${dateRange.from.toLocaleDateString()} to ${dateRange.to.toLocaleDateString()}${filterArea !== "all" ? ` for ${filterArea}` : ""}.</p>
        <p>For questions about this report, please contact your system administrator.</p>
      </div>
    </div>
  `;

  document.body.appendChild(element);

  const opt = {
    margin: 10,
    filename: `Organization_Dashboard_Report_${dateRange.from.toISOString().split("T")[0]}_to_${dateRange.to.toISOString().split("T")[0]}${filterArea !== "all" ? `_${filterArea.replace(/\s+/g, "_")}` : ""}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } finally {
    document.body.removeChild(element);
  }
};
