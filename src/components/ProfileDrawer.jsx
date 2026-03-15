import {
  Settings,
  LogOut,
  HelpCircle,
  Moon,
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
import { Link, useRouter } from "@/i18n/routing";
import useAuthStore from "@/lib/store/useAuthStore";

const menuItems = [
  { icon: User, label: "View Profile", href: "/dashboard/settings" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  { icon: HelpCircle, label: "Help & Support", href: "/dashboard/settings" },
];

export function ProfileDrawer({ children, data }) {
  const initials = data?.initials || "??";
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleSignOut = () => {
    logout();
    router.push("/login");
  };

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
                <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <DrawerTitle className="text-lg">{data?.name || "User"}</DrawerTitle>
                <DrawerDescription className="text-sm">
                  {data?.email || ""}
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
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="w-full text-destructive border-destructive/50 hover:bg-destructive/10"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
