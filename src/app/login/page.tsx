import { LoginForm } from './login-form'
import { Cpu } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div className="z-10 w-full max-w-md backdrop-blur-xl bg-card border border-border shadow-2xl rounded-2xl p-8 transition-all hover:border-primary/30 hover:shadow-[0_0_30px_rgba(0,240,255,0.1)]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 border border-primary/20">
            <Cpu className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-widest text-center text-primary">SYSTEM ACCESS</h1>
          <p className="mt-2 text-sm text-muted-foreground text-center font-mono tracking-wider uppercase">Robotics Competition Core</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
