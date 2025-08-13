import { Container } from "@/components/ui/Container";
import Image from "next/image";
import { BRAND } from "@/lib/constants/brand";

export default function QRSection() {
  return (
    <section className="py-12 bg-[var(--slate-50)]">
      <Container>
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">
              تابعنا على وسائل التواصل الاجتماعي
            </h2>
            <p className="text-[var(--slate-600)] max-w-2xl mx-auto">
              امسح الكود للوصول السريع لحساباتنا وتابع آخر أعمالنا ونصائحنا في التسويق الرقمي
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {/* QR Code */}
            <div className="bg-[var(--card)] p-6 rounded-2xl shadow-lg">
              <Image
                src={BRAND.qr}
                alt="QR Code للوصول لحسابات Depth Agency"
                width={200}
                height={200}
                className="mx-auto"
              />
              <p className="text-sm text-[var(--slate-600)] mt-4">
                امسح للوصول السريع
              </p>
            </div>
            
            {/* Social Links */}
            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                <a 
                  href="https://www.instagram.com/depth_agency/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-[var(--card)] p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">IG</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Instagram</p>
                    <p className="text-sm text-[var(--slate-600)]">@depth_agency</p>
                  </div>
                </a>
                
                <a 
                  href="https://www.facebook.com/depthagency" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-[var(--card)] p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">FB</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Facebook</p>
                    <p className="text-sm text-[var(--slate-600)]">Depth Agency</p>
                  </div>
                </a>
              </div>
              
              <div className="text-center pt-4">
                <p className="text-sm text-[var(--slate-600)]">
                  تابعنا لآخر الأعمال والنصائح
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
