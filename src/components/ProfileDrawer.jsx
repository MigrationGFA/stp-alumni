import {
  Settings,
  LogOut,
  HelpCircle,
  Moon,
  Bell,
  Shield,
  CreditCard,
  User,
} from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Link } from "@/i18n/routing";

const menuItems = [
  { icon: User, label: "View Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Shield, label: "Privacy", href: "/privacy" },
  { icon: CreditCard, label: "Subscription", href: "/subscription" },
  { icon: HelpCircle, label: "Help & Support", href: "/help" },
];

export function ProfileDrawer({ children,data }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="text-left">
            <div className="flex items-center gap-3">
              <Avatar className="h-14 w-14 border-2 border-accent">
                <AvatarImage src={data?.img} />
                <AvatarFallback className="bg-primary text-primary-foreground">EM</AvatarFallback>
              </Avatar>
              <div>
                <DrawerTitle className="text-lg">{data?.name}</DrawerTitle>
                <DrawerDescription className="text-sm">
                  {data?.email}
                </DrawerDescription>
              </div>
            </div>
          </DrawerHeader>

          <div className="px-4 space-y-1">
            {menuItems.map((item) => (
              <DrawerClose asChild key={item.label}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                >
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <span>{item.label}</span>
                </Link>
              </DrawerClose>
            ))}

            <Separator className="my-2" />

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between px-3 py-3">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Dark Mode</span>
              </div>
              <Switch />
            </div>
          </div>

          <DrawerFooter className="pt-2">
            <Button 
              variant="outline" 
              className="w-full text-destructive border-destructive/50 hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}