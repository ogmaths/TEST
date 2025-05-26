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
