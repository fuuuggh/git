import Link from "next/link";

export default function AuthCodeErrorPage({ searchParams }: { searchParams: Promise<{ error_code?: string }> }) {
  return <main className="mx-auto flex min-h-screen max-w-lg items-center px-6"><section className="w-full rounded-2xl border border-border bg-card p-8 text-center">
    <p className="text-sm font-medium tracking-[0.16em] text-primary uppercase">登录链接失效</p>
    <h1 className="mt-3 text-2xl font-bold text-foreground">这次登录没有完成</h1>
    <p className="mt-3 text-sm leading-6 text-muted-foreground">邮箱链接只能使用一次，且可能被邮件服务的安全扫描提前打开。请回到登录页重新发送一封，收到后立即在同一台设备、同一浏览器中打开最新的一封。</p>
    <Link href="/login" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">重新发送登录链接</Link>
  </section></main>;
}
