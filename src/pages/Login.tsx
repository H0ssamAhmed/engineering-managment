import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
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
  const [testLogin, setTestLogin] = useState(false);
  document.title = "مكتب انس حلواني | تسجيل الدخول"
  const { state: { from: location } } = useLocation();


  const redirectTo = useMemo(() => {
    const redirect = `${location.pathname}${location.search}`;
    return redirect ? redirect : "/"
  }, [location]);

  useEffect(() => {
    if (session) {
      navigate(redirectTo);
    }
  }, [session, redirectTo, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await signIn(email, password);
      if (res?.error) {
        toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
        return;
      }

      toast.success("تم تسجيل الدخول بنجاح ✅");
      navigate(redirectTo);
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء تسجيل الدخول.");
    } finally {
      setSubmitting(false);
    }
  };
  const handleTestLogin = () => {
    setTestLogin(true)
  }
  if (loading) return <LoadingPage />

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-linear-to-b from-background to-muted/30 p-4" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
              <img src="/image.png" className="object-contain" />

            </div>
          </div>
          <CardTitle className="text-2xl">مكتب  انس حلواني للاستشارات الهندسية</CardTitle>
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
                defaultChecked={showPassword}


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
          <div className="f justify-center gap-2 p-4">
            <p>ليس بديك حساب ؟  <br />
              <span onClick={handleTestLogin} className="underline cursor-pointer">تسجيل الدخول بحساب تجريبي</span>
            </p>
          </div>
          {testLogin && <div>
            <p>بيانات حساب تجريبي</p>
            <ol className="flex flex-col gap-2 p-3 rounded-2xl bg-gray-100">
              <li className="flex items-center justify-between">البريد الإلكتروني: <span className=" text-end">visitor@anas-con.com</span></li>
              <li className="flex items-center justify-between">كلمة المرور: <span className=" text-end">Password!123</span></li>
            </ol>
          </div>}
        </CardContent>

      </Card>

    </div>
  );
}