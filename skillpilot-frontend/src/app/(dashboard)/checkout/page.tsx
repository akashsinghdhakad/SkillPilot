'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ShoppingBag, CreditCard, CheckCircle2, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${orderId}`);
      setOrder(res.data);
    } catch (err) {
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const handleStripeCheckout = async () => {
    setIsProcessing(true);
    try {
      const res = await api.post('/payments/stripe/session', { order_id: orderId });
      // Redirect to Stripe Checkout URL
      window.location.href = res.data.url;
    } catch (err) {
      toast.error("Stripe Checkout failed. Please try again.");
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading your order...</div>;
  if (!order) return <div className="p-8 text-center">Order not found.</div>;

  return (
    <div className="container max-w-4xl py-12">
      <div className="flex items-center gap-2 mb-8 text-muted-foreground">
        <span className="text-primary font-medium">Order Summary</span>
        <ChevronRight className="w-4 h-4" />
        <span>Payment</span>
        <ChevronRight className="w-4 h-4" />
        <span>Confirmation</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card hover={false} className="border-none shadow-xl bg-gradient-to-br from-card to-background/50 p-8">
            <div className="mb-6">
              <h2 className="flex items-center gap-2 text-2xl font-bold">
                <ShoppingBag className="w-6 h-6 text-primary" />
                Review Your Order
              </h2>
            </div>
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center p-4 rounded-3xl bg-background/50 border border-border/50 shadow-inner">
                  <div className="flex flex-col">
                    <span className="font-semibold text-lg">
                      {item.itemable?.title || item.itemable?.name || 'SkillPilot Item'}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest bg-muted px-2 py-0.5 rounded-full w-fit mt-1">
                      {item.itemable_type.split('\\').pop()}
                    </span>
                  </div>
                  <span className="font-mono text-xl font-black">${parseFloat(item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-bold">Instant Enrollment</h4>
              <p className="text-sm text-muted-foreground">
                Upon successful payment, access will be granted immediately to your dashboard. We'll also send a confirmation email to your registered address.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card hover={false} className="border-none shadow-2xl bg-primary text-primary-foreground p-8 flex flex-col gap-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest opacity-70">Total Amount</h3>
              <div className="text-5xl font-black mt-2">
                ${parseFloat(order.total_amount).toFixed(2)}
              </div>
              <p className="text-primary-foreground/70 text-xs mt-4 italic">
                Secure checkout powered by Stripe
              </p>
            </div>
            
            <Button 
              variant="secondary" 
              size="lg" 
              className="w-full h-14 text-lg font-black shadow-lg hover:shadow-xl transition-all rounded-2xl bg-white text-primary border-0"
              onClick={handleStripeCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Complete Purchase
                </>
              )}
            </Button>
          </Card>

          <p className="text-center text-[10px] text-muted-foreground px-4 font-medium leading-relaxed">
            By completing this purchase, you agree to our Terms of Service and Privacy Policy. All transactions are encrypted and secure.
          </p>
        </div>
      </div>
    </div>
  );
}
