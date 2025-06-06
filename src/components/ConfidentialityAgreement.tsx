import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ConfidentialityAgreement() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleAgree = () => {
    if (user) {
      // Update user with agreement acceptance
      setUser({
        ...user,
        hasAcceptedConfidentiality: true,
      });
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT
          </CardTitle>
          <CardDescription className="text-center">
            Effective Date: Upon acceptance by the User.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] rounded-md border p-4">
            <div className="space-y-4 text-sm">
              <p>
                By clicking "I Agree," you ("User") acknowledge and agree to the
                following terms with OG MATHS LIMITED ("Company") regarding your
                access to the Company's Customer Relationship Management (CRM)
                IMPACT CRM POWERED BY OGSTAT system and the personal information
                of the Company's clients ("Confidential Information").
              </p>

              <h3 className="font-bold">Confidential Information</h3>
              <p>
                Includes any personal, financial, medical, or other sensitive
                data relating to the Company's clients, whether stored
                electronically or otherwise.
              </p>

              <h3 className="font-bold">User Obligations</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  You agree to maintain the strict confidentiality of all
                  Confidential Information.
                </li>
                <li>
                  You will not disclose, share, or sell any Confidential
                  Information to any third party.
                </li>
                <li>
                  You will only use Confidential Information to perform your
                  authorized tasks within the CRM system.
                </li>
                <li>
                  You will implement reasonable security measures to protect
                  Confidential Information.
                </li>
                <li>
                  You will notify the Company immediately if you become aware of
                  any unauthorized access or disclosure.
                </li>
              </ul>

              <h3 className="font-bold">Prohibited Uses</h3>
              <p>
                You may not copy, store, or use Confidential Information for any
                purpose outside your authorized work within the CRM.
              </p>

              <h3 className="font-bold">International Compliance</h3>
              <p>
                You agree to comply with applicable data protection and privacy
                laws, including but not limited to the General Data Protection
                Regulation (GDPR) in the European Union and other relevant
                international standards.
              </p>

              <h3 className="font-bold">Legal Remedies</h3>
              <p>
                You acknowledge that any unauthorized use or disclosure of
                Confidential Information may cause serious harm to the Company
                and its clients. The Company may seek legal remedies, including
                injunctions and damages, for any breach of this Agreement.
              </p>

              <h3 className="font-bold">
                Termination and Return/Destruction of Information
              </h3>
              <p>
                Upon termination of your access or at the Company's request, you
                agree to promptly return or securely delete any Confidential
                Information in your possession.
              </p>

              <h3 className="font-bold">Governing Law and Jurisdiction</h3>
              <p>
                This Agreement is governed by the laws of England & Wales. You
                agree to submit to the exclusive jurisdiction of the courts in
                your jurisdiction.
              </p>

              <h3 className="font-bold">Entire Agreement</h3>
              <p>
                This Agreement is the entire agreement between you and the
                Company regarding confidentiality of client information.
              </p>

              <p>
                By clicking "I Agree," you confirm that you have read,
                understand, and agree to be bound by these terms.
              </p>
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleAgree} size="lg" className="w-full max-w-xs">
            I AGREE
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
