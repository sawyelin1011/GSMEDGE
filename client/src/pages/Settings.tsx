import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Key, Lock, Globe, Database } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your organization configuration for the platform.</p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            {["General", "Team", "Billing", "API Keys", "Audit Logs"].map((item) => (
              <Button
                key={item}
                variant={item === "General" ? "secondary" : "ghost"}
                className="justify-start"
              >
                {item}
              </Button>
            ))}
          </nav>
        </aside>
        <div className="flex-1 lg:max-w-2xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Organization Name</Label>
              <Input defaultValue="Edge Starter Platform" />
              <p className="text-[0.8rem] text-muted-foreground">
                This is the name that will be displayed on your public profile.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
