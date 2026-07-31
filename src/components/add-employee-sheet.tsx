import { useState } from "react"
import type React from "react"
import { PlusIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { apiFetch } from "@/lib/api-client"
import type { Employee } from "@/components/columns"

const STATUS_OPTIONS = ["Active", "On Leave", "Inactive"]
const FORM_ID = "add-employee-form"

interface AddEmployeeSheetProps {
  onCreated: (employee: Employee) => void
}

export function AddEmployeeSheet({ onCreated }: AddEmployeeSheetProps) {
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")
  const [department, setDepartment] = useState("")
  const [status, setStatus] = useState(STATUS_OPTIONS[0])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  function resetForm() {
    setUsername("")
    setEmail("")
    setRole("")
    setDepartment("")
    setStatus(STATUS_OPTIONS[0])
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const res = await apiFetch("/api/Employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, role, department, status }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => null)
        throw new Error(
          errorData?.message || `Failed to add employee (${res.status})`
        )
      }

      const created = (await res.json()) as Employee
      onCreated(created)
      resetForm()
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) resetForm()
      }}
    >
      <SheetTrigger asChild>
        <Button>
          <PlusIcon />
          Add Employee
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add employee</SheetTitle>
          <SheetDescription>
            Add a new employee record to the directory.
          </SheetDescription>
        </SheetHeader>

        <form
          id={FORM_ID}
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-4 overflow-y-auto px-4"
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="add-username">Username</FieldLabel>
              <Input
                id="add-username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="add-email">Email</FieldLabel>
              <Input
                id="add-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="add-role">Role</FieldLabel>
              <Input
                id="add-role"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={isLoading}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="add-department">Department</FieldLabel>
              <Input
                id="add-department"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                disabled={isLoading}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="add-status">Status</FieldLabel>
              <select
                id="add-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={isLoading}
                className="h-9 w-full rounded-none border border-input bg-transparent px-3 text-xs shadow-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </FieldGroup>

          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </div>
          )}
        </form>

        <SheetFooter>
          <Button type="submit" form={FORM_ID} disabled={isLoading}>
            {isLoading ? "Adding..." : "Add employee"}
          </Button>
          <SheetClose asChild>
            <Button variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
