import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
} from "lucide-react";

interface AISentimentAnalysisProps {
  defaultText?: string;
  onAnalysisComplete?: (result: any) => void;
}

const AISentimentAnalysis: React.FC<AISentimentAnalysisProps> = ({
  defaultText = "",
  onAnalysisComplete,
}) => {
  const [text, setText] = useState(defaultText);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyzeSentiment = () => {
    if (!text.trim()) return;

    setLoading(true);

    // In a real implementation, this would call an AI service
    // For now, we'll simulate AI processing with setTimeout
    setTimeout(() => {
      // Simple sentiment analysis simulation
      const words = text.toLowerCase().split(/\s+/);

      // Define positive and negative word lists
      const positiveWords = [
        "good",
        "great",
        "excellent",
        "happy",
        "positive",
        "wonderful",
        "fantastic",
        "pleased",
        "excited",
        "helpful",
        "supportive",
        "progress",
        "improvement",
        "better",
        "success",
        "confident",
        "resolved",
        "solution",
      ];

      const negativeWords = [
        "bad",
        "poor",
        "terrible",
        "unhappy",
        "negative",
        "awful",
        "disappointed",
        "frustrated",
        "angry",
        "worried",
        "concerned",
        "problem",
        "issue",
        "worse",
        "failure",
        "anxious",
        "stressed",
        "difficult",
      ];

      // Count positive and negative words
      let positiveCount = 0;
      let negativeCount = 0;

      const foundPositive: string[] = [];
      const foundNegative: string[] = [];

      words.forEach((word) => {
        if (positiveWords.includes(word)) {
          positiveCount++;
          if (!foundPositive.includes(word)) foundPositive.push(word);
        }
        if (negativeWords.includes(word)) {
          negativeCount++;
          if (!foundNegative.includes(word)) foundNegative.push(word);
        }
      });

      // Calculate sentiment score (-1 to 1)
      const totalWords = words.length;
      const sentimentScore =
        totalWords > 0
          ? (positiveCount - negativeCount) /
            Math.max(1, positiveCount + negativeCount)
          : 0;

      // Determine sentiment category
      let sentiment;
      if (sentimentScore > 0.25) sentiment = "positive";
      else if (sentimentScore < -0.25) sentiment = "negative";
      else sentiment = "neutral";

      // Generate key phrases
      const keyPhrases = [...foundPositive, ...foundNegative].slice(0, 5);

      // Generate insights based on sentiment
      let insights = [];

      if (sentiment === "positive") {
        insights.push("Client appears to be expressing satisfaction.");
        if (
          foundPositive.includes("progress") ||
          foundPositive.includes("improvement") ||
          foundPositive.includes("better")
        ) {
          insights.push("Client is noting progress or improvement.");
        }
        if (
          foundPositive.includes("helpful") ||
          foundPositive.includes("supportive")
        ) {
          insights.push("Client feels supported by the services provided.");
        }
      } else if (sentiment === "negative") {
        insights.push("Client may be expressing concerns or dissatisfaction.");
        if (
          foundNegative.includes("problem") ||
          foundNegative.includes("issue") ||
          foundNegative.includes("difficult")
        ) {
          insights.push(
            "Client is experiencing specific problems that need addressing.",
          );
        }
        if (
          foundNegative.includes("anxious") ||
          foundNegative.includes("worried") ||
          foundNegative.includes("stressed")
        ) {
          insights.push("Client may be experiencing emotional distress.");
        }
      } else {
        insights.push("Client's sentiment appears to be balanced or neutral.");
      }

      // If text is very short, add a note about limited analysis
      if (totalWords < 10) {
        insights.push(
          "Note: Limited text provided for comprehensive analysis.",
        );
      }

      const analysisResult = {
        sentiment,
        score: sentimentScore,
        positiveWords: foundPositive,
        negativeWords: foundNegative,
        keyPhrases,
        insights,
      };

      setResult(analysisResult);
      setLoading(false);

      if (onAnalysisComplete) {
        onAnalysisComplete(analysisResult);
      }
    }, 1500);
  };

  const getSentimentBadge = () => {
    if (!result) return null;

    switch (result.sentiment) {
      case "positive":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <ThumbsUp className="h-3 w-3 mr-1" /> Positive
          </Badge>
        );
      case "negative":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <ThumbsDown className="h-3 w-3 mr-1" /> Negative
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <AlertCircle className="h-3 w-3 mr-1" /> Neutral
          </Badge>
        );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Sentiment Analysis
          </div>
          {result && getSentimentBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            placeholder="Enter text to analyze sentiment (e.g., client notes, feedback, or conversation summary)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full"
          />

          <div className="flex justify-end">
            <Button
              onClick={analyzeSentiment}
              disabled={loading || !text.trim()}
              size="sm"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
                </>
              ) : (
                <>Analyze Sentiment</>
              )}
            </Button>
          </div>

          {result && (
            <div className="space-y-4 mt-4">
              <div className="p-4 bg-muted/30 rounded-md space-y-3">
                <h4 className="font-medium">Analysis Results</h4>

                <div>
                  <h5 className="text-sm font-medium">Key Phrases</h5>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {result.keyPhrases.length > 0 ? (
                      result.keyPhrases.map((phrase, i) => (
                        <Badge key={i} variant="outline">
                          {phrase}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No key phrases identified
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium">Insights</h5>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    {result.insights.map((insight, i) => (
                      <li key={i} className="text-sm">
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-green-600">
                      Positive Words
                    </h5>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {result.positiveWords.length > 0 ? (
                        result.positiveWords.map((word, i) => (
                          <Badge
                            key={i}
                            className="bg-green-50 text-green-700 border-green-100"
                          >
                            {word}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          None detected
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-red-600">
                      Negative Words
                    </h5>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {result.negativeWords.length > 0 ? (
                        result.negativeWords.map((word, i) => (
                          <Badge
                            key={i}
                            className="bg-red-50 text-red-700 border-red-100"
                          >
                            {word}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          None detected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AISentimentAnalysis;
