'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const router = useRouter();

  return (
    <div className="container max-w-xl py-24">
      <Card hover={false} className="border-none shadow-2xl text-center overflow-hidden p-0">
        <div className="h-3 bg-primary" />
        <div className="pt-12 px-8 pb-8">
          <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 shadow-inner">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-black mb-4 tracking-tight uppercase italic">Payment Successful!</h1>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Thank you for your purchase. Your access has been granted immediately.
          </p>
          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border mb-8">
            <p className="text-sm text-muted-foreground font-medium">
              A confirmation email and receipt have been sent to your email address. You can now start learning right away.
            </p>
          </div>

          <Button 
            size="lg" 
            className="w-full h-16 text-xl font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all"
            onClick={() => router.push('/dashboard')}
          >
            Go to Dashboard
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
