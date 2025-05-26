import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Calendar, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import BackButton from "@/components/BackButton";
import Logo from "./Logo";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import UserSettings from "@/components/UserSettings";

interface Client {
  id: string;
  name: string;
  status: string;
  joinDate: string;
  caseWorker: string;
  profileImage: string;
  lastActivity: string;
}

const ClientManagementDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  // Load clients from localStorage or use mock data if none exists
  useEffect(() => {
    const savedClients = localStorage.getItem("clients");
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    } else {
      // Mock clients data as fallback
      setClients([
        {
          id: "1",
          name: "Jane Smith",
          status: "Active",
          joinDate: "2023-03-10",
          caseWorker: "Michael Johnson",
          profileImage: "https://api.dicebear.com/7.x/initials/svg?seed=JS",
          lastActivity: "2023-06-15",
        },
        {
          id: "2",
          name: "Robert Chen",
          status: "Active",
          joinDate: "2023-04-05",
          caseWorker: "Sarah Williams",
          profileImage: "https://api.dicebear.com/7.x/initials/svg?seed=RC",
          lastActivity: "2023-06-10",
        },
        {
          id: "3",
          name: "Maria Garcia",
          status: "Inactive",
          joinDate: "2023-01-20",
          caseWorker: "Michael Johnson",
          profileImage: "https://api.dicebear.com/7.x/initials/svg?seed=MG",
          lastActivity: "2023-05-22",
        },
        {
          id: "4",
          name: "David Wilson",
          status: "Active",
          joinDate: "2023-05-12",
          caseWorker: "Lisa Chen",
          profileImage: "https://api.dicebear.com/7.x/initials/svg?seed=DW",
          lastActivity: "2023-06-14",
        },
        {
          id: "5",
          name: "Aisha Patel",
          status: "Active",
          joinDate: "2023-02-28",
          caseWorker: "Sarah Williams",
          profileImage: "https://api.dicebear.com/7.x/initials/svg?seed=AP",
          lastActivity: "2023-06-01",
        },
      ]);
    }
  }, []);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.caseWorker.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="p-6 bg-background">
      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <UserSettings onClose={() => setShowSettings(false)} />
        </DialogContent>
      </Dialog>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <BackButton />
        </div>
        <div className="flex items-center gap-2">
          <Link to="/events">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> View Events
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-6">Client Management Dashboard</h1>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Client Directory</h2>
        <Link to="/clients/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add New Client
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search clients by name or case worker..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => {
            // This will trigger the search using the current searchQuery value
            // The filtering is already handled by the filteredClients variable
            // This button is now just an alternative way to trigger search (for users who prefer clicking)
            document
              .querySelector('input[type="search"]')
              ?.setAttribute("tabindex", "-1");
            (
              document.querySelector('input[type="search"]') as HTMLElement
            )?.focus();
          }}
        >
          <Search className="h-4 w-4" /> Search
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Client List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto] md:grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 p-4 border-b font-medium">
              <div>Client</div>
              <div></div>
              <div className="hidden md:block">Case Worker</div>
              <div>Status</div>
              <div>Last Activity</div>
              <div>Actions</div>
            </div>
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="grid grid-cols-[auto_1fr_auto_auto_auto] md:grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 p-4 border-b items-center"
              >
                <Link to={`/client/${client.id}`}>
                  <Avatar className="cursor-pointer hover:opacity-80">
                    <AvatarImage src={client.profileImage} alt={client.name} />
                    <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link to={`/client/${client.id}`} className="hover:underline">
                    <div className="font-medium">{client.name}</div>
                  </Link>
                  <div className="text-sm text-muted-foreground">
                    Since {new Date(client.joinDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="hidden md:block text-sm">
                  {client.caseWorker}
                </div>
                <Badge
                  variant={client.status === "Active" ? "default" : "outline"}
                >
                  {client.status}
                </Badge>
                <div className="text-sm">
                  {new Date(client.lastActivity).toLocaleDateString()}
                </div>
                <div>
                  <Link to={`/client/${client.id}`}>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientManagementDashboard;
