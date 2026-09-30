'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function CheckoutCancelPage() {
  const router = useRouter();

  return (
    <div className="container max-w-xl py-24">
      <Card hover={false} className="border-none shadow-2xl text-center overflow-hidden p-0">
        <div className="h-3 bg-destructive" />
        <div className="pt-12 px-8 pb-8">
          <div className="mx-auto w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mb-8 shadow-inner">
            <XCircle className="w-12 h-12 text-destructive" />
          </div>
          <h1 className="text-4xl font-black mb-4 tracking-tight uppercase italic">Payment Cancelled</h1>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Your transaction was not completed.
          </p>
          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border mb-8 text-sm text-muted-foreground font-medium">
            No charges were made to your account. If you experienced any issues during the checkout process, please contact our support team.
          </div>

          <Button 
            variant="outline"
            size="lg" 
            className="w-full h-16 text-xl font-black rounded-2xl shadow-lg transition-all"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            Back to Checkout
          </Button>
        </div>
      </Card>
    </div>
  );
}
