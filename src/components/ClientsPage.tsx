import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Filter,
  Users,
  Calendar,
  Phone,
  Mail,
  MapPin,
  MoreVertical,
  Eye,
  MessageSquare,
  FileText,
  Activity,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import BackButton from "@/components/BackButton";
import Logo from "./Logo";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/context/UserContext";

interface Client {
  id: string;
  name: string;
  status: string;
  joinDate: string;
  caseWorker: string;
  profileImage: string;
  lastActivity: string;
  email?: string;
  phone?: string;
}

const ClientsPage: React.FC = () => {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [workerFilter, setWorkerFilter] = useState<string>("all");

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

  // Show all clients by default, but allow filtering by assigned worker
  const displayClients = clients;

  // Filter clients based on worker assignment for metrics calculation
  const metricsClients =
    workerFilter === "mine" && user
      ? clients.filter((client) => client.caseWorker === user.name)
      : clients;

  const filteredClients = displayClients
    .filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.caseWorker.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        client.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesWorker =
        workerFilter === "all" ||
        (workerFilter === "mine" && user && client.caseWorker === user.name);

      return matchesSearch && matchesStatus && matchesWorker;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "joinDate":
          return (
            new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
          );
        case "lastActivity":
          return (
            new Date(b.lastActivity).getTime() -
            new Date(a.lastActivity).getTime()
          );
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <BackButton />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  My Clients
                </h1>
                <p className="text-sm text-slate-600">
                  Manage client directory and assignments
                </p>
              </div>
            </div>
            <Link to="/clients/new">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="h-4 w-4 mr-2" />
                Add New Client
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Total Clients
                  </p>
                  <p className="text-3xl font-bold">{metricsClients.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Active Clients
                  </p>
                  <p className="text-3xl font-bold">
                    {metricsClients.filter((c) => c.status === "Active").length}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">
                    New This Month
                  </p>
                  <p className="text-3xl font-bold">
                    {
                      metricsClients.filter((c) => {
                        const joinDate = new Date(c.joinDate);
                        const now = new Date();
                        return (
                          joinDate.getMonth() === now.getMonth() &&
                          joinDate.getFullYear() === now.getFullYear()
                        );
                      }).length
                    }
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Inactive Clients
                  </p>
                  <p className="text-3xl font-bold">
                    {
                      metricsClients.filter((c) => c.status === "Inactive")
                        .length
                    }
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  placeholder="Search your clients by name..."
                  className="pl-10 h-12 text-base border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <Select value={workerFilter} onValueChange={setWorkerFilter}>
                  <SelectTrigger className="w-40 h-12 border-slate-200">
                    <SelectValue placeholder="Assignment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clients</SelectItem>
                    <SelectItem value="mine">My Clients</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 h-12 border-slate-200">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 h-12 border-slate-200">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="joinDate">Join Date</SelectItem>
                    <SelectItem value="lastActivity">Last Activity</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="lg"
                  onClick={() => setViewMode("grid")}
                  className="px-4"
                >
                  <Users className="h-4 w-4" />
                </Button>

                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="lg"
                  onClick={() => setViewMode("list")}
                  className="px-4"
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
              <span>
                Showing {filteredClients.length} of {metricsClients.length}{" "}
                clients
                {searchQuery && ` for "${searchQuery}"`}
                {workerFilter === "mine" && " (assigned to you)"}
              </span>
              {(searchQuery ||
                statusFilter !== "all" ||
                workerFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setWorkerFilter("all");
                  }}
                  className="text-slate-500 hover:text-slate-700"
                >
                  Clear filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Client List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <Card
                key={client.id}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="h-12 w-12 ring-2 ring-slate-100">
                      <AvatarImage
                        src={client.profileImage}
                        alt={client.name}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                        {client.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {client.name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        Since {new Date(client.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          client.status === "Active" ? "default" : "secondary"
                        }
                        className={
                          client.status === "Active"
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-slate-100 text-slate-600"
                        }
                      >
                        {client.status}
                      </Badge>
                      <span className="text-xs text-slate-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(client.lastActivity).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-slate-600">
                        <Users className="h-4 w-4 mr-2 text-slate-400" />
                        <span className="truncate">{client.caseWorker}</span>
                      </div>
                      {client.email && (
                        <div className="flex items-center text-slate-600">
                          <Mail className="h-4 w-4 mr-2 text-slate-400" />
                          <span className="truncate">
                            {client.email.includes("@")
                              ? `*****@${client.email.split("@")[1]}`
                              : client.email}
                          </span>
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center text-slate-600">
                          <Phone className="h-4 w-4 mr-2 text-slate-400" />
                          <span>
                            {client.phone.length > 3
                              ? `***-***-${client.phone.slice(-3)}`
                              : client.phone}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <Link to={`/client/${client.id}`}>
                      <Button className="w-full bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="text-slate-900">Client Directory</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left p-4 font-semibold text-slate-700">
                        Client
                      </th>
                      <th className="text-left p-4 font-semibold text-slate-700 hidden md:table-cell">
                        Contact
                      </th>
                      <th className="text-left p-4 font-semibold text-slate-700">
                        Case Worker
                      </th>
                      <th className="text-left p-4 font-semibold text-slate-700">
                        Status
                      </th>
                      <th className="text-left p-4 font-semibold text-slate-700">
                        Last Activity
                      </th>
                      <th className="text-left p-4 font-semibold text-slate-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredClients.map((client) => (
                      <tr
                        key={client.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={client.profileImage}
                                alt={client.name}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                {client.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold text-slate-900">
                                {client.name}
                              </div>
                              <div className="text-sm text-slate-500">
                                Since{" "}
                                {new Date(client.joinDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <div className="space-y-1 text-sm text-slate-600">
                            {client.email && (
                              <div className="flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {client.email.includes("@")
                                  ? `*****@${client.email.split("@")[1]}`
                                  : client.email}
                              </div>
                            )}
                            {client.phone && (
                              <div className="flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {client.phone.length > 3
                                  ? `***-***-${client.phone.slice(-3)}`
                                  : client.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-slate-700">
                          {client.caseWorker}
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={
                              client.status === "Active"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              client.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-slate-100 text-slate-600"
                            }
                          >
                            {client.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-slate-600">
                          {new Date(client.lastActivity).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/client/${client.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/interaction/add/${client.id}`}>
                                <MessageSquare className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/assessment?clientId=${client.id}`}>
                                <FileText className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {filteredClients.length === 0 && (
          <Card className="shadow-lg border-0">
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                {searchQuery || statusFilter !== "all"
                  ? "No clients found"
                  : "No assigned clients"}
              </h3>
              <p className="text-slate-500 mb-6">
                {searchQuery || statusFilter !== "all" || workerFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No clients found in the directory"}
              </p>
              {!searchQuery &&
                statusFilter === "all" &&
                workerFilter === "all" && (
                  <Link to="/clients/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Client
                    </Button>
                  </Link>
                )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ClientsPage;
