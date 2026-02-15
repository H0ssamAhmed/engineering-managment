import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import LoadingPage from "@/components/LoadingPage";


export default function Login() {
  const { signIn, loading } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("tamer2022@gmail.com");
  const [password, setPassword] = useState("tamer.2022");
  const [showPassword, setShowPassword] = useState<boolean>(true)
  const { session } = useAuth()
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
      console.log(res);

    } catch (error) {
      console.log(error);

      // toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
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
          <div>
            <p>تم تسجيل الدخول بنجاح </p>
            <Button>تم تسجيل</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
// export default function Login() {
//   const [email, setEmail] = useState("tamer2022@gmail.com");
//   const [password, setPassword] = useState("tamer.2022");
//   const [showPassword, setShowPassword] = useState<boolean>(true)
//   const [submitting, setSubmitting] = useState(false);
//   const { signIn, isSignedIn, setIsSignedIn } = useAuth();
//   const navigate = useNavigate()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     // setSubmitting(true);
//     await signIn(email, password);
//     // console.log(res.error.message);

//     // if (res.error) {
//     //   toast.error(res.error.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة.")
//     //   setSubmitting(false);
//     // } else {
//     //   setSubmitting(false);
//     //   setIsSignedIn(true)
//     //   navigate("/");
//     //   toast.success("تم تسجيل الدخول بنجاح ✅");
//     // }
//   };
//   // useEffect(() => {
//   //   if (isSignedIn) {
//   //     navigate("/")
//   //   }
//   // }, [isSignedIn])
//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   setSubmitting(true);

//   //   const res = await signIn(email, password);

//   //   if (res?.error) {
//   //     toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
//   //     setSubmitting(false);
//   //   } else {
//   //     setSubmitting(false);
//   //     toast.success("تم تسجيل الدخول بنجاح ✅");
//   //     // التوجيه هنا أفضل بكتير
//   //     navigate("/", { replace: true }); 
//   //   }
//   // };
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-background to-muted/30 p-4" dir="rtl">
//       <Card className="w-full max-w-md">
//         <CardHeader className="text-center space-y-2">
//           <div className="flex justify-center">
//             <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
//               <Briefcase className="w-8 h-8 text-primary-foreground" />
//             </div>
//           </div>
//           <CardTitle className="text-2xl">إتقان الهندسي</CardTitle>
//           <CardDescription>نظام إدارة المشاريع الهندسية - سجّل دخولك للمتابعة</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email">البريد الإلكتروني</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="example@office.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 autoComplete="email"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">كلمة المرور</Label>
//               <Input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required

//                 autoComplete="current-password"
//               />
//             </div>
//             <div
//               className="flex items-center  gap-2 justify-start"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               <Input type="checkbox"
//                 className="w-4 h-4"
//                 checked={showPassword}

//               />
//               <Label>اظهار كلمة المرور</Label>
//             </div>
//             <Button type="submit" className="w-full" disabled={submitting}>
//               {submitting ? (
//                 <>
//                   <Loader2 className="w-4 h-4 animate-spin ml-2" />
//                   جاري التحقق...
//                 </>
//               ) : (
//                 "تسجيل الدخول"
//               )}
//             </Button>
//           </form>
//           <div>
//             <p>تم تسجيل الدخول بنجاح </p>
//             <Button>تم تسجيل</Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
