"use client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Pen, Users, Info, Mail, Calendar } from "lucide-react";
import { useState } from "react";
import { ChangeEvent } from "react";
import { HTMLInputs } from "@/types/inputs";
import { toast } from "sonner";
import { Organization } from "@/data/types";
import { Label } from "../ui/label";

interface User {
  id: string;
  name: string;
  email: string;
  role: {
    orgRole: string;
  };
}

type Props = {
  orgId: string | string[];
  orgData: Organization;
  users?: User[] | undefined;
};

const Information = ({ orgId, orgData, users = [] }: Props) => {
  const [edit, setEdit] = useState<boolean>(false);

  const [info, setInfo] = useState([
    {
      name: "Description",
      key: "description",
      value: orgData.description,
      type: "textarea",
      icon: Info,
    },
    {
      name: "Location",
      key: "location",
      value: "Los Angeles",
      type: "input",
      icon: null,
    },
    {
      name: "Google Calendar ID",
      key: "calendarId",
      value: orgData.calendarId,
      type: "input",
      icon: Calendar,
    },
  ]);

  const handleChange = (e: ChangeEvent<HTMLInputs>, index: number) => {
    const updated = [...info];
    updated[index].value = e.target.value;
    setInfo(updated);
  };

  const handleUpdate = async () => {
    const toastId = toast.loading("Updating Organization Information");
    const updatedData = info.reduce(
      (acc, { key, value }) => {
        acc[key] = value;
        return acc;
      },
      {} as { [key: string]: string },
    );

    try {
      const response = await fetch("/api/manage", {
        method: "PUT",
        body: JSON.stringify({
          orgId: orgId,
          updatedData: updatedData,
        }),
      });

      if (response.status !== 200) {
        toast.error("Error updating organization.", { id: toastId });
        return;
      }

      toast.success("Successfully updated organization!", { id: toastId });
      setEdit(false);
    } catch (error) {
      console.error("Error updating organization:", error);
      toast.error("Error updating organization.", { id: toastId });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "owner":
        return "bg-red-100 text-red-800";
      case "moderator":
        return "bg-blue-100 text-blue-800";
      case "user":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col w-full bg-white shadow-md rounded-2xl border-gray-100 border overflow-hidden  z-20">
      <Tabs defaultValue="info" className="w-full">
        <div className="flex flex-row justify-between items-center p-6 border-b border-gray-100">
          <div className="flex flex-col">
            <h2 className="text-gray-900 font-semibold text-lg">
              Organization Management
            </h2>
            <p className="text-gray-500 text-sm font-medium">
              Manage your organization{"'"}s information and members
            </p>
          </div>

          <div className="flex items-center gap-3 z-20">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="info"
                className="flex items-center gap-2 text-gray-500 hover:text-ttickles-lightblue data-[state=active]:text-ttickles-blue"
              >
                <Info size={16} />
                Information
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="flex items-center gap-2 text-gray-500 hover:text-ttickles-lightblue data-[state=active]:text-ttickles-blue"
              >
                <Users size={16} />
                Users
                <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full ml-1">
                  {users.length}
                </span>
              </TabsTrigger>
            </TabsList>
            {!edit && (
              <button
                onClick={() => setEdit(true)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Pen size={20} />
              </button>
            )}
          </div>
        </div>

        <TabsContent value="info" className="p-6 m-0">
          <div className="flex flex-row justify-between items-center mb-5">
            <div>
              <div className="text-gray-900 font-semibold">
                Organization Information
              </div>
              <p className="text-gray-500 text-sm">
                Edit your organization{"'"}s details and settings
              </p>
            </div>
          </div>
          {edit && (
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button variant="outline" onClick={() => setEdit(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                className="bg-ttickles-blue text-white shadow-none hover:bg-ttickles-blue hover:brightness-110 duration-100"
              >
                Save Changes
              </Button>
            </div>
          )}

          <div className="flex flex-col gap-y-6">
            {!edit &&
              info.map((item, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    {item.icon && (
                      <item.icon size={14} className="text-gray-400" />
                    )}
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-gray-900 text-sm leading-relaxed">
                    {item.value || "Not specified"}
                  </span>
                </div>
              ))}

            {edit &&
              info.map((question, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    {question.icon && (
                      <question.icon size={14} className="text-gray-400" />
                    )}
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {question.name}
                    </Label>
                  </div>
                  {question.type === "textarea" ? (
                    <Textarea
                      value={question.value}
                      className="resize-none min-h-[100px]"
                      onChange={(e) => handleChange(e, index)}
                      placeholder={`Enter ${question.name.toLowerCase()}...`}
                    />
                  ) : (
                    <Input
                      value={question.value}
                      onChange={(e) => handleChange(e, index)}
                      placeholder={`Enter ${question.name.toLowerCase()}...`}
                    />
                  )}
                </div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="p-6 m-0">
          <div className="mb-6">
            <div className="text-gray-900 font-semibold">
              Organization Members
            </div>
            <p className="text-gray-500 text-sm">
              View and manage organization members ({users.length} total)
            </p>
          </div>

          <div className="space-y-4">
            {users.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2 text-sm font-medium text-gray-900">
                  No users
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  No users have joined this organization yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {users.map(({ id, email, name, role }) => (
                  <div
                    key={id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {name}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Mail size={12} />
                          {email}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                        role.orgRole,
                      )}`}
                    >
                      {role.orgRole}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Information;
