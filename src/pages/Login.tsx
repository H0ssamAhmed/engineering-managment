import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import LoadingPage from "@/components/LoadingPage";
import { ROUTE_PATHS } from "@/lib";


export default function Login() {
  const { signIn, loading } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const { session } = useAuth()
  document.title = "مكتب انس حلواني | تسجيل الدخول"

  const checkSessionChnages = () => {
    if (session)
      navigate("/")
  }


  useEffect(() => {
    checkSessionChnages()
  }, [session])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();



    setSubmitting(true);
    try {
      const res = await signIn(email, password);


    } catch (error) {
      console.error(error);

      setSubmitting(false);
    }
    finally {
      setSubmitting(false);
      checkSessionChnages()


    }
    const res = await signIn(email, password);

    if (res?.error) {
      toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
      setSubmitting(false);
    } else {
      toast.success("تم تسجيل الدخول بنجاح ✅");
      navigate("/");
    }
  };

  if (loading) return <LoadingPage />

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-linear-to-b from-background to-muted/30 p-4" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">إتقان الهندسي</CardTitle>
          <CardDescription>نظام إدارة المشاريع الهندسية - سجّل دخولك للمتابعة</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@office.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required

                autoComplete="current-password"
              />
            </div>
            <div
              className="flex items-center  gap-2 justify-start"
              onClick={() => setShowPassword(!showPassword)}
            >
              <Input type="checkbox"
                className="w-4 h-4"
                checked={showPassword}

              />
              <Label>اظهار كلمة المرور</Label>
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                  جاري التحقق...
                </>
              ) : (
                "تسجيل الدخول"
              )}
            </Button>
          </form>
          {session && <div className="my-4 flex items-center justify-center gap-4 flex-col">
            <p>تم تسجيل الدخول بنجاح </p>
            <Link to={ROUTE_PATHS.DASHBOARD}>
              <Button variant="outline"> الصفحة الرئيسية</Button>
            </Link>
          </div>}
        </CardContent>

      </Card>

    </div>
  );
}