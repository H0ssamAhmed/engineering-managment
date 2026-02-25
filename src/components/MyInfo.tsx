import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../supabase/supabase'
import { updateUser } from '@/api/users'
import { getRoleLabel } from '@/lib/index'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, User, Lock, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const MyInfo = () => {
    const { profile, user } = useAuth()
    const queryClient = useQueryClient()
    
    // Name update state
    const [name, setName] = useState(profile?.name || '')
    const [isNameEditing, setIsNameEditing] = useState(false)
    
    // Password update state
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Sync name state when profile changes
    useEffect(() => {
        if (profile?.name && !isNameEditing) {
            setName(profile.name)
        }
    }, [profile?.name, isNameEditing])

    // Update name mutation
    const updateNameMutation = useMutation({
        mutationFn: async (newName: string) => {
            if (!profile?.id) throw new Error('لا يوجد مستخدم مسجل دخول')
            return await updateUser(profile.id, { name: newName })
        },
        onSuccess: (data) => {
            if (data) {
                toast.success('تم تحديث الاسم بنجاح ✅')
                setIsNameEditing(false)
                // Invalidate queries to refresh user data
                queryClient.invalidateQueries({ queryKey: ['profile'] })
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'فشل تحديث الاسم ❌')
        }
    })

    // Update password mutation
    const updatePasswordMutation = useMutation({
        mutationFn: async ({ currentPwd, newPwd }: { currentPwd: string; newPwd: string }) => {
            // First verify current password by attempting to sign in
            if (!user?.email) throw new Error('لا يوجد بريد إلكتروني مسجل')
            
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: currentPwd
            })

            if (signInError) {
                throw new Error('كلمة المرور الحالية غير صحيحة')
            }

            // Update password
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPwd
            })

            if (updateError) {
                throw new Error(updateError.message || 'فشل تحديث كلمة المرور')
            }
        },
        onSuccess: () => {
            toast.success('تم تحديث كلمة المرور بنجاح ✅')
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'فشل تحديث كلمة المرور ❌')
        }
    })

    const handleNameSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) {
            toast.error('الاسم لا يمكن أن يكون فارغاً')
            return
        }
        if (name === profile?.name) {
            setIsNameEditing(false)
            return
        }
        updateNameMutation.mutate(name.trim())
    }

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('يرجى ملء جميع الحقول')
            return
        }

        if (newPassword.length < 6) {
            toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error('كلمة المرور الجديدة وتأكيدها غير متطابقين')
            return
        }

        if (currentPassword === newPassword) {
            toast.error('كلمة المرور الجديدة يجب أن تكون مختلفة عن الحالية')
            return
        }

        updatePasswordMutation.mutate({
            currentPwd: currentPassword,
            newPwd: newPassword
        })
    }

    return (
        <div className="space-y-6" dir="rtl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">معلوماتي</h1>
                    <p className="text-muted-foreground mt-1">
                        إدارة حسابي ومعلوماتي.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                {/* Update Name Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            <CardTitle>تحديث الاسم</CardTitle>
                        </div>
                        <CardDescription>
                            قم بتحديث اسمك المعروض في النظام
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!isNameEditing ? (
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-muted-foreground">الاسم الحالي</Label>
                                    <p className="text-lg font-medium mt-1">{profile?.name || '—'}</p>
                                </div>
                                <Button 
                                    onClick={() => {
                                        setIsNameEditing(true)
                                        setName(profile?.name || '')
                                    }}
                                    variant="outline"
                                    className="w-full"
                                >
                                    تعديل الاسم
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleNameSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">الاسم الجديد</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="أدخل الاسم الجديد"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        type="submit"
                                        disabled={updateNameMutation.isPending}
                                        className="flex-1"
                                    >
                                        {updateNameMutation.isPending ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin ml-2" />
                                                جاري الحفظ...
                                            </>
                                        ) : (
                                            'حفظ التغييرات'
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsNameEditing(false)
                                            setName(profile?.name || '')
                                        }}
                                        disabled={updateNameMutation.isPending}
                                    >
                                        إلغاء
                                    </Button>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>

                {/* Change Password Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Lock className="h-5 w-5 text-primary" />
                            <CardTitle>تغيير كلمة المرور</CardTitle>
                        </div>
                        <CardDescription>
                            قم بتغيير كلمة المرور لحسابك
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                                <div className="relative">
                                    <Input
                                        id="currentPassword"
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="أدخل كلمة المرور الحالية"
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute left-0 top-0 h-full px-3"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                        {showCurrentPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="أدخل كلمة المرور الجديدة (6 أحرف على الأقل)"
                                        required
                                        minLength={6}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute left-0 top-0 h-full px-3"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="أعد إدخال كلمة المرور الجديدة"
                                        required
                                        minLength={6}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute left-0 top-0 h-full px-3"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={updatePasswordMutation.isPending}
                                className="w-full"
                            >
                                {updatePasswordMutation.isPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin ml-2" />
                                        جاري التحديث...
                                    </>
                                ) : (
                                    'تغيير كلمة المرور'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* User Info Display */}
            <Card>
                <CardHeader>
                    <CardTitle>معلومات الحساب</CardTitle>
                    <CardDescription>
                        معلومات حسابك الأساسية
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <Label className="text-muted-foreground">الاسم</Label>
                            <p className="text-lg font-medium mt-1">{profile?.name || '—'}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">البريد الإلكتروني</Label>
                            <p className="text-lg font-medium mt-1">{user?.email || profile?.email || '—'}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">الدور</Label>
                            <p className="text-lg font-medium mt-1">{profile?.role ? getRoleLabel(profile.role) : '—'}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">حالة الحساب</Label>
                            <p className="text-lg font-medium mt-1">
                                {profile?.is_active ? (
                                    <span className="text-green-600">نشط</span>
                                ) : (
                                    <span className="text-red-600">غير نشط</span>
                                )}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default MyInfo