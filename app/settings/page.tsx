"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Building, Palette } from "lucide-react";

export default function SettingsPage() {
  const { user, profile, refreshProfile } = useAuth();
  const supabase = createClient();
  const { toast } = useToast();
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("user_profiles").update({ full_name: fullName }).eq("id", user.id);
    if (error) toast({ title: "Error updating profile", description: error.message, variant: "destructive" });
    else { toast({ title: "Profile updated" }); refreshProfile(); }
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 8) { toast({ title: "Password must be at least 8 characters", variant: "destructive" }); return; }
    setChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) toast({ title: "Error changing password", description: error.message, variant: "destructive" });
    else { toast({ title: "Password updated" }); setNewPassword(""); }
    setChangingPassword(false);
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2"><User className="h-4 w-4" />Profile</TabsTrigger>
          <TabsTrigger value="organization" className="gap-2"><Building className="h-4 w-4" />Organization</TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2"><Palette className="h-4 w-4" />Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader><CardTitle>Profile</CardTitle><CardDescription>Manage your personal information.</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2"><Label>Email</Label><Input value={user?.email || ""} disabled className="bg-muted" /></div>
              <div className="space-y-2"><Label>Full Name</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
              <div className="space-y-2"><Label>Role</Label><Input value={profile?.role || ""} disabled className="bg-muted capitalize" /></div>
              <Button onClick={handleUpdateProfile} disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save Changes</Button>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Change Password</h3>
                <div className="space-y-2"><Label>New Password</Label><Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 8 characters" /></div>
                <Button variant="outline" onClick={handleChangePassword} disabled={changingPassword || !newPassword}>{changingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Update Password</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization">
          <Card>
            <CardHeader><CardTitle>Organization</CardTitle><CardDescription>Manage your newsroom settings.</CardDescription></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Organization management features coming soon. You can set up your editorial style guide, manage team members, and configure default settings.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader><CardTitle>Preferences</CardTitle><CardDescription>Customize your NewsFlow experience.</CardDescription></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Theme, notification, and AI preferences coming soon. Use the sun/moon icon in the navigation to toggle dark mode.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
