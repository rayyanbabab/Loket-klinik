import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, LogIn } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    return (
        <AuthLayout title="Masuk ke Akun Anda" description="Masukkan email dan password untuk melanjutkan">
            <Head title="Masuk" />

            {status && (
                <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">{status}</p>
                </div>
            )}

            <Form {...AuthenticatedSessionController.store.form()} resetOnSuccess={['password']} className="flex flex-col gap-4">
                {({ processing, errors }) => (
                    <>
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
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="petugas@poliklinik.com"
                                    className="pl-9 h-11 text-sm rounded-xl border-slate-200 dark:border-slate-700 focus:ring-1 focus:ring-teal-600"
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Password
                                </Label>
                                {canResetPassword && (
                                    <TextLink href={request()} className="text-xs text-teal-700 dark:text-teal-400 hover:underline" tabIndex={5}>
                                        Lupa password?
                                    </TextLink>
                                )}
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-slate-400" />
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Masukkan password"
                                    className="pl-9 h-11 text-sm rounded-xl border-slate-200 dark:border-slate-700 focus:ring-1 focus:ring-teal-600"
                                />
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center gap-2.5 pt-1">
                            <Checkbox
                                id="remember"
                                name="remember"
                                tabIndex={3}
                                className="rounded border-slate-300 dark:border-slate-600 text-teal-700 focus:ring-teal-600"
                            />
                            <Label htmlFor="remember" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                                Ingat saya di perangkat ini
                            </Label>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            tabIndex={4}
                            disabled={processing}
                            className="w-full h-11 mt-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
                        >
                            {processing ? (
                                <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <LogIn className="h-4 w-4 mr-2" />
                            )}
                            Masuk ke Sistem
                        </Button>

                        {/* Register Link */}
                        <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                Belum punya akun?{' '}
                            </span>
                            <TextLink
                                href={register()}
                                tabIndex={6}
                                className="text-sm font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                            >
                                Daftar sekarang
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
