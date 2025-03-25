import { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Briefcase, 
  Calendar, 
  Edit, 
  Save, 
  Lock, 
  Bell,
  Upload,
  UserPlus,
  Clock,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import DashboardLayout from '@/components/DashboardLayout';

const Profile = () => {
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    website: 'johndoe.com',
    company: 'TimeTrack Inc.',
    position: 'Senior Developer',
    joinDate: 'January 2022',
    bio: 'Frontend developer with a passion for creating intuitive user interfaces and seamless user experiences. Specializing in React, TypeScript, and modern web technologies.'
  });
  
  const handleEditToggle = () => {
    setEditing(!editing);
  };
  
  const handleSave = () => {
    setEditing(false);
    // Here you would normally save the profile data to a backend
  };
  
  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  return (
    <DashboardLayout title="Profile">
      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">
            <User className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="mr-2 h-4 w-4" />
            Security & Privacy
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="connections">
            <UserPlus className="mr-2 h-4 w-4" />
            Connections
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Update your profile picture</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Button variant="outline" className="mt-4 w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Change Photo
                </Button>
              </CardContent>
              <CardFooter className="flex flex-col items-start text-sm text-muted-foreground">
                <p>Recommended dimensions: 400x400px</p>
                <p>Maximum file size: 5MB</p>
              </CardFooter>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </div>
                {editing ? (
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                ) : (
                  <Button variant="outline" onClick={handleEditToggle}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      {editing ? (
                        <Input 
                          id="name" 
                          value={profileData.name} 
                          onChange={(e) => handleInputChange('name', e.target.value)} 
                        />
                      ) : (
                        <span>{profileData.name}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      {editing ? (
                        <Input 
                          id="email" 
                          type="email" 
                          value={profileData.email} 
                          onChange={(e) => handleInputChange('email', e.target.value)} 
                        />
                      ) : (
                        <span>{profileData.email}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      {editing ? (
                        <Input 
                          id="phone" 
                          value={profileData.phone} 
                          onChange={(e) => handleInputChange('phone', e.target.value)} 
                        />
                      ) : (
                        <span>{profileData.phone}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      {editing ? (
                        <Input 
                          id="location" 
                          value={profileData.location} 
                          onChange={(e) => handleInputChange('location', e.target.value)} 
                        />
                      ) : (
                        <span>{profileData.location}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="flex items-center">
                      <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                      {editing ? (
                        <Input 
                          id="website" 
                          value={profileData.website} 
                          onChange={(e) => handleInputChange('website', e.target.value)} 
                        />
                      ) : (
                        <span>{profileData.website}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <div className="flex items-center">
                      <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                      {editing ? (
                        <Input 
                          id="company" 
                          value={profileData.company} 
                          onChange={(e) => handleInputChange('company', e.target.value)} 
                        />
                      ) : (
                        <span>{profileData.company}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <div className="flex items-center">
                      <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                      {editing ? (
                        <Input 
                          id="position" 
                          value={profileData.position} 
                          onChange={(e) => handleInputChange('position', e.target.value)} 
                        />
                      ) : (
                        <span>{profileData.position}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="joinDate">Join Date</Label>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{profileData.joinDate}</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  {editing ? (
                    <textarea 
                      id="bio" 
                      className="w-full min-h-[100px] p-2 rounded-md border border-input"
                      value={profileData.bio} 
                      onChange={(e) => handleInputChange('bio', e.target.value)} 
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{profileData.bio}</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Time Stats</CardTitle>
                <CardDescription>Your time tracking statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="bg-muted rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Total Hours</h3>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-2xl font-bold mt-2">487.5</p>
                    <p className="text-xs text-muted-foreground mt-1">All time tracked hours</p>
                  </div>
                  
                  <div className="bg-muted rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Weekly Average</h3>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-2xl font-bold mt-2">32.5</p>
                    <p className="text-xs text-muted-foreground mt-1">Hours per week on average</p>
                  </div>
                  
                  <div className="bg-muted rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Projects</h3>
                      <Layers className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-2xl font-bold mt-2">12</p>
                    <p className="text-xs text-muted-foreground mt-1">Projects worked on</p>
                  </div>
                  
                  <div className="bg-muted rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Productivity</h3>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-2xl font-bold mt-2">87%</p>
                    <p className="text-xs text-muted-foreground mt-1">Based on all tracked time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="security">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input type="password" id="current-password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input type="password" id="new-password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input type="password" id="confirm-password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Update Password</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">Protect your account with 2FA.</p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Authorized Devices</h3>
                    <p className="text-sm text-muted-foreground">Manage devices that can access your account</p>
                  </div>
                  <Button variant="outline">Manage</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Manage your privacy preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Profile Visibility</h3>
                    <p className="text-sm text-muted-foreground">Control who can see your profile information</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="profile-visibility">Public</Label>
                    <Switch id="profile-visibility" />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Activity Status</h3>
                    <p className="text-sm text-muted-foreground">Show when you're active or recently active</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="activity-status">Active</Label>
                    <Switch id="activity-status" defaultChecked />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Data Collection</h3>
                    <p className="text-sm text-muted-foreground">Allow us to collect usage data to improve our service</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="data-collection">Allow</Label>
                    <Switch id="data-collection" defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div></div>
                <div className="text-center text-sm font-medium">Email</div>
                <div className="text-center text-sm font-medium">In-app</div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-3 gap-4 items-center">
                <div>
                  <h3 className="text-sm font-medium">Time Reminders</h3>
                  <p className="text-xs text-muted-foreground">Remind you to track your time</p>
                </div>
                <div className="flex justify-center">
                  <Switch id="time-reminders-email" />
                </div>
                <div className="flex justify-center">
                  <Switch id="time-reminders-app" defaultChecked />
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-3 gap-4 items-center">
                <div>
                  <h3 className="text-sm font-medium">Project Updates</h3>
                  <p className="text-xs text-muted-foreground">Changes to projects you're involved in</p>
                </div>
                <div className="flex justify-center">
                  <Switch id="project-updates-email" defaultChecked />
                </div>
                <div className="flex justify-center">
                  <Switch id="project-updates-app" defaultChecked />
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-3 gap-4 items-center">
                <div>
                  <h3 className="text-sm font-medium">Team Activity</h3>
                  <p className="text-xs text-muted-foreground">Updates from team members</p>
                </div>
                <div className="flex justify-center">
                  <Switch id="team-activity-email" />
                </div>
                <div className="flex justify-center">
                  <Switch id="team-activity-app" defaultChecked />
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-3 gap-4 items-center">
                <div>
                  <h3 className="text-sm font-medium">Weekly Reports</h3>
                  <p className="text-xs text-muted-foreground">Summary of your weekly activity</p>
                </div>
                <div className="flex justify-center">
                  <Switch id="weekly-reports-email" defaultChecked />
                </div>
                <div className="flex justify-center">
                  <Switch id="weekly-reports-app" />
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-3 gap-4 items-center">
                <div>
                  <h3 className="text-sm font-medium">System Updates</h3>
                  <p className="text-xs text-muted-foreground">Updates to the platform and features</p>
                </div>
                <div className="flex justify-center">
                  <Switch id="system-updates-email" defaultChecked />
                </div>
                <div className="flex justify-center">
                  <Switch id="system-updates-app" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="connections">
          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>Manage your connected accounts and services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-muted h-10 w-10 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                      <path d="M12 2a10 10 0 0 0-3.16 19.5c.5.1.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.4.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .26.18.58.69.48A10 10 0 0 0 12 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">GitHub</h3>
                    <p className="text-xs text-muted-foreground">Connect your GitHub account</p>
                  </div>
                </div>
                <Button variant="outline">Connect</Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-muted h-10 w-10 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Twitter</h3>
                    <p className="text-xs text-muted-foreground">Connect your Twitter account</p>
                  </div>
                </div>
                <Button variant="outline">Connect</Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-muted h-10 w-10 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">LinkedIn</h3>
                    <p className="text-xs text-muted-foreground">Connect your LinkedIn account</p>
                  </div>
                </div>
                <Button variant="outline">Connect</Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-muted h-10 w-10 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">YouTube</h3>
                    <p className="text-xs text-muted-foreground">Connect your YouTube account</p>
                  </div>
                </div>
                <Button variant="outline">Connect</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Profile;
