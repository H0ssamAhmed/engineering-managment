import React, { createContext, useContext, useEffect, useState } from "react";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { supabase } from "../../supabase/supabase";
import type { User } from "@/lib/index";
import toast from "react-hot-toast";

interface AuthContextType {
  session: Session | null;
  user: SupabaseUser | null;
  profile: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isManager: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error.message);
        return null;
      }
      return data as User;
    } catch (err) {
      console.error("Unexpected error fetching profile:", err);
      return null;
    }
  };

  useEffect(() => {
    // Initialize session on mount
    const initialize = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!session) {
          console.error("Session error:", error || "Ssession expired");
          // localStorage.clear();
          setLoading(false);
          return;
        }
        const profile = await fetchProfile(session?.user?.id);

        setSession(session);
        setUser(session?.user ?? null);
        setProfile(profile);


        // if (initialSession?.user) {
        //   const p = await fetchProfile(initialSession.user.id);
        // }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initialize(); // IMPORTANT: Uncomment this!

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      // async (event, currentSession) => {
      //   // This will use for logout event later
      // }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data: { session, user }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setLoading(false);
        return { error: new Error(error.message) };
      }
      const profile = await fetchProfile(session?.user?.id);

      setProfile(profile)
      setSession(session)
      setUser(user)
      setLoading(false);

      return { error: null };
    } catch (err) {
      setLoading(false);
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      toast.success("تم تسجيل الخروج بنجاح، سنفتقدك كثيرا ✅");


      setProfile(null);
      setSession(null);
      setUser(null);
    } catch (err) {
      console.error("Error signing out:", err);
      toast.error(err.message || "❌ حدث خطأ، حاول مرة اخري")


    } finally {
      setLoading(false);
    }
  };

  const isManager = profile?.role === "MANAGER";

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        signIn,
        signOut,
        isManager,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}