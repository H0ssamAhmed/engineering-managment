import React from 'react'
import { Avatar, AvatarImage } from './ui/avatar'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS, getRoleLabel } from "@/lib/index";
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

const LoggedInUser = () => {
    const { profile, signOut } = useAuth();
    const navigate = useNavigate()

    const handleSignOut = async () => {
        await signOut();
        navigate(ROUTE_PATHS.LOGIN);
    };
    return (
        <div className="p-4 mt-auto border-t border-sidebar-border">
            <div className="flex items-center gap-3 px-2 py-3">
                <Avatar className="size-10 border border-border">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-accent text-accent-foreground w-full flex items-center justify-center font-bold">
                        {profile?.name?.charAt(0) + " " + profile?.name?.split(" ")[1].charAt(0) || "م"}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-semibold truncate">{profile?.name ? `م. ${profile?.name}` : "المستخدم"}</p>
                    <p className="text-xs text-muted-foreground truncate">
                        {profile?.role ? getRoleLabel(profile.role) : "مدير المكتب"}
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={handleSignOut}
                >
                    <LogOut size={18} />
                </Button>
            </div>
        </div>
    )
}

export default LoggedInUser