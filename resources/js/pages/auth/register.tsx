import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle, User, Mail, Lock, KeyRound, UserPlus } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    return (
        <AuthLayout title="Buat Akun Baru" description="Daftar untuk mulai menggunakan sistem antrian">
            <Head title="Daftar" />
            <Form
                {...RegisteredUserController.store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        {/* Name Field */}
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Nama Lengkap
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 text-slate-400" />
                                </div>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Masukkan nama lengkap"
                                    className="pl-9 h-11 text-sm rounded-xl border-slate-200 dark:border-slate-700 focus:ring-1 focus:ring-teal-600"
                                />
                            </div>
                            <InputError message={errors.name} className="mt-1" />
                        </div>

                        {/* Email Field */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Alamat Email
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="nama@poliklinik.com"
                                    className="pl-9 h-11 text-sm rounded-xl border-slate-200 dark:border-slate-700 focus:ring-1 focus:ring-teal-600"
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Password
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-slate-400" />
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Minimal 8 karakter"
                                    className="pl-9 h-11 text-sm rounded-xl border-slate-200 dark:border-slate-700 focus:ring-1 focus:ring-teal-600"
                                />
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        {/* Password Confirmation Field */}
                        <div className="space-y-1.5">
                            <Label htmlFor="password_confirmation" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Konfirmasi Password
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <KeyRound className="h-4 w-4 text-slate-400" />
                                </div>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Ulangi password"
                                    className="pl-9 h-11 text-sm rounded-xl border-slate-200 dark:border-slate-700 focus:ring-1 focus:ring-teal-600"
                                />
                            </div>
                            <InputError message={errors.password_confirmation} />
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            tabIndex={5}
                            disabled={processing}
                            className="w-full h-11 mt-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
                        >
                            {processing ? (
                                <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <UserPlus className="h-4 w-4 mr-2" />
                            )}
                            Daftar Akun Petugas
                        </Button>

                        {/* Login Link */}
                        <div className="text-center pt-3 border-t border-slate-200 dark:border-slate-700">
                            <span className="text-xs text-slate-500">
                                Sudah punya akun petugas?{' '}
                            </span>
                            <TextLink
                                href={login()}
                                tabIndex={6}
                                className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline"
                            >
                                Masuk di sini
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
