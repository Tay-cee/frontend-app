"use client";

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { getColumns, type Employee } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import useSWR from "swr";


const fetcher = async (url: string) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch employees");

  return res.json() as Promise<Employee[]>;
};

export default function Dashboard() {
    const {
        data: employees = [],
        error,
        isLoading,
        mutate,
    } = useSWR<Employee[]>("http://localhost:5188/api/Employees", fetcher);

    const deleteEmployee = React.useCallback(
    async (id: number) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await fetch(`http://localhost:5188/api/Employees/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                mutate(employees.filter((e) => e.id !== id));
            }
        } catch (err) {
            console.error("Failed to delete:", err);
        }
    },
        [employees, mutate]
    );

    const columns = React.useMemo(
        () => getColumns({ onDelete: deleteEmployee }),
        [deleteEmployee]
    );

    const errorMessage = error instanceof Error ? error.message : error ? "Something went wrong" : null;

    return (
    <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
                <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                    <BreadcrumbPage>Employees</BreadcrumbPage>
                </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {/* Stats */}
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="flex flex-col justify-center rounded-xl bg-muted/50 p-6">
                <span className="text-sm text-muted-foreground">Total Employees</span>
                <span className="text-3xl font-bold">{employees.length}</span>
            </div>
            <div className="flex flex-col justify-center rounded-xl bg-muted/50 p-6">
                <span className="text-sm text-muted-foreground">Active</span>
                <span className="text-3xl font-bold">
                {employees.filter((e) => e.status === "Active").length}
                </span>
            </div>
            <div className="flex flex-col justify-center rounded-xl bg-muted/50 p-6">
                <span className="text-sm text-muted-foreground">Departments</span>
                <span className="text-3xl font-bold">
                {new Set(employees.map((e) => e.department)).size}
                </span>
            </div>
            </div>

            {/* Table */}
            <div className="rounded-xl bg-muted/50 p-6">
            {isLoading && (
                <div className="flex items-center justify-center py-12 text-muted-foreground">
                Loading employees...
                </div>
            )}

            {errorMessage && (
                <div className="flex items-center justify-center py-12 text-destructive">
                {errorMessage}
                </div>
            )}

            {!isLoading && !errorMessage && (
                <DataTable columns={columns} data={employees} />
            )}
            </div>
        </div>
        </SidebarInset>
    </SidebarProvider>
    );
}